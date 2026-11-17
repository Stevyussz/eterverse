"use client";

import { useState } from "react";
import { PixelIcon } from "@/components/pixel/PixelIcon";

export function EmbedWidget({ serverSlug }: { serverSlug: string }) {
  const [copied, setCopied] = useState(false);
  const embedCode = `<a href="https://eterverse.vercel.app/server/${serverSlug}" target="_blank"><img src="https://eterverse.vercel.app/api/widget/${serverSlug}" alt="EterVerse Live Status" /></a>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-flat p-6 flex flex-col gap-3">
      <h3 className="px-title text-lg text-ink">Widget status server (HTML)</h3>
      <p className="text-sm text-ink-2">
        Tempel kode ini di website atau forum server kamu untuk menampilkan status dan jumlah pemain secara langsung.
      </p>
      <div className="flex items-center gap-3 mt-2">
        <code className="flex-1 min-w-0 ip-chip !text-[11px] truncate block">{embedCode}</code>
        <button onClick={copyToClipboard} className="px-btn px-btn-cream px-btn-icon" aria-label="Salin kode embed">
          <PixelIcon name={copied ? "check" : "copy"} size={18} />
        </button>
      </div>
    </div>
  );
}
