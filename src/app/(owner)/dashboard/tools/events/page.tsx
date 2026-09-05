import { Metadata } from "next";
import Link from "next/link";
import { 
  Sparkle, 
  Lightning, 
  Clock, 
  ArrowRight, 
  Trophy, 
  CalendarDots, 
  Flame, 
  Users, 
  Bell 
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Kalender Acara & Reset Season (Event Hub) - Segera Hadir | EterVerse",
  description: "Promosikan jadwal event, turnamen PvP, giveaway rank, dan reset season server Minecraft kamu di EterVerse.",
};

export default function EventsComingSoonPage() {
  const eventTypes = [
    {
      icon: <Trophy size={22} weight="fill" className="text-amber-400" />,
      title: "Turnamen PvP & UHC",
      desc: "Kompetisi adu skill PvP antar pemain dengan hadiah uang tunai, saldo server, atau rank VIP.",
      tag: "PvP & UHC",
    },
    {
      icon: <Flame size={22} weight="fill" className="text-orange-400" />,
      title: "Reset Season / Nether / The End",
      desc: "Pemberitahuan resmi tanggal reset world atau pembukaan dimensi baru agar pemain siap berebut naga & loot pertama.",
      tag: "Reset Season",
    },
    {
      icon: <Sparkle size={22} weight="fill" className="text-purple-400" />,
      title: "Giveaway Rank & Crate Key",
      desc: "Acara pembagian item kosmetik, rank donasi, atau item langka untuk merayakan anniversary server.",
      tag: "Giveaway",
    },
    {
      icon: <Lightning size={22} weight="fill" className="text-cyan-400" />,
      title: "Weekend EXP & Economy Booster",
      desc: "Event 2x EXP atau 2x Money drop sepanjang akhir pekan untuk mendongkrak jumlah pemain online.",
      tag: "Booster Event",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-10 animate-fade-in pb-24">
      
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <Link href="/dashboard" className="hover:text-zinc-300 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-zinc-300">Alat Server</span>
          <span>/</span>
          <span className="text-amber-400">Kalender Acara</span>
        </div>

        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 px-3 py-1 rounded-full text-amber-300 font-mono text-xs font-semibold shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <Clock size={14} weight="fill" className="animate-spin-slow" />
          <span>STATUS: SEGERA HADIR (COMING SOON)</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-zinc-950 border border-zinc-800 p-8 sm:p-12 shadow-2xl">
        {/* Glow Accent */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-5 max-w-3xl">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <CalendarDots size={24} weight="fill" />
            </span>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-amber-400">
              Komunitas &amp; Event Hub
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight leading-tight">
            Kalender Acara &amp; <br />
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Reset Season Server
            </span>
          </h1>

          <p className="text-zinc-300 font-body text-base sm:text-lg leading-relaxed">
            Pasang jadwal turnamen, peluncuran season baru, event reset dimensi, dan giveaway servermu langsung di etalase utama EterVerse dengan <strong className="text-white">Countdown Timer Real-Time</strong>.
          </p>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3.5 py-1.5 rounded-xl text-xs font-mono text-zinc-300">
              <Clock size={14} weight="fill" className="text-amber-400" />
              <span>Hitung Mundur Live (Countdown)</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3.5 py-1.5 rounded-xl text-xs font-mono text-zinc-300">
              <Users size={14} weight="fill" className="text-cyan-400" />
              <span>Sistem RSVP / Pengingat Pemain</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3.5 py-1.5 rounded-xl text-xs font-mono text-zinc-300">
              <Flame size={14} weight="fill" className="text-orange-400" />
              <span>Sorotan Khusus di Beranda</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Event Categories Preview */}
      <div className="flex flex-col gap-5">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">Kategori Acara</span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
            Jenis Event yang Bisa Kamu Publikasikan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eventTypes.map((ev, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  {ev.icon}
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-700">
                  {ev.tag}
                </span>
              </div>
              <h3 className="text-base font-display font-semibold text-white">{ev.title}</h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-body leading-relaxed">{ev.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <div className="flex flex-col gap-6 p-6 sm:p-8 bg-zinc-950/70 border border-zinc-800/90 rounded-2xl">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">Fitur Mendatang</span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">Apa yang Terjadi Saat Event Diterbitkan?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 flex flex-col gap-2">
            <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold flex items-center justify-center">1</span>
            <span className="text-sm font-semibold text-white mt-1">Banner Countdown di Server</span>
            <span className="text-xs text-zinc-400 font-body leading-relaxed">
              Halaman profil server kamu akan menampilkan banner khusus dengan jam hitung mundur detik demi detik.
            </span>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 flex flex-col gap-2">
            <span className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-300 font-mono text-xs font-bold flex items-center justify-center">2</span>
            <span className="text-sm font-semibold text-white mt-1">Badge Api di Kartu Server</span>
            <span className="text-xs text-zinc-400 font-body leading-relaxed">
              Kartu servermu di Beranda dan Halaman Jelajah akan memiliki badge <code className="text-orange-400">🔥 EVENT LIVE</code> yang memikat perhatian gamer.
            </span>
          </div>

          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 flex flex-col gap-2">
            <span className="w-7 h-7 rounded-full bg-red-500/20 text-red-300 font-mono text-xs font-bold flex items-center justify-center">3</span>
            <span className="text-sm font-semibold text-white mt-1">Notifikasi Sebelum Mulai</span>
            <span className="text-xs text-zinc-400 font-body leading-relaxed">
              Pemain yang menekan tombol "Ingatkan Saya" akan mendapat pengingat 1 jam sebelum event dimulai agar servermu ramai saat kick-off!
            </span>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-950/30 via-zinc-950 to-zinc-950 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-xl">
          <span className="text-xs font-mono text-amber-300 uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Bell size={14} weight="fill" />
            Persiapkan Event Menarikmu
          </span>
          <h3 className="text-lg sm:text-xl font-display font-semibold text-white">
            Fitur ini akan segera aktif untuk semua server terverifikasi
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 font-body">
            Pastikan servermu sudah terdaftar dan lolos verifikasi di EterVerse agar bisa langsung menjadwalkan event saat fitur ini dibuka.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="bg-white hover:bg-zinc-200 text-zinc-950 font-semibold px-5 py-2.5 rounded-xl text-sm font-mono flex items-center gap-2 shrink-0 transition-all shadow-sm active:scale-95"
        >
          <span>Kembali ke Dashboard</span>
          <ArrowRight size={16} weight="bold" />
        </Link>
      </div>

    </div>
  );
}
