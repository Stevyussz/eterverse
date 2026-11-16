import Link from "next/link";
import { ServerCard } from "@/components/server/ServerCard";
import { HeroSlider } from "@/components/home/HeroSlider";
import { AiMatchmaker } from "@/components/home/AiMatchmaker";
import { getHomeData, type ServerCardData } from "@/lib/server-queries";
import { LiveIcon } from "@/components/ui/LiveIcon";

export const dynamic = 'force-dynamic';

// Below this many servers, three ranked sections would repeat the same cards.
const SPLIT_SECTIONS_AT = 8;

function ServerGrid({ servers, empty }: { servers: ServerCardData[]; empty: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full">
      {servers.length > 0 ? (
        servers.map((server, i) => (
          // Stagger within a row of four so a row lands as one gesture, not one-by-one forever.
          <div key={server.slug} data-reveal style={{ "--reveal-i": i % 4 } as React.CSSProperties}>
            <ServerCard {...server} />
          </div>
        ))
      ) : (
        <div className="col-span-full py-20 text-center text-zinc-400 font-mono">{empty}</div>
      )}
    </div>
  );
}

function SectionHeader({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div data-reveal className="flex items-end justify-between gap-4 border-b border-zinc-800/80 pb-4">
      <h2 className="text-2xl font-display font-semibold text-white">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-sm font-mono text-zinc-400 hover:text-white transition-colors pb-0.5 shrink-0 focus-visible:outline-2 focus-visible:outline-white rounded"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

export default async function Home() {
  let data;
  try {
    data = await getHomeData();
  } catch (err) {
    console.error("Home data failed:", err);
    data = null;
  }

  const hero = data?.partners.length
    ? { servers: data.partners, mode: "partner" as const }
    : { servers: data?.trending.slice(0, 3) ?? [], mode: "mostVoted" as const };

  const splitSections = (data?.totalApproved ?? 0) >= SPLIT_SECTIONS_AT;

  return (
    <main className="relative min-h-screen flex flex-col items-center pt-28 md:pt-36 pb-24 px-4 sm:px-6 lg:px-24 overflow-x-clip">

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-4 w-full mb-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white text-balance">
          Temukan Server Minecraft Impianmu.
        </h1>

        {/* Live pulse of the directory, straight from the last status checks. */}
        {data && data.totalApproved > 0 && (
          <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-md border border-white/10 bg-black/70 px-3 py-1.5 font-mono text-xs text-zinc-300">
            <LiveIcon online={data.onlineServers > 0} />
            {data.onlineServers > 0 ? (
              <>
                <span className="text-white">{data.onlineServers.toLocaleString("id-ID")} server online</span>
                <span aria-hidden className="text-zinc-500">·</span>
                <span>{data.playersOnline.toLocaleString("id-ID")} pemain sedang main</span>
              </>
            ) : (
              <span>{data.totalApproved.toLocaleString("id-ID")} server terdaftar, status dicek otomatis</span>
            )}
          </p>
        )}

        <AiMatchmaker />
      </div>

      <div className="w-full z-10">
        {hero.servers.length > 0 && <HeroSlider servers={hero.servers} mode={hero.mode} />}
      </div>

      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-20" />

      <div className="w-full max-w-7xl mx-auto flex flex-col gap-24 relative z-10">

        {data === null ? (
          <div role="alert" className="py-20 px-6 text-center border border-rose-500/30 rounded-2xl bg-zinc-950/80 flex flex-col items-center gap-3">
            <p className="text-zinc-200 font-body">Daftar server gagal dimuat. Coba muat ulang halaman.</p>
            <Link href="/discover" className="text-sm font-mono text-white underline underline-offset-4">
              Buka halaman Jelajahi
            </Link>
          </div>
        ) : splitSections ? (
          <>
            <section className="flex flex-col gap-8 w-full">
              <SectionHeader title="Vote Terbanyak" href="/discover?sort=votes" linkLabel="Lihat Semua Server →" />
              <ServerGrid servers={data.trending.slice(0, 4)} empty="Belum ada server yang terdaftar." />
            </section>
            <section className="flex flex-col gap-8 w-full">
              <SectionHeader title="Server Rating Tertinggi" href="/discover?sort=rating" linkLabel="Urutkan per rating →" />
              <ServerGrid servers={data.topRated} empty="Belum ada server yang memiliki ulasan." />
            </section>
            <section className="flex flex-col gap-8 w-full">
              <SectionHeader title="Server Baru Ditambahkan" href="/discover?sort=newest" linkLabel="Semua server baru →" />
              <ServerGrid servers={data.newest} empty="Belum ada server baru saat ini." />
            </section>
          </>
        ) : (
          <section className="flex flex-col gap-8 w-full">
            <SectionHeader title="Server Terdaftar" href="/discover" linkLabel="Lihat Semua Server →" />
            <ServerGrid servers={data.trending} empty="Belum ada server yang terdaftar. Jadilah yang pertama." />
          </section>
        )}

        {/* Owner acquisition: every listed server brings its own players back here. */}
        <section data-reveal className="relative overflow-hidden rounded-xl border border-amber-500/25 bg-zinc-950/90 px-6 py-10 sm:px-10 sm:py-12 flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1 flex flex-col gap-3">
            <p className="text-xs font-mono text-amber-300">Untuk owner server</p>
            <h2 className="text-2xl sm:text-3xl font-display font-semibold text-white leading-tight">
              Pemainmu cari server lewat video. Tunjukkan server kamu di sini.
            </h2>
            <ul className="text-sm text-zinc-300 font-body flex flex-col gap-1.5 mt-1">
              <li>Halaman profil dengan trailer, IP, dan status online yang dicek otomatis.</li>
              <li>Widget status untuk Discord dan website kamu.</li>
              <li>Vote harian yang tersambung ke Votifier untuk hadiah in-game.</li>
            </ul>
          </div>
          <div className="flex flex-col gap-3 md:items-end shrink-0">
            <Link
              href="/dashboard/server/new"
              className="inline-flex items-center justify-center min-h-[48px] px-6 bg-white text-zinc-950 font-semibold rounded-md text-sm hover:bg-zinc-200 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Daftarkan Server Kamu
            </Link>
            <Link
              href="/etershop"
              className="text-xs font-mono text-zinc-400 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-white rounded"
            >
              Lihat paket Partner EterShop
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
