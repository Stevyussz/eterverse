"use client";

import { useState } from "react";
// Brand marks keep their official shapes; everything else is a pixel icon.
import { DiscordLogo, WhatsappLogo, TelegramLogo } from "@phosphor-icons/react";
import { PixelIcon, type PixelIconName } from "@/components/pixel/PixelIcon";
import { Sprite } from "@/components/pixel/PixelArt";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { StarRating } from "@/components/server/StarRating";
import { EmbedWidget } from "@/components/server/EmbedWidget";
import { CopyIPButton } from "@/components/server/CopyIPButton";
import { DirectPlayButton } from "@/components/server/DirectPlayButton";
import { LiveIcon } from "@/components/ui/LiveIcon";
import { useLanguage } from "@/context/LanguageContext";

interface ServerChannelTabsProps {
  server: any;
  isLoggedIn: boolean;
  userRating: number;
  ytId: string | null;
}

function Empty({ sprite, title, body }: { sprite: "film" | "chest"; title: string; body: string }) {
  return (
    <div className="px-flat py-14 px-6 text-center flex flex-col items-center gap-3">
      <Sprite name={sprite} size={56} />
      <h3 className="px-title text-lg text-ink">{title}</h3>
      <p className="text-sm text-ink-2 max-w-sm">{body}</p>
    </div>
  );
}

type TabKey = "overview" | "trailer" | "gallery" | "about" | "reviews";

export function ServerChannelTabs({
  server,
  isLoggedIn,
  userRating,
  ytId,
}: ServerChannelTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [teaserLoaded, setTeaserLoaded] = useState(false);
  const { t } = useLanguage();

  const isOnline = !!server.liveStatus?.isOnline;
  const currentPlayers = server.liveStatus?.currentPlayers || 0;
  const maxPlayers = server.liveStatus?.maxPlayers || 0;
  const rating = server.metrics?.rating || 0;
  const votes = server.metrics?.votes || 0;
  const gallery = server.galleryUrls || [];
  const isRealm = server.serverType === "REALM";
  const isCrossplay = !isRealm && (server.platform === "CROSSPLAY" || (!server.platform && server.port && server.port !== 19132));

  const tabs: { key: TabKey; label: string; icon: PixelIconName; badge?: string | number }[] = [
    { key: "overview", label: t("server.overview"), icon: "home" },
    // No "HD" badge: video resolution is never checked, so it was an unbacked claim.
    { key: "trailer", label: t("server.trailer"), icon: "play" },
    { key: "gallery", label: t("server.gallery"), icon: "image", badge: gallery.length > 0 ? gallery.length : undefined },
    { key: "about", label: t("server.about"), icon: "scroll" },
    { key: "reviews", label: t("server.reviews"), icon: "star", badge: rating > 0 ? rating.toFixed(1) : undefined },
  ];

  const card = "px-flat p-5 sm:p-6 flex flex-col gap-4";
  const cardTitle = "px-title text-lg text-ink flex items-center gap-2";

  const socials = [
    server.socialLinks?.discord && { href: server.socialLinks.discord, label: t("server.joinDiscord"), icon: <DiscordLogo size={20} weight="fill" className="text-[#4752C4]" aria-hidden /> },
    server.socialLinks?.whatsapp && { href: server.socialLinks.whatsapp, label: t("server.whatsappGroup"), icon: <WhatsappLogo size={20} weight="fill" className="text-[#128C3E]" aria-hidden /> },
    server.socialLinks?.telegram && { href: server.socialLinks.telegram, label: t("server.telegramGroup"), icon: <TelegramLogo size={20} weight="fill" className="text-[#1A7FB0]" aria-hidden /> },
    server.socialLinks?.website && { href: server.socialLinks.website, label: t("server.officialWebsite"), icon: <PixelIcon name="globe" size={18} /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Tabs as inventory slots; the strip sticks under the navbar (64px + drips). */}
      <div className="sticky top-[76px] z-30 -mx-4 px-4 sm:mx-0 sm:px-0 py-2 bg-cream">
        <div role="tablist" aria-label="Bagian halaman server" className="flex items-center gap-3 overflow-x-auto scrollbar-none p-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.key)}
                className="px-slot shrink-0 inline-flex items-center gap-2 min-h-[44px] px-3.5 font-pixel text-sm"
              >
                <PixelIcon name={tab.icon} size={14} className={isActive ? "text-gold-d" : "text-ink-2"} />
                {tab.label}
                {tab.badge !== undefined && <span className="px-chip !text-xs !py-0 !px-1.5 ml-0.5">{tab.badge}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-6" role="tabpanel">
        {activeTab === "overview" && (
          <div className="flex flex-col gap-6 px-pop">
            {/* Stat slots */}
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: t("server.serverStatus"),
                  icon: <LiveIcon online={isOnline} size={16} />,
                  value: isRealm ? "Realm" : isOnline ? "Online" : "Offline",
                  cls: isOnline && !isRealm ? "text-online-d" : "text-ink",
                },
                { label: t("server.onlinePlayers"), icon: <PixelIcon name="users" size={16} className="text-ink-2" />, value: `${currentPlayers.toLocaleString("id-ID")} / ${maxPlayers.toLocaleString("id-ID")}`, cls: "text-ink" },
                { label: t("server.totalVote"), icon: <Sprite name="emerald" size={16} />, value: votes.toLocaleString("id-ID"), cls: "text-ink" },
                { label: t("server.starRating"), icon: <PixelIcon name="star" size={16} className="text-gold-d" />, value: `${rating.toFixed(1)} / 5`, cls: "text-ink" },
              ].map((s) => (
                <div key={s.label} className="px-slot p-3.5 flex flex-col gap-1.5">
                  <dt className="text-xs text-ink-2">{s.label}</dt>
                  <dd className={`flex items-center gap-2 font-bold tabular ${s.cls}`}>
                    {s.icon}
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* How to join */}
            {isCrossplay ? (
              <div className={card}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className={cardTitle}>
                    <PixelIcon name="bolt" size={16} className="text-gold-d" />
                    Crossplay: Java & Bedrock
                  </h3>
                  <span className="text-sm text-ink-2">Pemain PC, HP, dan konsol bisa main bareng</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="px-slot p-4 flex flex-col justify-between gap-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-pixel text-sm text-ink-2">Java Edition (PC)</span>
                      <span className="ip-chip w-fit max-w-full"><span className="ip-chip-caret" aria-hidden>&gt;</span><span className="truncate">{server.ipAddress}{server.port && server.port !== 25565 ? `:${server.port}` : ""}</span></span>
                    </div>
                    <CopyIPButton ipAddress={server.ipAddress} port={server.port} className="w-full sm:w-fit" />
                  </div>
                  <div className="px-slot p-4 flex flex-col justify-between gap-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-pixel text-sm text-ink-2">Bedrock (HP & PC) · port {server.bedrockPort || 19132}</span>
                      <span className="ip-chip w-fit max-w-full"><span className="ip-chip-caret" aria-hidden>&gt;</span><span className="truncate">{server.ipAddress}</span></span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <DirectPlayButton serverName={server.name} ipAddress={server.ipAddress} port={server.bedrockPort || 19132} className="flex-1 sm:flex-initial" />
                      <CopyIPButton ipAddress={server.ipAddress} port={server.bedrockPort || 19132} className="flex-1 sm:flex-initial" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${card} sm:flex-row sm:items-center sm:justify-between`}>
                <div className="flex flex-col gap-2 min-w-0">
                  <span className="font-pixel text-sm text-ink-2">
                    {isRealm ? t("server.realmAddress") : server.platform === "BEDROCK" ? "Alamat server Bedrock" : t("server.serverAddress")}
                  </span>
                  <span className="ip-chip w-fit max-w-full !text-sm">
                    <span className="ip-chip-caret" aria-hidden>&gt;</span>
                    <span className="truncate">
                      {isRealm ? server.realmCode || server.ipAddress : server.ipAddress}
                      {!isRealm && server.port && server.port !== 25565 ? `:${server.port}` : ""}
                    </span>
                  </span>
                  <span className="text-sm text-ink-2">{isRealm ? t("server.realmSubtext") : t("server.serverSubtext")}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 flex-wrap">
                  {(isRealm || server.platform !== "JAVA") && (
                    <DirectPlayButton serverName={server.name} ipAddress={server.ipAddress} port={server.port} isRealm={isRealm} realmCode={server.realmCode} />
                  )}
                  <CopyIPButton ipAddress={server.ipAddress} port={server.port} isRealm={isRealm} realmCode={server.realmCode} />
                </div>
              </div>
            )}

            {server.videoUrl && (
              <div className={card}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className={cardTitle}>
                    <PixelIcon name="play" size={14} className="text-prism-d" /> {t("server.officialTrailer")}
                  </h3>
                  <button onClick={() => setActiveTab("trailer")} className="px-btn px-btn-cream px-btn-sm">
                    {t("server.trailer")}
                    <PixelIcon name="arrow" rotate={180} size={12} />
                  </button>
                </div>
                <div className="aspect-video w-full px-screen">
                  {ytId && teaserLoaded ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ border: 0 }}
                      title="Server Preview"
                    />
                  ) : ytId ? (
                    // Thumbnail until tapped: the YouTube player is ~1MB of JS on page load.
                    <button
                      type="button"
                      onClick={() => setTeaserLoaded(true)}
                      aria-label={`${t("server.officialTrailer")}: ${server.name}`}
                      className="group/play on-dark absolute inset-0 w-full h-full"
                    >
                      <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="px-btn px-btn-gold !min-h-[64px] !min-w-[64px] !p-0 group-hover/play:brightness-110">
                          <PixelIcon name="play" size={28} />
                        </span>
                      </span>
                    </button>
                  ) : (
                    <video src={server.videoUrl} controls preload="metadata" className="w-full h-full object-contain bg-screen" poster={server.bannerUrl || undefined} />
                  )}
                </div>
              </div>
            )}

            <div className={card}>
              <h3 className={cardTitle}>
                <PixelIcon name="scroll" size={16} className="text-prism-d" /> {t("server.summaryTitle")}
              </h3>
              <div className="prose prose-eter max-w-none text-sm leading-relaxed line-clamp-4 overflow-hidden">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{server.description}</ReactMarkdown>
              </div>
              <button onClick={() => setActiveTab("about")} className="px-btn px-btn-cream px-btn-sm w-fit">
                {t("server.readFull")}
              </button>
            </div>
          </div>
        )}

        {activeTab === "trailer" && (
          <div className="flex flex-col gap-6 px-pop">
            {server.videoUrl ? (
              <>
                <div className="aspect-video w-full px-screen">
                  {ytId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ border: 0 }}
                      title={t("server.officialTrailer")}
                    />
                  ) : (
                    <video src={server.videoUrl} controls autoPlay className="w-full h-full object-contain bg-screen" poster={server.bannerUrl || undefined} />
                  )}
                </div>
                <div className={`${card} sm:flex-row sm:items-center sm:justify-between`}>
                  <span className="font-pixel text-base text-ink">{server.name}: {t("server.officialTrailer")}</span>
                  <div className="flex items-center gap-3 flex-wrap">
                    {(isRealm || server.platform !== "JAVA") && (
                      <DirectPlayButton serverName={server.name} ipAddress={server.ipAddress} port={server.port} isRealm={isRealm} realmCode={server.realmCode} />
                    )}
                    <CopyIPButton ipAddress={server.ipAddress} port={server.port} isRealm={isRealm} realmCode={server.realmCode} />
                  </div>
                </div>
              </>
            ) : (
              <Empty sprite="film" title={t("server.noTrailer")} body={t("server.noTrailerDesc")} />
            )}
          </div>
        )}

        {activeTab === "gallery" && (
          <div className="flex flex-col gap-4 px-pop">
            {gallery.length > 0 ? (
              <>
                <span className="text-sm text-ink-2">{gallery.length} tangkapan layar</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {gallery.map((url: string, index: number) => (
                    <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="aspect-video px-screen block group">
                      <img src={url} alt={`${server.name} screenshot ${index + 1}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      <span className="absolute bottom-2 left-2 px-chip">Foto {index + 1}</span>
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <Empty sprite="chest" title={t("server.noGallery")} body={t("server.noGalleryDesc")} />
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div className="flex flex-col gap-6 px-pop">
            <div className={card}>
              <h3 className={cardTitle}>
                <Sprite name="book" size={22} /> Info lengkap & aturan {server.name}
              </h3>
              <div className="prose prose-eter max-w-none text-sm sm:text-base leading-relaxed break-words">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{server.description}</ReactMarkdown>
              </div>
            </div>
            <div className={card}>
              <h4 className="font-pixel text-base text-ink">Spesifikasi server</h4>
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <dt className="text-ink-2">Alamat</dt>
                  <dd className="font-mono text-ink break-all">{isRealm ? server.realmCode || server.ipAddress : server.ipAddress}</dd>
                </div>
                {!isRealm && (
                  <div>
                    <dt className="text-ink-2">Port</dt>
                    <dd className="font-mono text-ink">{server.port || 25565}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-ink-2">Mode / tag</dt>
                  <dd className="text-ink">{server.tags?.join(", ") || "-"}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="flex flex-col gap-6 px-pop">
            <div className={card}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className={cardTitle}>
                    <PixelIcon name="star" size={16} className="text-gold-d" /> {t("server.rateTitle")} {server.name}
                  </h3>
                  <p className="text-sm text-ink-2 mt-1">{t("server.rateDesc")}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-3xl font-bold text-ink tabular">{rating.toFixed(1)}</span>
                  <span className="text-xs text-ink-2 block">dari 5</span>
                </div>
              </div>
              <StarRating slug={server.slug} initialRating={rating} isLoggedIn={isLoggedIn} userRating={userRating} />
            </div>

            {socials.length > 0 && (
              <div className={card}>
                <h3 className={cardTitle}>{t("server.officialCommunity")}</h3>
                <p className="text-sm text-ink-2 -mt-2">{t("server.communitySubtitle")}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {socials.map((s) => (
                    <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="px-btn px-btn-cream !justify-start">
                      {s.icon}
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <EmbedWidget serverSlug={server.slug} />
          </div>
        )}
      </div>
    </div>
  );
}
