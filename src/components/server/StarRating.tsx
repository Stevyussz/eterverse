"use client";

import { useState } from "react";
import { Star } from "@phosphor-icons/react";

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
            className={`transition-all duration-150 hover:scale-110 ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <Star
              size={24}
              weight={star <= displayStar ? "fill" : "regular"}
              className={
                star <= displayStar
                  ? "text-eter-gold"
                  : "text-zinc-600"
              }
            />
          </button>
        ))}
        <span className="text-sm font-mono text-zinc-400 ml-2">
          {currentRating.toFixed(1)} / 5.0
        </span>
      </div>

      {!isLoggedIn ? (
        <p className="text-[10px] font-mono text-zinc-600">Masuk untuk memberi rating server ini</p>
      ) : message ? (
        <p className="text-[10px] font-mono text-eter-cyan animate-fade-in">{message}</p>
      ) : submitted ? (
        <p className="text-[10px] font-mono text-zinc-500">Rating Anda: {submitted} ★</p>
      ) : (
        <p className="text-[10px] font-mono text-zinc-600">Klik bintang untuk memberi rating</p>
      )}
    </div>
  );
}
