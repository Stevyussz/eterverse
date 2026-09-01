import { Lightning, ShieldCheck, Trophy, Sparkle } from "@phosphor-icons/react/dist/ssr";

export default function EterShopBoostPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10 animate-fade-in pb-20 mt-4">
      
      <div className="text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border-l-2 border-l-eter-gold border-y border-r border-y-white/10 border-r-white/10 bg-[#09090b]/80 backdrop-blur-sm text-[11px] font-mono font-medium text-eter-starlight tracking-widest uppercase">
          <Sparkle weight="fill" size={14} className="text-eter-gold" />
          PREMIUM PROGRAM
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-semibold text-eter-starlight">EterShop Partner</h1>
        <p className="text-lg text-zinc-400 font-body mt-4 max-w-2xl">
          Supercharge your player base. Get the golden badge, rank #1 in the AI Matchmaker, and dominate the front page Hero Slider.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <FeatureCard 
          icon={<Trophy size={32} className="text-eter-gold" />}
          title="Golden Badge"
          desc="Stand out with the exclusive Partner badge on your Server Card."
        />
        <FeatureCard 
          icon={<Lightning size={32} className="text-eter-gold" />}
          title="AI Priority"
          desc="Algorithmically boosted to appear first in AI Matchmaker results."
        />
        <FeatureCard 
          icon={<ShieldCheck size={32} className="text-eter-gold" />}
          title="Hero Slider"
          desc="Guaranteed spot in the massive homepage rotating banner."
        />
      </div>

      <div className="bg-[#09090b]/80 border-l-2 border-l-eter-gold border-y border-r border-white/10 p-10 mt-6 flex flex-col items-center text-center shadow-[0_0_40px_rgba(234,179,8,0.05)] rounded-sm">
        <h2 className="text-2xl font-display font-semibold text-eter-starlight mb-4">Ready to dominate the ranks?</h2>
        <p className="text-zinc-400 mb-8 max-w-lg">
          Partnership slots are limited to maintain exclusivity. Contact our team directly to apply for EterShop Partner status.
        </p>
        <a 
          href="https://discord.gg/eterverse" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-eter-gold text-black font-semibold px-8 py-4 rounded-sm hover:bg-yellow-400 transition-colors border-l-2 border-l-white border-y border-r border-transparent flex items-center gap-3 text-lg"
        >
          <Lightning weight="fill" /> Apply via Discord
        </a>
      </div>
      
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-[#050505]/60 border border-white/5 p-6 rounded-sm text-center flex flex-col items-center gap-3">
      <div className="w-14 h-14 bg-eter-gold/10 border border-eter-gold/20 flex items-center justify-center rounded-sm">
        {icon}
      </div>
      <h3 className="text-lg font-display font-medium text-eter-starlight">{title}</h3>
      <p className="text-sm text-zinc-500">{desc}</p>
    </div>
  );
}
