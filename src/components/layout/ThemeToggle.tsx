"use client";

import { useSyncExternalStore } from "react";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { readTheme, setTheme, subscribeTheme } from "@/lib/theme";

/** Overworld / Nether switch. The icon shows where the button takes you. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => "overworld" as const);
  const toNether = theme === "overworld";
  const label = toNether ? "Ganti ke tema Nether (gelap)" : "Ganti ke tema Overworld (terang)";

  return (
    <button
      type="button"
      onClick={() => setTheme(toNether ? "nether" : "overworld")}
      aria-label={label}
      title={label}
      className={`px-btn px-btn-cream px-btn-icon ${className}`}
    >
      <PixelIcon name={toNether ? "fire" : "sun"} size={16} className={toNether ? "text-[#C9441A]" : "text-gold-d"} />
    </button>
  );
}
