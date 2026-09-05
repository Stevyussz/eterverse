"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";

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
    <button
      onClick={handleCopy}
      className={`font-mono text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border select-none active:scale-[0.97] shrink-0 ${
        copied
          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
          : "bg-zinc-100 text-zinc-950 hover:bg-white border-zinc-200/40 hover:border-zinc-300 shadow-sm hover:shadow-[0_2px_12px_rgba(255,255,255,0.08)]"
      } ${className}`}
      title={fullAddress}
    >
      {copied ? (
        <>
          <Check size={16} weight="bold" className="text-emerald-400 shrink-0" />
          <span className="font-semibold">{t("server.copied")}</span>
        </>
      ) : (
        <>
          <Copy size={16} className="text-zinc-700 shrink-0" />
          <span className="font-medium tracking-tight">
            {isRealm ? t("server.copyRealm") : t("server.copyIp")}
          </span>
        </>
      )}
    </button>
  );
}
