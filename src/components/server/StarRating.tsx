"use client";

import { useState } from "react";
import { PixelIcon } from "@/components/pixel/PixelIcon";

interface StarRatingProps {
  slug: string;
  initialRating: number;
  isLoggedIn: boolean;
  userRating?: number; // existing rating this user gave, if any
}

export function StarRating({ slug, initialRating, isLoggedIn, userRating = 0 }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(userRating);
  const [currentRating, setCurrentRating] = useState(initialRating);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRate = async (stars: number) => {
    if (!isLoggedIn) {
      setMessage("Masuk untuk memberi rating server ini.");
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/rate/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stars }),
      });
      const data = await res.json();

      if (res.ok) {
        setSubmitted(stars);
        setCurrentRating(data.rating);
        setMessage("Rating berhasil disimpan!");
        setTimeout(() => setMessage(""), 2000);
      } else {
        setMessage(data.error || "Gagal memberi rating.");
      }
    } catch {
      setMessage("Kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  const displayStar = hovered || submitted;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            disabled={loading}
            aria-label={`Beri ${star} bintang`}
            className={`w-11 h-11 flex items-center justify-center ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <PixelIcon
              name={star <= displayStar ? "star" : "starOutline"}
              size={24}
              className={`${star <= displayStar ? "text-gold-d" : "text-ink-3"} ${star === submitted ? "px-pop" : ""}`}
            />
          </button>
        ))}
        <span className="text-sm text-ink-2 ml-2 tabular">
          {currentRating.toFixed(1)} / 5.0
        </span>
      </div>

      {!isLoggedIn ? (
        <p className="text-xs text-ink-2">Masuk untuk memberi rating server ini</p>
      ) : message ? (
        <p className="text-xs text-prism-d px-pop" role="status">{message}</p>
      ) : submitted ? (
        <p className="text-xs text-ink-2">Rating kamu: {submitted} bintang</p>
      ) : (
        <p className="text-xs text-ink-2">Ketuk bintang untuk memberi rating</p>
      )}
    </div>
  );
}
