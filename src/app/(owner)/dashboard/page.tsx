import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import Link from "next/link";
import mongoose from "mongoose";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { Sprite } from "@/components/pixel/PixelArt";
import { revalidatePath } from "next/cache";
import { invalidateServerLists } from "@/lib/server-queries";
import { getUptimeSummary } from "@/lib/server-status";
import { LiveIcon } from "@/components/ui/LiveIcon";
import { Metric, ServerPanel } from "@/components/dashboard/ServerPanel";

export default async function DashboardOverview() {
  const session = await auth();
  const ownerIdentifier = session?.user?.id;

  await connectToDatabase();
  const myServers: any[] = await Server.find({ ownerId: ownerIdentifier }).sort({ createdAt: -1 }).lean();

  const uptimes = await Promise.all(
    myServers.map((s) =>
      s.serverType === "REALM" || s.moderationStatus !== "APPROVED"
        ? Promise.resolve(null)
        : getUptimeSummary(s._id.toString()).catch(() => null)
    )
  );

  const totals = myServers.reduce(
    (acc, s) => ({
      views: acc.views + (s.metrics?.impressions || 0),
      clicks: acc.clicks + (s.metrics?.clicks || 0),
      votes: acc.votes + (s.metrics?.votes || 0),
      online: acc.online + (s.liveStatus?.isOnline ? s.liveStatus?.currentPlayers || 0 : 0),
    }),
    { views: 0, clicks: 0, votes: 0, online: 0 }
  );
  const conversion = totals.views > 0 ? Math.round((totals.clicks / totals.views) * 1000) / 10 : null;

  async function deleteMyServer(formData: FormData) {
    "use server";
    const serverId = formData.get("serverId") as string;
    const session = await auth();
    if (!session?.user?.id || !mongoose.Types.ObjectId.isValid(serverId)) return;

    await connectToDatabase();
    // Only delete if the user owns it
    await Server.findOneAndDelete({ _id: serverId, ownerId: session.user.id });
    revalidatePath("/dashboard");
    invalidateServerLists();
  }

  const firstName = (session?.user?.name || "").split(" ")[0];

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 px-pop pb-20">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="px-title px-title-shadow text-3xl md:text-4xl text-ink">
            {firstName ? `Halo, ${firstName}` : "Dashboard"}
          </h1>
          <p className="text-ink-2 mt-2 text-sm">
            {myServers.length > 0
              ? "Pantau server kamu dan lengkapi yang masih kurang."
              : "Daftarkan server pertamamu untuk mulai tampil di EterVerse."}
          </p>
        </div>
        {/* One server per account: the button only exists while the account has none. */}
        {myServers.length === 0 && (
          <Link href="/dashboard/server/new" className="px-btn px-btn-gold shrink-0">
            <PixelIcon name="plus" size={12} /> Daftarkan server
          </Link>
        )}
      </header>

      {myServers.length === 0 ? (
        <div className="px-panel flex flex-col items-center justify-center p-10 sm:p-14 text-center gap-4">
          <Sprite name="chest" size={64} />
          <h2 className="px-title text-2xl text-ink">Belum ada server</h2>
          <p className="text-ink-2 max-w-md text-sm">
            Siapkan IP server, trailer pendek (video atau link YouTube), dan logo. Setelah dikirim, admin meninjau sebelum server tampil publik.
          </p>
          <Link href="/dashboard/server/new" className="px-btn px-btn-gold mt-2">
            Daftarkan server pertamamu
          </Link>
        </div>
      ) : (
        <>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <Metric label="Halaman dilihat" value={totals.views} icon={<PixelIcon name="eye" size={16} />} />
            <Metric
              label="Salin IP / Main"
              value={totals.clicks}
              icon={<PixelIcon name="copy" size={16} />}
              note={conversion !== null ? `${conversion}% dari pengunjung` : undefined}
            />
            <Metric label="Total vote" value={totals.votes} icon={<Sprite name="emerald" size={16} />} />
            <Metric label="Pemain online" value={totals.online} icon={<LiveIcon online={totals.online > 0} size={16} />} />
          </dl>

          <section className="flex flex-col gap-5" aria-labelledby="my-servers">
            <h2 id="my-servers" className="px-title text-2xl text-ink">
              Server kamu{myServers.length > 1 ? ` (${myServers.length})` : ""}
            </h2>
            {myServers.map((server, i) => (
              <ServerPanel key={server._id.toString()} server={server} uptime={uptimes[i]} deleteAction={deleteMyServer} />
            ))}
          </section>
        </>
      )}
    </div>
  );
}

