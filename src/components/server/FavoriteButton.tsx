"use client";

import { useState } from "react";
import { PixelIcon } from "@/components/pixel/PixelIcon";
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
      className={`px-btn ${favorited ? "px-btn-red" : "px-btn-cream"}`}
    >
      <PixelIcon name={favorited ? "heart" : "heartOutline"} size={16} className={favorited ? "" : "text-redstone"} />
      <span className="hidden sm:inline">{favorited ? "Favorit" : "Simpan"}</span>
    </button>
  );
}
