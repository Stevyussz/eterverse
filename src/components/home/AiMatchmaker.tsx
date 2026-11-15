"use client";

import { useState } from "react";
import Link from "next/link";
import { MagnifyingGlass, Spinner, WarningCircle } from "@phosphor-icons/react";
import { ServerCard } from "@/components/server/ServerCard";

type SearchState =
  | { status: "idle" }
  | { status: "done"; results: any[]; fallback: boolean }
  | { status: "error"; message: string };

const EXAMPLES = ["survival santai ekonomi", "lifesteal bisa dari HP", "skyblock Bedrock"];

export function AiMatchmaker() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<SearchState>({ status: "idle" });

  const runSearch = async (text: string) => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/matchmaker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState({
          status: "error",
          message: data.message || "Pencarian sedang bermasalah. Coba lagi, atau buka daftar semua server.",
        });
      } else {
        setState({ status: "done", results: data.results || [], fallback: !!data.fallback });
      }
    } catch {
      setState({ status: "error", message: "Koneksi terputus. Cek internet kamu lalu coba lagi." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(query);
        }}
        className="w-full max-w-2xl mt-2 relative z-20"
        role="search"
      >
        <div className={`bg-zinc-950/95 sm:bg-zinc-950/80 sm:backdrop-blur-md border ${isLoading ? 'border-zinc-500' : 'border-zinc-800 focus-within:border-zinc-400'} focus-within:bg-zinc-950 transition-colors duration-200 rounded-xl px-5 py-4 flex items-center gap-4 shadow-xl`}>
          {isLoading ? (
            <Spinner weight="bold" className="text-zinc-400 shrink-0 animate-spin" size={24} aria-hidden />
          ) : (
            <MagnifyingGlass weight="bold" className="text-zinc-400 shrink-0" size={24} aria-hidden />
          )}
          <label htmlFor="matchmaker-input" className="sr-only">
            Ceritakan server seperti apa yang kamu cari
          </label>
          <input
            id="matchmaker-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            maxLength={200}
            enterKeyHint="search"
            placeholder="Contoh: survival santai dengan sistem ekonomi"
            className="bg-transparent border-none outline-none w-full text-white placeholder:text-zinc-500 font-body text-base sm:text-lg disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="font-mono text-xs border border-zinc-800 bg-zinc-900 rounded-md px-2.5 py-1 text-zinc-400 shrink-0 hidden sm:block hover:bg-zinc-800 hover:text-white transition-colors disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-white"
          >
            ↵ Enter
          </button>
        </div>

        {/* One-tap starters: most visitors on a phone will not type a full sentence. */}
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              disabled={isLoading}
              onClick={() => {
                setQuery(ex);
                runSearch(ex);
              }}
              className="min-h-[44px] sm:min-h-0 px-3 py-1.5 text-xs font-mono text-zinc-300 border border-zinc-800 rounded-md bg-zinc-950/80 hover:border-zinc-600 hover:text-white transition-colors disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-white"
            >
              {ex}
            </button>
          ))}
        </div>
      </form>

      {state.status !== "idle" && (
        <div className="w-full max-w-7xl mx-auto mt-16 flex flex-col gap-8 relative z-20 animate-fade-in" aria-live="polite">
          <div className="flex items-end justify-between gap-4 border-b border-zinc-800 pb-4">
            <h2 className="text-2xl font-display font-semibold text-white flex items-center gap-2">
              <MagnifyingGlass weight="bold" size={22} className="text-zinc-400" aria-hidden />
              Hasil Rekomendasi
            </h2>
            <button
              onClick={() => setState({ status: "idle" })}
              className="text-xs font-mono text-zinc-400 hover:text-white transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-white"
            >
              Tutup Hasil
            </button>
          </div>

          {state.status === "error" ? (
            <div role="alert" className="flex flex-col items-center justify-center py-16 px-6 text-center border border-rose-500/30 rounded-2xl bg-zinc-950/80 gap-3">
              <WarningCircle size={36} className="text-rose-400" aria-hidden />
              <p className="text-zinc-200 text-sm font-body max-w-md">{state.message}</p>
              <Link href="/discover" className="text-sm font-mono text-white underline underline-offset-4">
                Buka semua server
              </Link>
            </div>
          ) : state.results.length > 0 ? (
            <>
              {state.fallback && (
                <p className="text-xs font-mono text-zinc-400 -mt-4">
                  AI sedang sibuk, ini hasil pencarian kata kunci.
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {state.results.map((server) => (
                  <ServerCard key={server.slug} {...server} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-zinc-800/80 rounded-2xl bg-zinc-950/80 gap-2">
              <MagnifyingGlass size={36} className="text-zinc-500" aria-hidden />
              <h3 className="text-lg font-display text-white">Belum ada server yang cocok</h3>
              <p className="text-zinc-400 text-sm font-body">
                Coba kata lain (misal mode game atau platform), atau{" "}
                <Link href="/discover" className="text-white underline underline-offset-4">jelajahi semua server</Link>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
