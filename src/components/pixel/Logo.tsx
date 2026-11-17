import { Sprite } from "@/components/pixel/PixelArt";

/** Brand lockup: the portal block plus the wordmark in Pixelify. */
export function Logo({ size = 32, tone = "light", className = "" }: { size?: number; tone?: "light" | "dark"; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Sprite name="portal" size={size} />
      <span className={`font-pixel font-bold text-xl leading-none tracking-tight ${tone === "dark" ? "text-panel" : "text-ink"}`}>
        Eter<span className={tone === "dark" ? "text-prism-l" : "text-prism-d"}>Verse</span>
      </span>
    </span>
  );
}
