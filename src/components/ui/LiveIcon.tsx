import { PixelIcon } from "@/components/pixel/PixelIcon";

// Server status drawn like the ping bars on Minecraft's Multiplayer screen: full green bars
// when online, flat bars with an X when not. The shape carries the meaning, not only colour.
export function LiveIcon({ online, size = 14, className = "" }: { online: boolean; size?: number; className?: string }) {
  return online ? (
    <PixelIcon name="signal" size={size} className={`text-online shrink-0 ${className}`} />
  ) : (
    <PixelIcon name="signalOff" size={size} className={`text-ink-3 shrink-0 ${className}`} />
  );
}
