"use client";

import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react";

// Shown instead of the bare Next.js error screen. The digest lets a player quote the
// error so it can be matched to the server log line written by instrumentation.ts.
export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 pt-28 pb-20">
      <div role="alert" className="max-w-md w-full flex flex-col items-center text-center gap-4 rounded-xl border border-zinc-800 bg-zinc-950/90 p-8">
        <WarningCircle size={40} className="text-rose-300" aria-hidden />
        <h1 className="font-display text-2xl font-semibold text-white">Halaman ini gagal dimuat</h1>
        <p className="text-sm text-zinc-300">
          Biasanya karena koneksi atau server kami sedang sibuk. Coba lagi; kalau tetap gagal, kirim kode di bawah ke admin.
        </p>
        {error.digest && <p className="font-mono text-xs text-zinc-400">Kode: {error.digest}</p>}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <button
            onClick={retry}
            className="min-h-[44px] px-5 rounded-md bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Coba lagi
          </button>
          <Link href="/" className="inline-flex items-center min-h-[44px] px-5 rounded-md border border-zinc-700 text-sm text-zinc-200 hover:border-zinc-500 focus-visible:outline-2 focus-visible:outline-white">
            Ke beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
