import Link from "next/link";
import { Sprite } from "@/components/pixel/PixelArt";
import { PixelIcon } from "@/components/pixel/PixelIcon";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16 text-center">
      <div className="px-panel flex flex-col items-center gap-5 p-10 sm:p-12 max-w-lg px-pop">
        <Sprite name="grassBlock" size={64} />
        <p className="px-title px-title-shadow text-6xl text-ink">404</p>
        <h1 className="px-title text-2xl text-ink">Chunk ini belum ter-generate</h1>
        <p className="text-ink-2 text-sm leading-relaxed max-w-sm">
          Server atau halaman yang kamu cari mungkin sudah dihapus, dipindahkan, atau belum terdaftar di EterVerse.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="px-btn">
            <PixelIcon name="arrow" size={14} /> Ke beranda
          </Link>
          <Link href="/discover" className="px-btn px-btn-cream">Jelajahi server</Link>
        </div>
      </div>
    </main>
  );
}
