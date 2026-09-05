import { Metadata } from "next";
import Link from "next/link";
import { 
  Sparkle, 
  Lightning, 
  ShieldCheck, 
  CheckCircle, 
  WarningCircle, 
  ArrowRight,
  Clock,
  Cpu,
  Broadcast,
  Crown
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "EterReward™ In-Game Sync - Segera Hadir | EterVerse",
  description: "Pelajari integrasi protokol EterReward™ untuk memberikan hadiah otomatis di dalam game Minecraft saat pemain vote di EterVerse.",
};

export default function EterRewardComingSoonPage() {
  const requirements = [
    {
      title: "1. Server Berbasis Plugin / Software Dedicated",
      badge: "Wajib",
      desc: "Server menggunakan Paper, Purpur, Spigot, Velocity, BungeeCord, atau Fabric. Server Crossplay dengan GeyserMC didukung penuh.",
      note: "Untuk Minecraft Realms yang tidak memiliki folder plugin, tersedia solusi EterRealm Webhook (baca penjelasan di bawah).",
    },
    {
      title: "2. Modul Bridge EterReward / Socket Listener Terpasang",
      badge: "Wajib",
      desc: "Server memasang modul bridge socket EterReward di folder /plugins/ server Anda (mendukung modul socket standar industri Minecraft).",
      note: "Modul ini sangat ringan, tanpa lag, dan kompatibel dari Minecraft 1.12 hingga versi terbaru 1.21+.",
    },
    {
      title: "3. Port Koneksi Socket Terbuka (Open Port)",
      badge: "Wajib",
      desc: "Port khusus untuk protokol komunikasi EterReward (port alokasi jaringan hosting/VPS Anda, misal port default 8192 atau port custom) terbuka untuk menerima sinyal terenkripsi dari EterVerse.",
      note: "Jika Anda menggunakan hosting Pterodactyl, Bisect, PebbleHost, atau VPS, Anda cukup menambahkan satu port alokasi tambahan di control panel.",
    },
    {
      title: "4. Plugin Eksekutor Hadiah (Reward Listener)",
      badge: "Wajib",
      desc: "Plugin di server Anda yang bertugas mengeksekusi perintah hadiah ke pemain saat sinyal EterReward diterima.",
      note: "Kompatibel dengan semua plugin reward populer seperti VotingPlugin, GAListener, SuperVoter, atau PlayerPoints.",
    },
    {
      title: "5. Kunci Enkripsi Kriptografi (EterBridge RSA Key)",
      badge: "Keamanan",
      desc: "Saat fitur ini rilis, Anda cukup memasukkan Public Key dari konfigurasi server Anda ke form pengaturan EterVerse.",
      note: "Enkripsi RSA 2048-bit memastikan hanya website resmi EterVerse yang dapat memicu pembagian hadiah di server Anda, 100% aman dari spam atau injeksi hacker.",
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
          <span className="text-cyan-400">EterReward™</span>
        </div>

        <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 px-3 py-1 rounded-full text-cyan-300 font-mono text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <Clock size={14} weight="fill" className="animate-spin-slow" />
          <span>STATUS: SEGERA HADIR (COMING SOON)</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-zinc-950 border border-zinc-800 p-8 sm:p-12 shadow-2xl">
        {/* Glow Accent */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-5 max-w-3xl">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Sparkle size={24} weight="fill" />
            </span>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-400">
              Teknologi Eksklusif EterVerse
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight leading-tight">
            EterReward™ <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              In-Game Real-Time Sync Engine
            </span>
          </h1>

          <p className="text-zinc-300 font-body text-base sm:text-lg leading-relaxed">
            Berikan hadiah instan di dalam game (seperti <strong className="text-white">Vote Crate Key</strong>, <strong className="text-white">Diamond</strong>, atau <strong className="text-white">Koin Server</strong>) secara otomatis setiap kali pemain mem-vote servermu di EterVerse.
          </p>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3.5 py-1.5 rounded-xl text-xs font-mono text-zinc-300">
              <Lightning size={14} weight="fill" className="text-amber-400" />
              <span>Sinkronisasi Cepat (&lt; 1 Detik)</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3.5 py-1.5 rounded-xl text-xs font-mono text-zinc-300">
              <ShieldCheck size={14} weight="fill" className="text-emerald-400" />
              <span>Enkripsi RSA 2048-bit Militer</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-3.5 py-1.5 rounded-xl text-xs font-mono text-zinc-300">
              <Cpu size={14} weight="fill" className="text-cyan-400" />
              <span>Mendukung Java &amp; Bedrock (Geyser)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lightning size={22} weight="fill" />
          </div>
          <h3 className="text-base font-display font-semibold text-white">Trafik Otomatis &amp; Viral</h3>
          <p className="text-xs sm:text-sm text-zinc-400 font-body leading-relaxed">
            Cukup atur perintah <code className="text-amber-300 bg-zinc-900 px-1.5 py-0.5 rounded font-mono">/vote</code> di servermu mengarah ke EterVerse. Ratusan pemainmu akan membuka web setiap hari tanpa perlu promosi manual!
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sparkle size={22} weight="fill" />
          </div>
          <h3 className="text-base font-display font-semibold text-white">Pemain Makin Rajin Login</h3>
          <p className="text-xs sm:text-sm text-zinc-400 font-body leading-relaxed">
            Pemain Minecraft menyukai rutinitas harian (*daily streak*). Hadiah crate key gratis akan membuat mereka selalu setia bermain di servermu setiap hari.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Broadcast size={22} weight="fill" />
          </div>
          <h3 className="text-base font-display font-semibold text-white">Peringkat Server Meroket</h3>
          <p className="text-xs sm:text-sm text-zinc-400 font-body leading-relaxed">
            Dengan bertambahnya puluhan hingga ratusan vote organik setiap hari, servermu otomatis menduduki peringkat teratas di Beranda EterVerse!
          </p>
        </div>
      </div>

      {/* How it Works Flow */}
      <div className="flex flex-col gap-6 p-6 sm:p-8 bg-zinc-950/70 border border-zinc-800/90 rounded-2xl">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Mekanisme Kerja</span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">Bagaimana Protokol EterReward™ Bekerja?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center">1</span>
              <span className="text-[10px] font-mono text-zinc-500">In-Game</span>
            </div>
            <span className="text-sm font-semibold text-white mt-1">Pemain Ketik /vote</span>
            <span className="text-xs text-zinc-400 font-body leading-relaxed">
              Pesan chat game menampilkan tautan server kamu di EterVerse beserta hadiah yang bisa didapatkan.
            </span>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-300 font-mono text-xs font-bold flex items-center justify-center">2</span>
              <span className="text-[10px] font-mono text-zinc-500">Website</span>
            </div>
            <span className="text-sm font-semibold text-white mt-1">Input Username (IGN)</span>
            <span className="text-xs text-zinc-400 font-body leading-relaxed">
              Pemain membuka EterVerse, mengklik tombol Vote, dan memasukkan IGN karakter Minecraft mereka.
            </span>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold flex items-center justify-center">3</span>
              <span className="text-[10px] font-mono text-zinc-500">Protokol</span>
            </div>
            <span className="text-sm font-semibold text-white mt-1">Pengiriman Terenkripsi</span>
            <span className="text-xs text-zinc-400 font-body leading-relaxed">
              EterVerse mengenkripsi payload dengan kunci RSA dan menembakkannya via TCP Socket ke Port Server kamu dalam sekejap.
            </span>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center">4</span>
              <span className="text-[10px] font-mono text-zinc-500">Real-Time</span>
            </div>
            <span className="text-sm font-semibold text-white mt-1">Hadiah Masuk ke Tas!</span>
            <span className="text-xs text-zinc-400 font-body leading-relaxed">
              Server memvalidasi sinyal EterReward, lalu broadcast pesan dan mengirim reward langsung ke pemain secara instan.
            </span>
          </div>
        </div>
      </div>

      {/* Special Section: How About Realms? */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-950/30 via-zinc-950 to-zinc-950 border border-purple-500/30 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-purple-300">
          <Crown size={22} weight="fill" className="text-purple-400" />
          <h3 className="text-lg font-display font-semibold text-white">Bagaimana dengan Minecraft Realms?</h3>
        </div>
        
        <p className="text-xs sm:text-sm text-zinc-300 font-body leading-relaxed">
          Banyak yang bertanya: <em className="text-purple-300">"Apakah Minecraft Realms bisa menggunakan sinkronisasi socket otomatis ini?"</em>
        </p>
        
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex flex-col gap-2 text-xs text-zinc-400">
          <div className="flex items-center gap-2 text-zinc-200 font-semibold">
            <WarningCircle size={16} className="text-amber-400 shrink-0" />
            <span>Batasan Resmi dari Mojang / Microsoft untuk Realms:</span>
          </div>
          <p className="leading-relaxed pl-6">
            Layanan Minecraft Realms dihosting langsung di cloud tertutup Mojang. Mojang <strong>sama sekali tidak memberikan akses folder plugin</strong> dan <strong>menutup semua port jaringan eksternal</strong> demi alasan keamanan sandbox mereka. Sehingga, tidak ada server list di dunia yang bisa memasang socket listener langsung ke dalam Realm.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 flex flex-col gap-2 text-xs text-zinc-300">
          <div className="flex items-center gap-2 text-purple-200 font-semibold">
            <Sparkle size={16} weight="fill" className="text-purple-400 shrink-0" />
            <span>Solusi Kreatif EterVerse untuk Komunitas Realms (EterRealm Discord Webhook):</span>
          </div>
          <p className="leading-relaxed pl-6">
            EterVerse sedang menyiapkan <strong>EterRealm Bot Webhook</strong>. Setiap kali pemain vote Realm Anda di EterVerse, bot akan otomatis mengirim log username pemilih ke channel Discord Realm Anda. Anda atau admin Realm bisa memberikan hadiah berupa <strong>Whitelist Prioritas</strong>, <strong>Role Eksklusif Discord</strong>, atau membagikan reward in-game secara manual saat online!
          </p>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="flex flex-col gap-6 p-6 sm:p-8 bg-zinc-950/70 border border-zinc-800/90 rounded-2xl">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Persyaratan &amp; Checklist</span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
            Apa Saja yang Perlu Disiapkan di Server Kamu?
          </h2>
          <p className="text-zinc-400 font-body text-xs sm:text-sm mt-1">
            Sebelum fitur ini resmi diluncurkan, pastikan server Minecraft kamu telah memenuhi checklist berikut:
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {requirements.map((req, idx) => (
            <div 
              key={idx} 
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 sm:mt-0">
                  <CheckCircle size={18} weight="fill" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm sm:text-base font-semibold text-white">{req.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {req.badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-body leading-relaxed">{req.desc}</p>
                  <span className="text-[11px] text-zinc-500 font-mono mt-0.5">
                    💡 Catatan: {req.note}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-950/30 via-cyan-950/20 to-zinc-950 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-2 max-w-xl">
          <span className="text-xs font-mono text-cyan-300 uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Sparkle size={14} weight="fill" />
            Tahap Pengembangan Sedang Berjalan
          </span>
          <h3 className="text-lg sm:text-xl font-display font-semibold text-white">
            Ingin servermu jadi yang pertama mencoba saat rilis?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 font-body">
            Tim developer EterVerse sedang mematangkan integrasi backend socket server. Notifikasi dan opsi konfigurasi EterReward akan muncul otomatis di halaman Edit Server begitu fitur siap.
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
