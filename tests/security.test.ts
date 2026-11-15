import { describe, expect, it } from "vitest";
import { escapeRegex, safeSearchTerm } from "@/lib/text";
import { safeCallback } from "@/lib/safe-callback";
import { toSafeJsonLd } from "@/lib/json-ld";
import { isPrivateAddress } from "@/lib/net-guard";

describe("escapeRegex", () => {
  it("neutralises catastrophic and invalid patterns", () => {
    for (const input of ["(a+)+$", "(", "[", "a|b", ".*"]) {
      const rx = new RegExp(escapeRegex(input));
      expect(rx.test(input)).toBe(true);
      expect(rx.test("unrelated")).toBe(false);
    }
  });

  it("trims and caps search input", () => {
    expect(safeSearchTerm("  smp  ")).toBe("smp");
    expect(safeSearchTerm("x".repeat(500))).toHaveLength(60);
    expect(safeSearchTerm(undefined)).toBe("");
  });
});

describe("safeCallback", () => {
  const origins = ["https://eterverse.vercel.app"];

  it("keeps internal paths", () => {
    expect(safeCallback("/server/abc", origins)).toBe("/server/abc");
    expect(safeCallback("/dashboard/server/new?x=1", origins)).toBe("/dashboard/server/new?x=1");
  });

  it("reduces same-site absolute URLs to a path", () => {
    expect(safeCallback("https://eterverse.vercel.app/dashboard/server/new", origins)).toBe("/dashboard/server/new");
  });

  it("blocks open redirects", () => {
    for (const bad of ["//evil.com", "/\\evil.com", "https://evil.com/x", "javascript:alert(1)", "evil.com", ""]) {
      expect(safeCallback(bad, origins)).toBe("/dashboard");
    }
    expect(safeCallback(undefined, origins)).toBe("/dashboard");
  });
});

describe("toSafeJsonLd", () => {
  it("cannot close the script tag and stays valid JSON", () => {
    const payload = { description: '</script><script>alert(1)</script> & "q"' };
    const out = toSafeJsonLd(payload);
    expect(out).not.toMatch(/<\/script/i);
    expect(out).not.toContain("<");
    expect(JSON.parse(out)).toEqual(payload);
  });
});

describe("isPrivateAddress", () => {
  it.each(["127.0.0.1", "10.1.2.3", "172.16.0.1", "172.31.255.255", "192.168.0.10", "169.254.169.254", "100.64.0.1", "0.0.0.0", "::1", "fd00::1", "fe80::1", "::ffff:127.0.0.1"])(
    "blocks %s",
    (ip) => expect(isPrivateAddress(ip)).toBe(true)
  );

  it.each(["1.1.1.1", "8.8.8.8", "172.32.0.1", "103.10.20.30", "2606:4700::1111"])("allows %s", (ip) =>
    expect(isPrivateAddress(ip)).toBe(false)
  );
});
