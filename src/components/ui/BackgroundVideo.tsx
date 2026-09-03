"use client";

import { useRef, useEffect } from "react";

interface BackgroundVideoProps {
  videoUrl: string;
  isHovered?: boolean;
  className?: string;
  autoPlay?: boolean;
}

export function BackgroundVideo({ videoUrl, isHovered = true, className = "", autoPlay = false }: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Helper to extract YouTube ID
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
    return match ? match[1] : null;
  };

  const ytId = getYoutubeId(videoUrl);

  // Play/pause logic for native video elements (non-YouTube)
  useEffect(() => {
    if (ytId) return; // YouTube handles autoplay internally

    if (autoPlay || isHovered) {
      videoRef.current?.play().catch(() => {});
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, autoPlay, ytId]);

  if (ytId) {
    return (
      <div className={`overflow-hidden pointer-events-none ${className}`}>
        {/* We use a scale trick to mimic object-cover behavior for YouTube iframes */}
        {isHovered || autoPlay ? (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&playsinline=1&modestbranding=1&rel=0`}
            className="absolute top-1/2 left-1/2 w-[300%] h-[300%] sm:w-[200%] sm:h-[200%] md:w-[150%] md:h-[150%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            allow="autoplay; encrypted-media"
            style={{ border: 0 }}
          />
        ) : (
          <img 
            src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            alt="YouTube Thumbnail Fallback"
          />
        )}
      </div>
    );
  }

  // Native MP4/WebM handling (Cloudinary)
  return (
    <video
      ref={videoRef}
      src={videoUrl}
      muted
      loop
      playsInline
      className={`pointer-events-none ${className}`}
    />
  );
}
