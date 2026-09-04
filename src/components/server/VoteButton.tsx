"use client";

import { useState } from "react";
import { CaretUp } from "@phosphor-icons/react";

interface VoteButtonProps {
  slug: string;
  initialVotes: number;
}

export function VoteButton({ slug, initialVotes }: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes);
  const [state, setState] = useState<"idle" | "loading" | "voted" | "already">("idle");

  const handleVote = async () => {
    if (state === "voted" || state === "already" || state === "loading") return;
    setState("loading");

    try {
      const res = await fetch(`/api/vote/${slug}`, { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        setVotes(data.votes);
        setState("voted");
      } else if (data.error === "already_voted") {
        setState("already");
      } else {
        setState("idle");
      }
    } catch {
      setState("idle");
    }
  };

  const isDisabled = state === "loading" || state === "voted" || state === "already";

  return (
    <button
      onClick={handleVote}
      disabled={isDisabled}
      className={`group flex flex-col items-center gap-1 px-5 py-2.5 rounded-lg border transition-all duration-200 min-w-[76px]
        ${state === "voted"
          ? "bg-white/10 border-white/30 text-white"
          : state === "already"
          ? "bg-zinc-900/40 border-zinc-800 text-zinc-500 cursor-not-allowed"
          : "bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:bg-zinc-800/60 hover:border-zinc-700 hover:text-white"
        }
      `}
    >
      <CaretUp
        size={20}
        weight={state === "voted" ? "fill" : "bold"}
        className={`transition-transform ${state === "idle" ? "group-hover:-translate-y-0.5" : ""}`}
      />
      <span className="text-xl font-display font-bold">{votes.toLocaleString()}</span>
      <span className="text-[9px] font-mono uppercase tracking-widest opacity-70">
        {state === "voted" ? "Voted!" : state === "already" ? "Voted" : "Vote"}
      </span>
    </button>
  );
}
