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
      className={`group flex flex-col items-center gap-1 px-5 py-3 rounded-xl border transition-all duration-300 min-w-[80px]
        ${state === "voted"
          ? "bg-eter-cyan/20 border-eter-cyan text-eter-cyan"
          : state === "already"
          ? "bg-white/5 border-white/10 text-zinc-500 cursor-not-allowed"
          : "bg-white/5 border-white/10 text-zinc-300 hover:bg-eter-cyan/10 hover:border-eter-cyan/40 hover:text-eter-cyan"
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
