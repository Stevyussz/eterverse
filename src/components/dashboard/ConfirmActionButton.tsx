"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Sprite } from "@/components/pixel/PixelArt";

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
  danger: "px-btn-red",
  warning: "px-btn-gold",
  neutral: "px-btn-cream",
  success: "",
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
        className="m-auto w-[calc(100%-2rem)] max-w-md px-panel p-0 backdrop:bg-[#2E2216]/70"
      >
        {open && (
          <div className="flex flex-col gap-4 p-6">
            <h2 id="confirm-title" className="px-title text-xl text-ink flex items-center gap-2">{tone === "danger" && <Sprite name="torch" size={24} />}{title}</h2>
            <p className="text-sm text-ink-2 leading-relaxed">{body}</p>

            {reasonField && (
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="px-label !mb-1">{reasonField.label}</span>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder={reasonField.placeholder}
                  className="px-input !min-h-[96px]"
                />
              </label>
            )}

            {requireText && (
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-sm text-ink-2">
                  Ketik <span className="font-mono text-ink font-semibold">{requireText}</span> untuk melanjutkan
                </span>
                <input
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  className="px-input font-mono"
                />
              </label>
            )}

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-btn px-btn-cream"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={locked || isPending}
                className={`px-btn ${TONE_BTN[tone]}`}
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
