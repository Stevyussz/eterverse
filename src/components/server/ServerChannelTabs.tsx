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
    { key: "overview", label: "Overview", icon: <House size={18} weight={activeTab === "overview" ? "fill" : "regular"} /> },
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
      
      {/* ── YouTube-Style Sticky Tabs Bar ─────────────────────────────────────────── */}
      <div className="border-b border-white/10 bg-[#09090b]/80 backdrop-blur-md sticky top-[68px] sm:top-[74px] z-30 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-display font-medium transition-all duration-200 shrink-0 select-none ${
                  isActive
                    ? "text-eter-starlight font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02] rounded-lg"
                }`}
              >
                <span className={isActive ? "text-eter-cyan" : "text-zinc-500"}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
                      isActive
                        ? "bg-eter-cyan/15 border-eter-cyan/40 text-eter-cyan font-bold"
                        : "bg-white/5 border-white/10 text-zinc-500"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
                
                {/* Active Sliding Indicator Bar */}
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-eter-cyan via-cyan-300 to-eter-cyan rounded-full shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
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
            
            {/* Quick Live Server Health HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#09090b] via-[#050505] to-black border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-eter-cyan/5 blur-3xl pointer-events-none" />

              {/* Status */}
              <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Status Server</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" : "bg-eter-red"}`} />
                  <span className={`text-sm sm:text-base font-mono font-bold ${isOnline ? "text-green-400" : "text-eter-red"}`}>
                    {isOnline ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>
              </div>

              {/* Current Players */}
              <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Pemain Online</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Users size={16} className="text-eter-cyan" weight="fill" />
                  <span className="text-sm sm:text-base font-mono font-bold text-eter-starlight">
                    {currentPlayers.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-zinc-500 font-mono">/ {maxPlayers.toLocaleString()}</span>
                  </span>
                </div>
              </div>

              {/* Votes */}
              <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Total Vote</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Trophy size={16} className="text-eter-gold" weight="fill" />
                  <span className="text-sm sm:text-base font-mono font-bold text-eter-starlight">
                    {votes.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex flex-col gap-1 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Rating Bintang</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star size={16} className="text-eter-gold" weight="fill" />
                  <span className="text-sm sm:text-base font-mono font-bold text-eter-gold">
                    {rating.toFixed(1)}{" "}
                    <span className="text-xs font-normal text-zinc-500 font-mono">/ 5.0</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Connect & Join Box */}
            <div className="bg-[#050505]/90 border border-white/10 border-l-2 border-l-eter-cyan rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">
                  Alamat Server Minecraft
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-mono font-bold text-eter-cyan tracking-tight break-all">
                    {server.ipAddress}
                  </span>
                  {server.port && server.port !== 25565 && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">
                      Port: {server.port}
                    </span>
                  )}
                </div>
                <span className="text-xs text-zinc-400 font-body mt-1">
                  Mendukung Java & Bedrock Edition · Klik tombol untuk salin IP langsung
                </span>
              </div>
              <CopyIPButton ipAddress={server.ipAddress} />
            </div>

            {/* Featured Trailer Teaser (If available) */}
            {server.videoUrl && (
              <div className="bg-[#09090b]/80 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-display font-semibold text-eter-starlight flex items-center gap-2">
                    <VideoCamera size={18} className="text-eter-cyan" /> Cuplikan Trailer Server
                  </h3>
                  <button
                    onClick={() => setActiveTab("trailer")}
                    className="text-xs font-mono text-eter-cyan hover:underline"
                  >
                    Buka Tab Trailer →
                  </button>
                </div>
                
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 relative">
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
            <div className="bg-[#09090b]/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-3">
              <h3 className="text-base font-display font-semibold text-eter-starlight flex items-center gap-2">
                <Sparkle size={18} className="text-eter-gold" /> Ringkasan Server
              </h3>
              <p className="text-sm text-zinc-300 font-body leading-relaxed line-clamp-4">
                {server.description}
              </p>
              <button
                onClick={() => setActiveTab("about")}
                className="text-xs font-mono text-eter-cyan hover:underline w-fit mt-1"
              >
                Baca Informasi & Aturan Selengkapnya →
              </button>
            </div>

          </div>
        )}

        {/* ── TAB 2: TRAILER & REELS ──────────────────────────────────────────────── */}
        {activeTab === "trailer" && (
          <div className="flex flex-col gap-6 animate-fade-in">
            
            {/* Main Video Cinema Showcase */}
            {server.videoUrl ? (
              <div className="flex flex-col gap-4">
                <div className="bg-black/80 border border-white/15 rounded-2xl overflow-hidden shadow-2xl aspect-video relative group">
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-xs font-mono font-medium text-eter-starlight flex items-center gap-2 pointer-events-none">
                    <FilmStrip size={16} className="text-eter-cyan" /> Official Server Trailer
                  </div>
                  {ytId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                      className="w-full h-full object-cover"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ border: 0 }}
                      title="Official Trailer"
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

                <div className="bg-[#09090b]/80 border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex flex-col">
                    <span className="text-sm font-display font-semibold text-eter-starlight">{server.name} Trailer Resmi</span>
                    <span className="text-xs font-mono text-zinc-500">Kualitas HD · Dioptimasi untuk streaming</span>
                  </div>
                  <CopyIPButton ipAddress={server.ipAddress} />
                </div>
              </div>
            ) : (
              <div className="py-16 text-center border border-white/5 rounded-2xl bg-black/40 flex flex-col items-center gap-3">
                <FilmStrip size={40} className="text-zinc-600" />
                <h3 className="text-lg font-display text-zinc-300">Belum ada video trailer resmi</h3>
                <p className="text-xs font-body text-zinc-500 max-w-sm">
                  Owner server belum menambahkan video trailer untuk server ini.
                </p>
              </div>
            )}

            {/* Teaser: Server Shorts / Reels Feature Showcase */}
            <div className="bg-gradient-to-r from-[#09090b] via-[#0e1726]/40 to-[#09090b] border border-eter-cyan/25 rounded-2xl p-6 shadow-xl flex flex-col gap-4 relative overflow-hidden">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-eter-cyan/15 border border-eter-cyan/30 flex items-center justify-center text-eter-cyan">
                  <FilmStrip size={18} weight="bold" />
                </div>
                <div>
                  <h4 className="text-sm font-display font-semibold text-eter-starlight flex items-center gap-2">
                    EterVerse Clips & Reels
                    <span className="text-[9px] font-mono bg-eter-cyan/20 border border-eter-cyan/40 text-eter-cyan px-2 py-0.2 rounded-full uppercase tracking-wider">
                      Coming Soon
                    </span>
                  </h4>
                  <p className="text-xs text-zinc-400 font-body mt-0.5">
                    Fitur Reels vertikal untuk upload cuplikan gameplay PvP, build timelapses, dan momen seru server ini!
                  </p>
                </div>
              </div>

              {/* Visual Mockup Grid for Reels */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                {[
                  { title: "PvP Arena Highlights", tag: "Warzone" },
                  { title: "Epic Castle Timelapse", tag: "Creative" },
                  { title: "Custom Boss Fight Event", tag: "RPG" },
                  { title: "SMP Economy Market", tag: "Survival" },
                ].map((clip, i) => (
                  <div
                    key={i}
                    className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black/60 border border-white/10 p-3 flex flex-col justify-end group hover:border-eter-cyan/40 transition-colors"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <span className="relative z-10 text-[9px] font-mono text-eter-cyan uppercase tracking-wider">{clip.tag}</span>
                    <span className="relative z-10 text-xs font-display font-semibold text-zinc-200 line-clamp-2">{clip.title}</span>
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
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    {gallery.length} Tangkapan Layar Tersedia
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {gallery.map((url: string, index: number) => (
                    <div
                      key={index}
                      className="aspect-video bg-black/60 border border-white/10 rounded-xl overflow-hidden group shadow-lg relative"
                    >
                      <img
                        src={url}
                        alt={`${server.name} Screenshot ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-zinc-300 border border-white/10 pointer-events-none">
                        Foto {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center border border-white/5 rounded-2xl bg-black/40 flex flex-col items-center gap-3">
                <ImageIcon size={40} className="text-zinc-600" />
                <h3 className="text-lg font-display text-zinc-300">Belum ada foto galeri</h3>
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
            <div className="bg-[#09090b]/80 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-xl font-display font-semibold text-eter-starlight mb-6 border-b border-white/10 pb-4 flex items-center gap-2.5">
                <BookOpenText size={22} className="text-eter-cyan" /> Informasi Lengkap & Aturan {server.name}
              </h3>
              
              <div className="prose prose-invert prose-cyan max-w-none font-body text-sm sm:text-base leading-relaxed break-words">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {server.description}
                </ReactMarkdown>
              </div>
            </div>

            {/* Server Details Spec Card */}
            <div className="bg-[#050505]/70 border border-white/10 rounded-xl p-5 flex flex-col gap-3">
              <h4 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">Spesifikasi Server</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block">IP Address:</span>
                  <span className="text-eter-cyan font-bold break-all">{server.ipAddress}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Port:</span>
                  <span className="text-eter-starlight">{server.port || 25565}</span>
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
            <div className="bg-[#09090b]/80 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-display font-semibold text-eter-starlight flex items-center gap-2">
                    <Star size={20} className="text-eter-gold" weight="fill" /> Beri Penilaian untuk {server.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-body mt-1">
                    Bantu komunitas mengetahui kualitas gameplay, staf, dan komunitas di server ini.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-mono font-bold text-eter-gold">{rating.toFixed(1)}</span>
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
            <div className="bg-[#09090b]/80 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
              <h3 className="text-base font-display font-semibold text-eter-starlight">Hub Komunitas Resmi</h3>
              <p className="text-xs text-zinc-400 font-body -mt-2">
                Gabung ke grup resmi untuk mendapatkan pengumuman event, update server, dan berinteraksi dengan sesama pemain.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {server.socialLinks?.discord && (
                  <a
                    href={server.socialLinks.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#5865F2]/15 hover:bg-[#5865F2]/25 border border-[#5865F2]/30 text-[#5865F2] hover:text-white transition-all px-4 py-3 rounded-xl text-sm font-medium"
                  >
                    <DiscordLogo size={22} weight="fill" />
                    <span>Join Official Discord Server</span>
                  </a>
                )}
                {server.socialLinks?.whatsapp && (
                  <a
                    href={server.socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] hover:text-white transition-all px-4 py-3 rounded-xl text-sm font-medium"
                  >
                    <WhatsappLogo size={22} weight="fill" />
                    <span>Grup WhatsApp Komunitas</span>
                  </a>
                )}
                {server.socialLinks?.telegram && (
                  <a
                    href={server.socialLinks.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border border-[#229ED9]/30 text-[#229ED9] hover:text-white transition-all px-4 py-3 rounded-xl text-sm font-medium"
                  >
                    <TelegramLogo size={22} weight="fill" />
                    <span>Channel / Grup Telegram</span>
                  </a>
                )}
                {server.socialLinks?.website && (
                  <a
                    href={server.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all px-4 py-3 rounded-xl text-sm font-medium"
                  >
                    <Globe size={22} weight="fill" />
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
