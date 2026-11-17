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
import { ShareServerButton } from "@/components/server/ShareServerButton";
import { UptimePanel } from "@/components/server/UptimePanel";
import { SafeImage } from "@/components/ui/SafeImage";
import { LiveIcon } from "@/components/ui/LiveIcon";
import { FavoriteButton } from "@/components/server/FavoriteButton";
import { Favorite } from "@/models/Favorite";
import { isAdminEmail } from "@/lib/admin-guard";
import { getUptimeSummary, refreshIfStale } from "@/lib/server-status";
import { after } from "next/server";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { Sprite } from "@/components/pixel/PixelArt";
// Brand marks stay the official shapes (DESIGN-ETERVERSE.md: only exception to pixel icons).
import {
  DiscordLogo,
  WhatsappLogo,
  TelegramLogo
} from "@phosphor-icons/react/dist/ssr";
import { getYoutubeId } from "@/utils/youtube";

type Props = {
  params: Promise<{ slug: string }>;
};

// Next.js 15 Native SEO Metadata Generator
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  await connectToDatabase();
  const server = await Server.findOne({ slug: params.slug, moderationStatus: 'APPROVED' }).lean();

  if (!server) {
    return { title: "Server Tidak Ditemukan | EterVerse", robots: { index: false } };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eterverse.vercel.app";
  // Generated share card (name, live status, IP). The version changes with each status
  // check so chat apps that cache by URL pick up a fresh card instead of a stale one.
  const ogVersion = server.liveStatus?.lastChecked ? new Date(server.liveStatus.lastChecked).getTime().toString(36) : "0";
  const ogImage = `${baseUrl}/api/og/${encodeURIComponent(server.slug)}?v=${ogVersion}`;
  const onlineCount = server.liveStatus?.currentPlayers || 0;
  // No invented "5.0" for unrated servers: the rating appears only once players have rated.
  const ratingText = server.metrics?.rating ? ` Rating ${server.metrics.rating.toFixed(1)}/5.` : "";

  return {
    title: `${server.name} - Server Minecraft Indonesia | IP & Status`,
    description: `Main di ${server.name} sekarang! IP: ${server.ipAddress}. Status: ${server.liveStatus?.isOnline ? 'Online' : 'Offline'} (${onlineCount} pemain online).${ratingText} Temukan info lengkap dan vote di EterVerse.`,
    keywords: [
      server.name,
      `${server.name} minecraft`,
      `ip ${server.name}`,
      "server minecraft indonesia",
      ...(server.tags || []),
    ],
    alternates: {
      canonical: `${baseUrl}/server/${server.slug}`,
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: `${baseUrl}/server/${server.slug}`,
      siteName: "EterVerse",
      title: `${server.name} - Server Minecraft Indonesia`,
      description: `IP: ${server.ipAddress} | ${onlineCount} pemain online.${ratingText} Gabung dan main sekarang!`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${server.name}: status server, IP, dan jumlah pemain`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${server.name} - Server Minecraft Indonesia`,
      description: `IP: ${server.ipAddress} | ${onlineCount} pemain online.${ratingText}`,
      images: [ogImage],
    },
  };
}

export default async function ServerProfilePage(props: Props) {
  const params = await props.params;
  const session = await auth();

  await connectToDatabase();
  const doc: any = await Server.findOne({ slug: params.slug }).lean();

  // Pending, rejected and banned servers were publicly reachable by slug.
  // The owner can still preview their own listing while it waits for review.
  const isOwner = !!session?.user?.id && doc?.ownerId?.toString() === session.user.id;
  // Admins need the same preview to judge a submission from the moderation queue.
  const canPreview = isOwner || isAdminEmail(session?.user?.email);
  if (!doc || (doc.moderationStatus !== 'APPROVED' && !canPreview)) {
    notFound();
  }

  // Everything passed below reaches client components and the HTML payload. The owner's
  // private WhatsApp (separate from the public socialLinks.whatsapp) was leaking there.
  const { ownerWhatsApp: _ownerWhatsApp, votifier, rejectionReason: _rejectionReason, ...publicFields } = doc;
  const serverData: any = {
    ...publicFields,
    _id: doc._id.toString(),
    ownerId: doc.ownerId?.toString(),
    // Older documents predate the platform field; the schema default is CROSSPLAY, and the
    // header, card and tabs disagreed about it (Java vs Java + Bedrock) until this was set.
    platform: doc.platform || "CROSSPLAY",
  };
  const rewardsEnabled = !!votifier?.enabled;

  // Fetch user's existing rating if logged in
  let userRating = 0;
  if (session?.user?.id) {
    const existing = await Rating.findOne({ serverId: doc._id, userId: session.user.id }).lean();
    userRating = existing?.stars ?? 0;
  }
  const ratingCount = await Rating.countDocuments({ serverId: doc._id });
  const isFavorited = session?.user?.id
    ? !!(await Favorite.exists({ userId: session.user.id, serverId: doc._id }))
    : false;

  // A missing history must never break the page; the panel just stays hidden.
  const uptime = doc.serverType === "REALM" ? null : await getUptimeSummary(serverData._id).catch(() => null);

  // Status used to come only from a once-a-day cron. Refresh in the background after the
  // response when it is older than 5 minutes; the next visitor sees the fresh numbers.
  if (doc.moderationStatus === "APPROVED") {
    after(() => refreshIfStale(serverData._id).catch((err) => console.error("status refresh failed:", err)));
  }


  const ytId = getYoutubeId(serverData.videoUrl);
  const isOnline = !!serverData.liveStatus?.isOnline;
  const currentPlayers = serverData.liveStatus?.currentPlayers || 0;
  const maxPlayers = serverData.liveStatus?.maxPlayers || 0;
  const votes = serverData.metrics?.votes || 0;
  const rating = serverData.metrics?.rating || 0;
  const isRealm = serverData.serverType === "REALM";

  const effectiveBedrockPort = serverData.platform === "BEDROCK" 
    ? (serverData.port || 19132) 
    : (serverData.bedrockPort || 19132);

  return (
    <>
      {serverData.moderationStatus === 'APPROVED' ? (
        <>
          <JsonLdSchema server={serverData} ratingCount={ratingCount} />
          <ImpressionTracker slug={serverData.slug} />
        </>
      ) : (
        <div role="status" className="fixed top-[84px] inset-x-0 z-40 mx-auto w-fit max-w-[calc(100%-2rem)] px-chip px-chip-gold !text-sm !py-1.5 !whitespace-normal">
          Pratinjau {isOwner ? "owner" : "admin"}: server ini belum tampil untuk publik (
          {serverData.moderationStatus === "PENDING" ? "menunggu review" : serverData.moderationStatus === "BANNED" ? "dibekukan" : "ditolak"}).
        </div>
      )}
      
      {/* Banner: a framed window onto the server's world; prismarine bricks when there is none. */}
      <div className="relative w-full pt-16 prism-bricks border-b-[3px] border-ink select-none">
        <div className="relative h-[200px] sm:h-[320px] md:h-[400px] overflow-hidden">
          {serverData.bannerUrl && (
            <SafeImage src={serverData.bannerUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
          )}
        </div>
      </div>

      <main className="relative min-h-screen px-4 sm:px-6 lg:px-8 pb-32 -mt-12 sm:-mt-16">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          {/* Profile card */}
          <div className="px-panel p-4 sm:p-6 flex flex-col gap-5 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
              <div className="flex items-start gap-4 sm:gap-5 min-w-0">
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 shrink-0 px-frame bg-slot -mt-12 sm:-mt-16">
                  <SafeImage
                    src={serverData.logoUrl}
                    fallbackName={serverData.name}
                    alt={`Logo ${serverData.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col gap-2 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="px-title px-title-shadow text-2xl sm:text-3xl md:text-4xl text-ink break-words">
                      {serverData.name}
                    </h1>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {!isRealm && (
                      <span className="px-chip">
                        <LiveIcon online={isOnline} size={12} />
                        {isOnline ? (
                          <span className="text-online-d">{currentPlayers.toLocaleString("id-ID")} online</span>
                        ) : (
                          <span className="text-ink-2">Offline</span>
                        )}
                      </span>
                    )}
                    <span className="px-chip px-chip-prism">
                      {isRealm ? (
                        <><PixelIcon name="crown" size={12} /> Realm</>
                      ) : serverData.platform === "CROSSPLAY" ? (
                        "Java + Bedrock"
                      ) : serverData.platform === "BEDROCK" ? (
                        "Bedrock (HP)"
                      ) : (
                        "Java Edition"
                      )}
                    </span>
                    {serverData.isEterShopPartner && (
                      <span className="px-chip px-chip-gold">
                        <PixelIcon name="sparkle" size={12} className="text-gold-d" /> Partner
                      </span>
                    )}
                    <span className="px-chip">
                      <Sprite name="emerald" size={12} />
                      <span className="tabular">{votes.toLocaleString("id-ID")}</span> vote
                    </span>
                    {rating > 0 && (
                      <span className="px-chip">
                        <PixelIcon name="star" size={12} className="text-gold-d" />
                        {Number(rating).toFixed(1)}
                      </span>
                    )}
                  </div>

                  <div className="ip-chip w-fit max-w-full">
                    <span className="ip-chip-caret" aria-hidden>&gt;</span>
                    <span className="truncate">
                      {isRealm
                        ? serverData.realmCode || serverData.ipAddress
                        : `${serverData.ipAddress}${serverData.port && serverData.port !== 25565 ? `:${serverData.port}` : ""}`}
                    </span>
                  </div>

                  {serverData.tags?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {serverData.tags.map((tag: string, i: number) => (
                        <a key={i} href={`/discover?tag=${encodeURIComponent(tag)}`} className="px-slot font-pixel text-xs px-2 py-1 min-h-[28px] inline-flex items-center">
                          {tag}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0 flex-wrap">
                <VoteButton
                  slug={serverData.slug}
                  initialVotes={votes}
                  serverName={serverData.name}
                  rewardsEnabled={rewardsEnabled}
                />
                {(isRealm || serverData.platform !== "JAVA") && (
                  <DirectPlayButton
                    serverName={serverData.name}
                    ipAddress={serverData.ipAddress}
                    port={effectiveBedrockPort}
                    isRealm={isRealm}
                    realmCode={serverData.realmCode}
                  />
                )}
                <CopyIPButton
                  ipAddress={serverData.ipAddress}
                  port={serverData.port}
                  isRealm={isRealm}
                  realmCode={serverData.realmCode}
                />
                {serverData.moderationStatus === "APPROVED" && (
                  <FavoriteButton slug={serverData.slug} initial={isFavorited} />
                )}
                <ShareServerButton
                  serverName={serverData.name}
                  slug={serverData.slug}
                  address={
                    isRealm
                      ? `realms.gg/${String(serverData.realmCode || "").replace(/^https?:\/\/realms\.gg\//, "")}`
                      : `${serverData.ipAddress}${serverData.port && serverData.port !== 25565 ? `:${serverData.port}` : ""}`
                  }
                />
              </div>
            </div>

            {(serverData.socialLinks?.discord || serverData.socialLinks?.whatsapp || serverData.socialLinks?.telegram || serverData.socialLinks?.website) && (
              <div className="flex items-center gap-3 overflow-x-auto py-1 px-1 scrollbar-none border-t-2 border-dashed border-ink/15 pt-4">
                {serverData.socialLinks?.discord && (
                  <a href={serverData.socialLinks.discord} target="_blank" rel="noopener noreferrer" className="px-btn px-btn-cream px-btn-sm shrink-0">
                    <DiscordLogo size={16} weight="fill" className="text-[#4752C4]" aria-hidden />
                    Discord
                  </a>
                )}
                {serverData.socialLinks?.whatsapp && (
                  <a href={serverData.socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="px-btn px-btn-cream px-btn-sm shrink-0">
                    <WhatsappLogo size={16} weight="fill" className="text-[#128C3E]" aria-hidden />
                    WhatsApp
                  </a>
                )}
                {serverData.socialLinks?.telegram && (
                  <a href={serverData.socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="px-btn px-btn-cream px-btn-sm shrink-0">
                    <TelegramLogo size={16} weight="fill" className="text-[#1A7FB0]" aria-hidden />
                    Telegram
                  </a>
                )}
                {serverData.socialLinks?.website && (
                  <a href={serverData.socialLinks.website} target="_blank" rel="noopener noreferrer" className="px-btn px-btn-cream px-btn-sm shrink-0">
                    <PixelIcon name="globe" size={14} />
                    Website
                  </a>
                )}
              </div>
            )}
          </div>

          {!isRealm && <UptimePanel summary={uptime} version={serverData.liveStatus?.version} />}

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
        port={effectiveBedrockPort}
        isRealm={isRealm}
        realmCode={serverData.realmCode}
        platform={serverData.platform}
        logoUrl={serverData.logoUrl}
        isOnline={isOnline}
        currentPlayers={currentPlayers}
        slug={serverData.slug}
        initialVotes={votes}
        rewardsEnabled={rewardsEnabled}
      />
    </>
  );
}

