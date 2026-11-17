"use client";

import { useState } from "react";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { Sprite } from "@/components/pixel/PixelArt";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { submitVote } from "@/lib/vote-client";
import { trackJoinIntent } from "@/lib/track-click";
import { VoteUsernameDialog } from "@/components/server/VoteUsernameDialog";
import { SafeImage } from "@/components/ui/SafeImage";
import { LiveIcon } from "@/components/ui/LiveIcon";

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
  rewardsEnabled?: boolean;
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
  rewardsEnabled = false,
}: MobileStickyActionBarProps) {
  const [askName, setAskName] = useState(false);
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
    trackJoinIntent();
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

  const handleQuickVote = () => {
    if (voted || voting) return;
    if (rewardsEnabled) setAskName(true);
    else sendVote();
  };

  const sendVote = async (username?: string) => {
    setAskName(false);
    setVoting(true);
    const outcome = await submitVote(slug, username);
    if (outcome.kind === "voted") {
      setVotes(outcome.votes);
      setVoted(true);
    } else if (outcome.kind === "already") {
      setVoted(true);
    }
    setVoting(false);
  };

  // A hotbar along the bottom edge: identity on the left, three blocks on the right.
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-panel border-t-[3px] border-ink px-3 py-2.5 flex items-center justify-between gap-3 px-pop">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <SafeImage src={logoUrl} fallbackName={serverName} alt={`Logo ${serverName}`} className="w-10 h-10 shrink-0 object-cover px-frame text-xs" />
        <div className="flex flex-col min-w-0">
          <span className="font-pixel text-sm text-ink truncate leading-tight">{serverName}</span>
          <span className="flex items-center gap-1.5 text-xs text-ink-2 truncate">
            {isRealm ? (
              <><PixelIcon name="crown" size={11} className="text-gold-d" /> Realm</>
            ) : (
              <>
                <LiveIcon online={isOnline} size={11} />
                <span className={isOnline ? "text-online-d" : ""}>
                  {isOnline ? `${currentPlayers.toLocaleString("id-ID")} online` : "Offline"}
                </span>
              </>
            )}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={handleQuickVote}
          disabled={voting || voted}
          aria-label={rewardsEnabled ? "Vote server dan dapat hadiah in-game" : "Vote server"}
          className={`px-btn ${voted ? "px-btn-gold" : "px-btn-cream"} !px-2.5 disabled:!cursor-default`}
          title="Vote server"
        >
          <Sprite name="emerald" size={16} />
          <span className="tabular text-sm">{votes}</span>
        </button>

        {/* Direct Play / Join Realm (Bedrock & Realms only, Java players copy the IP) */}
        {(isRealm || platform !== 'JAVA') && (
          <a
            href={directLink}
            onClick={trackJoinIntent}
            target={isRealm ? "_blank" : undefined}
            rel={isRealm ? "noopener noreferrer" : undefined}
            className="px-btn !px-2.5"
            title={isRealm ? "Masuk Realm" : "Main langsung di Minecraft"}
          >
            <PixelIcon name="gamepad" size={16} />
            <span className="hidden min-[380px]:inline text-sm">{isRealm ? "Realm" : "Main"}</span>
          </a>
        )}

        <button
          onClick={handleCopy}
          aria-label={isRealm ? "Salin kode Realm" : `Salin IP ${fullAddress}`}
          className="px-btn px-btn-gold !px-3"
          title={isRealm ? "Salin kode Realm" : `Salin ${fullAddress}`}
        >
          <PixelIcon name={copied ? "check" : "copy"} size={14} />
          <span className="text-sm">{copied ? "OK" : isRealm ? (lang === "id" ? "Kode" : "Code") : t("server.copyIp")}</span>
        </button>
      </div>

      {askName && (
        <VoteUsernameDialog serverName={serverName} onSubmit={sendVote} onClose={() => setAskName(false)} />
      )}
    </div>
  );
}
