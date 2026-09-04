"use client";

import { useRef, useState, useEffect } from "react";
import { Users, Star, CaretUp, Trophy } from "@phosphor-icons/react";
import Link from "next/link";
import { BackgroundVideo } from "@/components/ui/BackgroundVideo";

interface ServerCardProps {
  name: string;
  slug: string;
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

  useEffect(() => {
    // Use IntersectionObserver specifically for mobile/touch devices
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouchDevice) return;

    const currentCard = cardRef.current;
    if (!currentCard) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsHovered(true);
          } else {
            setIsHovered(false);
          }
        });
      },
      { threshold: 0.6 } // Play when 60% of the card is visible on screen
    );

    observer.observe(currentCard);

    return () => {
      if (currentCard) observer.unobserve(currentCard);
    };
  }, []);

  const handleMouseEnter = () => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setIsHovered(false);
  };

  const safeTags = Array.isArray(tags) ? tags : [];

  return (
    <Link 
      href={`/server/${slug}`}
      ref={cardRef}
      className="group relative flex flex-col aspect-[4/5] sm:aspect-[9/16] rounded-xl overflow-hidden border border-white/10 bg-eter-abyss hover:border-eter-cyan/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(34,211,238,0.18)]"
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
      <div className="relative z-10 flex justify-between p-3.5 sm:p-4">
        {isEterShopPartner ? (
          <div className="flex items-center gap-1.5 bg-[#09090b]/85 backdrop-blur-md border-l-2 border-l-eter-gold border-y border-r border-white/15 px-2.5 py-1 shadow-[0_0_12px_rgba(234,179,8,0.2)] rounded-full h-fit">
            <Trophy weight="fill" className="text-eter-gold" size={12} />
            <span className="text-[9px] font-mono font-bold text-eter-gold tracking-widest uppercase">Partner</span>
          </div>
        ) : <div />}

        <div className="ml-auto flex flex-col gap-1.5 items-end">
           {safeTags.slice(0, 2).map((tag) => (
             <span key={tag} className="bg-black/80 backdrop-blur-md border-l-2 border-l-eter-cyan border-y border-r border-white/15 text-[8px] sm:text-[9px] font-mono font-medium text-zinc-300 px-2 py-0.5 uppercase tracking-wider rounded-sm">
               {tag}
             </span>
           ))}
        </div>
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 mt-auto p-4 sm:p-5 flex flex-col gap-2.5">
        <h3 className="font-display text-lg sm:text-xl font-semibold text-eter-starlight leading-tight group-hover:text-eter-cyan transition-colors duration-300 line-clamp-2">
          {name}
        </h3>
        
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap pt-1 border-t border-white/10">
          <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-zinc-300">
            <Users weight="fill" className="text-eter-cyan" size={14} />
            <span>{(onlinePlayers || 0).toLocaleString()} / {(maxPlayers || 0).toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-zinc-300">
            <CaretUp weight="bold" className="text-eter-starlight" size={14} />
            <span>{(votes || 0).toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-zinc-300 ml-auto">
            <Star weight="fill" className="text-eter-gold" size={14} />
            <span>{(rating || 0).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

