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
    return { title: "Server Tidak Ditemukan | EterVerse" };
  }

  const ogImage = server.bannerUrl || server.logoUrl || "https://eterverse.com/dashboard-bg.png";
  const onlineCount = server.liveStatus?.currentPlayers || 0;
  const rating = server.metrics?.rating ? server.metrics.rating.toFixed(1) : "5.0";

  return {
    title: `${server.name} - Server Minecraft Indonesia | IP & Status`,
    description: `Main di ${server.name} sekarang! IP: ${server.ipAddress}. Status: ${server.liveStatus?.isOnline ? 'Online' : 'Offline'} (${onlineCount} pemain online). Rating: ⭐ ${rating}/5.0. Temukan info lengkap dan vote di EterVerse.`,
    keywords: [
      server.name,
      `${server.name} minecraft`,
      `ip ${server.name}`,
      "server minecraft indonesia",
      ...(server.tags || []),
    ],
    alternates: {
      canonical: `https://eterverse.com/server/${server.slug}`,
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: `https://eterverse.com/server/${server.slug}`,
      siteName: "EterVerse",
      title: `${server.name} - Server Minecraft Indonesia`,
      description: `IP: ${server.ipAddress} | ${onlineCount} pemain online | Rating ⭐ ${rating}/5.0. Gabung dan main sekarang!`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${server.name} Minecraft Server Banner`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${server.name} - Server Minecraft Indonesia`,
      description: `IP: ${server.ipAddress} | ${onlineCount} pemain online | Rating ⭐ ${rating}/5.0.`,
      images: [ogImage],
    },
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
      
      {/* Cinematic Server Banner with Organic Deep Ambient Blend */}
      <div className="relative w-full h-[260px] sm:h-[360px] md:h-[440px] bg-[#09090b] overflow-hidden select-none">
        {/* Ambient Glow / Backdrop */}
        <div className="absolute inset-0 bg-[#09090b]" />
        <img 
          src={serverData.bannerUrl || defaultBanner} 
          alt={`${serverData.name} Banner`} 
          className="w-full h-full object-cover opacity-70 scale-[1.03] transition-transform duration-700 filter saturate-[1.1]"
        />
        
        {/* Multi-layered Organic Gradient Vignettes (No Harsh Boundaries) */}
        {/* Top Fade into Navbar */}
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#09090b] via-[#09090b]/70 to-transparent pointer-events-none z-10" />
        
        {/* Soft Radial Vignette for Atmospheric Focus */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(9,9,11,0.85)_100%)] pointer-events-none z-10" />
        
        {/* Bottom Dissolve into Main Profile Area */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 via-35% to-transparent pointer-events-none z-10" />
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none z-10" />
      </div>

      <main className="relative min-h-screen px-4 sm:px-6 lg:px-24 pb-32 -mt-20 sm:-mt-28">
        
        {/* Profile Content Container */}
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          
          {/* Channel Header: Logo, Title, Actions & Socials */}
          <div className="flex flex-col gap-4 relative z-10">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6">
              
              {/* Logo & Main Info */}
              <div className="flex items-end gap-4 sm:gap-6">
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-2xl bg-black border-2 border-zinc-800 shadow-2xl overflow-hidden shrink-0">
                  <img 
                    src={serverData.logoUrl || defaultLogo} 
                    alt={`${serverData.name} Logo`} 
                    className="w-full h-full object-cover"
                  />
                  {/* Live Online Dot Overlay */}
                  <div className="absolute bottom-2 right-2 flex items-center justify-center">
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ring-2 ring-zinc-950 ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  </div>
                </div>

                <div className="flex flex-col gap-1 pb-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-tight leading-tight">
                      {serverData.name}
                    </h1>
                    {serverData.isEterShopPartner && (
                      <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shrink-0">
                        <Trophy weight="fill" size={12} /> Partner
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <span className="text-zinc-300 font-semibold break-all">{serverData.ipAddress}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users size={13} className="text-zinc-400" weight="fill" />
                      {currentPlayers.toLocaleString()} Online
                    </span>
                  </div>

                  {/* Tags Carousel/Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {serverData.tags?.map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-md text-[10px] font-mono text-zinc-400">
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
                    className="flex items-center gap-2 bg-[#5865F2]/10 border border-[#5865F2]/25 text-white hover:bg-[#5865F2]/20 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors"
                  >
                    <DiscordLogo size={16} weight="fill" className="text-[#5865F2]" />
                    <span>Discord</span>
                  </a>
                )}
                {serverData.socialLinks?.whatsapp && (
                  <a
                    href={serverData.socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/25 text-white hover:bg-[#25D366]/20 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors"
                  >
                    <WhatsappLogo size={16} weight="fill" className="text-[#25D366]" />
                    <span>WhatsApp</span>
                  </a>
                )}
                {serverData.socialLinks?.telegram && (
                  <a
                    href={serverData.socialLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#229ED9]/10 border border-[#229ED9]/25 text-white hover:bg-[#229ED9]/20 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors"
                  >
                    <TelegramLogo size={16} weight="fill" className="text-[#229ED9]" />
                    <span>Telegram</span>
                  </a>
                )}
                {serverData.socialLinks?.website && (
                  <a
                    href={serverData.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors"
                  >
                    <Globe size={16} className="text-zinc-400" />
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

