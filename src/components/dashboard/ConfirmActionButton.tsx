"use client";

import { useEffect, useRef, useState, useTransition } from "react";

type Tone = "danger" | "warning" | "neutral" | "success";

interface Props {
  action: (formData: FormData) => Promise<unknown>;
  fields: Record<string, string>;
  label: React.ReactNode;
  title: string;
  body: string;
  confirmLabel: string;
  tone?: Tone;
  /** Typing this exact text unlocks the confirm button (used for permanent deletes). */
  requireText?: string;
  /** Optional free-text input sent as this form field (e.g. a rejection reason). */
  reasonField?: { name: string; label: string; placeholder?: string };
  className?: string;
  pendingLabel?: string;
}

const TONE_BTN: Record<Tone, string> = {
  danger: "bg-rose-600 hover:bg-rose-500 text-white",
  warning: "bg-orange-500 hover:bg-orange-400 text-zinc-950",
  neutral: "bg-white hover:bg-zinc-200 text-zinc-950",
  success: "bg-emerald-500 hover:bg-emerald-400 text-zinc-950",
};

// One confirmation pattern for every consequential admin/owner action. Ban and hard delete
// used to fire on a single tap with no way back.
export function ConfirmActionButton({
  action,
  fields,
  label,
  title,
  body,
  confirmLabel,
  tone = "danger",
  requireText,
  reasonField,
  className = "",
  pendingLabel = "Memproses...",
}: Props) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  const locked = !!requireText && typed.trim() !== requireText;

  const submit = () => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(fields)) fd.append(k, v);
    if (reasonField) fd.append(reasonField.name, reason.trim());
    startTransition(async () => {
      await action(fd);
      setOpen(false);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setTyped("");
          setReason("");
          setOpen(true);
        }}
        disabled={isPending}
        className={className}
      >
        {isPending ? pendingLabel : label}
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        aria-labelledby="confirm-title"
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-0 text-white backdrop:bg-black/80"
      >
        {open && (
          <div className="flex flex-col gap-4 p-6">
            <h2 id="confirm-title" className="font-display text-lg font-semibold">{title}</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">{body}</p>

            {reasonField && (
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-xs font-mono text-zinc-300">{reasonField.label}</span>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder={reasonField.placeholder}
                  className="rounded-lg border border-zinc-800 bg-black px-3 py-2 text-white placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                />
              </label>
            )}

            {requireText && (
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-xs text-zinc-300">
                  Ketik <span className="font-mono text-white">{requireText}</span> untuk melanjutkan
                </span>
                <input
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  className="rounded-lg border border-zinc-800 bg-black px-3 py-2.5 font-mono text-white focus:border-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                />
              </label>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="min-h-[44px] px-4 rounded-md border border-zinc-700 text-sm text-zinc-200 hover:border-zinc-500 focus-visible:outline-2 focus-visible:outline-white"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={locked || isPending}
                className={`min-h-[44px] px-4 rounded-md text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${TONE_BTN[tone]}`}
              >
                {isPending ? pendingLabel : confirmLabel}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
