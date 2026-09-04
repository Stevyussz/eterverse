"use client";

import React, { useCallback, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ServerCard } from "@/components/server/ServerCard";
import { CaretLeft, CaretRight, Star, ArrowRight } from "@phosphor-icons/react";
import { BackgroundVideo } from "@/components/ui/BackgroundVideo";
import Link from "next/link";

export function HeroSlider({ servers }: { servers: any[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <div className="relative w-full max-w-6xl mx-auto group mt-8">
      
      {/* Slider Viewport */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#050505]/80 backdrop-blur-xl shadow-2xl" ref={emblaRef}>
        <div className="flex">
          {servers.map((server) => (
            <div key={server.slug} className="flex-[0_0_100%] min-w-0 flex flex-col md:flex-row items-center relative">
              
              {/* Info Side */}
              <div className="w-full md:w-1/2 p-7 sm:p-10 md:p-14 flex flex-col justify-center min-h-[420px] md:min-h-[480px] relative z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 w-max border-l-2 border-l-eter-gold border-y border-r border-y-white/10 border-r-white/10 bg-[#09090b]/85 backdrop-blur-sm text-[11px] font-mono font-medium text-eter-starlight tracking-widest uppercase shadow-[0_0_15px_rgba(234,179,8,0.15)] rounded-sm">
                  <Star weight="fill" size={14} className="text-eter-gold" />
                  RECOMMENDED PARTNER
                </div>
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-eter-starlight leading-[1.1] mb-4 tracking-tight">
                  {server.name}
                </h2>
                
                <p className="text-zinc-400 font-body font-light text-base sm:text-lg mb-6 max-w-md line-clamp-2 sm:line-clamp-3 leading-relaxed">
                  {server.description}
                </p>

                {/* Mobile & Desktop Quick CTA */}
                <div className="flex items-center gap-4 mb-4">
                  <Link
                    href={`/server/${server.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-eter-cyan text-black font-semibold rounded-md text-sm hover:bg-cyan-300 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-105"
                  >
                    Explore Server <ArrowRight size={16} weight="bold" />
                  </Link>
                </div>
                
                {/* Embedded Mini ServerCard for desktop context */}
                <div className="hidden lg:block w-52 transform origin-left scale-90 opacity-90 hover:opacity-100 hover:scale-95 transition-all duration-smooth">
                   <ServerCard {...server} />
                </div>
              </div>
              
              {/* Media Side (Fading into Info) */}
              <div className="absolute right-0 top-0 w-full md:w-2/3 h-full z-10 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 opacity-70" />
                <BackgroundVideo
                  videoUrl={server.videoUrl}
                  fallbackImage={server.bannerUrl}
                  autoPlay={true}
                  className="absolute inset-0 w-full h-full object-cover opacity-75"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      {servers.length > 1 && (
        <div className="flex items-center justify-center gap-2.5 mt-4 z-20">
          {servers.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === selectedIndex
                  ? "w-8 bg-eter-cyan shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

      {/* Controls */}
      <button 
        onClick={scrollPrev}
        aria-label="Previous Slide"
        className="absolute left-2 md:-left-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-eter-starlight backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-smooth hover:bg-black/90 hover:text-eter-cyan hover:scale-110 z-30 shadow-xl"
      >
        <CaretLeft size={22} weight="bold" />
      </button>
      
      <button 
        onClick={scrollNext}
        aria-label="Next Slide"
        className="absolute right-2 md:-right-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-eter-starlight backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-smooth hover:bg-black/90 hover:text-eter-cyan hover:scale-110 z-30 shadow-xl"
      >
        <CaretRight size={22} weight="bold" />
      </button>

    </div>
  );
}

