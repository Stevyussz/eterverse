"use client";

import { useState } from "react";
import { Sprite } from "@/components/pixel/PixelArt";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { submitVote } from "@/lib/vote-client";
import { VoteUsernameDialog } from "@/components/server/VoteUsernameDialog";

// Where the green pixels fly when a vote lands (px offsets from the button top).
const SPARKS: [number, number][] = [[-26, -18], [24, -22], [-14, -38], [16, -40], [0, -48]];

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
        className={`px-btn ${state === "voted" ? "px-btn-gold" : "px-btn-cream"} hover-bob relative !gap-2.5 disabled:!cursor-default`}
        aria-disabled={state === "already" || undefined}
      >
        {/* Real event only: the emerald flies up after the server accepted the vote. */}
        {state === "voted" && (
          <span className="absolute left-1/2 -top-2 pointer-events-none" aria-hidden>
            <Sprite name="emerald" size={32} className="px-emerald-up absolute -left-4" />
            {SPARKS.map(([dx, dy], i) => (
              <span key={i} className="px-spark" style={{ "--dx": `${dx}px`, "--dy": `${dy}px` } as React.CSSProperties} />
            ))}
          </span>
        )}
        <Sprite name="emerald" size={16} className="bob-target" />
        <span className="tabular">{votes.toLocaleString("id-ID")}</span>
        <span className="border-l-2 border-current/30 pl-2.5">
          {state === "loading" ? "Mengirim" : state === "voted" || state === "already" ? "Sudah vote" : "Vote"}
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
