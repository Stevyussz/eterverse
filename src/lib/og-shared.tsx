// Shared pieces for next/og images (share cards and the embeddable widget). Satori renders
// plain SVG, so the status icon is drawn here: the same ping bars as the site's LiveIcon.

export const OG_COLORS = {
  bg: "#F2EAD3",
  panel: "#FFFBF0",
  ink: "#2E2216",
  muted: "#5E4A33",
  prism: "#1D5E57",
  prismL: "#77C9BC",
  gold: "#F2B318",
  goldL: "#FFF1C2",
  online: "#2F8F1F",
  onlineText: "#226B14",
  offline: "#7A644A",
  screen: "#1B1510",
};

/** Minecraft-style ping bars: four rising bars when online, flat bars plus an X when not. */
export function StatusIcon({ online, size }: { online: boolean; size: number }) {
  const c = online ? OG_COLORS.online : OG_COLORS.offline;
  const bars = online
    ? [[0, 9, 3], [3, 6, 6], [6, 3, 9], [9, 0, 12]]
    : [[0, 10, 2], [3, 10, 2], [6, 10, 2], [9, 10, 2]];
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" shapeRendering="crispEdges">
      {bars.map(([x, y, h], i) => (
        <rect key={i} x={x} y={y} width={2} height={h} fill={c} />
      ))}
      {!online && <path d="M0 0h1v1H0zM1 1h1v1H1zM2 2h1v1H2zM3 1h1v1H3zM4 0h1v1H4zM1 3h1v1H1zM0 4h1v1H0zM3 3h1v1H3zM4 4h1v1H4z" fill={c} />}
    </svg>
  );
}

/**
 * Fetches an owner image for use inside the card. Satori only decodes PNG/JPEG, and a slow
 * or dead image host must not break the whole card, so anything else returns null.
 */
export async function fetchImageDataUri(url: string | undefined, timeoutMs = 3000): Promise<string | null> {
  if (!url || !/^https?:\/\//i.test(url)) return null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    const type = res.headers.get("content-type") || "";
    if (!res.ok || !/^image\/(png|jpe?g)/i.test(type)) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 2.5 * 1024 * 1024) return null;
    return `data:${type.split(";")[0]};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}
