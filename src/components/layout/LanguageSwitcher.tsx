"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Translate } from "@phosphor-icons/react";

interface LanguageSwitcherProps {
  className?: string;
  showIcon?: boolean;
}

export function LanguageSwitcher({ className = "", showIcon = false }: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs font-mono select-none ${className}`}
      role="group"
      aria-label="Pilih Bahasa / Select Language"
    >
      {showIcon && (
        <span className="pl-1.5 pr-1 text-zinc-500">
          <Translate size={13} />
        </span>
      )}
      <button
        type="button"
        onClick={() => setLang("id")}
        className={`px-2 py-0.5 rounded-md transition-all duration-150 text-[11px] font-semibold ${
          lang === "id"
            ? "bg-white text-zinc-950 shadow-sm"
            : "text-zinc-400 hover:text-white"
        }`}
        title="Bahasa Indonesia"
      >
        ID
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-2 py-0.5 rounded-md transition-all duration-150 text-[11px] font-semibold ${
          lang === "en"
            ? "bg-white text-zinc-950 shadow-sm"
            : "text-zinc-400 hover:text-white"
        }`}
        title="English"
      >
        EN
      </button>
    </div>
  );
}
