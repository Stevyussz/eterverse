import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PencilSimple } from "@phosphor-icons/react/dist/ssr";
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
    <div className="max-w-3xl mx-auto flex flex-col gap-8 animate-fade-in pb-20">
      <header>
        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-white">Daftarkan Server</h1>
        <p className="text-zinc-400 font-body mt-1 text-sm">
          Satu akun untuk satu server. Admin meninjau setiap listing sebelum tampil di direktori publik.
        </p>
      </header>

      {existing ? (
        <div className="bg-zinc-950/80 border border-zinc-800 p-6 sm:p-8 rounded-xl flex flex-col gap-4">
          <h2 className="font-display text-lg font-semibold text-white">Akunmu sudah punya server</h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            <span className="text-white font-semibold">{existing.name}</span> sudah terdaftar di akun ini. Setiap akun hanya bisa
            mendaftarkan satu server. Perbarui datanya lewat Edit; kalau ingin mendaftarkan server lain, hapus dulu yang lama dari dashboard.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/dashboard/server/${existing._id.toString()}/edit`}
              className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-md bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <PencilSimple size={16} aria-hidden /> Edit {existing.name}
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center min-h-[44px] px-5 rounded-md border border-zinc-700 text-sm text-zinc-200 hover:border-zinc-500 transition-colors focus-visible:outline-2 focus-visible:outline-white"
            >
              Ke dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-zinc-950/70 border border-zinc-800 p-6 sm:p-8 shadow-xl rounded-2xl">
          <ServerSubmitForm action={createServer} />
        </div>
      )}
    </div>
  );
}
