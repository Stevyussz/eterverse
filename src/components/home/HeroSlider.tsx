"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
import { isLowEndDevice } from "@/lib/scroll-perf";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { plainExcerpt } from "@/lib/text";
import { LiveIcon } from "@/components/ui/LiveIcon";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { Sprite } from "@/components/pixel/PixelArt";
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
    <div ref={rootRef} className="relative w-full max-w-6xl mx-auto">
      <div className="px-panel overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {servers.map((server, idx) => {
            const isActive = idx === selectedIndex;
            return (
              <div key={server.slug} className="flex-[0_0_100%] min-w-0 grid md:grid-cols-[1fr_1.25fr]">
                {/* Trailer screen first on phones: the video is what sells the server. */}
                <div className="order-1 md:order-2 relative aspect-video md:aspect-auto md:min-h-[440px] px-screen !shadow-none">
                  <BackgroundVideo
                    videoUrl={server.videoUrl}
                    fallbackImage={server.bannerUrl}
                    // isHovered defaults to true, which made every slide's native video play at once
                    isHovered={false}
                    autoPlay={isActive && inView && mediaAllowed}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-chip px-chip-gold">
                    <PixelIcon name={mode === "partner" ? "sparkle" : "trophy"} size={12} className="text-gold-d" />
                    {t(mode === "partner" ? "home.partnerServer" : "home.mostVotedServer")}
                  </span>
                </div>

                <div className="order-2 md:order-1 p-6 sm:p-8 md:p-10 flex flex-col justify-center gap-5 border-t-[3px] md:border-t-0 md:border-r-[3px] border-ink">
                  <h2 className="px-title px-title-shadow text-3xl sm:text-4xl lg:text-5xl text-ink text-balance">{server.name}</h2>

                  {/* Plain excerpt: raw markdown showed divider lines and repeated the name as a heading. */}
                  <p className="text-ink-2 text-base leading-relaxed line-clamp-3 max-w-md">
                    {plainExcerpt(server.description, 170, server.name)}
                  </p>

                  {/* What a player decides on: is it up, how busy, and the address. */}
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    {server.serverType !== "REALM" && (
                      <span className="px-chip">
                        <LiveIcon online={!!server.isOnline} size={12} />
                        {server.isOnline ? `${(server.onlinePlayers || 0).toLocaleString("id-ID")} online` : "Offline"}
                      </span>
                    )}
                    <span className="px-chip">
                      <Sprite name="emerald" size={12} />
                      <span className="tabular">{(server.votes || 0).toLocaleString("id-ID")}</span> vote
                    </span>
                    {server.rating > 0 && (
                      <span className="px-chip">
                        <PixelIcon name="star" size={12} className="text-gold-d" />
                        {Number(server.rating).toFixed(1)}
                      </span>
                    )}
                  </div>

                  {server.address && (
                    <div className="ip-chip w-fit max-w-full">
                      <span className="ip-chip-caret" aria-hidden>&gt;</span>
                      <span className="truncate">{server.address}</span>
                    </div>
                  )}

                  <div>
                    <Link href={`/server/${server.slug}`} className="px-btn px-btn-gold hover-bob">
                      {t("home.exploreServer")}
                      <PixelIcon name="arrow" rotate={180} size={14} className="bob-target" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hotbar: one numbered slot per slide, plus stepped prev/next blocks. */}
      {servers.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button onClick={scrollPrev} aria-label="Slide sebelumnya" className="px-btn px-btn-cream px-btn-icon">
            <PixelIcon name="arrow" size={14} />
          </button>
          <div className="flex items-center gap-2" role="group" aria-label="Pilih slide">
            {servers.map((server, idx) => (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                aria-label={`Slide ${idx + 1}: ${server.name}`}
                aria-pressed={idx === selectedIndex}
                className="px-slot w-11 h-11 font-pixel text-base"
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <button onClick={scrollNext} aria-label="Slide berikutnya" className="px-btn px-btn-cream px-btn-icon">
            <PixelIcon name="arrow" rotate={180} size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
