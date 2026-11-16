// Fire-and-forget: sendBeacon survives the page switching to the Minecraft app on
// "Main Langsung", which a normal fetch can lose. Every Copy IP / Main button lives on
// /server/[slug], so the slug comes from the URL instead of being threaded through props.
export function trackJoinIntent() {
  if (typeof window === "undefined") return;
  const match = window.location.pathname.match(/^\/server\/([^/?#]+)/);
  if (!match) return;
  const url = `/api/click/${match[1]}`;
  try {
    if (navigator.sendBeacon?.(url)) return;
  } catch {
    // fall through to fetch
  }
  fetch(url, { method: "POST", keepalive: true }).catch(() => {});
}
