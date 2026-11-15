import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { redirect } from "next/navigation";
import { ServerSubmitForm } from "./ServerSubmitForm";
import { parseServerForm } from "@/lib/server-form";
import { rateLimit } from "@/lib/rate-limit";

export default async function NewServerPage() {
  const session = await auth();

  async function createServer(formData: FormData): Promise<{ error: string } | void> {
    "use server";

    const session = await auth();
    // Strictly use session.user.id (ObjectId from MongoDBAdapter) to prevent CastError
    const ownerIdentifier = session?.user?.id;
    if (!ownerIdentifier) return { error: "Sesi login habis. Masuk lagi lalu kirim ulang." };

    const parsed = parseServerForm(formData);
    if (!parsed.ok) return { error: parsed.error };

    // Each listing costs an admin review; this stops one account flooding the queue.
    const limit = await rateLimit(`newsrv:${ownerIdentifier}`, 5, 86400);
    if (!limit.ok) return { error: "Batas 5 pendaftaran per hari tercapai. Coba lagi besok." };

    await connectToDatabase();

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
        <p className="text-zinc-400 font-body mt-1 text-sm">Lengkapi rincian formulir di bawah ini. Tim kurasi kami akan meninjau server Anda sebelum tampil di direktori publik.</p>
      </header>
      
      <div className="bg-zinc-950/70 border border-zinc-800 p-6 sm:p-8 shadow-xl rounded-2xl">
        <ServerSubmitForm action={createServer} />
      </div>
    </div>
  );
}
