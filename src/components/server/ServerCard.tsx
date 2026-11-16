"use client";

import { useRef, useState, useEffect } from "react";
import { Users, Star, CaretUp, Trophy, Crown } from "@phosphor-icons/react";
import Link from "next/link";
import { BackgroundVideo } from "@/components/ui/BackgroundVideo";
import { LiveIcon } from "@/components/ui/LiveIcon";
import { isLowEndDevice, isPageScrolling, isTouchDevice, subscribeScroll } from "@/lib/scroll-perf";

interface ServerCardProps {
  name: string;
  slug: string;
  serverType?: 'SERVER' | 'REALM';
  platform?: 'JAVA' | 'BEDROCK' | 'CROSSPLAY';
  videoUrl?: string;
  bannerUrl?: string;
  isEterShopPartner?: boolean;
  onlinePlayers?: number;
  maxPlayers?: number;
  votes?: number;
  rating?: number;
  tags?: string[];
  isOnline?: boolean;
  address?: string;
}

const PLATFORM_LABEL: Record<string, string> = {
  CROSSPLAY: "Java + Bedrock",
  JAVA: "Java",
  BEDROCK: "Bedrock",
};

export function ServerCard({
  name,
  slug,
  serverType = 'SERVER',
  platform = 'CROSSPLAY',
  videoUrl = "",
  bannerUrl,
  isEterShopPartner = false,
  onlinePlayers = 0,
  maxPlayers = 0,
  votes = 0,
  rating = 0,
  tags = [],
  isOnline = false,
  address = "",
}: ServerCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Touch devices: TikTok-style focal-zone autoplay, driven by one shared scroll listener.
  useEffect(() => {
    const currentCard = cardRef.current;
    if (!currentCard) return;

    const clearHoverTimer = () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    };

    // Desktop uses mouse hover; low-end phones keep the poster only (no iframe/video decode).
    if (!isTouchDevice() || isLowEndDevice()) {
      return clearHoverTimer;
    }

    let inFocalZone = false;

    const schedulePlay = () => {
      clearHoverTimer();
      hoverTimeoutRef.current = setTimeout(() => {
        if (inFocalZone && !isPageScrolling()) setIsHovered(true);
      }, 650);
    };

    const unsubscribe = subscribeScroll(
      () => {
        clearHoverTimer();
        setIsHovered(false);
      },
      () => {
        // Previously a card that stayed in the zone during a scroll never resumed playing.
        if (inFocalZone) schedulePlay();
      }
    );

    const observer = new IntersectionObserver(
      ([entry]) => {
        inFocalZone = entry.isIntersecting;
        if (inFocalZone) {
          schedulePlay();
        } else {
          clearHoverTimer();
          setIsHovered(false);
        }
      },
      {
        rootMargin: "-20% 0px -20% 0px",
        threshold: 0.5,
      }
    );

    observer.observe(currentCard);

    return () => {
      observer.disconnect();
      unsubscribe();
      clearHoverTimer();
    };
  }, []);

  // Desktop mouse hover
  const handleMouseEnter = () => {
    if (isTouchDevice()) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 120);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(false);
  };

  const safeTags = Array.isArray(tags) ? tags : [];
  const isRealm = serverType === 'REALM';

  return (
    <Link 
      href={`/server/${slug}`}
      ref={cardRef}
      aria-label={`${name}, ${isRealm ? "Realm" : isOnline ? `online, ${onlinePlayers} pemain` : "offline"}`}
      className="server-card group relative flex flex-col aspect-[4/5] sm:aspect-[9/16] rounded-xl overflow-hidden border border-zinc-800/90 bg-zinc-950 hover:border-zinc-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 active:scale-[0.99] [contain:paint] card-cv"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video / Banner Background */}
      <BackgroundVideo 
        videoUrl={videoUrl} 
        fallbackImage={bannerUrl}
        isHovered={isHovered} 
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-55'}`}
      />
      
      {/* Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/60 to-transparent pointer-events-none" />

      {/* Top row: live status is the first thing a player checks; Partner is the only badge. */}
      <div className="relative z-10 flex justify-between items-start p-3.5 sm:p-4 gap-2">
        {isRealm ? (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-black/80 border border-white/10 px-2 py-1 text-[11px] font-mono text-purple-200">
            <Crown weight="fill" className="text-purple-300" size={12} aria-hidden />
            Realm
          </span>
        ) : (
          <span className={`inline-flex items-center gap-1.5 rounded-md bg-black/80 border px-2 py-1 text-[11px] font-mono ${isOnline ? "border-cyan-400/40 text-cyan-200" : "border-white/10 text-zinc-400"}`}>
            <LiveIcon online={isOnline} size={13} />
            {isOnline ? `${(onlinePlayers || 0).toLocaleString("id-ID")} online` : "Offline"}
          </span>
        )}
        {isEterShopPartner && (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-950/90 border border-amber-500/40 px-2 py-1 text-[11px] font-mono text-amber-200">
            <Trophy weight="fill" className="text-amber-400" size={12} aria-hidden />
            Partner
          </span>
        )}
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 mt-auto p-4 sm:p-5 flex flex-col gap-2.5">
        <p className="text-[11px] font-mono text-zinc-400 truncate">
          {[isRealm ? "Realm" : PLATFORM_LABEL[platform], ...safeTags.slice(0, 2)].filter(Boolean).join(" · ")}
        </p>
        <h3 className="font-display text-lg sm:text-xl font-semibold text-white leading-tight line-clamp-2">
          {name}
        </h3>

        {/* Identity motif: the address itself, in mono, the way players will type it. */}
        {address && (
          <div className="ip-chip" title={address}>
            <span className="ip-chip-caret" aria-hidden>&gt;</span>
            <span className="truncate">{address}</span>
          </div>
        )}

        <div className="flex items-center gap-3 sm:gap-4 pt-2 border-t border-zinc-800/80 font-mono text-[11px] sm:text-xs text-zinc-300">
          {!isRealm && (
            <span className="flex items-center gap-1.5" title="Pemain online / slot">
              <Users weight="fill" className="text-zinc-400" size={14} aria-hidden />
              {(onlinePlayers || 0).toLocaleString("id-ID")}/{(maxPlayers || 0).toLocaleString("id-ID")}
            </span>
          )}
          <span className="flex items-center gap-1.5" title="Vote">
            <CaretUp weight="bold" className="text-zinc-400" size={14} aria-hidden />
            {(votes || 0).toLocaleString("id-ID")}
            <span className="sr-only">vote</span>
          </span>
          {rating > 0 ? (
            <span className="flex items-center gap-1.5 ml-auto" title="Rating pemain">
              <Star weight="fill" className="text-amber-400" size={14} aria-hidden />
              {rating.toFixed(1)}
            </span>
          ) : (
            <span className="ml-auto text-zinc-400">Belum dirating</span>
          )}
        </div>
      </div>
    </Link>
  );
}

