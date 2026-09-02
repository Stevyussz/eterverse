"use client";

import { usePathname } from "next/navigation";

export function BackgroundController() {
  const pathname = usePathname();
  
  const isDashboardOrAdmin = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  if (isDashboardOrAdmin) {
    return (
      <>
        <div className="bg-vignette opacity-80"></div>
        <div className="fixed inset-0 bg-[#050505]/70 backdrop-blur-[2px] z-[-40]"></div>
        <picture>
          <source media="(max-width: 768px)" srcSet="/dashboard-bg-mobile.png" />
          <img src="/dashboard-bg.png" className="bg-wallpaper grayscale border-b-2" style={{ filter: "brightness(0.3) grayscale(0.5)" }} alt="EterVerse Dashboard Wallpaper" />
        </picture>
      </>
    );
  }

  return (
    <>
      <div className="bg-vignette"></div>
      <picture>
        <source media="(max-width: 768px)" srcSet="/wallpaper-mobile.png" />
        <img src="/wallpaper.png" className="bg-wallpaper" alt="EterVerse Wallpaper" />
      </picture>
    </>
  );
}
