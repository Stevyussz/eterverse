"use client";

import { useState } from "react";
import {
  House,
  VideoCamera,
  Image as ImageIcon,
  BookOpenText,
  Star,
  Users,
  Trophy,
  DiscordLogo,
  WhatsappLogo,
  TelegramLogo,
  Globe,
  FilmStrip,
  Sparkle
} from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { StarRating } from "@/components/server/StarRating";
import { EmbedWidget } from "@/components/server/EmbedWidget";
import { CopyIPButton } from "@/components/server/CopyIPButton";

interface ServerChannelTabsProps {
  server: any;
  isLoggedIn: boolean;
  userRating: number;
  ytId: string | null;
}

type TabKey = "overview" | "trailer" | "gallery" | "about" | "reviews";

export function ServerChannelTabs({
  server,
  isLoggedIn,
  userRating,
  ytId,
}: ServerChannelTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const isOnline = !!server.liveStatus?.isOnline;
  const currentPlayers = server.liveStatus?.currentPlayers || 0;
  const maxPlayers = server.liveStatus?.maxPlayers || 0;
  const rating = server.metrics?.rating || 0;
  const votes = server.metrics?.votes || 0;
  const gallery = server.galleryUrls || [];
  const defaultBanner = "/dashboard-bg.png";

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { key: "overview", label: "Ringkasan", icon: <House size={18} weight={activeTab === "overview" ? "fill" : "regular"} /> },
    {
      key: "trailer",
      label: "Trailer & Reels",
      icon: <FilmStrip size={18} weight={activeTab === "trailer" ? "fill" : "regular"} />,
      badge: server.videoUrl ? "HD" : undefined,
    },
    {
      key: "gallery",
      label: "Galeri",
      icon: <ImageIcon size={18} weight={activeTab === "gallery" ? "fill" : "regular"} />,
      badge: gallery.length > 0 ? gallery.length : undefined,
    },
    { key: "about", label: "Tentang Server", icon: <BookOpenText size={18} weight={activeTab === "about" ? "fill" : "regular"} /> },
    {
      key: "reviews",
      label: "Rating & Komunitas",
      icon: <Star size={18} weight={activeTab === "reviews" ? "fill" : "regular"} />,
      badge: rating > 0 ? rating.toFixed(1) : undefined,
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* ── YouTube-Style Sticky Tabs Bar (Refined & Minimalist) ────────────────── */}
      <div className="border-b border-zinc-800/80 bg-[#09090b]/90 backdrop-blur-md sticky top-[68px] sm:top-[74px] z-30 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-2 py-3 px-3.5 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-200 shrink-0 select-none ${
                  isActive
                    ? "text-white font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] rounded-lg"
                }`}
              >
                <span className={isActive ? "text-white" : "text-zinc-500"}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      isActive
                        ? "bg-white/10 border-white/20 text-white font-medium"
                        : "bg-zinc-800/80 border-zinc-700/60 text-zinc-400"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
                
                {/* Active Underline Indicator (Clean, Sharp, Zero Neon Glow) */}
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content Container ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">

        {/* ── TAB 1: OVERVIEW ────────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            
            {/* Server Health Metrics HUD (Matte Dark, Discrete Indicators) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/80">
              
              {/* Status */}
              <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Status Server</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ring-4 ${isOnline ? "bg-emerald-500 ring-emerald-500/20" : "bg-red-500 ring-red-500/20"}`} />
                  <span className={`text-xs sm:text-sm font-mono font-semibold ${isOnline ? "text-emerald-400" : "text-red-400"}`}>
                    {isOnline ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>
              </div>

              {/* Current Players */}
              <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Pemain Online</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Users size={16} className="text-zinc-400" weight="fill" />
                  <span className="text-xs sm:text-sm font-mono font-semibold text-white">
                    {currentPlayers.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-zinc-500 font-mono">/ {maxPlayers.toLocaleString()}</span>
                  </span>
                </div>
              </div>

              {/* Votes */}
              <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Total Vote</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Trophy size={16} className="text-amber-400/90" weight="fill" />
                  <span className="text-xs sm:text-sm font-mono font-semibold text-white">
                    {votes.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex flex-col gap-1 p-3.5 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Rating Bintang</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star size={16} className="text-amber-400" weight="fill" />
                  <span className="text-xs sm:text-sm font-mono font-semibold text-amber-300">
                    {rating.toFixed(1)}{" "}
                    <span className="text-xs font-normal text-zinc-500 font-mono">/ 5.0</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Connect & Join Box (Understated Luxury) */}
            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                  Alamat Server Minecraft
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight break-all">
                    {server.ipAddress}
                  </span>
                  {server.port && server.port !== 25565 && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                      Port: {server.port}
                    </span>
                  )}
                </div>
                <span className="text-xs text-zinc-400 font-body mt-1">
                  Mendukung Java & Bedrock Edition · Klik tombol untuk menyalin IP
                </span>
              </div>
              <CopyIPButton ipAddress={server.ipAddress} />
            </div>

            {/* Featured Trailer Teaser (If available) */}
            {server.videoUrl && (
              <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-display font-semibold text-zinc-200 flex items-center gap-2">
                    <VideoCamera size={18} className="text-zinc-400" /> Cuplikan Trailer Server
                  </h3>
                  <button
                    onClick={() => setActiveTab("trailer")}
                    className="text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                  >
                    Buka Tab Trailer →
                  </button>
                </div>
                
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-zinc-800 relative">
                  {ytId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=0&rel=0`}
                      className="w-full h-full object-cover"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ border: 0 }}
                      title="Server Preview"
                    />
                  ) : (
                    <video
                      src={server.videoUrl}
                      controls
                      preload="metadata"
                      className="w-full h-full object-contain bg-black"
                      poster={server.bannerUrl || defaultBanner}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Overview Quick Summary */}
            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 flex flex-col gap-3">
              <h3 className="text-sm font-display font-semibold text-zinc-200 flex items-center gap-2">
                <Sparkle size={18} className="text-zinc-400" /> Ringkasan Server
              </h3>
              <p className="text-sm text-zinc-300 font-body leading-relaxed line-clamp-4">
                {server.description}
              </p>
              <button
                onClick={() => setActiveTab("about")}
                className="text-xs font-mono text-zinc-400 hover:text-white transition-colors w-fit mt-1"
              >
                Baca Informasi & Aturan Selengkapnya →
              </button>
            </div>

          </div>
        )}

        {/* ── TAB 2: TRAILER & REELS ──────────────────────────────────────────────── */}
        {activeTab === "trailer" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            
            {/* Main Cinema Video Showcase */}
            {server.videoUrl ? (
              <div className="flex flex-col gap-4">
                <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden aspect-video relative group">
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-700/60 text-xs font-mono text-zinc-300 flex items-center gap-2 pointer-events-none">
                    <FilmStrip size={16} className="text-zinc-400" /> Trailer Resmi
                  </div>
                  {ytId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                      className="w-full h-full object-cover"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ border: 0 }}
                      title="Trailer Resmi"
                    />
                  ) : (
                    <video
                      src={server.videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-contain bg-black"
                      poster={server.bannerUrl || defaultBanner}
                    />
                  )}
                </div>

                <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-zinc-200">{server.name} Trailer Resmi</span>
                    <span className="text-xs font-mono text-zinc-500">Kualitas HD · Dioptimasi untuk streaming</span>
                  </div>
                  <CopyIPButton ipAddress={server.ipAddress} />
                </div>
              </div>
            ) : (
              <div className="py-16 text-center border border-zinc-800/60 rounded-2xl bg-zinc-950/40 flex flex-col items-center gap-3">
                <FilmStrip size={36} className="text-zinc-600" />
                <h3 className="text-base font-display text-zinc-300">Belum ada video trailer resmi</h3>
                <p className="text-xs font-body text-zinc-500 max-w-sm">
                  Owner server belum menambahkan video trailer untuk server ini.
                </p>
              </div>
            )}

            {/* Server Shorts / Reels Feature Showcase (Refined Dark Studio) */}
            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-300 shrink-0">
                  <FilmStrip size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-display font-semibold text-white flex items-center gap-2">
                    EterVerse Clips & Reels
                    <span className="text-[10px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-300 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Segera Hadir
                    </span>
                  </h4>
                  <p className="text-xs text-zinc-400 font-body mt-0.5">
                    Fitur Reels vertikal untuk cuplikan gameplay PvP, build timelapse, dan momen seru server ini.
                  </p>
                </div>
              </div>

              {/* Minimalist 9:16 Preview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                {[
                  { title: "PvP Arena Highlights", tag: "Warzone" },
                  { title: "Epic Castle Timelapse", tag: "Creative" },
                  { title: "Custom Boss Fight Event", tag: "RPG" },
                  { title: "SMP Economy Market", tag: "Survival" },
                ].map((clip, i) => (
                  <div
                    key={i}
                    className="relative aspect-[9/16] rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 hover:border-zinc-700 p-3.5 flex flex-col justify-end group transition-colors"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <span className="relative z-10 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">{clip.tag}</span>
                    <span className="relative z-10 text-xs font-medium text-zinc-200 line-clamp-2 mt-0.5">{clip.title}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 3: GALLERY ──────────────────────────────────────────────────────── */}
        {activeTab === "gallery" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            {gallery.length > 0 ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                    {gallery.length} Tangkapan Layar Tersedia
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {gallery.map((url: string, index: number) => (
                    <div
                      key={index}
                      className="aspect-video bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl overflow-hidden group relative transition-colors"
                    >
                      <img
                        src={url}
                        alt={`${server.name} Screenshot ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-zinc-400 border border-zinc-800 pointer-events-none">
                        Foto {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center border border-zinc-800/60 rounded-2xl bg-zinc-950/40 flex flex-col items-center gap-3">
                <ImageIcon size={36} className="text-zinc-600" />
                <h3 className="text-base font-display text-zinc-300">Belum ada foto galeri</h3>
                <p className="text-xs font-body text-zinc-500 max-w-sm">
                  Owner server belum menambahkan screenshot galeri untuk server ini.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: ABOUT SERVER (FULL DESCRIPTION & RULES) ──────────────────────── */}
        {activeTab === "about" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-display font-semibold text-white mb-6 border-b border-zinc-800 pb-4 flex items-center gap-2.5">
                <BookOpenText size={20} className="text-zinc-400" /> Informasi Lengkap & Aturan {server.name}
              </h3>
              
              <div className="prose prose-invert max-w-none font-body text-sm sm:text-base text-zinc-300 leading-relaxed break-words">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {server.description}
                </ReactMarkdown>
              </div>
            </div>

            {/* Server Details Spec Card */}
            <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-5 flex flex-col gap-3">
              <h4 className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Spesifikasi Server</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block">IP Address:</span>
                  <span className="text-zinc-200 font-semibold break-all">{server.ipAddress}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Port:</span>
                  <span className="text-zinc-200 font-semibold">{server.port || 25565}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Kategori / Tags:</span>
                  <span className="text-zinc-300">{server.tags?.join(", ") || "-"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: REVIEWS & COMMUNITY ─────────────────────────────────────────── */}
        {activeTab === "reviews" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            
            {/* Interactive Rating Section */}
            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-base font-display font-semibold text-white flex items-center gap-2">
                    <Star size={18} className="text-amber-400" weight="fill" /> Beri Penilaian untuk {server.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-body mt-1">
                    Bantu komunitas mengetahui kualitas gameplay dan pelayanan server ini.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-bold text-amber-400">{rating.toFixed(1)}</span>
                  <span className="text-xs font-mono text-zinc-500 block">/ 5.0 Rating</span>
                </div>
              </div>

              <div className="pt-2">
                <StarRating
                  slug={server.slug}
                  initialRating={rating}
                  isLoggedIn={isLoggedIn}
                  userRating={userRating}
                />
              </div>
            </div>

            {/* Social Media & Community Grid */}
            <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="text-base font-display font-semibold text-white">Hub Komunitas Resmi</h3>
              <p className="text-xs text-zinc-400 font-body -mt-2">
                Gabung ke grup resmi untuk pengumuman event, update server, dan interaksi komunitas.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {server.socialLinks?.discord && (
                  <a
                    href={server.socialLinks.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/25 text-white transition-all px-4 py-3 rounded-xl text-sm font-medium"
                  >
                    <DiscordLogo size={20} weight="fill" className="text-[#5865F2]" />
                    <span>Gabung Discord Resmi</span>
                  </a>
                )}
                {server.socialLinks?.whatsapp && (
                  <a
                    href={server.socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/25 text-white transition-all px-4 py-3 rounded-xl text-sm font-medium"
                  >
                    <WhatsappLogo size={20} weight="fill" className="text-[#25D366]" />
                    <span>Grup WhatsApp Komunitas</span>
                  </a>
                )}
                {server.socialLinks?.telegram && (
                  <a
                    href={server.socialLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/25 text-white transition-all px-4 py-3 rounded-xl text-sm font-medium"
                  >
                    <TelegramLogo size={20} weight="fill" className="text-[#229ED9]" />
                    <span>Channel / Grup Telegram</span>
                  </a>
                )}
                {server.socialLinks?.website && (
                  <a
                    href={server.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-zinc-200 hover:text-white transition-all px-4 py-3 rounded-xl text-sm font-medium"
                  >
                    <Globe size={20} className="text-zinc-400" />
                    <span>Kunjungi Website Resmi</span>
                  </a>
                )}
              </div>
            </div>

            {/* Embed Widget Generator */}
            <EmbedWidget serverSlug={server.slug} />

          </div>
        )}

      </div>

    </div>
  );
}
