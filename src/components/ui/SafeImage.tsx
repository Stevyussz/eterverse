"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  src?: string;
  alt: string;
  className?: string;
  /** Shown when the image is missing or fails: initials of `name` (honest placeholder, not art). */
  fallbackName?: string;
  /** Alternative image to try once before falling back to initials. */
  fallbackSrc?: string;
  style?: React.CSSProperties;
}

// Owner images live on third-party hosts (ImgBB, Cloudinary). A dead link used to render
// the browser's broken-image icon with alt text spilling out of the logo box.
export function SafeImage({ src, alt, className = "", fallbackName, fallbackSrc, style }: Props) {
  const [current, setCurrent] = useState(src || fallbackSrc || "");
  const [failed, setFailed] = useState(!src && !fallbackSrc);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleError = () => {
    if (fallbackSrc && current !== fallbackSrc) setCurrent(fallbackSrc);
    else setFailed(true);
  };

  // A server-rendered <img> can fail before React hydrates, and then onError never fires.
  // On mount, a finished image with no pixels means it already failed.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      queueMicrotask(handleError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (failed || !current) {
    if (!fallbackName) return null;
    const initials = fallbackName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");
    return (
      <div role="img" aria-label={alt} className={`flex items-center justify-center bg-slot font-pixel font-bold text-ink ${className}`} style={style}>
        {/* A caller-sized box (text-xs/sm/base in className) keeps its size; otherwise scale
            with the viewport for the large logo slots. A fixed clamp overflowed 40px avatars. */}
        <span className={/\btext-(xs|sm|base)\b/.test(className) ? "" : "text-[clamp(1rem,4vw,2.5rem)]"}>{initials || "?"}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src={current}
      alt={alt}
      className={className}
      style={style}
      decoding="async"
      onError={handleError}
    />
  );
}
