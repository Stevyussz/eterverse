import net from "node:net";
import dns from "node:dns/promises";

// Owners type hosts (server IP, Votifier host) that our infrastructure then connects to.
// Without this guard those fields could aim our servers at internal networks (SSRF).

export function isPrivateAddress(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 0 || a === 10 || a === 127 ||
      (a === 100 && b >= 64 && b <= 127) || // CGNAT
      (a === 169 && b === 254) ||           // link-local, cloud metadata
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a >= 224
    );
  }
  const v6 = ip.toLowerCase();
  if (v6.startsWith("::ffff:")) return isPrivateAddress(v6.slice(7));
  return v6 === "::1" || v6 === "::" || v6.startsWith("fc") || v6.startsWith("fd") || v6.startsWith("fe80");
}

/**
 * Resolves `host` and returns an address safe to connect to, or null when any record is
 * private. Callers must connect to the returned IP (not the name) so a DNS answer that
 * changes between check and connect cannot slip a private address through.
 */
export async function resolvePublicHost(host: string): Promise<string | null> {
  const clean = host.trim();
  if (net.isIP(clean)) return isPrivateAddress(clean) ? null : clean;
  const records = await dns.lookup(clean, { all: true });
  if (!records.length || records.some((r) => isPrivateAddress(r.address))) return null;
  return records[0].address;
}
