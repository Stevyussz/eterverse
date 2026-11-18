import { Metadata } from "next";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { ServerCard } from "@/components/server/ServerCard";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { Sprite } from "@/components/pixel/PixelArt";
import { PageHero } from "@/components/pixel/PageHero";
import { EmptySlotCard } from "@/components/server/EmptySlotCard";
import { escapeRegex, safeSearchTerm } from "@/lib/text";
import { CARD_FIELDS, toCard } from "@/lib/server-queries";
import { majorVersions } from "@/lib/mc-status";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Jelajahi Server Minecraft Indonesia (SMP, PvP, Survival, Lifesteal)",
  description: "Daftar lengkap server Minecraft Indonesia terbaik (Java & Bedrock). Filter berdasarkan mode permainan SMP, PvP, Lifesteal, RPG, dan Skyblock dengan status online real-time.",
  keywords: [
    "cari server minecraft",
    "daftar server minecraft indonesia",
    "server minecraft smp indonesia",
    "server minecraft pvp",
    "server minecraft lifesteal",
    "minecraft server list",
  ],
  alternates: {
    canonical: "https://eterverse.vercel.app/discover",
  },
  openGraph: {
    title: "Jelajahi Server Minecraft Indonesia | EterVerse",
    description: "Temukan server Minecraft Indonesia untuk Java dan Bedrock. Cek IP, status online real-time, dan vote server favoritmu.",
    url: "https://eterverse.vercel.app/discover",
    siteName: "EterVerse",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "https://eterverse.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Jelajahi Server Minecraft Indonesia",
      },
    ],
  },
};

const ALL_TAGS = ["Survival", "SMP", "Lifesteal", "Economy", "Creative", "PvP", "RPG", "Skyblock", "Factions", "Mini-Games"];

type Props = { searchParams: Promise<{ q?: string; tag?: string; sort?: string; platform?: string; version?: string }> };

export default async function DiscoverPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = safeSearchTerm(params.q);
  const tag = safeSearchTerm(params.tag, 30);
  const { sort = "votes", platform } = params;
  // Only "1.NN" is accepted; it is matched against the version the server itself reports.
  const version = /^1\.\d{1,2}$/.test(params.version || "") ? params.version! : "";

  await connectToDatabase();

  const query: any = { moderationStatus: 'APPROVED' };
  if (q) {
    const rx = escapeRegex(q);
    query.$or = [
      { name: { $regex: rx, $options: 'i' } },
      { description: { $regex: rx, $options: 'i' } },
      { ipAddress: { $regex: rx, $options: 'i' } },
    ];
  }
  if (tag) {
    query.tags = { $in: [new RegExp(`^${escapeRegex(tag)}$`, 'i')] };
  }
  if (version) {
    // "1.2" must not match "1.21": require a non-digit (or end) after the minor number.
    query['liveStatus.version'] = { $regex: `(^|[^0-9.])${escapeRegex(version)}(\\.|[^0-9]|$)` };
  }
  if (platform === 'REALM') {
    query.serverType = 'REALM';
  } else if (platform && ['JAVA', 'BEDROCK', 'CROSSPLAY'].includes(platform)) {
    query.serverType = 'SERVER';
    query.platform = platform;
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    votes: { "metrics.votes": -1 },
    rating: { "metrics.rating": -1 },
    newest: { createdAt: -1 },
    players: { "liveStatus.currentPlayers": -1 },
  };

  const sortOption = sortMap[sort] || sortMap.votes;
  const servers = await Server.find(query).sort(sortOption as any).limit(48).select(CARD_FIELDS).lean();
  const serialized = servers.map(toCard);
  const hasFilters = !!(q || tag || version || platform || (sort && sort !== "votes"));

  // Version pills come from what listed servers actually report, newest first.
  const reported: string[] = await Server.distinct('liveStatus.version', { moderationStatus: 'APPROVED' });
  const VERSIONS = Array.from(new Set(reported.filter(Boolean).flatMap(majorVersions)))
    .sort((a, b) => Number(b.split('.')[1]) - Number(a.split('.')[1]))
    .slice(0, 8);

  const PLATFORMS = [
    { id: "", label: "Semua" },
    { id: "CROSSPLAY", label: "Java + Bedrock" },
    { id: "JAVA", label: "Java" },
    { id: "BEDROCK", label: "Bedrock / HP" },
    { id: "REALM", label: "Realms" },
  ];

  const pill = "px-slot shrink-0 inline-flex items-center min-h-[40px] px-3.5 font-pixel text-sm";
  const rowLabel = "font-pixel text-sm text-ink-2 inline-flex items-center gap-1.5 min-w-[72px]";

  return (
    <main className="relative min-h-screen pb-8">
      <PageHero title="Jelajahi server" sprite="map" eyebrow="Server list">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-2" aria-live="polite">
          <span>
            {servers.length >= 48 ? "48+ server" : `${servers.length} server`} ditemukan
            {hasFilters ? " dengan filter ini" : ""}.
          </span>
          {hasFilters && (
            <a href="/discover" className="text-prism-t underline underline-offset-4 min-h-[44px] sm:min-h-0 inline-flex items-center">
              Reset filter
            </a>
          )}
        </div>
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col gap-7">
        {/* Keyboard users otherwise tab through ~20 filter pills before the first result. */}
        <a href="#hasil" className="sr-only focus:not-sr-only focus:self-start px-btn px-btn-gold px-btn-sm">
          Lewati ke hasil
        </a>

        <form method="GET" className="px-panel p-3 flex flex-col md:flex-row gap-3">
          {platform && <input type="hidden" name="platform" value={platform} />}
          {tag && <input type="hidden" name="tag" value={tag} />}
          {version && <input type="hidden" name="version" value={version} />}
          <div className="relative flex-1">
            <PixelIcon name="search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-2" />
            <input
              name="q"
              type="text"
              defaultValue={q}
              placeholder="Cari nama, IP, atau deskripsi"
              className="px-input !pl-10"
              aria-label="Cari server"
              maxLength={60}
            />
          </div>
          <select name="sort" defaultValue={sort} className="px-input md:!w-56" aria-label="Urutkan server">
            <option value="votes">Vote terbanyak</option>
            <option value="rating">Rating tertinggi</option>
            <option value="newest">Terbaru</option>
            <option value="players">Pemain terbanyak</option>
          </select>
          <button type="submit" className="px-btn">Cari</button>
        </form>

        <div className="flex flex-col gap-4">
          <div className="filter-row">
            <span className={rowLabel}>Edisi</span>
            {PLATFORMS.map(p => {
              const isActive = (platform || "") === p.id;
              const nextParams = new URLSearchParams({
                ...(q && { q }),
                ...(tag && { tag }),
                ...(version && { version }),
                ...(sort && { sort }),
                ...(p.id && { platform: p.id })
              });
              if (!p.id) nextParams.delete("platform");
              return (
                <a key={p.id} href={`/discover?${nextParams.toString()}`} aria-current={isActive ? "page" : undefined} className={pill}>
                  {p.label}
                </a>
              );
            })}
          </div>

          <div className="filter-row">
            <span className={rowLabel}>
              <PixelIcon name="filter" size={12} /> Mode
            </span>
            <a
              href={`/discover?${new URLSearchParams({ ...(q && { q }), ...(platform && { platform }), ...(version && { version }), sort }).toString()}`}
              aria-current={!tag ? "page" : undefined}
              className={pill}
            >
              Semua
            </a>
            {ALL_TAGS.map(t => (
              <a
                key={t}
                href={`/discover?${new URLSearchParams({ ...(q && { q }), ...(platform && { platform }), ...(version && { version }), tag: t, sort }).toString()}`}
                aria-current={tag?.toLowerCase() === t.toLowerCase() ? "page" : undefined}
                className={pill}
              >
                {t}
              </a>
            ))}
          </div>

          {/* Version pills: only shown once pinged servers have reported a version */}
          {VERSIONS.length > 0 && (
            <div className="filter-row">
              <span className={rowLabel}>Versi</span>
              {["", ...VERSIONS].map((v) => {
                const isActive = version === v;
                const href = `/discover?${new URLSearchParams({
                  ...(q && { q }),
                  ...(platform && { platform }),
                  ...(tag && { tag }),
                  ...(v && { version: v }),
                  sort,
                }).toString()}`;
                return (
                  <a key={v || "all"} href={href} aria-current={isActive ? "page" : undefined} className={pill}>
                    {v || "Semua"}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <span id="hasil" tabIndex={-1} className="sr-only">Hasil pencarian</span>
        {serialized.length === 0 ? (
          <div className="px-flat py-14 px-6 text-center flex flex-col items-center gap-3">
            <Sprite name="chest" size={56} />
            <p className="font-pixel text-lg text-ink">
              Tidak ada server yang cocok{q ? ` dengan "${q}"` : ""}.
            </p>
            <p className="text-sm text-ink-2">Coba kata lain, atau longgarkan filternya.</p>
            {hasFilters && (
              <a href="/discover" className="px-btn px-btn-cream mt-2">Hapus semua filter</a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {serialized.map((server, i) => (
              <div key={server.slug} data-reveal style={{ "--reveal-i": i % 4 } as React.CSSProperties}>
                <ServerCard {...server} />
              </div>
            ))}
            {/* Unfiltered and still a short list: show the open slot, not empty space. */}
            {!hasFilters && serialized.length < 4 && (
              <div data-reveal>
                <EmptySlotCard />
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
