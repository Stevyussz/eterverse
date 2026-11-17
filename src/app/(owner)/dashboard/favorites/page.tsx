import Link from "next/link";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { DashHeader } from "@/components/dashboard/DashHeader";
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
    <div className="max-w-3xl mx-auto flex flex-col gap-6 px-pop pb-20">
      <DashHeader title="Server favorit">
        {servers.length > 0
          ? `${onlineCount} dari ${servers.length} server sedang online. Status diperbarui setiap halaman server dibuka.`
          : "Simpan server dengan tombol hati di halaman server."}
      </DashHeader>

      {servers.length === 0 ? (
        <div className="px-panel p-10 text-center flex flex-col items-center gap-3">
          <PixelIcon name="heartOutline" size={40} className="text-redstone" />
          <p className="font-pixel text-lg text-ink">Belum ada server favorit.</p>
          <Link href="/discover" className="px-btn">Jelajahi server</Link>
        </div>
      ) : (
        <ul className="px-panel">
          {servers.map((s, i) => {
            const online = !!s.liveStatus?.isOnline;
            return (
              <li key={s._id.toString()} className={i > 0 ? "border-t-2 border-ink/15" : ""}>
                <Link href={`/server/${s.slug}`} className="flex items-center gap-4 p-4 hover:bg-panel-2 transition-colors">
                  <SafeImage src={s.logoUrl} fallbackName={s.name} alt="" className="w-11 h-11 shrink-0 object-cover px-frame text-xs" />
                  <div className="flex-1 min-w-0">
                    <p className="font-pixel text-base text-ink truncate">{s.name}</p>
                    <p className="text-xs font-mono text-ink-2 truncate">{displayAddress(s)}</p>
                  </div>
                  {s.serverType === "REALM" ? (
                    <span className="px-chip shrink-0"><PixelIcon name="crown" size={11} /> Realm</span>
                  ) : (
                    <span className={`flex items-center gap-1.5 text-sm shrink-0 ${online ? "text-online-d" : "text-ink-2"}`}>
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
