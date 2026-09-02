import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { ServerCard } from "@/components/server/ServerCard";
import { MagnifyingGlass, FunnelSimple } from "@phosphor-icons/react/dist/ssr";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Discover Servers | EterVerse",
  description: "Temukan dan jelajahi semua server Minecraft Indonesia terbaik di EterVerse. Filter berdasarkan kategori, mode permainan, dan rating.",
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
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-eter-starlight">Discover Servers</h1>
          <p className="text-zinc-400 font-body text-sm">Browse all {servers.length} server{servers.length !== 1 ? 's' : ''} on EterVerse.</p>
        </div>

        {/* Search & Filters */}
        <form method="GET" className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              name="q"
              type="text"
              defaultValue={q}
              placeholder="Search by name, IP, or description..."
              className="w-full bg-[#09090b]/80 border border-white/10 rounded-sm pl-10 pr-4 py-2.5 text-sm text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors"
            />
          </div>
          <select
            name="sort"
            defaultValue={sort}
            className="bg-[#09090b]/80 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-zinc-300 focus:border-eter-cyan focus:outline-none transition-colors"
          >
            <option value="votes">Most Voted</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
            <option value="players">Most Players</option>
          </select>
          <button type="submit" className="bg-eter-cyan text-black font-semibold px-6 py-2.5 rounded-sm hover:bg-cyan-300 transition-colors text-sm">
            Search
          </button>
        </form>

        {/* Tag Pills */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1">
            <FunnelSimple size={14} /> Filter:
          </span>
          <a href="/discover" className={`text-xs font-mono px-3 py-1 rounded-full border transition-colors ${!tag ? 'bg-eter-cyan/20 border-eter-cyan/40 text-eter-cyan' : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-zinc-200'}`}>
            All
          </a>
          {ALL_TAGS.map(t => (
            <a key={t} href={`/discover?${new URLSearchParams({ ...(q && { q }), tag: t, sort }).toString()}`} className={`text-xs font-mono px-3 py-1 rounded-full border transition-colors ${tag?.toLowerCase() === t.toLowerCase() ? 'bg-eter-cyan/20 border-eter-cyan/40 text-eter-cyan' : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-zinc-200'}`}>
              {t}
            </a>
          ))}
        </div>

        {/* Results */}
        {serialized.length === 0 ? (
          <div className="py-24 text-center text-zinc-500 font-mono border border-white/5 rounded-sm">
            No servers found{q ? ` for "${q}"` : ''}. Try a different search.
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
