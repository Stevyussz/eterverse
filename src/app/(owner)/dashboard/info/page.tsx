import { Metadata } from "next";
import Link from "next/link";
import { 
  Info, 
  ShieldCheck, 
  Sparkle, 
  CalendarDots, 
  Code, 
  Crown, 
  Desktop, 
  DeviceMobile, 
  Lightning, 
  Question,
  CheckCircle,
  WarningCircle,
  ArrowRight
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Pusat Informasi & Panduan Server | EterVerse",
  description: "Dokumentasi resmi, panduan teknis, standar kurasi moderasi, dan FAQ lengkap untuk pemilik server Minecraft di EterVerse.",
};

export default function InfoCenterPage() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-10 animate-fade-in pb-24">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <Link href="/dashboard" className="hover:text-zinc-300 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-zinc-300">Pusat Informasi</span>
        </div>

        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-zinc-400 font-mono text-xs">
          <Info size={14} className="text-cyan-400" />
          <span>Dokumentasi Resmi v2.4</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-zinc-950 border border-zinc-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4 max-w-3xl">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Info size={24} weight="fill" />
            </span>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-400">
              Knowledge Base &amp; Guide Hub
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight leading-tight">
            Pusat Informasi <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              &amp; Panduan Komunitas EterVerse
            </span>
          </h1>

          <p className="text-zinc-300 font-body text-base sm:text-lg leading-relaxed">
            Semua yang perlu kamu ketahui tentang cara mendaftarkan server, lolos kurasi tim moderasi, konfigurasi platform (Crossplay, Java, Bedrock, Realms), hingga teknologi sinkronisasi <strong className="text-white">EterReward™</strong>.
          </p>
        </div>
      </div>

      {/* Section 1: Panduan Platform & Edisi Minecraft */}
      <section className="flex flex-col gap-5 p-6 sm:p-8 rounded-2xl bg-zinc-950/70 border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Lightning size={22} weight="fill" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Bagian 1</span>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white">Panduan Platform &amp; Edisi Server</h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-400 font-body leading-relaxed">
          Lebih dari 70% pemain Minecraft di Indonesia bermain melalui smartphone (MCPE / Bedrock), sementara mayoritas server di-hosting menggunakan Java Edition. EterVerse menghadirkan penanganan terpisah untuk masing-masing edisi:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {/* Crossplay */}
          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-sm flex items-center gap-1.5">
                <Lightning size={16} weight="fill" className="text-cyan-400" />
                ⚡ Crossplay (Java + Bedrock)
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">Paling Populer</span>
            </div>
            <p className="text-xs text-zinc-400 font-body leading-relaxed">
              Untuk server yang memasang plugin GeyserMC. EterVerse menyediakan input terpisah untuk <strong className="text-zinc-200">Port Java (default: 25565)</strong> dan <strong className="text-zinc-200">Port Bedrock (default: 19132)</strong> agar pemain HP tidak gagal koneksi.
            </p>
          </div>

          {/* Java Only */}
          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-sm flex items-center gap-1.5">
                <Desktop size={16} weight="fill" className="text-blue-400" />
                ☕ Java Edition
              </span>
              <span className="text-[10px] font-mono text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/60">PC Only</span>
            </div>
            <p className="text-xs text-zinc-400 font-body leading-relaxed">
              Khusus pemain di PC/Mac menggunakan Minecraft Java Launcher. Tombol "Main Langsung" Bedrock otomatis disembunyikan untuk mencegah galat protokol.
            </p>
          </div>

          {/* Bedrock Only */}
          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-sm flex items-center gap-1.5">
                <DeviceMobile size={16} weight="fill" className="text-emerald-400" />
                📱 Bedrock / MCPE
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">Mobile/Win10</span>
            </div>
            <p className="text-xs text-zinc-400 font-body leading-relaxed">
              Khusus server native Bedrock Edition (BDS / PocketMine / Nukkit) untuk Android, iOS, konsol, dan Windows 10/11.
            </p>
          </div>

          {/* Realms */}
          <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-sm flex items-center gap-1.5">
                <Crown size={16} weight="fill" className="text-purple-400" />
                👑 Minecraft Realms
              </span>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">Official Mojang</span>
            </div>
            <p className="text-xs text-zinc-400 font-body leading-relaxed">
              Cukup masukkan kode undangan Realm (contoh: <code className="text-purple-300">https://realms.gg/xxxxxx</code>). Tombol CTA akan otomatis membuka aplikasi Minecraft dan bergabung ke Realm.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Standar Kurasi Moderasi */}
      <section className="flex flex-col gap-5 p-6 sm:p-8 rounded-2xl bg-zinc-950/70 border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck size={22} weight="fill" />
          </div>
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Bagian 2</span>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white">Standar Kurasi &amp; Syarat Lolos Verifikasi</h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-400 font-body leading-relaxed">
          Semua server yang didaftarkan ke EterVerse melewati proses kurasi manual oleh tim moderasi sebelum tayang ke publik demi menjaga kenyamanan pengunjung:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/80 flex flex-col gap-2">
            <span className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
              <CheckCircle size={16} weight="fill" /> Hal yang Wajib Dipenuhi:
            </span>
            <ul className="text-xs text-zinc-300 font-body space-y-1.5 list-disc list-inside">
              <li>Server dalam keadaan <strong>online / aktif</strong> dan dapat dimasuki pemain.</li>
              <li>Deskripsi informatif, jelas menceritakan mode bermain &amp; keunikan server.</li>
              <li>Logo &amp; banner beresolusi jelas tanpa gambar buram atau teks terpotong.</li>
              <li>Nomor WhatsApp aktif pemilik server untuk konfirmasi &amp; dukungan darurat.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/80 flex flex-col gap-2">
            <span className="text-sm font-semibold text-red-400 flex items-center gap-2">
              <WarningCircle size={16} weight="fill" /> Hal yang Mengakibatkan Penolakan / Ban:
            </span>
            <ul className="text-xs text-zinc-400 font-body space-y-1.5 list-disc list-inside">
              <li>Deskripsi asal-asalan (hanya berisi teks pendek "ayo gabung").</li>
              <li>Unsur penipuan donasi, konten ilegal, atau malware launcher.</li>
              <li>Server palsu (fake IP / bot generator pemain).</li>
              <li>Nomor WhatsApp fiktif atau nomor yang tidak dapat dihubungi.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 3: EterReward & Realms Solution */}
      <section className="flex flex-col gap-5 p-6 sm:p-8 rounded-2xl bg-zinc-950/70 border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Sparkle size={22} weight="fill" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Bagian 3 • Segera Hadir</span>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white">EterReward™ In-Game Sync Engine</h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 font-body leading-relaxed">
          <strong>EterReward™</strong> adalah teknologi eksklusif EterVerse yang menghubungkan website EterVerse langsung ke dalam server Minecraft kamu. Saat pemain melakukan vote di EterVerse, paket data terenkripsi RSA 2048-bit dikirim via TCP socket dan langsung membagikan hadiah (Crate Key, Uang, EXP) di dalam game secara instan (&lt; 1 detik).
        </p>

        <div className="p-5 rounded-xl bg-purple-950/30 border border-purple-500/30 flex flex-col gap-2">
          <span className="text-sm font-semibold text-purple-300 flex items-center gap-2">
            <Crown size={16} weight="fill" /> Bagaimana dengan Minecraft Realms?
          </span>
          <p className="text-xs text-zinc-300 font-body leading-relaxed">
            Mojang mengisolasi layanan Realms di server tertutup tanpa akses folder plugin dan memblokir port komunikasi eksternal. Oleh karena itu, Realms tidak dapat menggunakan socket otomatis langsung ke game.
          </p>
          <p className="text-xs text-purple-200 font-body leading-relaxed">
            <strong>Solusi EterVerse untuk Realms:</strong> Kami menyediakan integrasi <em>EterRealm Discord Webhook</em>. Setiap kali pemain vote Realm Anda, bot akan otomatis mengirimkan nama pemain ke Discord Realm Anda sehingga admin dapat memberikan Role VIP, Whitelist prioritas, atau hadiah in-game manual!
          </p>
        </div>
      </section>

      {/* Section 4: Kalender Acara */}
      <section className="flex flex-col gap-5 p-6 sm:p-8 rounded-2xl bg-zinc-950/70 border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <CalendarDots size={22} weight="fill" />
          </div>
          <div>
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">Bagian 4 • Segera Hadir</span>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white">Kalender Acara &amp; Reset Season (Event Hub)</h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-400 font-body leading-relaxed">
          Fitur ini memungkinkan pemilik server mempublikasikan jadwal penting seperti: <strong>Turnamen PvP</strong>, <strong>UHC</strong>, <strong>Reset Season / World</strong>, dan <strong>Giveaway Rank</strong> dengan jam hitung mundur live (countdown timer) di halaman utama EterVerse.
        </p>
      </section>

      {/* Section 5: Widget & SEO Ranking Tips */}
      <section className="flex flex-col gap-5 p-6 sm:p-8 rounded-2xl bg-zinc-950/70 border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Code size={22} weight="fill" />
          </div>
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">Bagian 5</span>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white">Widget Status &amp; Tips Ranking</h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-400 font-body leading-relaxed">
          Gunakan menu <Link href="/dashboard/tools/widget" className="text-cyan-400 underline hover:text-cyan-300">Generator Widget</Link> untuk memasang kartu status pemain real-time di Discord atau forum website kamu. Semakin banyak pemain yang kamu ajak untuk memberikan rating bintang 5 dan voting setiap 24 jam sekali, semakin tinggi posisi servermu di halaman Beranda EterVerse!
        </p>
      </section>

      {/* Section 6: FAQ */}
      <section className="flex flex-col gap-5 p-6 sm:p-8 rounded-2xl bg-zinc-950/70 border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0">
            <Question size={22} weight="fill" />
          </div>
          <div>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Bagian 6</span>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white">Pertanyaan yang Sering Diajukan (FAQ)</h2>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-2">
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 flex flex-col gap-1.5">
            <span className="font-semibold text-white text-sm">Berapa lama proses persetujuan (moderasi) server?</span>
            <p className="text-xs text-zinc-400 font-body leading-relaxed">
              Tim kurasi memeriksa pendaftaran server baru setiap hari. Biasanya proses memakan waktu antara 1 hingga 12 jam. Anda akan melihat status berubah menjadi APPROVED di ringkasan dashboard.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 flex flex-col gap-1.5">
            <span className="font-semibold text-white text-sm">Apakah mendaftarkan server di EterVerse berbayar?</span>
            <p className="text-xs text-zinc-400 font-body leading-relaxed">
              Tidak sama sekali! Pendaftaran server, Realms, pelacakan status live, widget, dan fitur EterReward gratis 100% selamanya untuk seluruh komunitas Minecraft Indonesia.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 flex flex-col gap-1.5">
            <span className="font-semibold text-white text-sm">Bagaimana cara pemain masuk otomatis lewat tombol Direct Play?</span>
            <p className="text-xs text-zinc-400 font-body leading-relaxed">
              Untuk pemain Bedrock / MCPE di HP atau PC Windows 10/11, mengklik tombol "Masuk Otomatis" akan langsung membuka game Minecraft dan otomatis menambahkan server ke tab External Servers Anda. Untuk Realms, tombol akan langsung membuka halaman realms.gg resmi.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Back Button */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex-wrap gap-4">
        <span className="text-xs font-mono text-zinc-400">Ada pertanyaan lain? Hubungi tim admin kami via komunitas Discord resmi.</span>
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
