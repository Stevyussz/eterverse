"use client";

import React, { useCallback, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ServerCard } from "@/components/server/ServerCard";
import { CaretLeft, CaretRight, Star, ArrowRight } from "@phosphor-icons/react";
import { BackgroundVideo } from "@/components/ui/BackgroundVideo";
import Link from "next/link";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "@/context/LanguageContext";

export function HeroSlider({ servers }: { servers: any[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { t } = useLanguage();

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
          {servers.map((server, idx) => {
            const isActive = idx === selectedIndex;
            return (
              <div key={server.slug} className="flex-[0_0_100%] min-w-0 flex flex-col md:flex-row items-center relative">
                
                {/* Info Side */}
                <div className="w-full md:w-1/2 p-7 sm:p-10 md:p-14 flex flex-col justify-center min-h-[420px] md:min-h-[480px] relative z-20">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-5 w-max bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] font-mono font-semibold tracking-wider uppercase rounded-full">
                    <Star weight="fill" size={14} className="text-amber-400" />
                    {t("home.featuredServer")}
                  </div>
                  
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.1] mb-4 tracking-tight">
                    {server.name}
                  </h2>
                  
                  <div className="text-zinc-400 font-body font-light text-base sm:text-lg mb-6 max-w-md line-clamp-2 sm:line-clamp-3 leading-relaxed prose prose-invert prose-p:my-0 prose-strong:text-white prose-strong:font-semibold prose-em:text-zinc-300 prose-headings:text-white prose-headings:text-base">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {server.description}
                    </ReactMarkdown>
                  </div>

                  {/* Mobile & Desktop Quick CTA */}
                  <div className="flex items-center gap-4 mb-4">
                    <Link
                      href={`/server/${server.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-950 font-medium rounded-lg text-sm hover:bg-zinc-200 transition-all duration-200 active:scale-[0.98] shadow-sm"
                    >
                      {t("home.exploreServer")} <ArrowRight size={16} weight="bold" />
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
                    autoPlay={isActive}
                    className="absolute inset-0 w-full h-full object-cover opacity-75"
                  />
                </div>
              </div>
            );
          })}
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
              className={`h-2 rounded-full transition-all duration-200 ${
                idx === selectedIndex
                  ? "w-7 bg-white"
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
        className="absolute left-2 md:-left-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-zinc-300 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-smooth hover:bg-zinc-900 hover:text-white hover:scale-105 z-30 shadow-xl"
      >
        <CaretLeft size={22} weight="bold" />
      </button>
      
      <button 
        onClick={scrollNext}
        aria-label="Next Slide"
        className="absolute right-2 md:-right-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-zinc-300 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-smooth hover:bg-zinc-900 hover:text-white hover:scale-105 z-30 shadow-xl"
      >
        <CaretRight size={22} weight="bold" />
      </button>

    </div>
  );
}

