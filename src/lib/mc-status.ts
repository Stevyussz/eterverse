import util from "minecraft-server-util";
import { resolvePublicHost } from "@/lib/net-guard";

export interface McStatus {
  online: boolean;
  players: number;
  maxPlayers: number;
  version: string;
}

const OFFLINE: McStatus = { online: false, players: 0, maxPlayers: 0, version: "" };
const TIMEOUT_MS = 5000;

type Edition = "java" | "bedrock";

/** Which protocol to ping. The old check (`port === 19132`) missed Bedrock servers on custom ports. */
export function editionFor(platform: string | undefined, port: number | undefined): Edition {
  if (platform === "BEDROCK") return "bedrock";
  if (platform === "JAVA" || platform === "CROSSPLAY") return "java";
  return port === 19132 ? "bedrock" : "java";
}

// mcstatus.io is the maintained successor that minecraft-server-util's deprecation notice
// points to. It pings from its own network, so our functions never open sockets to owner hosts.
async function viaMcStatus(edition: Edition, host: string, port: number): Promise<McStatus | null> {
  try {
    const res = await fetch(
      `https://api.mcstatus.io/v2/status/${edition}/${encodeURIComponent(host)}:${port}`,
      { signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.online) return OFFLINE;
    return {
      online: true,
      players: Number(data.players?.online) || 0,
      maxPlayers: Number(data.players?.max) || 0,
      version: String(data.version?.name_clean ?? data.version?.name ?? "").slice(0, 60),
    };
  } catch {
    return null;
  }
}

async function viaDirectPing(edition: Edition, host: string, port: number): Promise<McStatus> {
  try {
    const target = await resolvePublicHost(host);
    if (!target) return OFFLINE;
    if (edition === "bedrock") {
      const r = await util.statusBedrock(target, port, { timeout: TIMEOUT_MS });
      return { online: true, players: r.players.online, maxPlayers: r.players.max, version: String(r.version?.name ?? "").slice(0, 60) };
    }
    const r = await util.status(target, port, { timeout: TIMEOUT_MS, enableSRV: false });
    return { online: true, players: r.players.online, maxPlayers: r.players.max, version: String(r.version?.name ?? "").slice(0, 60) };
  } catch {
    return OFFLINE;
  }
}

export async function pingServer(opts: { host: string; port?: number; platform?: string }): Promise<McStatus> {
  const host = opts.host.trim();
  if (!host) return OFFLINE;
  const edition = editionFor(opts.platform, opts.port);
  const port = opts.port || (edition === "bedrock" ? 19132 : 25565);
  // null means "mcstatus.io unreachable", not "server offline": only then try directly.
  return (await viaMcStatus(edition, host, port)) ?? (await viaDirectPing(edition, host, port));
}

/** Pulls "1.21" out of version strings like "Paper 1.21.4" or "Velocity 3.3.0 1.8.x-1.21.x". */
export function majorVersions(version: string): string[] {
  const found = version.match(/\b1\.(\d{1,2})(?:\.\d+)?/g) ?? [];
  return Array.from(new Set(found.map((v) => v.split(".").slice(0, 2).join("."))));
}
