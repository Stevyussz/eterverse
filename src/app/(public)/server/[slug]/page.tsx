import { Metadata } from "next";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { notFound } from "next/navigation";
import { JsonLdSchema } from "@/components/seo/JsonLdSchema";
import { EmbedWidget } from "@/components/server/EmbedWidget";
import { Users, Star, Trophy } from "@phosphor-icons/react/dist/ssr";

type Props = {
  params: Promise<{ slug: string }>;
};

// Next.js 15 Native SEO Metadata Generator
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  await connectToDatabase();
  const server = await Server.findOne({ slug: params.slug }).lean();

  if (!server) {
    return { title: "Server Not Found | EterVerse" };
  }

  return {
    title: `${server.name} - IP, Ping & Status | EterVerse`,
    description: `Main di ${server.name} sekarang! Server Minecraft Indonesia terbaik. Copy IP: ${server.ipAddress}, Online: ${server.liveStatus?.currentPlayers || 0} players. Temukan komunitasmu di EterVerse.`,
    alternates: {
      canonical: `https://eterverse.com/server/${server.slug}`,
    }
  };
}

export default async function ServerProfilePage(props: Props) {
  const params = await props.params;
  await connectToDatabase();
  let serverData: any = await Server.findOne({ slug: params.slug }).lean();

  if (!serverData) {
    notFound();
  }

  return (
    <>
      <JsonLdSchema server={serverData} />
      <main className="relative min-h-screen pt-32 pb-24 px-6 lg:px-24">
        
        {/* Profile Content */}
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-10">
          
          {/* Main Info */}
          <div className="flex-1 flex flex-col gap-6">
            
            <div className="flex items-center gap-4">
              <h1 className="text-4xl md:text-5xl font-display font-semibold text-eter-starlight">
                {serverData.name}
              </h1>
              {serverData.isEterShopPartner && (
                 <div className="bg-[#09090b]/80 border-l-2 border-l-eter-gold border-y border-r border-white/10 px-3 py-1 text-[10px] font-mono font-bold text-eter-gold tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                   <Trophy weight="fill" size={14} /> Partner
                 </div>
              )}
            </div>
            
            <p className="text-zinc-400 font-body text-lg font-light leading-relaxed">
              {serverData.description}
            </p>
            
            {/* IP Copy Box */}
            <div className="bg-[#050505]/80 border border-white/10 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 shadow-xl">
              <div className="flex flex-col">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">Server IP Address</span>
                <span className="text-2xl font-mono font-semibold text-eter-cyan">{serverData.ipAddress}</span>
              </div>
              <button className="w-full sm:w-auto bg-eter-cyan text-[#09090B] font-semibold px-6 py-3 rounded-md hover:bg-cyan-300 transition-colors duration-smooth">
                Copy IP to Play
              </button>
            </div>
            
          </div>
          
          {/* Sidebar Stats */}
          <div className="w-full lg:w-80 flex flex-col gap-6">
            
            <div className="bg-[#050505]/60 border border-white/10 rounded-xl p-6 flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Live Status</h3>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300 flex items-center gap-2">
                  <span className={`relative flex h-2.5 w-2.5`}>
                    {serverData.liveStatus?.isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${serverData.liveStatus?.isOnline ? 'bg-green-500' : 'bg-eter-red'}`}></span>
                  </span>
                  {serverData.liveStatus?.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-eter-cyan">
                  <Users size={20} weight="fill" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-mono font-semibold text-eter-starlight">
                    {serverData.liveStatus?.currentPlayers?.toLocaleString() || 0} <span className="text-sm text-zinc-500 font-medium">/ {serverData.liveStatus?.maxPlayers?.toLocaleString() || 0}</span>
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-eter-gold">
                  <Star size={20} weight="fill" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-mono font-semibold text-eter-starlight">
                    {serverData.metrics?.rating?.toFixed(1) || 0} <span className="text-sm text-zinc-500 font-medium">/ 5.0</span>
                  </span>
                </div>
              </div>
            </div>
            
            <EmbedWidget serverSlug={serverData.slug} />

          </div>
          
        </div>
      </main>
    </>
  );
}
