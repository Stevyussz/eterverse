"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ServerCard } from "@/components/server/ServerCard";
import { CaretLeft, CaretRight, Star } from "@phosphor-icons/react";

export function HeroSlider({ servers }: { servers: any[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative w-full max-w-6xl mx-auto group mt-8">
      
      {/* Slider Viewport */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#050505]/60 backdrop-blur-xl" ref={emblaRef}>
        <div className="flex">
          {servers.map((server) => (
            <div key={server.slug} className="flex-[0_0_100%] min-w-0 flex flex-col md:flex-row items-center relative">
              
              {/* Info Side */}
              <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center min-h-[450px] relative z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 w-max border-l-2 border-l-eter-gold border-y border-r border-y-white/10 border-r-white/10 bg-[#09090b]/80 backdrop-blur-sm text-[11px] font-mono font-medium text-eter-starlight tracking-widest uppercase">
                  <Star weight="fill" size={14} className="text-eter-gold" />
                  RECOMMENDED
                </div>
                
                <h2 className="text-4xl md:text-6xl font-display font-semibold text-eter-starlight leading-[1.1] mb-5 tracking-tight">
                  {server.name}
                </h2>
                
                <p className="text-zinc-400 font-body font-light text-lg mb-8 max-w-md line-clamp-2">
                  {server.description}
                </p>
                
                {/* Embedded Mini ServerCard for context */}
                <div className="hidden md:block w-56 transform origin-left scale-90 opacity-90 hover:opacity-100 hover:scale-95 transition-all duration-smooth">
                   <ServerCard {...server} />
                </div>
              </div>
              
              {/* Media Side (Fading into Info) */}
              <div className="absolute right-0 top-0 w-full md:w-2/3 h-full z-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/50 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 opacity-60" />
                <video
                  src={server.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <button 
        onClick={scrollPrev}
        className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 border border-white/10 text-eter-starlight backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-smooth hover:bg-black/80 hover:text-eter-cyan hover:scale-110 z-30 shadow-lg"
      >
        <CaretLeft size={24} weight="bold" />
      </button>
      
      <button 
        onClick={scrollNext}
        className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 border border-white/10 text-eter-starlight backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-smooth hover:bg-black/80 hover:text-eter-cyan hover:scale-110 z-30 shadow-lg"
      >
        <CaretRight size={24} weight="bold" />
      </button>

    </div>
  );
}
