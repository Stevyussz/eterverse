"use client";

import Link from "next/link";
import { Sprite } from "@/components/pixel/PixelArt";

// Shown instead of the bare Next.js error screen. The digest lets a player quote the
// error so it can be matched to the server log line written by instrumentation.ts.
export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 pt-28 pb-20">
      <div role="alert" className="px-panel max-w-md w-full flex flex-col items-center text-center gap-4 p-8">
        <Sprite name="torch" size={56} />
        <h1 className="px-title text-2xl text-ink">Halaman ini gagal dimuat</h1>
        <p className="text-sm text-ink-2">
          Biasanya karena koneksi atau server kami sedang sibuk. Coba lagi; kalau tetap gagal, kirim kode di bawah ke admin.
        </p>
        {error.digest && <p className="ip-chip">Kode: {error.digest}</p>}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <button onClick={retry} className="px-btn">Coba lagi</button>
          <Link href="/" className="px-btn px-btn-cream">Ke beranda</Link>
        </div>
      </div>
    </main>
  );
}
