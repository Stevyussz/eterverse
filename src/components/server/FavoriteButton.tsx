"use client";

import { useState } from "react";
import { Heart } from "@phosphor-icons/react";
import { toast } from "sonner";

export function FavoriteButton({ slug, initial }: { slug: string; initial: boolean }) {
  const [favorited, setFavorited] = useState(initial);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    if (busy) return;
    const next = !favorited;
    // Optimistic: the heart responds instantly on slow connections, then reconciles.
    setFavorited(next);
    setBusy(true);
    try {
      const res = await fetch(`/api/favorite/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favorite: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setFavorited(!next);
        const loginUrl = `/login?callbackUrl=${encodeURIComponent(`/server/${slug}`)}`;
        toast("Login dulu untuk menyimpan favorit", {
          action: { label: "Masuk", onClick: () => window.location.assign(loginUrl) },
        });
        return;
      }
      if (!res.ok) {
        setFavorited(!next);
        toast.error(data.message || "Gagal menyimpan favorit. Coba lagi.");
        return;
      }
      setFavorited(data.favorited);
      toast.success(data.favorited ? "Disimpan ke favorit" : "Dihapus dari favorit", {
        description: data.favorited ? "Lihat semua favoritmu di Dashboard > Favorit." : undefined,
      });
    } catch {
      setFavorited(!next);
      toast.error("Koneksi terputus. Favorit belum tersimpan.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={favorited}
      aria-label={favorited ? "Hapus dari favorit" : "Simpan ke favorit"}
      className={`min-h-[44px] min-w-[44px] px-3 rounded-lg border inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
        favorited ? "border-rose-500/40 bg-rose-500/10 text-rose-200" : "border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:text-white hover:border-zinc-700"
      }`}
    >
      <Heart size={18} weight={favorited ? "fill" : "regular"} aria-hidden />
      <span className="hidden sm:inline">{favorited ? "Favorit" : "Simpan"}</span>
    </button>
  );
}
