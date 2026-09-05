import { Metadata } from "next";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { Rating } from "@/models/Rating";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { JsonLdSchema } from "@/components/seo/JsonLdSchema";
import { CopyIPButton } from "@/components/server/CopyIPButton";
import { DirectPlayButton } from "@/components/server/DirectPlayButton";
import { VoteButton } from "@/components/server/VoteButton";
import { ImpressionTracker } from "@/components/server/ImpressionTracker";
import { MobileStickyActionBar } from "@/components/server/MobileStickyActionBar";
import { ServerChannelTabs } from "@/components/server/ServerChannelTabs";
import {
  Users,
  Trophy,
  Crown,
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
  const isRealm = serverData.serverType === "REALM";

  return (
    <>
      <JsonLdSchema server={serverData} />
      <ImpressionTracker slug={serverData.slug} />
      
      {/* Cinematic Server Banner with 100% Organic Transparent Ambient Blend */}
      <div className="relative w-full h-[280px] sm:h-[380px] md:h-[460px] bg-transparent overflow-hidden select-none pointer-events-none">
        {/* Banner with radial + linear masks fading smoothly into the site wallpaper */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            maskImage: "radial-gradient(ellipse 96% 85% at 50% 35%, black 45%, transparent 95%)",
            WebkitMaskImage: "radial-gradient(ellipse 96% 85% at 50% 35%, black 45%, transparent 95%)",
          }}
        >
          <img 
            src={serverData.bannerUrl || defaultBanner} 
            alt={`${serverData.name} Banner`} 
            className="w-full h-full object-cover opacity-75 scale-[1.02] filter saturate-[1.15] transition-transform duration-700"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 65%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 65%, transparent 100%)",
            }}
          />
        </div>

        {/* Soft atmospheric gradient at bottom for text contrast without harsh box collision */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#09090b]/85 via-[#09090b]/30 to-transparent pointer-events-none" />
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
                    {isRealm && (
                      <div className="bg-purple-500/15 border border-purple-500/35 text-purple-300 font-mono text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.2)]">
                        <Crown weight="fill" size={12} /> Realm
                      </div>
                    )}
                    {serverData.isEterShopPartner && (
                      <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shrink-0">
                        <Trophy weight="fill" size={12} /> Partner
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    {isRealm ? (
                      <>
                        <span className="text-purple-300 font-semibold break-all">
                          {serverData.realmCode || serverData.ipAddress}
                        </span>
                        <span>•</span>
                        <span className="text-zinc-400">Minecraft Realms</span>
                      </>
                    ) : (
                      <>
                        <span className="text-zinc-300 font-semibold break-all">
                          {serverData.ipAddress}{serverData.port && serverData.port !== 25565 ? `:${serverData.port}` : ''}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users size={13} className="text-zinc-400" weight="fill" />
                          {currentPlayers.toLocaleString()} Online
                        </span>
                      </>
                    )}
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
              <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-end flex-wrap">
                <VoteButton slug={serverData.slug} initialVotes={votes} />
                <DirectPlayButton 
                  serverName={serverData.name}
                  ipAddress={serverData.ipAddress}
                  port={serverData.port}
                  isRealm={isRealm}
                  realmCode={serverData.realmCode}
                />
                <CopyIPButton 
                  ipAddress={serverData.ipAddress}
                  port={serverData.port}
                  isRealm={isRealm}
                  realmCode={serverData.realmCode}
                />
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
        port={serverData.port}
        isRealm={isRealm}
        realmCode={serverData.realmCode}
        logoUrl={serverData.logoUrl}
        isOnline={isOnline}
        currentPlayers={currentPlayers}
        slug={serverData.slug}
        initialVotes={votes}
      />
    </>
  );
}

