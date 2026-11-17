import { Metadata } from "next";
import Link from "next/link";
import { Sprite, type SpriteName } from "@/components/pixel/PixelArt";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { DashHeader } from "@/components/dashboard/DashHeader";

export const metadata: Metadata = {
  title: "Jadwal Event (segera hadir) | EterVerse",
  description: "Rencana fitur jadwal event, turnamen, dan reset season untuk server Minecraft di EterVerse.",
};

// A roadmap page, labelled as one: nothing here is live yet, so it says "rencana", never "fitur".
const EVENT_TYPES: { sprite: SpriteName; title: string; desc: string }[] = [
  { sprite: "pickaxe", title: "Turnamen PvP & UHC", desc: "Umumkan jadwal turnamen dan hadiahnya." },
  { sprite: "grassBlock", title: "Reset season", desc: "Tanggal reset world atau pembukaan dimensi baru." },
  { sprite: "chestGold", title: "Giveaway", desc: "Pembagian rank, crate key, atau item untuk anniversary server." },
  { sprite: "potion", title: "Weekend booster", desc: "Event 2x EXP atau 2x money di akhir pekan." },
];

const PLAN = [
  "Banner hitung mundur di halaman server.",
  "Penanda event di kartu server selama event berjalan.",
  "Tombol pengingat untuk pemain sebelum event mulai.",
];

export default function EventsComingSoonPage() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 px-pop pb-24">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <DashHeader title="Jadwal event" sprite="bell">
          Fitur ini belum aktif. Ini rencana kami supaya owner bisa mengumumkan event servernya di EterVerse.
        </DashHeader>
        <span className="px-chip px-chip-gold">
          <PixelIcon name="clock" size={12} /> Segera hadir
        </span>
      </div>

      <section className="flex flex-col gap-4" aria-labelledby="types">
        <h2 id="types" className="px-title text-2xl text-ink">Jenis event yang direncanakan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {EVENT_TYPES.map((ev) => (
            <div key={ev.title} className="px-flat p-5 flex gap-4">
              <Sprite name={ev.sprite} size={36} className="shrink-0" />
              <div>
                <h3 className="font-pixel text-base text-ink">{ev.title}</h3>
                <p className="text-sm text-ink-2 mt-1">{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-panel p-6 sm:p-8 flex flex-col gap-4" aria-labelledby="plan">
        <h2 id="plan" className="px-title text-2xl text-ink">Yang akan terjadi saat event diterbitkan</h2>
        <ol className="flex flex-col gap-3">
          {PLAN.map((p, i) => (
            <li key={p} className="flex items-center gap-3">
              <span className="px-slot w-9 h-9 shrink-0 flex items-center justify-center font-pixel" aria-hidden>{i + 1}</span>
              <span className="text-ink">{p}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="px-note px-note-info flex-col sm:flex-row sm:items-center justify-between">
        <p className="text-sm">Pastikan servermu sudah tayang, supaya bisa langsung menjadwalkan event saat fitur ini dibuka.</p>
        <Link href="/dashboard" className="px-btn px-btn-cream px-btn-sm shrink-0">Ke dashboard</Link>
      </div>
    </div>
  );
}
