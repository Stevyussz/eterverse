import { MagnifyingGlass, ArrowRight, Lightning } from "@phosphor-icons/react/dist/ssr";
import { ServerCard } from "@/components/server/ServerCard";
import { HeroSlider } from "@/components/home/HeroSlider";
import { AiMatchmaker } from "@/components/home/AiMatchmaker";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";

export const dynamic = 'force-dynamic';

export default async function Home() {
  await connectToDatabase();
  
  // Fetch real trending servers (e.g., sorted by votes or just approved)
  const servers = await Server.find({ moderationStatus: 'APPROVED' }).sort({ "metrics.votes": -1 }).limit(12).lean();

  // Convert ObjectIds to string to pass to Client Components without serialization errors
  const serializedServers = servers.map(s => ({
    ...s,
    _id: s._id.toString(),
    ownerId: s.ownerId?.toString(),
    // Map DB fields to the props expected by ServerCard
    onlinePlayers: s.liveStatus?.currentPlayers || 0,
    maxPlayers: s.liveStatus?.maxPlayers || 0,
    votes: s.metrics?.votes || 0,
    rating: s.metrics?.rating || 0,
  }));

  // Hero Slider should only get EterShop Partners (or top servers if no partners)
  let partnerServers = serializedServers.filter(s => s.isEterShopPartner);
  if (partnerServers.length === 0) partnerServers = serializedServers.slice(0, 3); // Fallback

  return (
    <main className="relative min-h-screen flex flex-col items-center pt-32 pb-24 px-6 lg:px-24 overflow-x-hidden">
      
      {/* Search Header Area */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-4 w-full mb-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 border-l-2 border-l-eter-cyan border-y border-r border-y-white/10 border-r-white/10 bg-[#050505]/80 backdrop-blur-md text-[11px] font-mono font-medium text-eter-starlight uppercase tracking-widest">
          <Lightning weight="fill" size={14} className="text-eter-cyan" />
          FULL PRODUCTION: LIVE DATABASE
        </div>
        
        {/* Typographical Contrast (Display vs Mono) */}
        <h1 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-eter-starlight">
          Find Your Perfect Server.
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

      {/* Trending Servers Grid */}
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 relative z-10">
        <div className="flex items-end justify-between border-b border-white/5 pb-4">
          <h2 className="text-2xl font-display font-semibold text-eter-starlight flex items-center gap-2">
            Trending This Week
          </h2>
          <a href="#" className="text-sm font-mono text-eter-cyan hover:text-cyan-300 transition-colors duration-smooth border-b border-eter-cyan/30 hover:border-cyan-300 pb-0.5">View Directory</a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {serializedServers.length > 0 ? (
             serializedServers.map((server) => (
               <ServerCard key={server.slug} {...server as any} />
             ))
          ) : (
            <div className="col-span-full py-20 text-center text-zinc-500 font-mono">
              No servers available in the database yet.
            </div>
          )}
        </div>
      </div>

    </main>
  );
}
