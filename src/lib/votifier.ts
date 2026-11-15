import net from "node:net";
import crypto from "node:crypto";
import { resolvePublicHost } from "@/lib/net-guard";

// Votifier v1 (RSA) sender. NuVotifier still accepts v1, and every reward plugin
// (VotingPlugin, SuperbVote, GAListener) listens to it, so one protocol covers them all.

export const VOTIFIER_SERVICE_NAME = "EterVerse";
const TIMEOUT_MS = 4000;

// Java names are 3-16 of [A-Za-z0-9_]. Geyser/Floodgate prefixes Bedrock names with "." or "*".
const USERNAME_RE = /^[.*]?[A-Za-z0-9_]{3,16}$/;

export function isValidMinecraftUsername(name: unknown): name is string {
  return typeof name === "string" && USERNAME_RE.test(name);
}

export type VotifierResult =
  | { ok: true }
  | { ok: false; reason: "invalid_key" | "blocked_host" | "dns" | "timeout" | "connect" | "protocol" };

export function normalizePublicKey(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  // NuVotifier writes plugins/Votifier/rsa/public.key as bare base64 DER (SPKI).
  const pem = trimmed.includes("BEGIN")
    ? trimmed
    : `-----BEGIN PUBLIC KEY-----\n${trimmed.replace(/\s+/g, "").match(/.{1,64}/g)?.join("\n")}\n-----END PUBLIC KEY-----`;
  try {
    const key = crypto.createPublicKey(pem);
    if (key.asymmetricKeyType !== "rsa") return null;
    return key.export({ type: "spki", format: "pem" }).toString();
  } catch {
    return null;
  }
}

export async function sendVotifierVote(opts: {
  host: string;
  port: number;
  publicKey: string;
  username: string;
  address: string;
}): Promise<VotifierResult> {
  const pem = normalizePublicKey(opts.publicKey);
  if (!pem) return { ok: false, reason: "invalid_key" };

  let target: string | null;
  try {
    target = await resolvePublicHost(opts.host);
  } catch {
    return { ok: false, reason: "dns" };
  }
  if (!target) return { ok: false, reason: "blocked_host" };

  const payload = `VOTE\n${VOTIFIER_SERVICE_NAME}\n${opts.username}\n${opts.address}\n${Date.now()}\n`;
  let block: Buffer;
  try {
    block = crypto.publicEncrypt({ key: pem, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(payload, "utf8"));
  } catch {
    return { ok: false, reason: "invalid_key" };
  }

  return new Promise<VotifierResult>((resolve) => {
    let settled = false;
    let greeted = false;
    const socket = net.createConnection({ host: target!, port: opts.port });

    const finish = (result: VotifierResult) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(TIMEOUT_MS, () => finish({ ok: false, reason: "timeout" }));
    socket.on("error", () => finish({ ok: false, reason: greeted ? "protocol" : "connect" }));

    // The listener greets first ("VOTIFIER <version> ..."); the vote is sent after that.
    socket.once("data", (chunk) => {
      if (!chunk.toString("utf8").startsWith("VOTIFIER")) {
        finish({ ok: false, reason: "protocol" });
        return;
      }
      greeted = true;
      socket.write(block, () => {
        // v1 has no acknowledgement; give the listener a moment to read before closing.
        setTimeout(() => finish({ ok: true }), 150);
      });
    });
  });
}
