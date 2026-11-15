import { describe, expect, it } from "vitest";
import { pingServer } from "@/lib/mc-status";

// Hits the real mcstatus.io API, so it only runs when asked: LIVE_NET=1 npm test
describe.runIf(process.env.LIVE_NET === "1")("pingServer (live network)", () => {
  it("reports an online Java server with players and version", async () => {
    const status = await pingServer({ host: "demo.mcstatus.io", port: 25565, platform: "JAVA" });
    expect(status.online).toBe(true);
    expect(status.maxPlayers).toBeGreaterThan(0);
    expect(status.version).toMatch(/1\.\d+/);
  }, 15000);

  it("reports a host that does not resolve as offline", async () => {
    const status = await pingServer({ host: "does-not-exist.eterverse-test.invalid", port: 25565, platform: "JAVA" });
    expect(status.online).toBe(false);
  }, 15000);
});
