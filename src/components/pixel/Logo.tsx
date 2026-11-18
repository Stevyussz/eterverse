import { MARK_RECTS, MARK_SIZE, WORDMARK_RECTS, WORDMARK_SIZE, type BrandRect } from "@/components/pixel/brand-art";

// Brand lockup. Pixels come from scripts/brand.mjs (one source for the site, favicon and
// the files in public/brand), so the logo here is the logo everywhere.

function Rects({ rects }: { rects: readonly BrandRect[] }) {
  return (
    <>
      {rects.map(([x, y, w, h, c], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={c} />
      ))}
    </>
  );
}

/** The "Gerbang Eter" mark on its own (favicon, avatars, small slots). */
export function LogoMark({ size = 32, className = "", label }: { size?: number; className?: string; label?: string }) {
  return (
    <svg
      viewBox={`0 0 ${MARK_SIZE} ${MARK_SIZE}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={`shrink-0 ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <Rects rects={MARK_RECTS} />
    </svg>
  );
}

/** Mark + block-letter wordmark. The wordmark has its own ink outline, so it reads on
 *  cream, Nether dark and prismarine alike. Height is set by the caller's class. */
export function Logo({ className = "", wordmarkClassName = "h-[28px] sm:h-[38px]" }: { className?: string; wordmarkClassName?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={32} />
      <svg
        viewBox={`0 0 ${WORDMARK_SIZE.w} ${WORDMARK_SIZE.h}`}
        shapeRendering="crispEdges"
        className={`w-auto ${wordmarkClassName}`}
        role="img"
        aria-label="EterVerse"
        focusable="false"
      >
        <Rects rects={WORDMARK_RECTS} />
      </svg>
    </span>
  );
}
