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
        <div className={`bg-[#050505]/70 backdrop-blur-md border ${isLoading ? 'border-eter-cyan/50' : 'border-white/10 focus-within:border-eter-cyan'} focus-within:bg-[#09090b]/90 transition-all duration-smooth rounded-xl px-5 py-4 flex items-center gap-4 shadow-xl`}>
          {isLoading ? (
            <Spinner weight="bold" className="text-eter-cyan shrink-0 animate-spin" size={24} />
          ) : (
            <MagnifyingGlass weight="bold" className="text-eter-cyan shrink-0" size={24} />
          )}
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            placeholder="e.g. 'I want a chill survival server with economy'" 
            className="bg-transparent border-none outline-none w-full text-eter-starlight placeholder:text-zinc-500 font-body text-lg font-light disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={isLoading || !query.trim()}
            className="font-mono text-xs border border-white/10 bg-white/5 rounded-md px-2 py-1 text-zinc-400 shrink-0 hidden sm:block hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
          >
            ↵ Enter
          </button>
        </div>
      </form>

      {/* AI Results Section */}
      {results !== null && (
        <div className="w-full max-w-7xl mx-auto mt-16 flex flex-col gap-8 relative z-20 animate-fade-in">
          <div className="flex items-end justify-between border-b border-eter-cyan/30 pb-4">
            <h2 className="text-2xl font-display font-semibold text-eter-cyan flex items-center gap-2">
              <MagnifyingGlass weight="bold" />
              AI Match Results
            </h2>
            <button onClick={() => setResults(null)} className="text-sm font-mono text-zinc-400 hover:text-white transition-colors">
              Clear Results
            </button>
          </div>
          
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {results.map((server) => (
                <ServerCard key={server.slug} {...server} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 rounded-2xl bg-black/20">
              <span className="text-4xl mb-4">🤖</span>
              <h3 className="text-xl font-display text-eter-starlight mb-2">No servers found for that vibe.</h3>
              <p className="text-zinc-500 font-body">Try a different prompt or browse the trending servers below.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
