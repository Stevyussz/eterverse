import { WifiHigh, WifiSlash } from "@phosphor-icons/react/dist/ssr";

// Server status as an icon instead of a coloured dot: the shape itself says online/offline,
// so it also reads for colour-blind players. Cyan stays reserved for "online".
export function LiveIcon({ online, size = 14, className = "" }: { online: boolean; size?: number; className?: string }) {
  return online ? (
    <WifiHigh size={size} weight="bold" className={`text-eter-cyan shrink-0 ${className}`} aria-hidden />
  ) : (
    <WifiSlash size={size} weight="bold" className={`text-zinc-500 shrink-0 ${className}`} aria-hidden />
  );
}
