"use client";

import { useState } from "react";
import { CaretUp, Gift } from "@phosphor-icons/react";
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
        className={`group relative flex flex-col items-center gap-1 px-5 py-2.5 rounded-lg border transition-all duration-200 min-w-[76px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
          ${state === "voted"
            ? "bg-white/10 border-white/30 text-white"
            : state === "already"
            ? "bg-zinc-900/40 border-zinc-800 text-zinc-400 cursor-not-allowed"
            : "bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:bg-zinc-800/60 hover:border-zinc-700 hover:text-white"
          }
        `}
      >
        {rewardsEnabled && state === "idle" && (
          <Gift size={14} weight="fill" className="absolute top-1.5 right-1.5 text-amber-400" aria-hidden />
        )}
        <CaretUp
          size={20}
          weight={state === "voted" ? "fill" : "bold"}
          className={`transition-transform ${state === "idle" ? "group-hover:-translate-y-0.5" : ""}`}
        />
        <span className="text-xl font-display font-bold">{votes.toLocaleString()}</span>
        <span className="text-[10px] font-mono uppercase tracking-widest opacity-80">
          {state === "loading" ? "Mengirim" : state === "voted" || state === "already" ? "Sudah Vote" : "Vote"}
        </span>
      </button>
      {askName && (
        <VoteUsernameDialog serverName={serverName} onSubmit={vote} onClose={() => setAskName(false)} />
      )}
    </>
  );
}
