// Internal destinations only: "//evil.com" and "/\evil.com" would be open redirects. The
// auth middleware sends absolute same-site URLs (https://eterverse.../dashboard/server/new),
// which are reduced to their path so owners land on the page they asked for.
export function safeCallback(raw: string | undefined, siteOrigins: string[], fallback = "/dashboard"): string {
  if (!raw) return fallback;
  if (/^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      return siteOrigins.includes(url.origin) ? url.pathname + url.search : fallback;
    } catch {
      return fallback;
    }
  }
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return fallback;
  return raw;
}

export function siteOriginsFromEnv(): string[] {
  return [process.env.NEXT_PUBLIC_SITE_URL, process.env.AUTH_URL, process.env.NEXTAUTH_URL]
    .filter((u): u is string => !!u)
    .flatMap((u) => {
      try {
        return [new URL(u).origin];
      } catch {
        return [];
      }
    });
}
