"use client";

import { useEffect, useRef, useState } from "react";
import { Sprite } from "@/components/pixel/PixelArt";
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
      className="m-auto w-[calc(100%-2rem)] max-w-sm px-panel p-0 backdrop:bg-[#2E2216]/70"
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
          <Sprite name="chestGold" size={36} className="shrink-0" />
          <h2 id="vote-dialog-title" className="px-title text-xl text-ink">
            Vote dan ambil hadiah di {serverName}
          </h2>
        </div>
        <p className="text-sm text-ink-2">
          Server ini memberi hadiah in-game untuk setiap vote. Tulis nama Minecraft kamu supaya hadiahnya masuk ke akun yang benar.
        </p>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="px-label !mb-1">Nama Minecraft</span>
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
            className="px-input font-mono"
          />
        </label>
        {error && (
          <p id="vote-name-error" role="alert" className="text-sm text-redstone px-shake">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-4 pt-2">
          <button
            type="submit"
            className="px-btn px-btn-gold px-btn-block"
          >
            Vote dan kirim hadiah
          </button>
          <button
            type="button"
            onClick={() => onSubmit(undefined)}
            className="px-btn px-btn-cream px-btn-block"
          >
            Vote tanpa hadiah
          </button>
        </div>
      </form>
    </dialog>
  );
}
