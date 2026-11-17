"use client";

import { useState } from "react";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { trackJoinIntent } from "@/lib/track-click";

interface CopyIPButtonProps {
  ipAddress: string;
  port?: number;
  isRealm?: boolean;
  realmCode?: string;
  className?: string;
}

export function CopyIPButton({
  ipAddress,
  port,
  isRealm = false,
  realmCode,
  className = "",
}: CopyIPButtonProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  // Full connection string including custom/Bedrock port or realm code
  const fullAddress = isRealm
    ? (realmCode ? realmCode.replace(/^https?:\/\/realms\.gg\//, "").trim() : ipAddress)
    : (port && port !== 25565 ? `${ipAddress}:${port}` : ipAddress);

  const handleCopy = async () => {
    trackJoinIntent();
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      toast.success(`${fullAddress} ${t("server.copied")}`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = fullAddress;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      toast.success(`${fullAddress} ${t("server.copied")}`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button onClick={handleCopy} className={`px-btn px-btn-gold shrink-0 ${className}`} title={fullAddress} aria-live="polite">
      <PixelIcon name={copied ? "check" : "copy"} size={16} />
      {copied ? t("server.copied") : isRealm ? t("server.copyRealm") : t("server.copyIp")}
    </button>
  );
}
