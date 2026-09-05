"use client";

import { useRef, useState, useEffect } from "react";
import { Users, Star, CaretUp, Trophy, Crown } from "@phosphor-icons/react";
import Link from "next/link";
import { BackgroundVideo } from "@/components/ui/BackgroundVideo";

interface ServerCardProps {
  name: string;
  slug: string;
  serverType?: 'SERVER' | 'REALM';
  videoUrl?: string;
  bannerUrl?: string;
  isEterShopPartner?: boolean;
  onlinePlayers?: number;
  maxPlayers?: number;
  votes?: number;
  rating?: number;
  tags?: string[];
}

export function ServerCard({
  name,
  slug,
  serverType = 'SERVER',
  videoUrl = "",
  bannerUrl,
  isEterShopPartner = false,
  onlinePlayers = 0,
  maxPlayers = 0,
  votes = 0,
  rating = 0,
  tags = [],
}: ServerCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up hover timeout on unmount and setup focal-zone observer on touch devices
  useEffect(() => {
    const currentCard = cardRef.current;
    if (!currentCard) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch) {
      return () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      };
    }

    // Focal-Zone IntersectionObserver:
    // rootMargin restricts triggering to the center reading area of the screen (-25% top, -25% bottom)
    // Only ONE card in the user's primary view will auto-play, matching TikTok / Reels behavior!
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            // Settle debounce (100ms): only start playing when user slows down/settles on this card
            hoverTimeoutRef.current = setTimeout(() => {
              setIsHovered(true);
            }, 100);
          } else {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            setIsHovered(false);
          }
        });
      },
      {
        rootMargin: "-25% 0px -25% 0px",
        threshold: 0.35,
      }
    );

    observer.observe(currentCard);

    return () => {
      observer.unobserve(currentCard);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // Desktop mouse hover
  const handleMouseEnter = () => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
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

  return (
    <Link 
      href={`/server/${slug}`}
      ref={cardRef}
      className="group relative flex flex-col aspect-[4/5] sm:aspect-[9/16] rounded-xl overflow-hidden border border-zinc-800/90 bg-zinc-950 hover:border-zinc-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 [contain:paint]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video / Banner Background */}
      <BackgroundVideo 
        videoUrl={videoUrl} 
        fallbackImage={bannerUrl}
        isHovered={isHovered} 
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${isHovered ? 'opacity-100 scale-105' : 'opacity-40'}`} 
      />
      
      {/* Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/50 to-transparent pointer-events-none" />

      {/* Top Badges */}
      <div className="relative z-10 flex justify-between items-start p-3.5 sm:p-4 gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {isEterShopPartner && (
            <div className="flex items-center gap-1.5 bg-amber-500/15 backdrop-blur-md border border-amber-500/30 px-2.5 py-1 rounded-full h-fit">
              <Trophy weight="fill" className="text-amber-400" size={12} />
              <span className="text-[9px] font-mono font-semibold text-amber-300 tracking-wider uppercase">Partner</span>
            </div>
          )}
          {serverType === 'REALM' && (
            <div className="flex items-center gap-1.5 bg-purple-500/20 backdrop-blur-md border border-purple-500/40 px-2.5 py-1 rounded-full h-fit shadow-[0_0_10px_rgba(168,85,247,0.25)]">
              <Crown weight="fill" className="text-purple-300" size={12} />
              <span className="text-[9px] font-mono font-semibold text-purple-200 tracking-wider uppercase">Realm</span>
            </div>
          )}
        </div>

        <div className="ml-auto flex flex-col gap-1.5 items-end">
           {safeTags.slice(0, 2).map((tag) => (
             <span key={tag} className="bg-black/70 backdrop-blur-md border border-white/10 text-[8px] sm:text-[9px] font-mono font-medium text-zinc-300 px-2 py-0.5 uppercase tracking-wider rounded-md">
               {tag}
             </span>
           ))}
        </div>
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 mt-auto p-4 sm:p-5 flex flex-col gap-2.5">
        <h3 className="font-display text-lg sm:text-xl font-semibold text-white leading-tight transition-colors duration-200 line-clamp-2">
          {name}
        </h3>
        
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap pt-2 border-t border-zinc-800/80">
          {serverType === 'REALM' ? (
            <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-purple-300">
              <Crown weight="fill" className="text-purple-400" size={13} />
              <span>Mojang Realm</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-zinc-300">
              <Users weight="fill" className="text-zinc-400" size={14} />
              <span>{(onlinePlayers || 0).toLocaleString()} / {(maxPlayers || 0).toLocaleString()}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-zinc-300">
            <CaretUp weight="bold" className="text-zinc-400" size={14} />
            <span>{(votes || 0).toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-zinc-300 ml-auto">
            <Star weight="fill" className="text-amber-400" size={14} />
            <span>{(rating || 0).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

