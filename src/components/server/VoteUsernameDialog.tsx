"use client";

import { useEffect, useRef, useState } from "react";
import { Gift } from "@phosphor-icons/react";
import { getSavedUsername } from "@/lib/vote-client";

const USERNAME_RE = /^[.*]?[A-Za-z0-9_]{3,16}$/;

interface Props {
  serverName: string;
  onSubmit: (username: string | undefined) => void;
  onClose: () => void;
}

// Mount only while open (`{open && <VoteUsernameDialog/>}`), so the saved name is read
// client-side on mount. Native <dialog> brings focus trap, Escape and backdrop.
export function VoteUsernameDialog({ serverName, onSubmit, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState(getSavedUsername);
  const [error, setError] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (el && !el.open) el.showModal();
    return () => {
      if (el?.open) el.close();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="vote-dialog-title"
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-xl border border-zinc-800 bg-zinc-950 p-0 text-white backdrop:bg-black/80"
    >
      <form
        method="dialog"
        className="flex flex-col gap-4 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          const trimmed = name.trim();
          if (!USERNAME_RE.test(trimmed)) {
            setError("Nama Minecraft 3-16 karakter: huruf, angka, atau _ (pemain Bedrock boleh diawali titik).");
            return;
          }
          onSubmit(trimmed);
        }}
      >
        <div className="flex items-center gap-3">
          <Gift size={24} weight="duotone" className="text-amber-400 shrink-0" aria-hidden />
          <h2 id="vote-dialog-title" className="font-display text-lg font-semibold leading-tight">
            Vote dan ambil hadiah di {serverName}
          </h2>
        </div>
        <p className="text-sm text-zinc-400 font-body">
          Server ini memberi hadiah in-game untuk setiap vote. Tulis nama Minecraft kamu supaya hadiahnya masuk ke akun yang benar.
        </p>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-mono text-xs text-zinc-300">Nama Minecraft</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            autoComplete="nickname"
            autoCapitalize="off"
            spellCheck={false}
            maxLength={17}
            placeholder="Steve_123"
            aria-invalid={!!error}
            aria-describedby={error ? "vote-name-error" : undefined}
            className="w-full rounded-lg border border-zinc-800 bg-black px-3 py-3 font-mono text-white placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          />
        </label>
        {error && (
          <p id="vote-name-error" role="alert" className="text-xs text-rose-400">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="submit"
            className="min-h-[48px] rounded-md bg-white font-semibold text-zinc-950 hover:bg-zinc-200 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Vote dan kirim hadiah
          </button>
          <button
            type="button"
            onClick={() => onSubmit(undefined)}
            className="min-h-[44px] rounded-md text-sm font-mono text-zinc-400 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-white"
          >
            Vote tanpa hadiah
          </button>
        </div>
      </form>
    </dialog>
  );
}
