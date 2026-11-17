import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { Sprite } from "@/components/pixel/PixelArt";
import { ServerSubmitForm } from "./ServerSubmitForm";
import { parseServerForm } from "@/lib/server-form";
import { rateLimit } from "@/lib/rate-limit";

// Product rule: one listing per account. A rejected or banned listing still counts; the
// owner fixes it through Edit, or deletes it to start over.
const MAX_SERVERS_PER_ACCOUNT = 1;

export default async function NewServerPage() {
  const session = await auth();

  await connectToDatabase();
  const existing: any = session?.user?.id
    ? await Server.findOne({ ownerId: session.user.id }).select("_id name moderationStatus").lean()
    : null;

  async function createServer(formData: FormData): Promise<{ error: string } | void> {
    "use server";

    const session = await auth();
    // Strictly use session.user.id (ObjectId from MongoDBAdapter) to prevent CastError
    const ownerIdentifier = session?.user?.id;
    if (!ownerIdentifier) return { error: "Sesi login habis. Masuk lagi lalu kirim ulang." };

    await connectToDatabase();

    // Enforced on the server, not only by hiding the form: the action is a public endpoint.
    const owned = await Server.countDocuments({ ownerId: ownerIdentifier });
    if (owned >= MAX_SERVERS_PER_ACCOUNT) {
      return { error: "Satu akun hanya bisa mendaftarkan 1 server. Edit server yang sudah ada dari dashboard." };
    }

    const parsed = parseServerForm(formData);
    if (!parsed.ok) return { error: parsed.error };

    // Stops delete-and-resubmit loops from flooding the admin review queue.
    const limit = await rateLimit(`newsrv:${ownerIdentifier}`, 3, 86400);
    if (!limit.ok) return { error: "Terlalu sering mendaftarkan ulang. Coba lagi besok." };

    const newServer = new Server({
      ...parsed.data,
      ownerId: ownerIdentifier,
      moderationStatus: 'PENDING',
      metrics: { impressions: 0, clicks: 0, votes: 0, rating: 0 },
      liveStatus: { isOnline: false, currentPlayers: 0, maxPlayers: 0, lastChecked: new Date() }
    });

    try {
      await newServer.save();
    } catch (err) {
      console.error("createServer failed:", err);
      return { error: "Server gagal disimpan. Coba lagi sebentar lagi." };
    }
    redirect("/dashboard");
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 px-pop pb-20">
      <header className="flex items-center gap-4">
        <Sprite name="grassBlock" size={48} className="hidden sm:block shrink-0" />
        <div>
          <h1 className="px-title px-title-shadow text-3xl sm:text-4xl text-ink">Daftarkan server</h1>
          <p className="text-ink-2 mt-2 text-sm">
            Satu akun untuk satu server. Admin meninjau setiap listing sebelum tampil di direktori publik.
          </p>
        </div>
      </header>

      {existing ? (
        <div className="px-panel p-6 sm:p-8 flex flex-col gap-4">
          <h2 className="px-title text-xl text-ink">Akunmu sudah punya server</h2>
          <p className="text-sm text-ink-2 leading-relaxed">
            <span className="text-ink font-semibold">{existing.name}</span> sudah terdaftar di akun ini. Setiap akun hanya bisa
            mendaftarkan satu server. Perbarui datanya lewat Edit; kalau ingin mendaftarkan server lain, hapus dulu yang lama dari dashboard.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href={`/dashboard/server/${existing._id.toString()}/edit`} className="px-btn">
              <PixelIcon name="pencil" size={14} /> Edit {existing.name}
            </Link>
            <Link href="/dashboard" className="px-btn px-btn-cream">Ke dashboard</Link>
          </div>
        </div>
      ) : (
        <div className="px-panel p-5 sm:p-8">
          <ServerSubmitForm action={createServer} />
        </div>
      )}
    </div>
  );
}
