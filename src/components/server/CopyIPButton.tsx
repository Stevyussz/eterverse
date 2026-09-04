"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";

export function CopyIPButton({ ipAddress }: { ipAddress: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ipAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = ipAddress;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`w-full sm:w-auto font-medium text-sm px-6 py-3.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]
        ${copied
          ? "bg-emerald-600 text-white"
          : "bg-white text-zinc-950 hover:bg-zinc-200"
        }
      `}
    >
      {copied ? (
        <>
          <Check size={18} weight="bold" />
          <span>Tersalin!</span>
        </>
      ) : (
        <>
          <Copy size={18} />
          <span>Salin IP Server</span>
        </>
      )}
    </button>
  );
}
