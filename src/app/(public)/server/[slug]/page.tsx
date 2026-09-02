import { Metadata } from "next";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { notFound } from "next/navigation";
import { JsonLdSchema } from "@/components/seo/JsonLdSchema";
import { EmbedWidget } from "@/components/server/EmbedWidget";
import { CopyIPButton } from "@/components/server/CopyIPButton";
import { Users, Star, Trophy, DiscordLogo, WhatsappLogo, TelegramLogo, Globe, Image as ImageIcon } from "@phosphor-icons/react/dist/ssr";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

  const defaultBanner = "https://images.unsplash.com/photo-1607988795691-3e0147c618d5?q=80&w=2070&auto=format&fit=crop";
  const defaultLogo = "https://images.unsplash.com/photo-1549643276-fdf2fab574f5?q=80&w=200&auto=format&fit=crop";

  return (
    <>
      <JsonLdSchema server={serverData} />
      
      {/* Portfolio Banner */}
      <div className="relative w-full h-[300px] md:h-[400px] bg-[#09090b] mt-20">
        <img 
          src={serverData.bannerUrl || defaultBanner} 
          alt={`${serverData.name} Banner`} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent"></div>
      </div>

      <main className="relative min-h-screen px-6 lg:px-24 pb-24 -mt-24">
        
        {/* Profile Content */}
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
          
          {/* Main Info */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Header: Logo & Title */}
            <div className="flex flex-col md:flex-row md:items-end gap-6 relative z-10">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-black border-4 border-[#09090b] shadow-2xl overflow-hidden shrink-0">
                <img 
                  src={serverData.logoUrl || defaultLogo} 
                  alt={`${serverData.name} Logo`} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex flex-col gap-2 pb-2">
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl md:text-5xl font-display font-semibold text-eter-starlight">
                    {serverData.name}
                  </h1>
                  {serverData.isEterShopPartner && (
                     <div className="bg-[#09090b]/80 border-l-2 border-l-eter-gold border-y border-r border-white/10 px-3 py-1 text-[10px] font-mono font-bold text-eter-gold tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(234,179,8,0.15)] rounded-full">
                       <Trophy weight="fill" size={14} /> Partner
                     </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {serverData.tags?.map((tag: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-zinc-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* IP Copy Box */}
            <div className="bg-[#050505]/80 border border-white/10 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 shadow-xl">
              <div className="flex flex-col">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">Server IP Address</span>
                <span className="text-2xl font-mono font-semibold text-eter-cyan">{serverData.ipAddress}</span>
                {serverData.port && serverData.port !== 25565 && (
                  <span className="text-xs font-mono text-zinc-500 mt-0.5">Port: {serverData.port}</span>
                )}
              </div>
              <CopyIPButton ipAddress={serverData.ipAddress} />
            </div>
            
            {/* Markdown Description */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-8 mt-2 shadow-lg">
              <h2 className="text-xl font-display font-medium text-eter-starlight mb-6 border-b border-white/5 pb-4">About this Server</h2>
              <div className="prose prose-invert prose-cyan max-w-none font-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {serverData.description}
                </ReactMarkdown>
              </div>
            </div>

            {/* Gallery */}
            {serverData.galleryUrls && serverData.galleryUrls.length > 0 && (
              <div className="flex flex-col gap-4 mt-6">
                <h2 className="text-xl font-display font-medium text-eter-starlight flex items-center gap-2">
                  <ImageIcon className="text-eter-cyan" /> Server Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {serverData.galleryUrls.map((url: string, index: number) => (
                    <div key={index} className="aspect-video bg-black/50 border border-white/10 rounded-xl overflow-hidden group">
                      <img 
                        src={url} 
                        alt={`${serverData.name} Screenshot ${index + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
          
          {/* Sidebar Stats */}
          <div className="w-full lg:w-80 flex flex-col gap-6 lg:mt-32">
            
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
            
            {/* Community Links */}
            {(serverData.socialLinks?.discord || serverData.socialLinks?.whatsapp || serverData.socialLinks?.telegram || serverData.socialLinks?.website) && (
              <div className="bg-[#050505]/60 border border-white/10 rounded-xl p-6 flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Community</h3>
                <div className="flex flex-col gap-2">
                  {serverData.socialLinks?.discord && (
                    <a href={serverData.socialLinks.discord} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/30 text-[#5865F2] hover:text-white transition-colors duration-smooth px-4 py-2.5 rounded-md">
                      <DiscordLogo size={20} weight="fill" />
                      <span className="font-medium text-sm">Join Discord</span>
                    </a>
                  )}
                  {serverData.socialLinks?.whatsapp && (
                    <a href={serverData.socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] hover:text-white transition-colors duration-smooth px-4 py-2.5 rounded-md">
                      <WhatsappLogo size={20} weight="fill" />
                      <span className="font-medium text-sm">WhatsApp Group</span>
                    </a>
                  )}
                  {serverData.socialLinks?.telegram && (
                    <a href={serverData.socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 text-[#229ED9] hover:text-white transition-colors duration-smooth px-4 py-2.5 rounded-md">
                      <TelegramLogo size={20} weight="fill" />
                      <span className="font-medium text-sm">Telegram Group</span>
                    </a>
                  )}
                  {serverData.socialLinks?.website && (
                    <a href={serverData.socialLinks.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors duration-smooth px-4 py-2.5 rounded-md">
                      <Globe size={20} weight="fill" />
                      <span className="font-medium text-sm">Visit Website</span>
                    </a>
                  )}
                </div>
              </div>
            )}

          </div>
          
        </div>
      </main>
    </>
  );
}
