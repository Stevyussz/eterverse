import { Metadata } from "next";
import Link from "next/link";
import { Sprite, type SpriteName } from "@/components/pixel/PixelArt";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { DashHeader } from "@/components/dashboard/DashHeader";

export const metadata: Metadata = {
  title: "Pusat Informasi & Panduan Server | EterVerse",
  description: "Panduan platform, syarat lolos review, hadiah vote, widget, dan FAQ untuk owner server Minecraft di EterVerse.",
};

// Every statement here describes behaviour the code has today. Earlier copy cited an
// unsourced "70% of players", a "1-12 hour" review SLA, a Discord webhook for Realms and an
// "EterReward" engine "coming soon" while Votifier rewards were already live.

const PLATFORMS: { sprite: SpriteName; title: string; tag: string; body: string }[] = [
  {
    sprite: "grassBlock",
    title: "Crossplay (Java + Bedrock)",
    tag: "GeyserMC",
    body: "Untuk server dengan GeyserMC. Isi port Java (default 25565) dan port Bedrock (default 19132) terpisah, supaya pemain HP tidak gagal konek.",
  },
  {
    sprite: "monitor",
    title: "Java Edition",
    tag: "PC",
    body: "Khusus pemain PC/Mac. Tombol Main Langsung (Bedrock) disembunyikan; pemain cukup Salin IP.",
  },
  {
    sprite: "phone",
    title: "Bedrock",
    tag: "HP & konsol",
    body: "Server Bedrock native (BDS, PocketMine, Nukkit). Pemain dapat tombol Main Langsung yang menambahkan server ke daftar Minecraft mereka.",
  },
  {
    sprite: "goldBlock",
    title: "Minecraft Realms",
    tag: "Mojang",
    body: "Isi kode undangan Realm (realms.gg/...). Tombolnya membuka halaman undangan resmi. Realms tidak bisa memasang plugin, jadi hadiah vote otomatis tidak tersedia.",
  },
];

const FAQ = [
  {
    q: "Bayar nggak?",
    a: "Gratis untuk daftar dan tayang, termasuk status online, vote, hadiah vote, dan widget. Yang berbayar hanya opsi Partner EterShop.",
  },
  {
    q: "Berapa lama review-nya?",
    a: "Setiap listing ditinjau manual oleh admin. Status di dashboard berubah jadi Tayang begitu disetujui, atau Ditolak beserta alasannya.",
  },
  {
    q: "Kenapa server saya tampil offline?",
    a: "Status dicek otomatis lewat ping. Pastikan domain atau IP bisa diakses dari internet dan port-nya benar. Status diperbarui berkala dan setiap halaman server dibuka.",
  },
  {
    q: "Bagaimana peringkat dihitung?",
    a: "Halaman Peringkat mengurutkan vote bulan berjalan (WIB) dan direset tiap tanggal 1. Satu akun bisa vote tiap server sekali sehari.",
  },
  {
    q: "Bisa daftar lebih dari satu server?",
    a: "Satu akun satu server. Data server bisa diedit kapan saja; menyimpan perubahan mengembalikan status ke review.",
  },
];

export default function InfoCenterPage() {
  const section = "px-panel p-6 sm:p-8 flex flex-col gap-5";
  const h2 = "px-title text-2xl text-ink flex items-center gap-3";

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 px-pop pb-24">
      <DashHeader title="Pusat informasi" sprite="book">
        Panduan singkat untuk owner: platform, syarat lolos review, hadiah vote, dan pertanyaan yang sering muncul.
      </DashHeader>

      <section className={section} aria-labelledby="platform">
        <h2 id="platform" className={h2}><PixelIcon name="bolt" size={18} className="text-gold-d" />Platform & edisi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PLATFORMS.map((p) => (
            <div key={p.title} className="px-slot p-5 flex gap-4">
              <Sprite name={p.sprite} size={36} className="shrink-0" />
              <div className="flex flex-col gap-1.5">
                <span className="flex items-center gap-2 flex-wrap">
                  <span className="font-pixel text-base text-ink">{p.title}</span>
                  <span className="px-chip !text-[11px] !py-0">{p.tag}</span>
                </span>
                <p className="text-sm text-ink-2 leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={section} aria-labelledby="review">
        <h2 id="review" className={h2}><PixelIcon name="shield" size={18} className="text-prism-d" />Syarat lolos review</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="px-note flex-col">
            <span className="font-pixel text-base flex items-center gap-2"><PixelIcon name="check" size={14} className="text-online-d" />Wajib dipenuhi</span>
            <ul className="text-sm text-ink-2 space-y-1.5 list-disc pl-5">
              <li>Server aktif dan bisa dimasuki pemain.</li>
              <li>Deskripsi jelas: mode bermain dan keunikan server.</li>
              <li>Trailer video (upload atau YouTube), logo, dan banner yang tajam.</li>
              <li>Nomor WhatsApp owner yang aktif (hanya dilihat admin).</li>
            </ul>
          </div>
          <div className="px-note px-note-error flex-col">
            <span className="font-pixel text-base flex items-center gap-2"><PixelIcon name="alert" size={14} className="text-redstone" />Alasan ditolak atau dibekukan</span>
            <ul className="text-sm text-ink-2 space-y-1.5 list-disc pl-5">
              <li>Deskripsi asal-asalan atau menyesatkan.</li>
              <li>Penipuan donasi, konten ilegal, atau launcher berisi malware.</li>
              <li>IP palsu atau jumlah pemain hasil bot.</li>
              <li>Nomor WhatsApp yang tidak bisa dihubungi.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={section} aria-labelledby="reward">
        <h2 id="reward" className={h2}><Sprite name="emerald" size={22} />Hadiah vote (NuVotifier)</h2>
        <p className="text-ink-2 leading-relaxed">
          Saat pemain vote, EterVerse mengirim vote Votifier (v1, RSA) ke server kamu, lalu plugin reward-mu (VotingPlugin, SuperbVote, dan lainnya)
          membagikan hadiahnya. Pemain mengisi nama Minecraft saat vote. Sambungkan dan tes koneksinya di menu Hadiah Vote.
        </p>
        <Link href="/dashboard/tools/votifier" className="px-btn px-btn-gold w-fit">
          <PixelIcon name="gift" size={14} /> Buka Hadiah Vote
        </Link>
      </section>

      <section className={section} aria-labelledby="widget">
        <h2 id="widget" className={h2}><PixelIcon name="monitor" size={18} className="text-prism-d" />Widget & ramaikan servermu</h2>
        <p className="text-ink-2 leading-relaxed">
          Pasang widget status di Discord atau website lewat menu{" "}
          <Link href="/dashboard/tools/widget" className="text-prism-d underline underline-offset-4">Widget Status</Link>. Bagikan link halaman servermu:
          kartu share-nya otomatis menampilkan IP dan status online. Ajak komunitasmu vote setiap hari untuk naik di Peringkat bulanan.
        </p>
      </section>

      <section className={section} aria-labelledby="faq">
        <h2 id="faq" className={h2}><PixelIcon name="chat" size={18} className="text-prism-d" />Pertanyaan umum</h2>
        <div className="flex flex-col gap-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-slot">
              <summary className="cursor-pointer list-none min-h-[48px] px-4 flex items-center justify-between gap-3 font-pixel text-base text-ink">
                {f.q}
                <PixelIcon name="chevron" size={12} className="shrink-0 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="px-4 pb-4 text-sm text-ink-2 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="px-note px-note-info flex-col sm:flex-row sm:items-center justify-between">
        <p className="text-sm">Ada pertanyaan lain? Kirim email ke admin@eterverse.com.</p>
        <Link href="/dashboard" className="px-btn px-btn-cream px-btn-sm shrink-0">Ke dashboard</Link>
      </div>
    </div>
  );
}
