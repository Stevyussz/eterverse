import Link from 'next/link';
import { Ghost, ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative px-6 text-center z-10">
      
      <div className="flex flex-col items-center gap-6 animate-fade-in bg-[#050505]/60 border border-white/5 border-l-2 border-l-eter-cyan p-12 max-w-xl shadow-2xl backdrop-blur-md rounded-sm">
        
        <div className="w-20 h-20 bg-eter-cyan/10 border border-eter-cyan/20 rounded-sm flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.2)]">
          <Ghost size={40} className="text-eter-cyan animate-pulse" weight="fill" />
        </div>
        
        <h1 className="text-6xl font-display font-bold text-eter-starlight tracking-tight">
          404
        </h1>
        
        <h2 className="text-2xl font-display font-medium text-eter-starlight">
          Server Not Found
        </h2>
        
        <p className="text-zinc-400 font-body text-lg leading-relaxed mb-4">
          The server profile you are looking for has either been deleted, never existed, or is still waiting in the moderation queue.
        </p>

        <Link 
          href="/" 
          className="bg-eter-cyan text-black font-semibold px-8 py-3.5 rounded-sm hover:bg-cyan-300 transition-colors border-l-2 border-l-white border-y border-r border-transparent flex items-center gap-2"
        >
          <ArrowLeft weight="bold" /> Return to EterVerse
        </Link>
        
      </div>
      
    </main>
  );
}
