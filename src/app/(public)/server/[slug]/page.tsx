import { Metadata } from "next";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { Rating } from "@/models/Rating";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { JsonLdSchema } from "@/components/seo/JsonLdSchema";
import { EmbedWidget } from "@/components/server/EmbedWidget";
import { CopyIPButton } from "@/components/server/CopyIPButton";
import { VoteButton } from "@/components/server/VoteButton";
import { StarRating } from "@/components/server/StarRating";
import { ImpressionTracker } from "@/components/server/ImpressionTracker";
import { MobileStickyActionBar } from "@/components/server/MobileStickyActionBar";
import {
  Users,
  Trophy,
  DiscordLogo,
  WhatsappLogo,
  TelegramLogo,
  Globe,
  Image as ImageIcon,
  VideoCamera,
  Star,
  CaretUp,
  SignalHigh,
  Sparkle
} from "@phosphor-icons/react/dist/ssr";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getYoutubeId } from "@/utils/youtube";

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
  const session = await auth();

  await connectToDatabase();
  let serverData: any = await Server.findOne({ slug: params.slug }).lean();

  if (!serverData) {
    notFound();
  }

  // Fetch user's existing rating if logged in
  let userRating = 0;
  if (session?.user?.id) {
    const existing = await Rating.findOne({ serverId: serverData._id, userId: session.user.id }).lean();
    userRating = existing?.stars ?? 0;
  }

  const defaultBanner = "/dashboard-bg.png";
  const defaultLogo = "/icon-placeholder.png";

  const ytId = getYoutubeId(serverData.videoUrl);
  const isOnline = !!serverData.liveStatus?.isOnline;
  const currentPlayers = serverData.liveStatus?.currentPlayers || 0;
  const maxPlayers = serverData.liveStatus?.maxPlayers || 0;
  const votes = serverData.metrics?.votes || 0;
  const rating = serverData.metrics?.rating || 0;

  return (
    <>
      <JsonLdSchema server={serverData} />
      <ImpressionTracker slug={serverData.slug} />
      
      {/* Portfolio Banner with Dynamic Ambient Fade */}
      <div className="relative w-full h-[220px] sm:h-[300px] md:h-[400px] bg-[#09090b] mt-16 sm:mt-20 overflow-hidden">
        <img 
          src={serverData.bannerUrl || defaultBanner} 
          alt={`${serverData.name} Banner`} 
          className="w-full h-full object-cover opacity-60 scale-105 filter blur-[0.5px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      <main className="relative min-h-screen px-4 sm:px-6 lg:px-24 pb-32 -mt-16 sm:-mt-24">
        
        {/* Profile Content Container */}
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-10">
          
          {/* Main Content Column */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Header: Logo, Title & Tags */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 relative z-10">
              
              {/* Server Logo Avatar */}
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-2xl bg-black border-4 border-[#09090b] shadow-[0_0_25px_rgba(0,0,0,0.8)] overflow-hidden shrink-0">
                <img 
                  src={serverData.logoUrl || defaultLogo} 
                  alt={`${serverData.name} Logo`} 
                  className="w-full h-full object-cover"
                />
                {/* Live Online Dot Overlay */}
                <div className="absolute bottom-2 right-2 flex items-center justify-center">
                  {isOnline && (
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75" />
                  )}
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-eter-red'}`} />
                </div>
              </div>
              
              {/* Title & Badges */}
              <div className="flex flex-col gap-2 pb-1 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-eter-starlight tracking-tight leading-tight">
                    {serverData.name}
                  </h1>
                  {serverData.isEterShopPartner && (
                     <div className="bg-[#09090b]/90 border-l-2 border-l-eter-gold border-y border-r border-white/15 px-2.5 py-1 text-[9px] sm:text-[10px] font-mono font-bold text-eter-gold tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(234,179,8,0.25)] rounded-full shrink-0">
                       <Trophy weight="fill" size={13} /> Partner
                     </div>
                  )}
                </div>

                {/* Tags Carousel/Pills */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5">
                  {serverData.tags?.map((tag: string, i: number) => (
                    <span key={i} className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-md text-[10px] sm:text-xs font-mono text-zinc-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Mobile-Only Quick Stats Strip (< lg) */}
            <div className="lg:hidden grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-[#050505]/75 border border-white/10 rounded-xl backdrop-blur-md shadow-lg">
              
              {/* Online Status */}
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <SignalHigh size={16} className={isOnline ? "text-green-400" : "text-eter-red"} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Status</span>
                  <span className={`text-xs font-mono font-bold ${isOnline ? "text-green-400" : "text-eter-red"}`}>
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>

              {/* Live Players */}
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-eter-cyan/10 flex items-center justify-center shrink-0 text-eter-cyan">
                  <Users size={16} weight="fill" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Players</span>
                  <span className="text-xs font-mono font-bold text-eter-starlight truncate">
                    {currentPlayers.toLocaleString()} <span className="text-[10px] font-normal text-zinc-500">/ {maxPlayers.toLocaleString()}</span>
                  </span>
                </div>
              </div>

              {/* Total Votes */}
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 text-eter-starlight">
                  <CaretUp size={16} weight="bold" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Votes</span>
                  <span className="text-xs font-mono font-bold text-eter-starlight truncate">
                    {votes.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-eter-gold/10 flex items-center justify-center shrink-0 text-eter-gold">
                  <Star size={16} weight="fill" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Rating</span>
                  <span className="text-xs font-mono font-bold text-eter-gold truncate">
                    {rating.toFixed(1)} <span className="text-[10px] font-normal text-zinc-500">/ 5.0</span>
                  </span>
                </div>
              </div>

            </div>

            {/* IP Box & Primary Action Card */}
            <div className="bg-[#050505]/85 border border-white/10 border-l-2 border-l-eter-cyan rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Server IP Address</span>
                  <span className="px-1.5 py-0.2 bg-eter-cyan/10 text-eter-cyan text-[9px] font-mono rounded">Java & Bedrock</span>
                </div>
                <span className="text-xl sm:text-2xl font-mono font-bold text-eter-cyan break-all tracking-tight selection:bg-eter-cyan selection:text-black">
                  {serverData.ipAddress}
                </span>
                {serverData.port && serverData.port !== 25565 && (
                  <span className="text-xs font-mono text-zinc-400 mt-0.5">Port: <span className="text-white font-semibold">{serverData.port}</span></span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex-1 sm:flex-initial">
                  <CopyIPButton ipAddress={serverData.ipAddress} />
                </div>
                {/* Inline Desktop Vote Button */}
                <div className="hidden sm:block shrink-0">
                  <VoteButton slug={serverData.slug} initialVotes={votes} />
                </div>
              </div>
            </div>

            {/* Mobile Community Hub Row (Quick Access) */}
            {(serverData.socialLinks?.discord || serverData.socialLinks?.whatsapp || serverData.socialLinks?.telegram || serverData.socialLinks?.website) && (
              <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-1 -mt-1 scrollbar-none">
                {serverData.socialLinks?.discord && (
                  <a
                    href={serverData.socialLinks.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#5865F2]/15 border border-[#5865F2]/30 text-[#5865F2] hover:bg-[#5865F2]/25 px-3.5 py-2 rounded-xl text-xs font-medium shrink-0 transition-colors"
                  >
                    <DiscordLogo size={18} weight="fill" />
                    <span>Discord</span>
                  </a>
                )}
                {serverData.socialLinks?.whatsapp && (
                  <a
                    href={serverData.socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/25 px-3.5 py-2 rounded-xl text-xs font-medium shrink-0 transition-colors"
                  >
                    <WhatsappLogo size={18} weight="fill" />
                    <span>WhatsApp</span>
                  </a>
                )}
                {serverData.socialLinks?.telegram && (
                  <a
                    href={serverData.socialLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#229ED9]/15 border border-[#229ED9]/30 text-[#229ED9] hover:bg-[#229ED9]/25 px-3.5 py-2 rounded-xl text-xs font-medium shrink-0 transition-colors"
                  >
                    <TelegramLogo size={18} weight="fill" />
                    <span>Telegram</span>
                  </a>
                )}
                {serverData.socialLinks?.website && (
                  <a
                    href={serverData.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 px-3.5 py-2 rounded-xl text-xs font-medium shrink-0 transition-colors"
                  >
                    <Globe size={18} weight="fill" />
                    <span>Website</span>
                  </a>
                )}
              </div>
            )}

            {/* Video Trailer */}
            {serverData.videoUrl && (
              <div className="bg-black/50 border border-white/10 rounded-2xl overflow-hidden shadow-2xl aspect-video relative group">
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono font-medium text-eter-starlight flex items-center gap-2 pointer-events-none">
                   <VideoCamera size={15} className="text-eter-cyan" /> Official Trailer
                </div>
                {ytId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0`}
                    className="w-full h-full object-cover"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: 0 }}
                    title="Server Video Trailer"
                  />
                ) : (
                  <video 
                    src={serverData.videoUrl} 
                    controls 
                    preload="metadata"
                    className="w-full h-full object-contain bg-black"
                    poster={serverData.bannerUrl || defaultBanner}
                  />
                )}
              </div>
            )}
            
            {/* Markdown Description */}
            <div className="bg-[#09090b]/80 border border-white/10 rounded-2xl p-5 sm:p-8 shadow-xl">
              <h2 className="text-lg sm:text-xl font-display font-semibold text-eter-starlight mb-5 border-b border-white/10 pb-3 flex items-center gap-2">
                <Sparkle size={18} className="text-eter-cyan" /> About {serverData.name}
              </h2>
              <div className="prose prose-invert prose-cyan max-w-none font-body text-sm sm:text-base leading-relaxed break-words">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {serverData.description}
                </ReactMarkdown>
              </div>
            </div>

            {/* Gallery Screenshots */}
            {serverData.galleryUrls && serverData.galleryUrls.length > 0 && (
              <div className="flex flex-col gap-3.5">
                <h2 className="text-lg sm:text-xl font-display font-semibold text-eter-starlight flex items-center gap-2">
                  <ImageIcon className="text-eter-cyan" size={20} /> Server Screenshots
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {serverData.galleryUrls.map((url: string, index: number) => (
                    <div key={index} className="aspect-video bg-black/60 border border-white/10 rounded-xl overflow-hidden group shadow-md">
                      <img 
                        src={url} 
                        alt={`${serverData.name} Screenshot ${index + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Star Rating Card (< lg) */}
            <div className="lg:hidden bg-[#09090b]/80 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-eter-starlight uppercase tracking-wider flex items-center gap-2">
                <Star className="text-eter-gold" weight="fill" size={16} /> Rate this Server
              </h3>
              <p className="text-xs text-zinc-400">Bagikan ratingmu untuk membantu pemain lain menemukan server terbaik.</p>
              <div className="pt-2">
                <StarRating 
                  slug={serverData.slug}
                  initialRating={rating}
                  isLoggedIn={!!session?.user}
                  userRating={userRating}
                />
              </div>
            </div>
            
          </div>
          
          {/* Desktop Sidebar (lg:w-80) */}
          <div className="hidden lg:flex w-80 flex-col gap-6 lg:mt-32 shrink-0">
            
            {/* Live Status & Star Rating */}
            <div className="bg-[#050505]/70 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 backdrop-blur-md shadow-xl">
              <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-widest">Live Status</h3>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-300 flex items-center gap-2 font-mono">
                  <span className="relative flex h-2.5 w-2.5">
                    {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />}
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? 'bg-green-500' : 'bg-eter-red'}`} />
                  </span>
                  {isOnline ? 'Server Online' : 'Server Offline'}
                </span>
              </div>
              
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-eter-cyan/10 text-eter-cyan border border-eter-cyan/20">
                  <Users size={20} weight="fill" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-mono font-bold text-eter-starlight">
                    {currentPlayers.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    of {maxPlayers.toLocaleString()} max players
                  </span>
                </div>
              </div>
              
              {/* Interactive Star Rating */}
              <div className="mt-2 pt-4 border-t border-white/10">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3">Rate this Server</p>
                <StarRating 
                  slug={serverData.slug}
                  initialRating={rating}
                  isLoggedIn={!!session?.user}
                  userRating={userRating}
                />
              </div>
            </div>
            
            <EmbedWidget serverSlug={serverData.slug} />
            
            {/* Community Links on Desktop */}
            {(serverData.socialLinks?.discord || serverData.socialLinks?.whatsapp || serverData.socialLinks?.telegram || serverData.socialLinks?.website) && (
              <div className="bg-[#050505]/70 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 backdrop-blur-md shadow-xl">
                <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-widest">Community Links</h3>
                <div className="flex flex-col gap-2.5">
                  {serverData.socialLinks?.discord && (
                    <a href={serverData.socialLinks.discord} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-[#5865F2]/15 hover:bg-[#5865F2]/25 border border-[#5865F2]/30 text-[#5865F2] hover:text-white transition-all px-4 py-2.5 rounded-xl text-sm font-medium">
                      <DiscordLogo size={20} weight="fill" />
                      <span>Join Discord</span>
                    </a>
                  )}
                  {serverData.socialLinks?.whatsapp && (
                    <a href={serverData.socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] hover:text-white transition-all px-4 py-2.5 rounded-xl text-sm font-medium">
                      <WhatsappLogo size={20} weight="fill" />
                      <span>WhatsApp Group</span>
                    </a>
                  )}
                  {serverData.socialLinks?.telegram && (
                    <a href={serverData.socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border border-[#229ED9]/30 text-[#229ED9] hover:text-white transition-all px-4 py-2.5 rounded-xl text-sm font-medium">
                      <TelegramLogo size={20} weight="fill" />
                      <span>Telegram Group</span>
                    </a>
                  )}
                  {serverData.socialLinks?.website && (
                    <a href={serverData.socialLinks.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all px-4 py-2.5 rounded-xl text-sm font-medium">
                      <Globe size={20} weight="fill" />
                      <span>Visit Website</span>
                    </a>
                  )}
                </div>
              </div>
            )}

          </div>
          
        </div>
      </main>

      {/* Floating Sticky Mobile Action Bar (< lg) */}
      <MobileStickyActionBar 
        serverName={serverData.name}
        ipAddress={serverData.ipAddress}
        logoUrl={serverData.logoUrl}
        isOnline={isOnline}
        currentPlayers={currentPlayers}
        slug={serverData.slug}
        initialVotes={votes}
      />
    </>
  );
}

