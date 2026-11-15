"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isLowEndDevice } from "@/lib/scroll-perf";

// useLayoutEffect warns during SSR; this component only does work in the browser.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Starts tracking new [data-reveal] elements. Ones already on screen can be shown at once. */
function scan(io: IntersectionObserver, revealVisibleNow: boolean) {
  const viewportH = window.innerHeight;
  document
    .querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed):not([data-reveal-tracked])")
    .forEach((el) => {
      el.setAttribute("data-reveal-tracked", "");
      if (revealVisibleNow && el.getBoundingClientRect().top < viewportH) {
        el.classList.add("is-revealed");
        return;
      }
      io.observe(el);
    });
}

/**
 * One IntersectionObserver for every [data-reveal] element on the site.
 * - Never enabled for reduced motion or low-end phones (content simply stays visible).
 * - Elements already on screen when a page appears are revealed instantly, so the first
 *   paint never flickers; only content reached by scrolling animates in.
 */
export function RevealController() {
  const pathname = usePathname();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || isLowEndDevice() || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    observerRef.current = io;

    scan(io, true);
    document.documentElement.classList.add("reveal-on");

    // Streamed sections (Suspense, client results) get picked up as they mount.
    let frame = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => scan(io, false));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      cancelAnimationFrame(frame);
      io.disconnect();
      observerRef.current = null;
      document.documentElement.classList.remove("reveal-on");
    };
  }, []);

  // Client navigation: reveal what is already in view before the browser paints.
  useIsoLayoutEffect(() => {
    if (observerRef.current) scan(observerRef.current, true);
  }, [pathname]);

  return null;
}
