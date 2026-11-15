import { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { VotifierForm } from "./VotifierForm";

export const metadata: Metadata = {
  title: "Hadiah Vote (Votifier) | EterVerse",
  description: "Sambungkan Votifier supaya pemain dapat hadiah in-game setiap vote servermu di EterVerse.",
};

const STEPS = [
  {
    title: "Pasang NuVotifier",
    body: "Taruh NuVotifier di folder plugins (Paper, Purpur, Spigot) atau proxy (Velocity, BungeeCord), lalu restart. Server Bedrock lewat Geyser juga bisa.",
  },
  {
    title: "Buka port Votifier",
    body: "Port default 8192 (lihat plugins/Votifier/config.yml). Di Pterodactyl atau panel hosting, tambahkan port itu sebagai alokasi tambahan.",
  },
  {
    title: "Tempel public key",
    body: "Salin isi plugins/Votifier/rsa/public.key ke form di bawah, simpan, lalu tekan Kirim Vote Tes.",
  },
  {
    title: "Atur hadiahnya",
    body: "Hadiah dijalankan oleh plugin reward yang kamu pakai (VotingPlugin, SuperbVote, dan sejenisnya). Nama layanan yang dikirim: EterVerse.",
  },
];

export default async function VotifierPage() {
  const session = await auth();
  await connectToDatabase();

  const servers = await Server.find({ ownerId: session?.user?.id, serverType: { $ne: "REALM" } })
    .select("_id name votifier.enabled +votifier.host +votifier.port +votifier.publicKey +votifier.lastResult +votifier.lastSentAt")
    .lean();

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 animate-fade-in pb-20">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-white">Hadiah Vote (Votifier)</h1>
        <p className="text-zinc-400 font-body text-sm max-w-2xl">
          Setiap pemain vote server kamu di EterVerse, kami kirim sinyal Votifier ke server kamu dan plugin reward
          memberi hadiahnya. Pemain mengisi nama Minecraft saat vote.
        </p>
      </header>

      <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {STEPS.map((step, i) => (
          <li key={step.title} className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-5 flex gap-4">
            <span className="font-mono text-sm text-amber-300 shrink-0" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-semibold text-white">{step.title}</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      {servers.length === 0 ? (
        <div className="p-10 border border-zinc-800 bg-zinc-950/80 text-center rounded-xl flex flex-col items-center gap-3">
          <p className="text-zinc-300">
            Belum ada server untuk disambungkan. Realms tidak didukung karena tidak bisa memasang plugin.
          </p>
          <Link href="/dashboard/server/new" className="text-sm font-mono text-white underline underline-offset-4">
            Daftarkan server
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {servers.map((s: any) => (
            <VotifierForm
              key={s._id.toString()}
              serverId={s._id.toString()}
              serverName={s.name}
              enabled={!!s.votifier?.enabled}
              host={s.votifier?.host || ""}
              port={s.votifier?.port || 8192}
              hasKey={!!s.votifier?.publicKey}
              lastResult={s.votifier?.lastResult || ""}
              lastSentAt={s.votifier?.lastSentAt ? new Date(s.votifier.lastSentAt).toISOString() : null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
