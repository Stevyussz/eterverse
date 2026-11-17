import { Metadata } from "next";
import Link from "next/link";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { VoteMonthly, wibMonth } from "@/models/VoteMonthly";
import { displayAddress } from "@/lib/server-queries";
import { LiveIcon } from "@/components/ui/LiveIcon";
import { SafeImage } from "@/components/ui/SafeImage";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { Sprite } from "@/components/pixel/PixelArt";
import { PageHero } from "@/components/pixel/PageHero";

// Podium = the ore tiers players already rank by: gold, iron, copper.
const PODIUM = [
  { label: "Juara 1", face: "bg-gold", text: "text-ink" },
  { label: "Juara 2", face: "bg-[#D8D8D8]", text: "text-ink" },
  { label: "Juara 3", face: "bg-[#E89A6A]", text: "text-ink" },
];

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
    <main className="relative min-h-screen pb-8">
      <PageHero title={`Peringkat ${monthLabel(thisMonth)}`} sprite="goldBlock" eyebrow="Vote bulanan">
        <p className="text-sm text-ink-2 max-w-2xl">
          Diurutkan dari vote bulan ini. Satu akun bisa vote tiap server sekali sehari. Peringkat direset dalam{" "}
          <span className="px-chip px-chip-gold !text-sm">{daysUntilReset()} hari</span>
        </p>
      </PageHero>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 flex flex-col gap-10">
        {failed ? (
          <div role="alert" className="px-note px-note-error">
            <PixelIcon name="alert" size={18} className="text-redstone shrink-0 mt-0.5" />
            Peringkat gagal dimuat. Coba muat ulang halaman.
          </div>
        ) : current.length === 0 ? (
          <div className="px-flat p-10 text-center flex flex-col items-center gap-3">
            <Sprite name="emerald" size={56} />
            <p className="font-pixel text-lg text-ink">Belum ada vote bulan ini.</p>
            <p className="text-sm text-ink-2">Vote pertama langsung menempatkan servernya di puncak.</p>
            <Link href="/discover" className="px-btn mt-2">Cari server untuk di-vote</Link>
          </div>
        ) : (
          <ol className="px-panel">
            {current.map(({ votes, server }, i) => {
              const podium = PODIUM[i];
              return (
                <li
                  key={server._id.toString()}
                  data-reveal
                  style={{ "--reveal-i": Math.min(i, 3) } as React.CSSProperties}
                  className={i > 0 ? "border-t-2 border-ink/15" : ""}
                >
                  <Link href={`/server/${server.slug}`} className="flex items-center gap-4 p-4 hover:bg-panel-2 transition-colors">
                    {/* Top three get an ore-tier rank block; the rest a plain number so the podium reads first. */}
                    <span
                      className={`w-10 h-10 shrink-0 flex items-center justify-center font-pixel text-lg font-bold ${
                        podium ? `${podium.face} ${podium.text} px-frame` : "text-ink-2"
                      }`}
                      aria-label={`Peringkat ${i + 1}`}
                    >
                      {i + 1}
                    </span>
                    <SafeImage
                      src={server.logoUrl}
                      fallbackName={server.name}
                      alt=""
                      className="w-11 h-11 shrink-0 object-cover px-frame text-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-pixel text-base text-ink truncate">{server.name}</p>
                      <p className="flex items-center gap-1.5 text-xs font-mono text-ink-2 truncate">
                        {server.serverType !== "REALM" && <LiveIcon online={!!server.liveStatus?.isOnline} size={12} />}
                        {displayAddress(server)}
                      </p>
                    </div>
                    <span className="flex items-center gap-1.5 font-pixel text-base text-ink shrink-0 tabular">
                      <Sprite name="emerald" size={16} />
                      {votes.toLocaleString("id-ID")}
                      <span className="sr-only">vote</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}

        {previous.length > 0 && (
          <section className="flex flex-col gap-4" aria-labelledby="prev">
            <h2 id="prev" className="px-title text-2xl text-ink flex items-center gap-2">
              <PixelIcon name="trophy" size={20} className="text-gold-d" />
              Juara {monthLabel(lastMonth)}
            </h2>
            <ol className="grid sm:grid-cols-3 gap-5">
              {previous.map(({ votes, server }, i) => (
                <li key={server._id.toString()}>
                  <Link href={`/server/${server.slug}`} className="px-panel px-lift flex flex-col gap-1.5 p-4 h-full">
                    <span className={`px-chip w-fit ${i === 0 ? "px-chip-gold" : ""}`}>
                      <PixelIcon name="trophy" size={12} /> {PODIUM[i].label}
                    </span>
                    <span className="font-pixel text-base text-ink truncate mt-1">{server.name}</span>
                    <span className="text-sm text-ink-2 tabular">{votes.toLocaleString("id-ID")} vote</span>
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
