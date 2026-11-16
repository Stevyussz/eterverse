import Link from "next/link";
import { Heart } from "@phosphor-icons/react/dist/ssr";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { Favorite } from "@/models/Favorite";
import { Server } from "@/models/Server";
import { displayAddress } from "@/lib/server-queries";
import { LiveIcon } from "@/components/ui/LiveIcon";
import { SafeImage } from "@/components/ui/SafeImage";

export const metadata = { title: "Server Favorit" };

export default async function FavoritesPage() {
  const session = await auth();
  await connectToDatabase();

  const favs = await Favorite.find({ userId: session?.user?.id }).sort({ createdAt: -1 }).lean();
  const servers: any[] = await Server.find({ _id: { $in: favs.map((f) => f.serverId) }, moderationStatus: "APPROVED" })
    .select("name slug logoUrl serverType platform ipAddress port realmCode liveStatus metrics")
    .lean();

  // Online first (most players on top), then offline: the question is "where can I play now?"
  servers.sort((a, b) => {
    const ao = a.liveStatus?.isOnline ? 1 : 0;
    const bo = b.liveStatus?.isOnline ? 1 : 0;
    if (ao !== bo) return bo - ao;
    return (b.liveStatus?.currentPlayers || 0) - (a.liveStatus?.currentPlayers || 0);
  });
  const onlineCount = servers.filter((s) => s.liveStatus?.isOnline).length;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 animate-fade-in pb-20">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-display font-semibold text-white">Server favorit</h1>
        <p className="text-sm text-zinc-400">
          {servers.length > 0
            ? `${onlineCount} dari ${servers.length} server sedang online. Status diperbarui setiap halaman server dibuka.`
            : "Simpan server dengan tombol hati di halaman server."}
        </p>
      </header>

      {servers.length === 0 ? (
        <div className="p-10 rounded-xl border border-zinc-800 bg-zinc-950/80 text-center flex flex-col items-center gap-3">
          <Heart size={36} className="text-zinc-500" aria-hidden />
          <p className="text-zinc-200">Belum ada server favorit.</p>
          <Link href="/discover" className="inline-flex items-center min-h-[44px] px-5 rounded-md bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Jelajahi server
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-950/80">
          {servers.map((s) => {
            const online = !!s.liveStatus?.isOnline;
            return (
              <li key={s._id.toString()}>
                <Link
                  href={`/server/${s.slug}`}
                  className="flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
                >
                  <div className="w-11 h-11 shrink-0 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                    <SafeImage src={s.logoUrl} fallbackName={s.name} alt="" className="w-full h-full object-cover text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-white truncate">{s.name}</p>
                    <p className="text-xs font-mono text-zinc-400 truncate">{displayAddress(s)}</p>
                  </div>
                  {s.serverType === "REALM" ? (
                    <span className="text-xs font-mono text-purple-200 shrink-0">Realm</span>
                  ) : (
                    <span className={`flex items-center gap-1.5 text-xs font-mono shrink-0 ${online ? "text-eter-cyan" : "text-zinc-400"}`}>
                      <LiveIcon online={online} />
                      {online ? `${s.liveStatus.currentPlayers || 0} online` : "Offline"}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
