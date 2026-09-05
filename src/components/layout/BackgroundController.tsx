"use client";

import { usePathname } from "next/navigation";

export function BackgroundController() {
  const pathname = usePathname();
  
  const isDashboardOrAdmin = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  if (isDashboardOrAdmin) {
    return (
      <>
        <div className="bg-vignette opacity-80" />
        <div className="fixed inset-0 bg-[#050505]/85 z-[-40] pointer-events-none" />
        <picture>
          <source media="(max-width: 768px)" type="image/webp" srcSet="/dashboard-bg-mobile.webp" />
          <source media="(max-width: 768px)" srcSet="/dashboard-bg-mobile.png" />
          <source type="image/webp" srcSet="/dashboard-bg.webp" />
          <img
            src="/dashboard-bg.png"
            className="bg-wallpaper grayscale border-b-2"
            style={{ filter: "brightness(0.3) grayscale(0.5)" }}
            alt="EterVerse Dashboard Wallpaper"
            loading="eager"
            decoding="async"
          />
        </picture>
      </>
    );
  }

  return (
    <>
      <div className="bg-vignette" />
      <picture>
        <source media="(max-width: 768px)" type="image/webp" srcSet="/wallpaper-mobile.webp" />
        <source media="(max-width: 768px)" srcSet="/wallpaper-mobile.png" />
        <source type="image/webp" srcSet="/wallpaper.webp" />
        <img
          src="/wallpaper.png"
          className="bg-wallpaper"
          alt="EterVerse Wallpaper"
          loading="eager"
          decoding="async"
        />
      </picture>
    </>
  );
}
