"use client";

import { useRef, useState, useEffect } from "react";
import { Users, Star, CaretUp, Trophy } from "@phosphor-icons/react";
import Link from "next/link";
import { BackgroundVideo } from "@/components/ui/BackgroundVideo";

interface ServerCardProps {
  name: string;
  slug: string;
  videoUrl: string;
  isEterShopPartner?: boolean;
  onlinePlayers: number;
  maxPlayers: number;
  votes: number;
  rating: number;
  tags: string[];
}

export function ServerCard({
  name,
  slug,
  videoUrl,
  isEterShopPartner = false,
  onlinePlayers,
  maxPlayers,
  votes,
  rating,
  tags
}: ServerCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
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
            videoRef.current?.play().catch(() => {});
          } else {
            setIsHovered(false);
            if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
            }
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
    // Only trigger hover events on desktop to prevent conflicts with observer
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    setIsHovered(false);
  };

  return (
    <Link 
      href={`/server/${slug}`}
      ref={cardRef}
      className="group relative flex flex-col aspect-[4/5] sm:aspect-[9/16] rounded-lg overflow-hidden border border-white/10 bg-eter-abyss hover:border-white/30 transition-colors duration-smooth"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Background */}
      <BackgroundVideo 
        videoUrl={videoUrl} 
        isHovered={isHovered} 
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-smooth ${isHovered ? 'opacity-100' : 'opacity-40'}`} 
      />
      
      {/* Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/40 to-transparent pointer-events-none" />

      {/* Top Badges */}
      <div className="relative z-10 flex justify-between p-4">
        {isEterShopPartner && (
          <div className="flex items-center gap-1.5 bg-[#09090b]/80 backdrop-blur-sm border-l-2 border-l-eter-gold border-y border-r border-white/10 px-2 py-1 shadow-sm h-fit">
            <Trophy weight="fill" className="text-eter-gold" size={12} />
            <span className="text-[9px] font-mono font-bold text-eter-gold tracking-widest uppercase">Partner</span>
          </div>
        )}
        <div className="ml-auto flex flex-col gap-1.5 items-end">
           {tags.slice(0,2).map(tag => (
             <span key={tag} className="bg-black/80 backdrop-blur-sm border-l-2 border-l-eter-cyan border-y border-r border-white/10 text-[8px] sm:text-[9px] font-mono font-medium text-zinc-300 px-1.5 sm:px-2 py-0.5 uppercase tracking-wider">
               {tag}
             </span>
           ))}
        </div>
      </div>

      {/* Bottom Content */}
      <div className="relative z-10 mt-auto p-3 sm:p-4 flex flex-col gap-2 sm:gap-3">
        <h3 className="font-display text-lg sm:text-xl font-semibold text-eter-starlight leading-tight group-hover:text-eter-cyan transition-colors duration-smooth line-clamp-2">
          {name}
        </h3>
        
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-zinc-300">
            <Users weight="fill" className="text-eter-cyan" size={14} />
            <span>{onlinePlayers.toLocaleString()} / {maxPlayers.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-zinc-300">
            <CaretUp weight="bold" className="text-eter-starlight" size={14} />
            <span>{votes.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-1.5 font-mono text-[10px] sm:text-xs text-zinc-300 ml-auto">
            <Star weight="fill" className="text-eter-gold" size={14} />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
