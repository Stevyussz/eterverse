import Link from "next/link";
import { ServerCard } from "@/components/server/ServerCard";
import { EmptySlotCard } from "@/components/server/EmptySlotCard";
import { HeroSlider } from "@/components/home/HeroSlider";
import { AiMatchmaker } from "@/components/home/AiMatchmaker";
import { getHomeData, type ServerCardData } from "@/lib/server-queries";
import { LiveIcon } from "@/components/ui/LiveIcon";
import { VerseScene } from "@/components/pixel/VerseScene";
import { Sprite, type SpriteName } from "@/components/pixel/PixelArt";
import { PixelIcon } from "@/components/pixel/PixelIcon";

export const dynamic = 'force-dynamic';

// Below this many servers, three ranked sections would repeat the same cards.
const SPLIT_SECTIONS_AT = 8;

function ServerGrid({ servers, empty, fillRow = false }: { servers: ServerCardData[]; empty: string; fillRow?: boolean }) {
  // While the directory is young, end a short row with open slots instead of blank space.
  // Only the first is shown on phones (one column), the rest from sm/lg up.
  const openSlots = fillRow && servers.length > 0 && servers.length < 4 ? 4 - servers.length : 0;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 w-full">
      {servers.length > 0 ? (
        servers.map((server, i) => (
          // Stagger within a row of four so a row lands as one gesture, not one-by-one forever.
          <div key={server.slug} data-reveal style={{ "--reveal-i": i % 4 } as React.CSSProperties}>
            <ServerCard {...server} />
          </div>
        ))
      ) : null}
      {Array.from({ length: openSlots }).map((_, i) => (
        <div key={`slot-${i}`} data-reveal className={i === 0 ? "" : i === 1 ? "hidden sm:block" : "hidden lg:block"}>
          <EmptySlotCard />
        </div>
      ))}
      {servers.length === 0 && (
        <div className="col-span-full px-flat py-14 flex flex-col items-center gap-3 text-center">
          <Sprite name="chest" size={56} />
          <p className="text-ink-2">{empty}</p>
          <Link href="/dashboard/server/new" className="px-btn px-btn-gold mt-1">Daftarkan server pertama</Link>
        </div>
      )}
    </div>
  );
}

// Section header as a hanging sign: sprite + pixel title, the link as a small block button.
function SectionHeader({ title, sprite, href, linkLabel }: { title: string; sprite: SpriteName; href?: string; linkLabel?: string }) {
  return (
    <div data-reveal className="flex items-center justify-between gap-4">
      <h2 className="px-title px-title-shadow text-2xl sm:text-3xl text-ink flex items-center gap-3">
        <Sprite name={sprite} size={32} />
        {title}
      </h2>
      {href && (
        <Link href={href} className="px-btn px-btn-cream px-btn-sm shrink-0">
          {linkLabel}
          <PixelIcon name="arrow" rotate={180} size={12} />
        </Link>
      )}
    </div>
  );
}

const OWNER_PERKS: { sprite: SpriteName; title: string; body: string }[] = [
  { sprite: "film", title: "Kartu video", body: "Trailer gameplay diputar langsung di daftar server." },
  { sprite: "emerald", title: "Vote = hadiah in-game", body: "Tersambung ke NuVotifier, hadiah masuk otomatis." },
  { sprite: "server", title: "Status otomatis", body: "Online, jumlah pemain, versi, dan uptime 7 hari." },
  { sprite: "monitor", title: "Widget & dashboard", body: "Pantau kunjungan, salin IP, dan vote server kamu." },
];

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
    <main className="relative min-h-screen flex flex-col overflow-x-clip">
      {/* Hero: sky over a block world with the EterVerse portal. Ink on sky is 12:1. */}
      <section className="relative bg-sky pt-16 border-b-[3px] border-frame">
        <VerseScene className="absolute inset-x-0 bottom-0 w-full h-[150px] sm:h-[210px] lg:h-[260px] only-light" />
        <VerseScene variant="nether" className="absolute inset-x-0 bottom-0 w-full h-[150px] sm:h-[210px] lg:h-[260px] only-nether" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-[170px] sm:pb-[230px] lg:pb-[280px] flex flex-col items-center text-center gap-6">
          <p className="px-chip px-chip-gold">
            <PixelIcon name="map" size={12} className="text-gold-d" />
            Server list Minecraft Indonesia
          </p>
          <h1 className="px-title px-title-shadow text-4xl sm:text-5xl md:text-6xl text-ink text-balance">
            Tonton dulu, baru join.
          </h1>
          <p className="text-ink-2 text-base sm:text-lg max-w-xl">
            Setiap server punya trailer gameplay, IP siap salin, dan status online yang dicek otomatis.
          </p>

          {/* Live pulse of the directory, straight from the last status checks. */}
          {data && data.totalApproved > 0 && (
            <p className="px-chip !text-sm !py-1.5 !px-3 flex-wrap justify-center">
              <LiveIcon online={data.onlineServers > 0} />
              {data.onlineServers > 0 ? (
                <>
                  <span className="text-online-d">{data.onlineServers.toLocaleString("id-ID")} server online</span>
                  <span aria-hidden className="text-ink-3">·</span>
                  <span>{data.playersOnline.toLocaleString("id-ID")} pemain sedang main</span>
                </>
              ) : (
                <span>{data.totalApproved.toLocaleString("id-ID")} server terdaftar, status dicek otomatis</span>
              )}
            </p>
          )}

          <AiMatchmaker />
        </div>
      </section>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-20 py-16">
        {hero.servers.length > 0 && (
          <section className="flex flex-col gap-6">
            <SectionHeader
              title={hero.mode === "partner" ? "Server unggulan" : "Lagi rame di-vote"}
              sprite={hero.mode === "partner" ? "goldBlock" : "emerald"}
            />
            <HeroSlider servers={hero.servers} mode={hero.mode} />
          </section>
        )}

        {data === null ? (
          <div role="alert" className="px-note px-note-error flex-col items-center text-center py-12">
            <PixelIcon name="alert" size={32} className="text-redstone mx-auto" />
            <p>Daftar server gagal dimuat. Coba muat ulang halaman.</p>
            <Link href="/discover" className="px-btn px-btn-cream px-btn-sm mx-auto">Buka halaman Jelajah</Link>
          </div>
        ) : splitSections ? (
          <>
            <section className="flex flex-col gap-6 w-full">
              <SectionHeader title="Vote terbanyak" sprite="emerald" href="/discover?sort=votes" linkLabel="Semua" />
              <ServerGrid servers={data.trending.slice(0, 4)} empty="Belum ada server yang terdaftar." />
            </section>
            <section className="flex flex-col gap-6 w-full">
              <SectionHeader title="Rating tertinggi" sprite="diamond" href="/discover?sort=rating" linkLabel="Semua" />
              <ServerGrid servers={data.topRated} empty="Belum ada server yang memiliki ulasan." />
            </section>
            <section className="flex flex-col gap-6 w-full">
              <SectionHeader title="Baru ditambahkan" sprite="grassBlock" href="/discover?sort=newest" linkLabel="Semua" />
              <ServerGrid servers={data.newest} empty="Belum ada server baru saat ini." />
            </section>
          </>
        ) : (
          <section className="flex flex-col gap-6 w-full">
            <SectionHeader title="Server terdaftar" sprite="grassBlock" href="/discover" linkLabel="Semua" />
            <ServerGrid servers={data.trending} empty="Belum ada server yang terdaftar. Jadilah yang pertama." fillRow />
          </section>
        )}

        {/* Owner acquisition: every listed server brings its own players back here. */}
        <section data-reveal className="px-panel overflow-hidden">
          <div className="prism-bricks on-dark text-white px-6 py-8 sm:px-10 sm:py-10 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 flex flex-col gap-3">
              <p className="px-chip px-chip-gold w-fit">Untuk owner server</p>
              <h2 className="px-title px-title-shadow-dark text-3xl sm:text-4xl leading-tight text-balance">
                Pemain cari server lewat video. Pasang trailer servermu di sini.
              </h2>
              <p className="text-white/90 max-w-xl">Gratis, 1 akun 1 server, ditinjau admin sebelum tayang.</p>
            </div>
            <div className="flex flex-col gap-3 md:items-end shrink-0">
              <Link href="/dashboard/server/new" className="px-btn px-btn-gold hover-bob">
                <PixelIcon name="plus" size={12} />
                Daftarkan server kamu
              </Link>
              <Link href="/etershop" className="text-sm text-[#FFF1C2] underline underline-offset-4 hover:text-white min-h-[32px] inline-flex items-center">
                Lihat paket Partner EterShop
              </Link>
            </div>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {OWNER_PERKS.map((p, i) => (
              <li
                key={p.title}
                className={`p-5 flex gap-3 border-ink/15 ${i > 0 ? "border-t-2 sm:border-t-0" : ""} ${i % 2 === 1 ? "sm:border-l-2" : ""} ${i >= 2 ? "sm:border-t-2 lg:border-t-0" : ""} ${i > 0 ? "lg:border-l-2" : ""}`}
              >
                <Sprite name={p.sprite} size={36} className="shrink-0" />
                <div>
                  <h3 className="font-pixel text-base text-ink">{p.title}</h3>
                  <p className="text-sm text-ink-2 mt-1">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
