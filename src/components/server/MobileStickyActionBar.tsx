"use client";

import { useState } from "react";
import { Check, Copy, Users, CaretUp, GameController, Crown } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

interface MobileStickyActionBarProps {
  serverName: string;
  ipAddress: string;
  port?: number;
  isRealm?: boolean;
  realmCode?: string;
  platform?: 'JAVA' | 'BEDROCK' | 'CROSSPLAY';
  logoUrl?: string;
  isOnline?: boolean;
  currentPlayers?: number;
  slug: string;
  initialVotes?: number;
}

export function MobileStickyActionBar({
  serverName,
  ipAddress,
  port,
  isRealm = false,
  realmCode,
  platform = 'CROSSPLAY',
  logoUrl,
  isOnline = true,
  currentPlayers = 0,
  slug,
  initialVotes = 0,
}: MobileStickyActionBarProps) {
  const [copied, setCopied] = useState(false);
  const [votes, setVotes] = useState(initialVotes);
  const [voted, setVoted] = useState(false);
  const [voting, setVoting] = useState(false);
  const { t, lang } = useLanguage();

  const cleanRealm = realmCode ? realmCode.replace(/^https?:\/\/realms\.gg\//, "").trim() : ipAddress;
  const fullAddress = isRealm
    ? cleanRealm
    : (port && port !== 25565 ? `${ipAddress}:${port}` : ipAddress);

  const directLink = isRealm
    ? `https://realms.gg/${cleanRealm}`
    : `minecraft://?addExternalServer=${encodeURIComponent(serverName)}|${ipAddress}:${port || 19132}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      toast.success(`${fullAddress} ${t("server.copied")}`);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.createElement("textarea");
      el.value = fullAddress;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      toast.success(`${fullAddress} ${t("server.copied")}`);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleQuickVote = async () => {
    if (voted || voting) return;
    setVoting(true);
    try {
      const res = await fetch(`/api/vote/${slug}`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setVotes(data.votes);
        setVoted(true);
        toast.success("Vote berhasil ditambahkan! 🌟");
      } else if (data.error === "already_voted") {
        setVoted(true);
        toast.info("Anda sudah vote server ini dalam 24 jam terakhir.");
      }
    } catch {
      toast.error("Gagal melakukan vote.");
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090b]/92 backdrop-blur-xl border-t border-white/10 px-3 sm:px-4 py-2.5 shadow-[0_-10px_30px_rgba(0,0,0,0.7)] flex items-center justify-between gap-2.5 animate-fade-in">
      
      {/* Mini Server Identity */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="relative w-9 h-9 rounded-lg bg-black border border-white/15 overflow-hidden shrink-0">
          <img
            src={logoUrl || "/icon-placeholder.png"}
            alt={serverName}
            className="w-full h-full object-cover"
          />
          <span
            className={`absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full ring-1 ring-black ${
              isOnline ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </div>
        
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-display font-semibold text-eter-starlight truncate leading-tight">
            {serverName}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
            {isRealm ? (
              <span className="flex items-center gap-1 text-purple-300">
                <Crown size={11} weight="fill" /> Realm
              </span>
            ) : (
              <span className="flex items-center gap-1 truncate">
                <Users size={11} className="text-zinc-400 shrink-0" weight="fill" />
                <span>{currentPlayers.toLocaleString()} Online</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Quick Vote Button */}
        <button
          onClick={handleQuickVote}
          disabled={voting || voted}
          aria-label="Vote Server"
          className={`h-9 px-2.5 rounded-lg border text-xs font-mono font-semibold flex items-center gap-1 transition-all ${
            voted
              ? "bg-white/10 border-white/20 text-white"
              : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:bg-zinc-800 active:scale-95"
          }`}
          title="Vote Server"
        >
          <CaretUp size={15} weight={voted ? "fill" : "bold"} />
          <span>{votes}</span>
        </button>

        {/* Direct Play / Join Realm Button (Bedrock & Realms only, Java players copy IP) */}
        {(isRealm || platform !== 'JAVA') && (
          <a
            href={directLink}
            target={isRealm ? "_blank" : undefined}
            rel={isRealm ? "noopener noreferrer" : undefined}
            className={`h-9 px-2.5 sm:px-3 rounded-lg font-mono font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all text-white border ${
              isRealm
                ? "bg-purple-600 hover:bg-purple-500 border-purple-400/40"
                : "bg-emerald-600 hover:bg-emerald-500 border-emerald-400/40"
            }`}
            title={isRealm ? "Masuk Realm" : "Main Langsung di Minecraft"}
          >
            <GameController size={15} weight="fill" />
            <span className="hidden xs:inline">{isRealm ? "Realm" : "Main"}</span>
          </a>
        )}

        {/* Copy IP / Realm Code CTA */}
        <button
          onClick={handleCopy}
          className={`h-9 px-3 rounded-lg font-mono font-medium text-xs transition-all duration-200 flex items-center gap-1.5 shadow-sm active:scale-95 ${
            copied
              ? "bg-emerald-600 text-white"
              : "bg-white text-zinc-950 hover:bg-zinc-200"
          }`}
          title={isRealm ? "Salin Kode Realm" : `Salin ${fullAddress}`}
        >
          {copied ? (
            <>
              <Check size={14} weight="bold" />
              <span className="hidden sm:inline">{t("server.copied")}</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span className="hidden xs:inline">{isRealm ? (lang === "id" ? "Kode" : "Code") : t("server.copyIp")}</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
