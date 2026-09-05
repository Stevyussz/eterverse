"use client";

import { useState } from "react";
import { Check, Copy, Users, CaretUp } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

interface MobileStickyActionBarProps {
  serverName: string;
  ipAddress: string;
  logoUrl?: string;
  isOnline?: boolean;
  currentPlayers?: number;
  slug: string;
  initialVotes?: number;
}

export function MobileStickyActionBar({
  serverName,
  ipAddress,
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
  const { t } = useLanguage();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ipAddress);
      setCopied(true);
      toast.success(`${ipAddress} ${t("server.copied")}`);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.createElement("textarea");
      el.value = ipAddress;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      toast.success(`${ipAddress} ${t("server.copied")}`);
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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090b]/92 backdrop-blur-xl border-t border-white/10 px-4 py-2.5 shadow-[0_-10px_30px_rgba(0,0,0,0.7)] flex items-center justify-between gap-3 animate-fade-in">
      
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
            <Users size={11} className="text-zinc-400 shrink-0" weight="fill" />
            <span>{currentPlayers.toLocaleString()} Online</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
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

        {/* Copy IP CTA */}
        <button
          onClick={handleCopy}
          className={`h-9 px-3.5 rounded-lg font-mono font-medium text-xs transition-all duration-200 flex items-center gap-1.5 shadow-sm active:scale-95 ${
            copied
              ? "bg-emerald-600 text-white"
              : "bg-white text-zinc-950 hover:bg-zinc-200"
          }`}
        >
          {copied ? (
            <>
              <Check size={14} weight="bold" />
              <span>{t("server.copied")}</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>{t("server.copyIp")}</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
