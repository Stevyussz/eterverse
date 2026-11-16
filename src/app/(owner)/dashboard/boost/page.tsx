import { Lightning, Trophy, Star } from "@phosphor-icons/react/dist/ssr";

export default function EterShopBoostPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10 animate-fade-in pb-20 mt-4">
      
      <div className="text-center flex flex-col items-center">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white">Partner EterShop</h1>
        {/* Only benefits the code actually delivers. "AI priority" was listed but the
            matchmaker never ranked partners higher. */}
        <p className="text-base sm:text-lg text-zinc-300 font-body mt-4 max-w-2xl leading-relaxed">
          Server partner tampil di banner utama beranda dan memakai badge Partner di setiap kartu dan halaman servernya.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
        <FeatureCard
          icon={<Trophy size={28} className="text-amber-400" />}
          title="Badge Partner"
          desc="Badge emas di kartu server, hasil pencarian, dan halaman servermu. Berlabel jelas sebagai partner."
        />
        <FeatureCard
          icon={<Star size={28} className="text-amber-400" />}
          title="Slot banner beranda"
          desc="Servermu masuk rotasi banner paling atas di beranda, lengkap dengan trailer dan IP."
        />
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800 p-8 sm:p-10 mt-4 flex flex-col items-center text-center rounded-2xl">
        <h2 className="text-xl sm:text-2xl font-display font-semibold text-white mb-3">Siap Tingkatkan Popularitas Server?</h2>
        <p className="text-zinc-400 text-sm max-w-md mb-6 leading-relaxed">
          Slot partner dibatasi untuk menjaga eksklusivitas dan efektivitas promosi. Hubungi tim kami untuk pengajuan server partner.
        </p>
        <a 
          href="mailto:admin@eterverse.com?subject=EterShop%20Partner%20Application"
          className="bg-amber-400 text-zinc-950 font-medium px-8 py-3.5 rounded-lg hover:bg-amber-300 transition-all flex items-center gap-2 text-sm shadow-sm active:scale-[0.98]"
        >
          <Lightning weight="fill" size={18} /> Ajukan via Email
        </a>
      </div>
      
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-zinc-900/20 border border-zinc-800/80 p-6 rounded-xl text-center flex flex-col items-center gap-3">
      <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 flex items-center justify-center rounded-xl">
        {icon}
      </div>
      <h3 className="text-base font-display font-semibold text-white">{title}</h3>
      <p className="text-xs text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  );
}
