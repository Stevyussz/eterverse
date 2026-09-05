"use client";

import { useRef, useEffect, useState } from "react";
import { getYoutubeId } from "@/utils/youtube";

interface BackgroundVideoProps {
  videoUrl?: string;
  fallbackImage?: string;
  isHovered?: boolean;
  className?: string;
  autoPlay?: boolean;
}

export function BackgroundVideo({
  videoUrl = "",
  fallbackImage,
  isHovered = true,
  className = "",
  autoPlay = false,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ytId = getYoutubeId(videoUrl);
  const [thumbSrc, setThumbSrc] = useState<string>(
    ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : fallbackImage || ""
  );

  useEffect(() => {
    if (ytId) {
      setThumbSrc(`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`);
    } else if (fallbackImage) {
      setThumbSrc(fallbackImage);
    }
  }, [ytId, fallbackImage]);

  // Play/pause logic for native video elements (non-YouTube)
  useEffect(() => {
    if (ytId || !videoUrl) return;

    if (autoPlay || isHovered) {
      videoRef.current?.play().catch(() => {});
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, autoPlay, ytId, videoUrl]);

  // If no videoUrl or invalid
  if (!videoUrl) {
    if (fallbackImage) {
      return (
        <img
          src={fallbackImage}
          alt="Background Preview"
          loading="lazy"
          decoding="async"
          className={`object-cover pointer-events-none ${className}`}
        />
      );
    }
    return (
      <div
        className={`bg-gradient-to-br from-zinc-900 via-black to-zinc-950 pointer-events-none ${className}`}
      />
    );
  }

  if (ytId) {
    const shouldPlay = isHovered || autoPlay;
    return (
      <div className={`overflow-hidden pointer-events-none relative ${className}`}>
        {/* Always display poster underneath so there is never a blank stutter while loading */}
        <img
          src={thumbSrc}
          loading="lazy"
          decoding="async"
          onError={() => {
            if (ytId) {
              setThumbSrc(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
            }
          }}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${
            shouldPlay ? "opacity-0" : "opacity-100"
          }`}
          alt="Video Preview"
        />

        {shouldPlay && (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&playsinline=1&modestbranding=1&rel=0`}
            className="absolute top-1/2 left-1/2 w-[350%] h-[350%] sm:w-[220%] sm:h-[220%] md:w-[180%] md:h-[180%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            allow="autoplay; encrypted-media"
            style={{ border: 0 }}
            title="Background Video"
            loading="lazy"
            tabIndex={-1}
          />
        )}
      </div>
    );
  }

  // Native MP4/WebM handling (Cloudinary or direct URL)
  return (
    <video
      ref={videoRef}
      src={videoUrl}
      muted
      loop
      playsInline
      preload="none"
      poster={fallbackImage}
      className={`pointer-events-none object-cover ${className}`}
    />
  );
}

