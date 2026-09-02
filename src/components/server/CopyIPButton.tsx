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
      className={`w-full sm:w-auto font-semibold px-8 py-4 rounded-md transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2
        ${copied
          ? "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]"
          : "bg-eter-cyan text-[#09090B] hover:bg-cyan-300"
        }
      `}
    >
      {copied ? (
        <>
          <Check size={20} weight="bold" />
          Copied!
        </>
      ) : (
        <>
          <Copy size={20} weight="bold" />
          Copy IP to Play
        </>
      )}
    </button>
  );
}
