import Link from "next/link";
import { Metadata } from "next";
import { PageHero } from "@/components/pixel/PageHero";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { Sprite, type SpriteName } from "@/components/pixel/PixelArt";

export const metadata: Metadata = {
  title: "Partner EterShop untuk Server Minecraft | EterVerse",
  description: "Program Partner EterShop: badge Partner emas di kartu dan halaman server, plus slot di banner utama beranda EterVerse.",
};

// Only what the code actually delivers. Earlier copy promised AI-matchmaker priority, glow
// effects, "hundreds of players a week" and a sold-out countdown; none of it existed.
const PERKS: { sprite: SpriteName; title: string; description: string }[] = [
  {
    sprite: "goldBlock",
    title: "Badge Partner emas",
    description: "Tampil di kartu server, hasil pencarian, dan halaman servermu. Diberi label jelas sebagai partner.",
  },
  {
    sprite: "film",
    title: "Slot banner beranda",
    description: "Servermu masuk rotasi banner paling atas di beranda, lengkap dengan trailer, status, dan IP.",
  },
];

const COMPARISON = [
  { feature: "Listing di direktori publik", standard: true },
  { feature: "Vote harian dan rating bintang", standard: true },
  { feature: "Hadiah vote via NuVotifier", standard: true },
  { feature: "Status online, uptime 7 hari, widget", standard: true },
  { feature: "Badge Partner emas", standard: false },
  { feature: "Slot di banner utama beranda", standard: false },
];

export default function EterShopPublicPage() {
  return (
    <main className="relative min-h-screen pb-8">
      <PageHero title="Partner EterShop" sprite="goldBlock" eyebrow="Program partner">
        <p className="text-ink-2 max-w-2xl">
          Listing di EterVerse gratis selamanya. Partner adalah opsi tambahan untuk owner yang ingin servernya lebih mencolok di beranda.
        </p>
      </PageHero>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PERKS.map((perk) => (
            <div key={perk.title} data-reveal className="px-panel p-6 sm:p-8 flex flex-col gap-4">
              <Sprite name={perk.sprite} size={48} />
              <h2 className="px-title text-2xl text-ink">{perk.title}</h2>
              <p className="text-ink-2 leading-relaxed">{perk.description}</p>
            </div>
          ))}
        </div>

        <section data-reveal className="px-panel overflow-hidden" aria-labelledby="compare">
          <div className="p-6 sm:p-8 border-b-[3px] border-frame">
            <h2 id="compare" className="px-title text-2xl text-ink">Reguler vs Partner</h2>
            <p className="text-ink-2 text-sm mt-1">Semua fitur inti sama-sama gratis. Partner menambah dua hal di bawah.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-panel-2 border-b-2 border-ink/15">
                  <th className="py-3.5 px-6 font-pixel font-normal text-ink">Fitur</th>
                  <th className="py-3.5 px-6 font-pixel font-normal text-ink text-center">Reguler</th>
                  <th className="py-3.5 px-6 font-pixel font-normal text-ink text-center bg-gold-l">Partner</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="border-b-2 border-ink/10 last:border-0">
                    <td className="py-3.5 px-6 text-ink">{row.feature}</td>
                    <td className="py-3.5 px-6 text-center">
                      {row.standard ? (
                        <PixelIcon name="check" size={16} className="text-online-d inline" label="Termasuk" />
                      ) : (
                        <PixelIcon name="minus" size={16} className="text-ink-3 inline" label="Tidak termasuk" />
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-center bg-gold-l/60">
                      <PixelIcon name="check" size={16} className="text-gold-d inline" label="Termasuk" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section data-reveal className="px-panel prism-bricks on-dark text-white p-8 sm:p-12 text-center flex flex-col items-center gap-4">
          <Sprite name="chestGold" size={56} />
          <h2 className="px-title px-title-shadow-dark text-3xl">Tertarik jadi partner?</h2>
          <p className="text-white/90 max-w-xl">
            Pengajuan ditinjau manual. Kirim nama server dan link halaman EterVerse-nya, tim kami membalas lewat email.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <a href="mailto:admin@eterverse.com?subject=EterShop%20Partner%20Inquiry" className="px-btn px-btn-gold">
              <PixelIcon name="mail" size={14} />
              Ajukan via email
            </a>
            <Link href="/dashboard/server/new" className="px-btn px-btn-cream">
              Daftarkan server gratis dulu
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
