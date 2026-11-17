"use client";

import { PixelIcon } from "@/components/pixel/PixelIcon";
import { useLanguage } from "@/context/LanguageContext";
import { trackJoinIntent } from "@/lib/track-click";

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
        onClick={trackJoinIntent}
        href={realmUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`px-btn shrink-0 ${className}`}
        title={lang === "id" ? "Buka Realm langsung di Minecraft" : "Open Realm directly in Minecraft"}
      >
        <PixelIcon name="gamepad" size={16} />
        {t("server.joinRealm")}
        <PixelIcon name="external" size={12} />
      </a>
    );
  }

  // Minecraft Bedrock / Cross-play Direct Connection URI Protocol
  const effectivePort = port || 19132;
  const directLink = `minecraft://?addExternalServer=${encodeURIComponent(serverName)}|${ipAddress}:${effectivePort}`;

  return (
    <a
      onClick={trackJoinIntent}
      href={directLink}
      className={`px-btn shrink-0 ${className}`}
      title={lang === "id" ? `Buka langsung di Minecraft (${ipAddress}:${effectivePort})` : `Launch directly in Minecraft (${ipAddress}:${effectivePort})`}
    >
      <PixelIcon name="gamepad" size={16} />
      {t("server.directPlay")}
    </a>
  );
}
