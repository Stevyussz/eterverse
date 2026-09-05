import { MagnifyingGlass, ArrowRight, Lightning } from "@phosphor-icons/react/dist/ssr";
import { ServerCard } from "@/components/server/ServerCard";
import { HeroSlider } from "@/components/home/HeroSlider";
import { AiMatchmaker } from "@/components/home/AiMatchmaker";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";

export const dynamic = 'force-dynamic';

export default async function Home() {
  await connectToDatabase();
  
  // 1. Fetch Trending Servers (Sorted by Votes)
  const trendingServers = await Server.find({ moderationStatus: 'APPROVED' }).sort({ "metrics.votes": -1 }).limit(4).lean();

  // 2. Fetch Top Rated Servers (Sorted by Rating)
  const topRatedServers = await Server.find({ moderationStatus: 'APPROVED' }).sort({ "metrics.rating": -1 }).limit(4).lean();

  // 3. Fetch Newest Servers (Sorted by CreatedAt)
  const newestServers = await Server.find({ moderationStatus: 'APPROVED' }).sort({ createdAt: -1 }).limit(4).lean();

  // Helper to serialize servers
  const serialize = (servers: any[]) => servers.map(s => ({
    ...s,
    _id: s._id.toString(),
    ownerId: s.ownerId?.toString(),
    onlinePlayers: s.liveStatus?.currentPlayers || 0,
    maxPlayers: s.liveStatus?.maxPlayers || 0,
    votes: s.metrics?.votes || 0,
    rating: s.metrics?.rating || 0,
  }));

  const serializedTrending = serialize(trendingServers);
  const serializedTopRated = serialize(topRatedServers);
  const serializedNewest = serialize(newestServers);

  // Hero Slider should only get EterShop Partners (or top trending servers if no partners)
  let partnerServers = serializedTrending.filter(s => s.isEterShopPartner);
  if (partnerServers.length === 0) partnerServers = serializedTrending.slice(0, 3); // Fallback

  return (
    <main className="relative min-h-screen flex flex-col items-center pt-28 md:pt-36 pb-24 px-4 sm:px-6 lg:px-24 overflow-x-clip">
      
      {/* Search Header Area */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-4 w-full mb-10">
        
        {/* Typographical Contrast (Display vs Mono) */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white">
          Temukan Server Minecraft Impianmu.
        </h1>

        {/* AI Matchmaker Client Component */}
        <AiMatchmaker />
      </div>

      {/* Hero Slider Component */}
      <div className="w-full z-10">
         {partnerServers.length > 0 && <HeroSlider servers={partnerServers} />}
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-20" />

      {/* --- Grids Container --- */}
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-24 relative z-10">
        
        {/* 1. Trending Servers Grid */}
        <div className="flex flex-col gap-8 w-full">
          <div className="flex items-end justify-between border-b border-zinc-800/80 pb-4">
            <h2 className="text-2xl font-display font-semibold text-white flex items-center gap-2">
              Sedang Tren Pekan Ini
            </h2>
            <a href="/discover" className="text-sm font-mono text-zinc-400 hover:text-white transition-colors pb-0.5">
              Lihat Semua Server →
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full content-auto">
            {serializedTrending.length > 0 ? (
               serializedTrending.map((server) => (
                 <ServerCard key={server.slug} {...server as any} />
               ))
            ) : (
              <div className="col-span-full py-20 text-center text-zinc-500 font-mono">
                Belum ada server yang terdaftar di database.
              </div>
            )}
          </div>
        </div>

        {/* 2. Top Rated Grid */}
        <div className="flex flex-col gap-8 w-full">
          <div className="flex items-end justify-between border-b border-zinc-800/80 pb-4">
            <h2 className="text-2xl font-display font-semibold text-white flex items-center gap-2">
              Server Rating Tertinggi
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full content-auto">
            {serializedTopRated.length > 0 ? (
               serializedTopRated.map((server) => (
                 <ServerCard key={server.slug} {...server as any} />
               ))
            ) : (
              <div className="col-span-full py-20 text-center text-zinc-500 font-mono">
                Belum ada server yang memiliki ulasan.
              </div>
            )}
          </div>
        </div>

        {/* 3. Newest Servers Grid */}
        <div className="flex flex-col gap-8 w-full">
          <div className="flex items-end justify-between border-b border-zinc-800/80 pb-4">
            <h2 className="text-2xl font-display font-semibold text-white flex items-center gap-2">
              Server Baru Ditambahkan
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full content-auto">
            {serializedNewest.length > 0 ? (
               serializedNewest.map((server) => (
                 <ServerCard key={server.slug} {...server as any} />
               ))
            ) : (
              <div className="col-span-full py-20 text-center text-zinc-500 font-mono">
                Belum ada server baru saat ini.
              </div>
            )}
          </div>
        </div>

      </div>

    </main>
  );
}
