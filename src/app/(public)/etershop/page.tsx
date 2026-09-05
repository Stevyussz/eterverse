import { Trophy, Lightning, ShieldCheck, Sparkle, ArrowRight, Check, CaretRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EterShop Partner & Server Boost | EterVerse",
  description: "Tingkatkan jumlah pemain server Minecraft kamu dengan program EterShop Partner. Tampil di Hero Slider, prioritas AI matchmaker, dan golden badge eksklusif.",
};

export default function EterShopPublicPage() {
  const perks = [
    {
      icon: <Trophy size={28} className="text-eter-gold" weight="fill" />,
      title: "Badge Partner Emas Eksklusif",
      description: "Tanda pengenal emas eksklusif yang membedakan servermu dari kompetitor di seluruh listing dan card.",
    },
    {
      icon: <Lightning size={28} className="text-eter-gold" weight="fill" />,
      title: "Prioritas Teratas di AI Matchmaker",
      description: "Saat pemain mencari server impian mereka dengan AI, server partner diprioritaskan tampil paling pertama.",
    },
    {
      icon: <ShieldCheck size={28} className="text-eter-gold" weight="fill" />,
      title: "Garansi Slot di Hero Slider",
      description: "Video trailer dan profil servermu dipajang di etalase utama homepage dengan auto-playing video dan visual premium.",
    },
    {
      icon: <Sparkle size={28} className="text-eter-gold" weight="fill" />,
      title: "Glow & Border Highlight Efek",
      description: "Card server memiliki border emas bercahaya dan efek visual khusus yang meningkatkan CTR klik pemain baru.",
    },
  ];

  const comparison = [
    { feature: "Listing di Direktori Publik", standard: true, partner: true },
    { feature: "Sistem Vote & Rating Bintang", standard: true, partner: true },
    { feature: "Widget Status Pemain Real-time", standard: true, partner: true },
    { feature: "Slot Utama di Homepage Hero Slider", standard: false, partner: true },
    { feature: "Golden Partner Badge & Glow Aura", standard: false, partner: true },
    { feature: "Algoritma Prioritas Rekomendasi AI", standard: false, partner: true },
    { feature: "Dukungan Khusus & Promosi Komunitas", standard: false, partner: true },
  ];

  return (
    <main className="relative min-h-screen pt-32 md:pt-40 pb-24 px-4 sm:px-6 lg:px-24 overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/[0.03] blur-[100px] pointer-events-none rounded-full" />
      
      <div className="max-w-5xl mx-auto flex flex-col gap-16 relative z-10">
        
        {/* Header Hero */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-mono font-medium text-amber-300 tracking-wider uppercase">
            <Sparkle weight="fill" size={14} className="text-amber-400" />
            PROGRAM PARTNER ETERVERSE
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white tracking-tight leading-[1.15]">
            Jadikan Servermu <span className="text-amber-300">Pilihan Utama</span> Pemain
          </h1>
          
          <p className="text-zinc-400 font-body text-base sm:text-lg max-w-2xl mt-2 leading-relaxed">
            Dapatkan visibilitas maksimal, ratusan pemain baru tiap pekan, dan posisi teratas di platform server Minecraft Indonesia paling modern.
          </p>

          <div className="flex items-center gap-4 mt-4 flex-wrap justify-center">
            <Link
              href="/dashboard/boost"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-400 text-zinc-950 font-medium rounded-lg text-sm hover:bg-amber-300 transition-all active:scale-[0.98] shadow-sm"
            >
              <Lightning weight="fill" size={18} />
              Aktifkan Partner di Dashboard
            </Link>
            
            <a
              href="mailto:admin@eterverse.com?subject=EterShop%20Partner%20Inquiry"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-mono text-sm rounded-lg hover:bg-zinc-800/60 transition-colors"
            >
              Konsultasi via Email <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {perks.map((perk, index) => (
            <div
              key={index}
              className="bg-zinc-900/30 border border-zinc-800 hover:border-zinc-600 p-6 sm:p-8 rounded-xl flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group"
            >
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-amber-400">
                {perk.icon}
              </div>
              <h3 className="text-xl font-display font-semibold text-white group-hover:text-amber-300 transition-colors">
                {perk.title}
              </h3>
              <p className="text-zinc-400 font-body text-sm leading-relaxed">
                {perk.description}
              </p>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 sm:p-8 border-b border-zinc-800">
            <h2 className="text-2xl font-display font-semibold text-white">Perbandingan Layanan</h2>
            <p className="text-zinc-500 font-body text-sm mt-1">Lihat perbedaan server reguler dan server dengan status EterShop Partner.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-mono">
              <thead>
                <tr className="border-b border-zinc-800 bg-white/[0.02]">
                  <th className="py-4 px-6 text-zinc-400 font-medium uppercase text-xs tracking-wider">Fitur & Manfaat</th>
                  <th className="py-4 px-6 text-zinc-400 font-medium uppercase text-xs tracking-wider text-center">Reguler</th>
                  <th className="py-4 px-6 text-amber-300 font-bold uppercase text-xs tracking-wider text-center bg-amber-500/5">Partner EterShop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 font-sans">
                {comparison.map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.01]">
                    <td className="py-3.5 px-6 text-zinc-300 font-body">{row.feature}</td>
                    <td className="py-3.5 px-6 text-center">
                      {row.standard ? (
                        <span className="inline-flex text-emerald-400"><Check size={18} weight="bold" /></span>
                      ) : (
                        <span className="text-zinc-600 font-mono">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-center bg-amber-500/[0.02]">
                      <span className="inline-flex text-amber-400"><Check size={18} weight="bold" /></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-8 sm:p-12 rounded-2xl text-center flex flex-col items-center gap-4 relative overflow-hidden">
          <Trophy size={40} weight="fill" className="text-amber-400 mb-1" />
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-white">
            Slot Partner Sangat Terbatas
          </h2>
          <p className="text-zinc-400 font-body text-sm sm:text-base max-w-xl">
            Untuk memastikan setiap partner mendapatkan eksposur maksimal, slot partner dibatasi per periode. Daftarkan servermu sekarang sebelum slot bulan ini penuh.
          </p>
          
          <Link
            href="/dashboard/boost"
            className="mt-2 inline-flex items-center gap-2 px-8 py-3.5 bg-amber-400 text-zinc-950 font-medium rounded-lg text-sm hover:bg-amber-300 transition-all active:scale-[0.98] shadow-sm"
          >
            Mulai Ajukan Server Partner <CaretRight size={16} weight="bold" />
          </Link>
        </div>

      </div>
    </main>
  );
}
