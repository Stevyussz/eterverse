import Link from 'next/link';
import { Ghost, ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative px-6 text-center z-10">
      <div className="flex flex-col items-center gap-6 animate-fade-in bg-zinc-900/40 border border-zinc-800 p-10 sm:p-12 max-w-lg shadow-xl backdrop-blur-md rounded-2xl">
        <div className="w-16 h-16 bg-zinc-800/80 border border-zinc-700/60 rounded-xl flex items-center justify-center text-zinc-300">
          <Ghost size={32} weight="duotone" />
        </div>
        
        <h1 className="text-5xl font-display font-bold text-white tracking-tight">
          404
        </h1>
        
        <h2 className="text-xl font-display font-medium text-zinc-200">
          Halaman Tidak Ditemukan
        </h2>
        
        <p className="text-zinc-400 font-body text-sm leading-relaxed max-w-sm">
          Server atau halaman yang kamu cari mungkin sudah dihapus, dipindahkan, atau belum terdaftar di EterVerse.
        </p>

        <Link 
          href="/" 
          className="bg-white text-zinc-950 font-medium px-6 py-3 rounded-lg hover:bg-zinc-200 transition-all text-sm flex items-center gap-2 shadow-sm active:scale-[0.98]"
        >
          <ArrowLeft weight="bold" size={16} /> Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
