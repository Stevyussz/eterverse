import { Sprite, type SpriteName } from "@/components/pixel/PixelArt";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { DashHeader } from "@/components/dashboard/DashHeader";

// Only benefits the code actually delivers. "AI priority" was listed once, but the
// matchmaker never ranked partners higher.
const PERKS: { sprite: SpriteName; title: string; desc: string }[] = [
  { sprite: "goldBlock", title: "Badge Partner", desc: "Badge emas di kartu server, hasil pencarian, dan halaman servermu. Berlabel jelas sebagai partner." },
  { sprite: "film", title: "Slot banner beranda", desc: "Servermu masuk rotasi banner paling atas di beranda, lengkap dengan trailer dan IP." },
];

export default function EterShopBoostPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 px-pop pb-20">
      <DashHeader title="Partner EterShop" sprite="goldBlock">
        Server partner tampil di banner utama beranda dan memakai badge Partner di setiap kartu dan halaman servernya.
      </DashHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PERKS.map((p) => (
          <div key={p.title} className="px-panel p-6 flex flex-col gap-3">
            <Sprite name={p.sprite} size={40} />
            <h2 className="px-title text-xl text-ink">{p.title}</h2>
            <p className="text-sm text-ink-2 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="px-panel prism-bricks on-dark text-white p-8 sm:p-10 flex flex-col items-center text-center gap-4">
        <Sprite name="chestGold" size={48} />
        <h2 className="px-title px-title-shadow-dark text-2xl">Ajukan server partner</h2>
        <p className="text-white/90 text-sm max-w-md leading-relaxed">
          Pengajuan ditinjau manual oleh tim kami. Kirim nama server dan link halaman EterVerse-nya lewat email.
        </p>
        <a href="mailto:admin@eterverse.com?subject=EterShop%20Partner%20Application" className="px-btn px-btn-gold">
          <PixelIcon name="mail" size={14} /> Ajukan via email
        </a>
      </div>
    </div>
  );
}
