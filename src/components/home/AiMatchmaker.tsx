"use client";

import { useState } from "react";
import Link from "next/link";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { Sprite } from "@/components/pixel/PixelArt";
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
        className="w-full max-w-2xl"
        role="search"
      >
        <div className="px-panel p-3 flex items-center gap-3">
          <label htmlFor="matchmaker-input" className="sr-only">
            Ceritakan server seperti apa yang kamu cari
          </label>
          <div className="relative flex-1 min-w-0">
            <PixelIcon
              name={isLoading ? "refresh" : "search"}
              size={18}
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-2 ${isLoading ? "px-spin" : ""}`}
            />
            <input
              id="matchmaker-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
              maxLength={200}
              enterKeyHint="search"
              placeholder="Ceritakan server yang kamu cari"
              className="px-input !pl-11 disabled:opacity-60"
            />
          </div>
          <button type="submit" disabled={isLoading || !query.trim()} className="px-btn shrink-0">
            Cari
          </button>
        </div>

        {/* One-tap starters: most visitors on a phone will not type a full sentence. */}
        <div className="flex flex-wrap justify-center gap-3 mt-5">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              disabled={isLoading}
              onClick={() => {
                setQuery(ex);
                runSearch(ex);
              }}
              className="px-chip min-h-[36px] !px-3 hover:bg-gold-l transition-colors disabled:opacity-60"
            >
              {ex}
            </button>
          ))}
        </div>
      </form>

      {state.status !== "idle" && (
        <div className="w-full max-w-7xl mx-auto mt-10 px-flat !bg-panel-2 p-5 sm:p-6 flex flex-col gap-6 text-left px-pop" aria-live="polite">
          <div className="flex items-center justify-between gap-4">
            <h2 className="px-title text-2xl text-ink flex items-center gap-2">
              <PixelIcon name="search" size={20} className="text-prism-d" />
              Hasil rekomendasi
            </h2>
            <button onClick={() => setState({ status: "idle" })} className="px-btn px-btn-cream px-btn-sm">
              <PixelIcon name="close" size={12} />
              Tutup
            </button>
          </div>

          {state.status === "error" ? (
            <div role="alert" className="px-note px-note-error flex-col items-center text-center py-10">
              <PixelIcon name="alert" size={32} className="text-redstone mx-auto" />
              <p className="text-sm max-w-md mx-auto">{state.message}</p>
              <Link href="/discover" className="px-btn px-btn-cream px-btn-sm mx-auto">Buka semua server</Link>
            </div>
          ) : state.results.length > 0 ? (
            <>
              {state.fallback && <p className="text-sm text-ink-2 -mt-2">AI sedang sibuk, ini hasil pencarian kata kunci.</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {state.results.map((server) => (
                  <ServerCard key={server.slug} {...server} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
              <Sprite name="chest" size={56} />
              <h3 className="px-title text-xl text-ink">Belum ada server yang cocok</h3>
              <p className="text-ink-2 text-sm">
                Coba kata lain (misal mode game atau platform), atau{" "}
                <Link href="/discover" className="text-prism-d underline underline-offset-4">jelajahi semua server</Link>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
