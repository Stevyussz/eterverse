"use client";

import { GameController, ArrowSquareOut } from "@phosphor-icons/react";
import { useLanguage } from "@/context/LanguageContext";

interface DirectPlayButtonProps {
  serverName: string;
  ipAddress: string;
  port?: number;
  isRealm?: boolean;
  realmCode?: string;
  className?: string;
}

export function DirectPlayButton({
  serverName,
  ipAddress,
  port = 19132,
  isRealm = false,
  realmCode,
  className = "",
}: DirectPlayButtonProps) {
  const { t, lang } = useLanguage();

  if (isRealm) {
    const cleanCode = (realmCode || ipAddress).replace(/^https?:\/\/realms\.gg\//, "").trim();
    const realmUrl = `https://realms.gg/${cleanCode}`;

    return (
      <a
        href={realmUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`font-mono text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border select-none active:scale-[0.97] shrink-0 bg-purple-600 hover:bg-purple-500 text-white border-purple-400/40 shadow-sm hover:shadow-[0_2px_16px_rgba(168,85,247,0.35)] ${className}`}
        title={lang === "id" ? "Buka Realm langsung di Minecraft" : "Open Realm directly in Minecraft"}
      >
        <GameController size={16} weight="fill" />
        <span className="font-semibold tracking-tight">
          {t("server.joinRealm")}
        </span>
        <ArrowSquareOut size={13} weight="bold" />
      </a>
    );
  }

  // Minecraft Bedrock / Cross-play Direct Connection URI Protocol
  const effectivePort = port || 19132;
  const directLink = `minecraft://?addExternalServer=${encodeURIComponent(serverName)}|${ipAddress}:${effectivePort}`;

  return (
    <a
      href={directLink}
      className={`font-mono text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border select-none active:scale-[0.97] shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/40 shadow-sm hover:shadow-[0_2px_16px_rgba(16,185,129,0.35)] ${className}`}
      title={lang === "id" ? `Buka langsung di Minecraft (${ipAddress}:${effectivePort})` : `Launch directly in Minecraft (${ipAddress}:${effectivePort})`}
    >
      <GameController size={16} weight="fill" />
      <span className="font-semibold tracking-tight">
        {t("server.directPlay")}
      </span>
    </a>
  );
}
