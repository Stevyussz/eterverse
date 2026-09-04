import { Metadata } from "next";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { Rating } from "@/models/Rating";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { JsonLdSchema } from "@/components/seo/JsonLdSchema";
import { CopyIPButton } from "@/components/server/CopyIPButton";
import { VoteButton } from "@/components/server/VoteButton";
import { ImpressionTracker } from "@/components/server/ImpressionTracker";
import { MobileStickyActionBar } from "@/components/server/MobileStickyActionBar";
import { ServerChannelTabs } from "@/components/server/ServerChannelTabs";
import {
  Users,
  Trophy,
  DiscordLogo,
  WhatsappLogo,
  TelegramLogo,
  Globe
} from "@phosphor-icons/react/dist/ssr";
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
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          
          {/* Channel Header: Logo, Title, Actions & Socials */}
          <div className="flex flex-col gap-4 relative z-10">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
              
              {/* Logo & Main Info */}
              <div className="flex items-end gap-4 sm:gap-6">
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

                <div className="flex flex-col gap-1 pb-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-eter-starlight tracking-tight leading-tight">
                      {serverData.name}
                    </h1>
                    {serverData.isEterShopPartner && (
                      <div className="bg-[#09090b]/90 border-l-2 border-l-eter-gold border-y border-r border-white/15 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold text-eter-gold tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(234,179,8,0.25)] rounded-full shrink-0">
                        <Trophy weight="fill" size={12} /> Partner
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <span className="text-eter-cyan font-bold break-all">{serverData.ipAddress}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users size={13} className="text-eter-cyan" weight="fill" />
                      {currentPlayers.toLocaleString()} Online
                    </span>
                  </div>

                  {/* Tags Carousel/Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {serverData.tags?.map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[10px] font-mono text-zinc-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons (Desktop & Tablet) */}
              <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-end">
                <VoteButton slug={serverData.slug} initialVotes={votes} />
                <CopyIPButton ipAddress={serverData.ipAddress} />
              </div>

            </div>

            {/* Quick Community Social Links */}
            {(serverData.socialLinks?.discord || serverData.socialLinks?.whatsapp || serverData.socialLinks?.telegram || serverData.socialLinks?.website) && (
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                {serverData.socialLinks?.discord && (
                  <a
                    href={serverData.socialLinks.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#5865F2]/15 border border-[#5865F2]/30 text-[#5865F2] hover:bg-[#5865F2]/25 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors"
                  >
                    <DiscordLogo size={16} weight="fill" />
                    <span>Discord</span>
                  </a>
                )}
                {serverData.socialLinks?.whatsapp && (
                  <a
                    href={serverData.socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/25 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors"
                  >
                    <WhatsappLogo size={16} weight="fill" />
                    <span>WhatsApp</span>
                  </a>
                )}
                {serverData.socialLinks?.telegram && (
                  <a
                    href={serverData.socialLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#229ED9]/15 border border-[#229ED9]/30 text-[#229ED9] hover:bg-[#229ED9]/25 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors"
                  >
                    <TelegramLogo size={16} weight="fill" />
                    <span>Telegram</span>
                  </a>
                )}
                {serverData.socialLinks?.website && (
                  <a
                    href={serverData.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors"
                  >
                    <Globe size={16} weight="fill" />
                    <span>Website</span>
                  </a>
                )}
              </div>
            )}

          </div>

          {/* YouTube-Style Categorized Tabs */}
          <ServerChannelTabs
            server={serverData}
            isLoggedIn={!!session?.user}
            userRating={userRating}
            ytId={ytId}
          />

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

