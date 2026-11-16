"use client";

import { useFormStatus } from "react-dom";

// Server-action buttons used to give no feedback until the page re-rendered, so admins
// double-clicked Approve/Ping. This disables the button and swaps the label while pending.
export function SubmitButton({
  children,
  pendingLabel = "Memproses...",
  className = "",
  title,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  title?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} title={title} className={`${className} disabled:opacity-60 disabled:cursor-wait`}>
      {pending ? pendingLabel : children}
    </button>
  );
}
