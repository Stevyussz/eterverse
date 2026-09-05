"use client";

import { useState } from "react";
import { MagnifyingGlass, Spinner } from "@phosphor-icons/react";
import { ServerCard } from "@/components/server/ServerCard";

export function AiMatchmaker() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/matchmaker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: query })
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Matchmaker failed", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <form onSubmit={handleSearch} className="w-full max-w-2xl mt-2 relative z-20">
        <div className={`bg-zinc-950/80 backdrop-blur-md border ${isLoading ? 'border-zinc-500' : 'border-zinc-800 focus-within:border-zinc-500'} focus-within:bg-zinc-950 transition-all duration-200 rounded-xl px-5 py-4 flex items-center gap-4 shadow-xl`}>
          {isLoading ? (
            <Spinner weight="bold" className="text-zinc-400 shrink-0 animate-spin" size={24} />
          ) : (
            <MagnifyingGlass weight="bold" className="text-zinc-400 shrink-0" size={24} />
          )}
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            placeholder="Contoh: 'Cari server survival santai dengan sistem ekonomi'" 
            className="bg-transparent border-none outline-none w-full text-white placeholder:text-zinc-600 font-body text-base sm:text-lg disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={isLoading || !query.trim()}
            className="font-mono text-xs border border-zinc-800 bg-zinc-900 rounded-md px-2.5 py-1 text-zinc-400 shrink-0 hidden sm:block hover:bg-zinc-800 hover:text-white transition-colors disabled:opacity-50"
          >
            ↵ Enter
          </button>
        </div>
      </form>

      {/* AI Results Section */}
      {results !== null && (
        <div className="w-full max-w-7xl mx-auto mt-16 flex flex-col gap-8 relative z-20 animate-fade-in">
          <div className="flex items-end justify-between border-b border-zinc-800 pb-4">
            <h2 className="text-2xl font-display font-semibold text-white flex items-center gap-2">
              <MagnifyingGlass weight="bold" size={22} className="text-zinc-400" />
              Hasil Rekomendasi AI
            </h2>
            <button onClick={() => setResults(null)} className="text-xs font-mono text-zinc-400 hover:text-white transition-colors">
              Tutup Hasil Rekomendasi
            </button>
          </div>
          
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {results.map((server) => (
                <ServerCard key={server.slug} {...server} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-zinc-800/80 rounded-2xl bg-zinc-950/40">
              <span className="text-4xl mb-3">🔍</span>
              <h3 className="text-lg font-display text-white mb-1.5">Tidak ada server yang cocok dengan kriteria tersebut</h3>
              <p className="text-zinc-400 text-sm font-body">Coba gunakan kata kunci atau deskripsi lain, atau jelajahi daftar server di bawah.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
