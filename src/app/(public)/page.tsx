import { MagnifyingGlass, ArrowRight, Lightning } from "@phosphor-icons/react/dist/ssr";
import { ServerCard } from "@/components/server/ServerCard";
import { HeroSlider } from "@/components/home/HeroSlider";
import { AiMatchmaker } from "@/components/home/AiMatchmaker";

// Mock Data
const MOCK_SERVERS = [
  {
    name: "Nusantara Lifesteal SMP",
    slug: "nusantara-lifesteal-smp",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", 
    isEterShopPartner: true,
    onlinePlayers: 245,
    maxPlayers: 500,
    votes: 1240,
    rating: 4.8,
    tags: ["Lifesteal", "Survival"]
  },
  {
    name: "Aetheria Skyblock",
    slug: "aetheria-skyblock",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    isEterShopPartner: false,
    onlinePlayers: 180,
    maxPlayers: 300,
    votes: 890,
    rating: 4.5,
    tags: ["Skyblock", "Economy"]
  },
  {
    name: "Titan Factions",
    slug: "titan-factions",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    isEterShopPartner: true,
    onlinePlayers: 420,
    maxPlayers: 1000,
    votes: 3500,
    rating: 4.9,
    tags: ["Factions", "PvP"]
  },
  {
    name: "CozyCraft SMP",
    slug: "cozycraft-smp",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    isEterShopPartner: false,
    onlinePlayers: 45,
    maxPlayers: 100,
    votes: 210,
    rating: 4.2,
    tags: ["Vanilla", "Chill"]
  }
];

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center pt-32 pb-24 px-6 lg:px-24 overflow-x-hidden">
      
      {/* Search Header Area */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-4 w-full mb-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 border-l-2 border-l-eter-cyan border-y border-r border-y-white/10 border-r-white/10 bg-[#050505]/80 backdrop-blur-md text-[11px] font-mono font-medium text-eter-starlight uppercase tracking-widest">
          <Lightning weight="fill" size={14} className="text-eter-cyan" />
          PHASE 3.5: AI MATCHMAKER READY
        </div>
        
        {/* Typographical Contrast (Display vs Mono) */}
        <h1 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-eter-starlight">
          Find Your Perfect Server.
        </h1>

        {/* AI Matchmaker Client Component */}
        <AiMatchmaker />
      </div>

      {/* Hero Slider Component replaces the massive static headline */}
      <div className="w-full z-10">
         <HeroSlider />
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
          {MOCK_SERVERS.map((server) => (
            <ServerCard key={server.slug} {...server} />
          ))}
        </div>
      </div>

    </main>
  );
}
