// Shared pieces for next/og images (share cards and the embeddable widget). Satori renders
// plain SVG, so the status icon is drawn here instead of using the React icon library.
// Paths: Material Design Icons "wifi" / "wifi_off" (Apache 2.0).

const WIFI_ON =
  "M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z";
const WIFI_OFF =
  "M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8 23.64 7zm-6.6 8.22L3.27 1.44 2 2.72l2.05 2.06C1.91 5.76.59 6.82.36 7l11.63 14.49.01.01.01-.01 3.9-4.86 3.32 3.32 1.27-1.27-3.46-3.46z";

export const OG_COLORS = {
  bg: "#09090B",
  text: "#FAFAFA",
  muted: "#A1A1AA",
  border: "rgba(255,255,255,0.14)",
  cyan: "#22D3EE",
  gold: "#EAB308",
};

export function StatusIcon({ online, size }: { online: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d={online ? WIFI_ON : WIFI_OFF} fill={online ? OG_COLORS.cyan : "#71717A"} />
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
