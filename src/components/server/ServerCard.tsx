"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { BackgroundVideo } from "@/components/ui/BackgroundVideo";
import { LiveIcon } from "@/components/ui/LiveIcon";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { Sprite } from "@/components/pixel/PixelArt";
import { SafeImage } from "@/components/ui/SafeImage";
import { isLowEndDevice, isPageScrolling, isTouchDevice, subscribeScroll } from "@/lib/scroll-perf";

interface ServerCardProps {
  name: string;
  slug: string;
  serverType?: 'SERVER' | 'REALM';
  platform?: 'JAVA' | 'BEDROCK' | 'CROSSPLAY';
  videoUrl?: string;
  bannerUrl?: string;
  logoUrl?: string;
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
  logoUrl = "",
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
      className="server-card group px-panel px-lift flex flex-col h-full card-cv"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* The trailer screen. Status sits on it like the ping corner of the Multiplayer list. */}
      <div className="relative aspect-video px-screen !shadow-none border-b-[3px] border-frame">
        <BackgroundVideo
          videoUrl={videoUrl}
          fallbackImage={bannerUrl}
          isHovered={isHovered}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 flex justify-between items-start p-2.5 gap-2">
          {isRealm ? (
            <span className="px-chip">
              <PixelIcon name="crown" size={12} className="text-gold-d" />
              Realm
            </span>
          ) : (
            <span className="px-chip">
              <LiveIcon online={isOnline} size={12} />
              {isOnline ? (
                <span className="text-online-d">{(onlinePlayers || 0).toLocaleString("id-ID")} online</span>
              ) : (
                <span className="text-ink-2">Offline</span>
              )}
            </span>
          )}
          {isEterShopPartner && (
            <span className="px-chip px-chip-gold">
              <PixelIcon name="sparkle" size={12} className="text-gold-d" />
              Partner
            </span>
          )}
        </div>
        {!videoUrl && !bannerUrl && (
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
            <Sprite name="grassBlock" size={48} />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start gap-3">
          {/* Server icon, as on the Multiplayer screen */}
          <SafeImage
            src={logoUrl}
            alt=""
            fallbackName={name}
            className="w-11 h-11 shrink-0 object-cover px-frame !bg-slot text-sm"
          />
          <div className="min-w-0 flex-1">
            <h3 className="px-title text-lg text-ink leading-tight line-clamp-2">{name}</h3>
            <p className="text-xs text-ink-2 truncate mt-1">
              {[isRealm ? "Realm" : PLATFORM_LABEL[platform], ...safeTags.slice(0, 2)].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>

        {/* Identity motif: the address itself, in mono, the way players will type it. */}
        {address && (
          <div className="ip-chip" title={address}>
            <span className="ip-chip-caret" aria-hidden>&gt;</span>
            <span className="truncate">{address}</span>
          </div>
        )}

        <div className="mt-auto flex items-center gap-4 pt-3 border-t-2 border-dashed border-ink/15 text-sm text-ink tabular">
          {!isRealm && (
            <span className="flex items-center gap-1.5" title="Pemain online / slot">
              <PixelIcon name="users" size={14} className="text-ink-2" />
              {(onlinePlayers || 0).toLocaleString("id-ID")}/{(maxPlayers || 0).toLocaleString("id-ID")}
            </span>
          )}
          <span className="flex items-center gap-1.5" title="Vote">
            <Sprite name="emerald" size={16} />
            {(votes || 0).toLocaleString("id-ID")}
            <span className="sr-only">vote</span>
          </span>
          {rating > 0 ? (
            <span className="flex items-center gap-1.5 ml-auto" title="Rating pemain">
              <PixelIcon name="star" size={14} className="text-gold-d" />
              {rating.toFixed(1)}
            </span>
          ) : (
            <span className="ml-auto text-xs text-ink-2">Belum dirating</span>
          )}
        </div>
      </div>
    </Link>
  );
}
