import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import net from "node:net";
import crypto from "node:crypto";

// Every host in these tests "resolves" to a public TEST-NET address, and sockets are
// redirected to a local fake listener. The real SSRF guard is covered in security.test.ts.
vi.mock("@/lib/net-guard", () => ({
  resolvePublicHost: async (host: string) => (host === "blocked.example" ? null : "203.0.113.10"),
}));

const realConnect = net.createConnection;

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
// NuVotifier's public.key format: bare base64 DER (SPKI), no PEM header.
const bareKey = publicKey.export({ type: "spki", format: "der" }).toString("base64");

function decryptPkcs1(block: Buffer): string {
  // Node 20 refuses PKCS#1 v1.5 private decryption, so strip the type-2 padding by hand,
  // the same way the Java listener reads it.
  const raw = crypto.privateDecrypt({ key: privateKey, padding: crypto.constants.RSA_NO_PADDING }, block);
  expect(raw[0]).toBe(0);
  expect(raw[1]).toBe(2);
  return raw.subarray(raw.indexOf(0, 2) + 1).toString("utf8");
}

let votifierPort = 0;
let wrongServicePort = 0;
let received: string | null = null;
const servers: net.Server[] = [];

beforeAll(async () => {
  const listen = (handler: (s: net.Socket) => void) =>
    new Promise<number>((resolve) => {
      const srv = net.createServer(handler);
      servers.push(srv);
      srv.listen(0, "127.0.0.1", () => resolve((srv.address() as net.AddressInfo).port));
    });

  votifierPort = await listen((sock) => {
    sock.write("VOTIFIER 2.9 challenge\n");
    const chunks: Buffer[] = [];
    sock.on("data", (c) => {
      chunks.push(c);
      const buf = Buffer.concat(chunks);
      if (buf.length >= 256) {
        received = decryptPkcs1(buf.subarray(0, 256));
        sock.end();
      }
    });
  });
  wrongServicePort = await listen((sock) => sock.end("HTTP/1.1 400 Bad Request\r\n\r\n"));

  vi.spyOn(net, "createConnection").mockImplementation(((opts: net.NetConnectOpts) =>
    realConnect({ ...(opts as net.TcpNetConnectOpts), host: "127.0.0.1" })) as typeof net.createConnection);
});

afterAll(() => {
  servers.forEach((s) => s.close());
  vi.restoreAllMocks();
});

describe("Votifier v1", async () => {
  const v = await import("@/lib/votifier");

  it("delivers an RSA block the listener decrypts to a v1 vote", async () => {
    const result = await v.sendVotifierVote({ host: "play.example.id", port: votifierPort, publicKey: bareKey, username: "Steve_123", address: "1.2.3.4" });
    expect(result).toEqual({ ok: true });
    await new Promise((r) => setTimeout(r, 100));
    const lines = received!.split("\n");
    expect(lines.slice(0, 4)).toEqual(["VOTE", "EterVerse", "Steve_123", "1.2.3.4"]);
    expect(Number(lines[4])).toBeGreaterThan(1_600_000_000_000);
  });

  it("accepts PEM keys too", () => {
    expect(v.normalizePublicKey(publicKey.export({ type: "spki", format: "pem" }).toString())).toContain("BEGIN PUBLIC KEY");
  });

  it("reports why a send failed", async () => {
    const base = { publicKey: bareKey, username: "Steve", address: "x" };
    expect(await v.sendVotifierVote({ ...base, host: "blocked.example", port: votifierPort })).toEqual({ ok: false, reason: "blocked_host" });
    expect(await v.sendVotifierVote({ ...base, host: "a.example", port: wrongServicePort })).toEqual({ ok: false, reason: "protocol" });
    expect(await v.sendVotifierVote({ ...base, host: "a.example", port: 1 })).toEqual({ ok: false, reason: "connect" });
    expect(await v.sendVotifierVote({ ...base, host: "a.example", port: votifierPort, publicKey: "nope" })).toEqual({ ok: false, reason: "invalid_key" });
  });

  it("validates Minecraft usernames, including Geyser prefixes", () => {
    for (const ok of ["Steve", "Steve_123", ".BedrockGuy", "*Floodgate"]) expect(v.isValidMinecraftUsername(ok)).toBe(true);
    for (const bad of ["ab", "a b", "Steve\nVOTE", "x".repeat(17), 42, null]) expect(v.isValidMinecraftUsername(bad)).toBe(false);
  });
});
