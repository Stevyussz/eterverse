import { Metadata } from "next";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { ServerCard } from "@/components/server/ServerCard";
import { MagnifyingGlass, FunnelSimple } from "@phosphor-icons/react/dist/ssr";

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
    canonical: "https://eterverse.com/discover",
  },
  openGraph: {
    title: "Jelajahi Server Minecraft Indonesia | EterVerse",
    description: "Temukan ratusan server Minecraft Indonesia terpopuler. Cek IP, status online real-time, dan vote server favoritmu.",
    url: "https://eterverse.com/discover",
    siteName: "EterVerse",
    locale: "id_ID",
    type: "website",
  },
};

const ALL_TAGS = ["Survival", "SMP", "Lifesteal", "Economy", "Creative", "PvP", "RPG", "Skyblock", "Factions", "Mini-Games"];

type Props = { searchParams: Promise<{ q?: string; tag?: string; sort?: string }> };

export default async function DiscoverPage({ searchParams }: Props) {
  const { q, tag, sort = "votes" } = await searchParams;

  await connectToDatabase();

  const query: any = { moderationStatus: 'APPROVED' };
  if (q) {
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { ipAddress: { $regex: q, $options: 'i' } },
    ];
  }
  if (tag) {
    query.tags = { $in: [new RegExp(tag, 'i')] };
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    votes: { "metrics.votes": -1 },
    rating: { "metrics.rating": -1 },
    newest: { createdAt: -1 },
    players: { "liveStatus.currentPlayers": -1 },
  };

  const sortOption = sortMap[sort] || sortMap.votes;
  const servers = await Server.find(query).sort(sortOption as any).limit(48).lean();

  const serialize = (s: any) => ({
    ...s,
    _id: s._id.toString(),
    ownerId: s.ownerId?.toString(),
    onlinePlayers: s.liveStatus?.currentPlayers || 0,
    maxPlayers: s.liveStatus?.maxPlayers || 0,
    votes: s.metrics?.votes || 0,
    rating: s.metrics?.rating || 0,
  });

  const serialized = servers.map(serialize);

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
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              name="q"
              type="text"
              defaultValue={q}
              placeholder="Cari berdasarkan nama, IP, atau deskripsi..."
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-zinc-500 focus:outline-none transition-colors placeholder:text-zinc-600"
            />
          </div>
          <select
            name="sort"
            defaultValue={sort}
            className="bg-zinc-950/80 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-300 focus:border-zinc-500 focus:outline-none transition-colors"
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

        {/* Tag Pills */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
            <FunnelSimple size={14} /> Kategori:
          </span>
          <a href="/discover" className={`text-xs font-mono px-3 py-1 rounded-full border transition-colors ${!tag ? 'bg-white text-zinc-950 font-semibold border-white' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'}`}>
            Semua
          </a>
          {ALL_TAGS.map(t => (
            <a key={t} href={`/discover?${new URLSearchParams({ ...(q && { q }), tag: t, sort }).toString()}`} className={`text-xs font-mono px-3 py-1 rounded-full border transition-colors ${tag?.toLowerCase() === t.toLowerCase() ? 'bg-white text-zinc-950 font-semibold border-white' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'}`}>
              {t}
            </a>
          ))}
        </div>

        {/* Results */}
        {serialized.length === 0 ? (
          <div className="py-24 text-center text-zinc-500 font-mono border border-zinc-800/80 rounded-xl bg-zinc-950/40">
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
