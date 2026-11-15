"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
import { isLowEndDevice } from "@/lib/scroll-perf";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { plainExcerpt } from "@/lib/text";
import { CaretLeft, CaretRight, Star, ArrowRight } from "@phosphor-icons/react";
import { BackgroundVideo } from "@/components/ui/BackgroundVideo";
import Link from "next/link";

import { useLanguage } from "@/context/LanguageContext";

export function HeroSlider({
  servers,
  mode = "partner",
}: {
  servers: any[];
  mode?: "partner" | "mostVoted";
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { t } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [mediaAllowed, setMediaAllowed] = useState(false);

  // The YouTube player only mounts once the main thread is idle after hydration, never on
  // low-end phones, and unmounts once the hero is scrolled out of view.
  useEffect(() => {
    if (isLowEndDevice()) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setMediaAllowed(true), { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const timer = setTimeout(() => setMediaAllowed(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.25,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Rotating slides off-screen still remounts iframes and repaints; pause while hidden.
  // Only resume what we paused: with a single slide the plugin skips init, and calling
  // play() on it throws (undefined delay) and takes the whole page down.
  const pausedByViewportRef = useRef(false);
  useEffect(() => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;
    if (!inView && autoplay.isPlaying()) {
      autoplay.stop();
      pausedByViewportRef.current = true;
    } else if (inView && pausedByViewportRef.current) {
      pausedByViewportRef.current = false;
      autoplay.play();
    }
  }, [emblaApi, inView]);

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
    <div ref={rootRef} className="relative w-full max-w-6xl mx-auto group mt-8">

      {/* Slider Viewport */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#050505]/95 sm:bg-[#050505]/80 sm:backdrop-blur-xl shadow-2xl" ref={emblaRef}>
        <div className="flex">
          {servers.map((server, idx) => {
            const isActive = idx === selectedIndex;
            return (
              <div key={server.slug} className="flex-[0_0_100%] min-w-0 flex flex-col md:flex-row items-center relative">
                
                {/* Info Side */}
                <div className="w-full md:w-1/2 p-7 sm:p-10 md:p-14 flex flex-col justify-center min-h-[420px] md:min-h-[480px] relative z-20">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-5 w-max bg-amber-950/80 border border-amber-500/30 text-amber-200 text-xs font-mono rounded-md">
                    <Star weight="fill" size={13} className="text-amber-400" aria-hidden />
                    {t(mode === "partner" ? "home.partnerServer" : "home.mostVotedServer")}
                  </div>

                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.05] mb-4 tracking-tight text-balance">
                    {server.name}
                  </h2>

                  {/* Plain excerpt: raw markdown showed divider lines and repeated the name as a heading. */}
                  <p className="text-zinc-300 font-body text-base sm:text-lg mb-6 max-w-md line-clamp-3 leading-relaxed">
                    {plainExcerpt(server.description, 170, server.name)}
                  </p>

                  {/* What a player decides on: is it up, how busy, and the address. */}
                  <div className="flex flex-col gap-3 mb-6 max-w-md">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-zinc-300">
                      {server.serverType !== "REALM" && (
                        <span className="inline-flex items-center gap-1.5">
                          <span className={`live-dot ${server.isOnline ? "is-online" : ""}`} aria-hidden />
                          {server.isOnline ? `${(server.onlinePlayers || 0).toLocaleString("id-ID")} pemain online` : "Sedang offline"}
                        </span>
                      )}
                      <span>{(server.votes || 0).toLocaleString("id-ID")} vote</span>
                      {server.rating > 0 && <span>Rating {Number(server.rating).toFixed(1)}</span>}
                    </div>
                    {server.address && (
                      <div className="ip-chip w-fit max-w-full">
                        <span className="ip-chip-caret" aria-hidden>&gt;</span>
                        <span className="truncate">{server.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <Link
                      href={`/server/${server.slug}`}
                      className="group/cta inline-flex items-center gap-2 min-h-[48px] px-6 bg-white text-zinc-950 font-semibold rounded-md text-sm hover:bg-zinc-200 transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      {t("home.exploreServer")}
                      {/* DESIGN.md CTA: the arrow nudges on hover to signal "go to page". */}
                      <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover/cta:translate-x-1" aria-hidden />
                    </Link>
                  </div>
                </div>
                
                {/* Media Side (Fading into Info) */}
                <div className="absolute right-0 top-0 w-full md:w-2/3 h-full z-10 pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 opacity-70" />
                  <BackgroundVideo
                    videoUrl={server.videoUrl}
                    fallbackImage={server.bannerUrl}
                    // isHovered defaults to true, which made every slide's native video play at once
                    isHovered={false}
                    autoPlay={isActive && inView && mediaAllowed}
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
        <div className="flex items-center justify-center mt-2 z-20">
          {servers.map((server, idx) => (
            // 44px hit area around the 8px dot: the bare dot was nearly impossible to tap.
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              aria-label={`Slide ${idx + 1}: ${server.name}`}
              aria-current={idx === selectedIndex ? "true" : undefined}
              className="h-11 px-1.5 flex items-center justify-center group/dot focus-visible:outline-2 focus-visible:outline-white rounded-md"
            >
              <span
                className={`block h-2 rounded-full transition-[width,background-color] duration-200 ${
                  idx === selectedIndex ? "w-7 bg-white" : "w-2 bg-white/30 group-hover/dot:bg-white/50"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Controls */}
      <button 
        onClick={scrollPrev}
        aria-label="Previous Slide"
        className={`${servers.length > 1 ? "hidden md:flex" : "hidden"} absolute md:-left-6 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-black/60 border border-white/10 text-zinc-300 backdrop-blur-md opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-white transition-all duration-smooth hover:bg-zinc-900 hover:text-white hover:scale-105 z-30 shadow-xl`}
      >
        <CaretLeft size={22} weight="bold" />
      </button>
      
      <button 
        onClick={scrollNext}
        aria-label="Next Slide"
        className={`${servers.length > 1 ? "hidden md:flex" : "hidden"} absolute md:-right-6 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-black/60 border border-white/10 text-zinc-300 backdrop-blur-md opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-white transition-all duration-smooth hover:bg-zinc-900 hover:text-white hover:scale-105 z-30 shadow-xl`}
      >
        <CaretRight size={22} weight="bold" />
      </button>

    </div>
  );
}

