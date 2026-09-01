"use client";

import { useState } from "react";
import { Code, CheckCircle } from "@phosphor-icons/react";

export function EmbedWidget({ serverSlug }: { serverSlug: string }) {
  const [copied, setCopied] = useState(false);
  const embedCode = `<a href="https://eterverse.com/server/${serverSlug}" target="_blank"><img src="https://eterverse.com/api/widget/${serverSlug}" alt="EterVerse Live Status" /></a>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#050505]/60 border border-white/10 rounded-xl p-6 flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-eter-starlight uppercase tracking-widest">Support us! Embed Widget</h3>
      <p className="text-sm text-zinc-400 font-light">
        Copy this HTML code to your website or server forum to display your live player count and boost your ranking on EterVerse!
      </p>
      <div className="flex items-center gap-2 mt-2">
        <code className="flex-1 bg-black/60 border border-white/10 rounded-md p-2.5 text-[10px] text-zinc-500 font-mono overflow-hidden whitespace-nowrap text-ellipsis">
          {embedCode}
        </code>
        <button 
          onClick={copyToClipboard}
          className="shrink-0 flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/10 rounded-md transition-colors duration-smooth"
        >
          {copied ? <CheckCircle weight="fill" className="text-eter-cyan" size={20} /> : <Code size={20} className="text-eter-starlight" />}
        </button>
      </div>
    </div>
  );
}
