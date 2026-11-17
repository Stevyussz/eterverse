"use client";

import { useState } from "react";
import { Sprite } from "@/components/pixel/PixelArt";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { submitVote } from "@/lib/vote-client";
import { VoteUsernameDialog } from "@/components/server/VoteUsernameDialog";

interface VoteButtonProps {
  slug: string;
  initialVotes: number;
  serverName?: string;
  rewardsEnabled?: boolean;
}

export function VoteButton({ slug, initialVotes, serverName = "server ini", rewardsEnabled = false }: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [state, setState] = useState<"idle" | "loading" | "voted" | "already">("idle");
  const [askName, setAskName] = useState(false);

  const vote = async (username?: string) => {
    setAskName(false);
    setState("loading");
    const outcome = await submitVote(slug, username);
    if (outcome.kind === "voted") {
      setVotes(outcome.votes);
      setState("voted");
    } else if (outcome.kind === "already") {
      setState("already");
    } else {
      setState("idle");
    }
  };

  const handleVote = () => {
    if (state !== "idle") return;
    if (rewardsEnabled) setAskName(true);
    else vote();
  };

  const isDisabled = state !== "idle";

  return (
    <>
      <button
        onClick={handleVote}
        disabled={isDisabled}
        aria-label={rewardsEnabled ? "Vote server ini dan dapat hadiah in-game" : "Vote server ini"}
        className={`px-btn ${state === "voted" ? "px-btn-gold" : "px-btn-cream"} relative !gap-2.5 disabled:!cursor-default`}
        aria-disabled={state === "already" || undefined}
      >
        {/* Real event only: the emerald flies up after the server accepted the vote. */}
        {state === "voted" && (
          <Sprite name="emerald" size={20} className="px-emerald-up absolute left-1/2 -ml-2.5 -top-2 pointer-events-none" />
        )}
        <Sprite name="emerald" size={18} />
        <span className="flex flex-col items-start leading-none">
          <span className="tabular text-base">{votes.toLocaleString("id-ID")}</span>
          <span className="text-[11px] font-normal opacity-80 mt-0.5">
            {state === "loading" ? "Mengirim" : state === "voted" || state === "already" ? "Sudah vote" : "Vote"}
          </span>
        </span>
        {rewardsEnabled && state === "idle" && (
          <PixelIcon name="gift" size={14} className="text-gold-d" label="Ada hadiah in-game" />
        )}
      </button>
      {askName && (
        <VoteUsernameDialog serverName={serverName} onSubmit={vote} onClose={() => setAskName(false)} />
      )}
    </>
  );
}
