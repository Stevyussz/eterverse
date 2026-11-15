import { Metadata } from "next";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { ServerCard } from "@/components/server/ServerCard";
import { MagnifyingGlass, FunnelSimple } from "@phosphor-icons/react/dist/ssr";
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

  // Version pills come from what listed servers actually report, newest first.
  const reported: string[] = await Server.distinct('liveStatus.version', { moderationStatus: 'APPROVED' });
  const VERSIONS = Array.from(new Set(reported.filter(Boolean).flatMap(majorVersions)))
    .sort((a, b) => Number(b.split('.')[1]) - Number(a.split('.')[1]))
    .slice(0, 8);

  const PLATFORMS = [
    { id: "", label: "Semua Platform" },
    { id: "CROSSPLAY", label: "Crossplay (Java + Bedrock)" },
    { id: "JAVA", label: "Java Edition" },
    { id: "BEDROCK", label: "Bedrock / HP" },
    { id: "REALM", label: "Realms" },
  ];

  return (
    <main className="relative min-h-screen pt-28 pb-24 px-6 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-white">Jelajahi Server</h1>
          <p className="text-zinc-400 font-body text-sm">Menampilkan {servers.length} server Minecraft aktif di EterVerse.</p>
        </div>

        {/* Search & Filters */}
        <form method="GET" className="flex flex-col md:flex-row gap-3">
          {platform && <input type="hidden" name="platform" value={platform} />}
          {tag && <input type="hidden" name="tag" value={tag} />}
          {version && <input type="hidden" name="version" value={version} />}
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              name="q"
              type="text"
              defaultValue={q}
              placeholder="Cari berdasarkan nama, IP, atau deskripsi..."
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transition-colors placeholder:text-zinc-500"
              aria-label="Cari server"
              maxLength={60}
            />
          </div>
          <select
            name="sort"
            defaultValue={sort}
            className="bg-zinc-950/80 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-300 focus:border-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transition-colors"
            aria-label="Urutkan server"
          >
            <option value="votes">Vote Terbanyak</option>
            <option value="rating">Rating Tertinggi</option>
            <option value="newest">Terbaru</option>
            <option value="players">Pemain Terbanyak</option>
          </select>
          <button type="submit" className="bg-white text-zinc-950 font-medium px-6 py-2.5 rounded-lg hover:bg-zinc-200 transition-all text-sm shadow-sm active:scale-[0.98]">
            Cari Server
          </button>
        </form>

        {/* Filter Rows Container */}
        <div className="flex flex-col gap-3">
          {/* Platform Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Edisi:
            </span>
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
                <a
                  key={p.id}
                  href={`/discover?${nextParams.toString()}`}
                  className={`inline-flex items-center min-h-[44px] sm:min-h-0 text-xs font-mono px-3 py-1.5 rounded-full border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all ${
                    isActive
                      ? 'bg-white text-zinc-950 font-semibold border-white shadow-sm'
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white bg-zinc-950/40'
                  }`}
                >
                  {p.label}
                </a>
              );
            })}
          </div>

          {/* Tag Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <FunnelSimple size={14} /> Kategori:
            </span>
            <a 
              href={`/discover?${new URLSearchParams({ ...(q && { q }), ...(platform && { platform }), ...(version && { version }), sort }).toString()}`}
              className={`inline-flex items-center min-h-[44px] sm:min-h-0 text-xs font-mono px-3 py-1.5 rounded-full border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors ${!tag ? 'bg-white text-zinc-950 font-semibold border-white' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'}`}
            >
              Semua
            </a>
            {ALL_TAGS.map(t => (
              <a 
                key={t} 
                href={`/discover?${new URLSearchParams({ ...(q && { q }), ...(platform && { platform }), ...(version && { version }), tag: t, sort }).toString()}`}
                className={`inline-flex items-center min-h-[44px] sm:min-h-0 text-xs font-mono px-3 py-1.5 rounded-full border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors ${tag?.toLowerCase() === t.toLowerCase() ? 'bg-white text-zinc-950 font-semibold border-white' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'}`}
              >
                {t}
              </a>
            ))}
          </div>

          {/* Version Pills: only shown once pinged servers have reported a version */}
          {VERSIONS.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Versi:</span>
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
                  <a
                    key={v || "all"}
                    href={href}
                    aria-current={isActive ? "true" : undefined}
                    className={`inline-flex items-center min-h-[44px] sm:min-h-0 text-xs font-mono px-3 py-1.5 rounded-full border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors ${isActive ? 'bg-white text-zinc-950 font-semibold border-white' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'}`}
                  >
                    {v || "Semua"}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Results */}
        {serialized.length === 0 ? (
          <div className="py-24 text-center text-zinc-400 font-mono border border-zinc-800/80 rounded-xl bg-zinc-950/40">
            Tidak ada server yang ditemukan{q ? ` untuk "${q}"` : ''}. Coba kata kunci lain.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {serialized.map((server) => (
              <ServerCard key={server.slug} {...server as any} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
