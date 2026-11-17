"use client";

import { useLanguage } from "@/context/LanguageContext";
import { PixelIcon } from "@/components/pixel/PixelIcon";

interface LanguageSwitcherProps {
  className?: string;
  showIcon?: boolean;
}

// Two inventory slots; the active language is the gold-framed one.
export function LanguageSwitcher({ className = "", showIcon = false }: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguage();

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`} role="group" aria-label="Pilih Bahasa / Select Language">
      {showIcon && <PixelIcon name="globe" size={14} className="opacity-80" />}
      {(["id", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          title={code === "id" ? "Bahasa Indonesia" : "English"}
          className="px-slot font-pixel text-sm min-w-[40px] min-h-[32px] px-2"
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
