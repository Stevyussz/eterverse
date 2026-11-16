import { Metadata } from "next";
import Link from "next/link";
import { Trophy, CaretUp } from "@phosphor-icons/react/dist/ssr";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { VoteMonthly, wibMonth } from "@/models/VoteMonthly";
import { displayAddress } from "@/lib/server-queries";
import { LiveIcon } from "@/components/ui/LiveIcon";
import { SafeImage } from "@/components/ui/SafeImage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Peringkat Vote Bulanan Server Minecraft Indonesia",
  description: "Server Minecraft Indonesia dengan vote terbanyak bulan ini. Vote server favoritmu setiap hari untuk menaikkan peringkatnya.",
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://eterverse.vercel.app"}/leaderboard` },
};

const MONTH_FMT = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric", timeZone: "UTC" });

function monthLabel(month: string) {
  const [y, m] = month.split("-").map(Number);
  return MONTH_FMT.format(new Date(Date.UTC(y, m - 1, 1)));
}

/** Days left until the 1st of next month, WIB. */
function daysUntilReset() {
  const wibNow = new Date(Date.now() + 7 * 60 * 60 * 1000);
  const next = Date.UTC(wibNow.getUTCFullYear(), wibNow.getUTCMonth() + 1, 1);
  return Math.max(1, Math.ceil((next - wibNow.getTime()) / 86_400_000));
}

async function ranking(month: string, limit: number) {
  const rows = await VoteMonthly.find({ month, votes: { $gt: 0 } }).sort({ votes: -1 }).limit(limit * 2).lean();
  const servers = await Server.find({ _id: { $in: rows.map((r) => r.serverId) }, moderationStatus: "APPROVED" })
    .select("name slug logoUrl serverType ipAddress port realmCode liveStatus")
    .lean();
  const byId = new Map(servers.map((s: any) => [s._id.toString(), s]));
  // Banned/removed servers keep their tally rows; they just drop out of the ranking.
  return rows
    .map((r) => ({ votes: r.votes, server: byId.get(r.serverId.toString()) as any }))
    .filter((r) => r.server)
    .slice(0, limit);
}

export default async function LeaderboardPage() {
  const thisMonth = wibMonth();
  const lastMonth = wibMonth(new Date(), -1);

  let current: Awaited<ReturnType<typeof ranking>> = [];
  let previous: Awaited<ReturnType<typeof ranking>> = [];
  let failed = false;
  try {
    await connectToDatabase();
    [current, previous] = await Promise.all([ranking(thisMonth, 25), ranking(lastMonth, 3)]);
  } catch (err) {
    console.error("leaderboard failed:", err);
    failed = true;
  }

  return (
    <main className="relative min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-24">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-white">Peringkat {monthLabel(thisMonth)}</h1>
          <p className="text-sm text-zinc-300">
            Diurutkan dari vote bulan ini. Satu akun bisa vote tiap server sekali sehari. Peringkat direset dalam{" "}
            <span className="font-mono text-white">{daysUntilReset()} hari</span>.
          </p>
        </header>

        {failed ? (
          <div role="alert" className="p-8 rounded-xl border border-rose-500/30 bg-zinc-950/80 text-center text-sm text-zinc-200">
            Peringkat gagal dimuat. Coba muat ulang halaman.
          </div>
        ) : current.length === 0 ? (
          <div className="p-10 rounded-xl border border-zinc-800 bg-zinc-950/80 text-center flex flex-col items-center gap-3">
            <Trophy size={36} className="text-zinc-500" aria-hidden />
            <p className="text-zinc-200">Belum ada vote bulan ini.</p>
            <p className="text-sm text-zinc-400">Vote pertama langsung menempatkan servernya di puncak.</p>
            <Link href="/discover" className="mt-1 inline-flex items-center min-h-[44px] px-5 rounded-md bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Cari server untuk di-vote
            </Link>
          </div>
        ) : (
          <ol className="flex flex-col divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-950/80">
            {current.map(({ votes, server }, i) => (
              <li key={server._id.toString()} data-reveal style={{ "--reveal-i": Math.min(i, 3) } as React.CSSProperties}>
                <Link
                  href={`/server/${server.slug}`}
                  className="flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
                >
                  {/* Top three get the gold accent; the rest stay neutral so the podium reads first. */}
                  <span className={`w-8 shrink-0 text-center font-display text-xl font-bold ${i < 3 ? "text-amber-300" : "text-zinc-400"}`}>
                    {i + 1}
                  </span>
                  <div className="w-11 h-11 shrink-0 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                    <SafeImage src={server.logoUrl} fallbackName={server.name} alt="" className="w-full h-full object-cover text-xs" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-white truncate">{server.name}</p>
                    <p className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 truncate">
                      {server.serverType !== "REALM" && <LiveIcon online={!!server.liveStatus?.isOnline} size={12} />}
                      {displayAddress(server)}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 font-mono text-sm text-white shrink-0">
                    <CaretUp size={14} weight="bold" className="text-zinc-400" aria-hidden />
                    {votes.toLocaleString("id-ID")}
                    <span className="sr-only">vote</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}

        {previous.length > 0 && (
          <section className="flex flex-col gap-3" aria-labelledby="prev">
            <h2 id="prev" className="text-lg font-display font-semibold text-white">Juara {monthLabel(lastMonth)}</h2>
            <ol className="grid sm:grid-cols-3 gap-3">
              {previous.map(({ votes, server }, i) => (
                <li key={server._id.toString()}>
                  <Link
                    href={`/server/${server.slug}`}
                    className="flex flex-col gap-1 p-4 rounded-xl border border-zinc-800 bg-zinc-950/80 hover:border-zinc-600 transition-colors focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <span className="flex items-center gap-1.5 text-xs font-mono text-amber-300">
                      <Trophy size={14} weight="fill" aria-hidden /> Juara {i + 1}
                    </span>
                    <span className="font-display font-semibold text-white truncate">{server.name}</span>
                    <span className="text-xs font-mono text-zinc-400">{votes.toLocaleString("id-ID")} vote</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </main>
  );
}
