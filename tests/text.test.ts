import { describe, expect, it } from "vitest";
import { plainExcerpt } from "@/lib/text";
import { displayAddress } from "@/lib/server-queries";

describe("plainExcerpt", () => {
  const md = "**ETERNITYPIRATES**\r\n\r\nSET SAIL. BUILD YOUR CREW.\r\n\r\n━━━━━━━━━━\r\n\r\nAhoy, *Pirate*! [Gabung](https://x.y) sekarang.";

  it("drops the repeated name, dividers and markdown syntax", () => {
    expect(plainExcerpt(md, 200, "EternityPirates")).toBe("SET SAIL. BUILD YOUR CREW. Ahoy, Pirate! Gabung sekarang.");
  });

  it("cuts on a word boundary", () => {
    const out = plainExcerpt("kata ".repeat(60), 60);
    expect(out.endsWith("...")).toBe(true);
    expect(out.length).toBeLessThanOrEqual(63);
    expect(out).not.toMatch(/ka\.\.\.$/);
  });

  it("handles empty input", () => {
    expect(plainExcerpt(undefined)).toBe("");
  });
});

describe("displayAddress", () => {
  it("hides default ports and keeps custom ones", () => {
    expect(displayAddress({ ipAddress: "play.x.id", port: 25565 })).toBe("play.x.id");
    expect(displayAddress({ ipAddress: "play.x.id", port: 19132 })).toBe("play.x.id");
    expect(displayAddress({ ipAddress: "play.x.id", port: 25570 })).toBe("play.x.id:25570");
  });

  it("uses the Realm code for Realms", () => {
    expect(displayAddress({ serverType: "REALM", realmCode: "https://realms.gg/AbC123" })).toBe("AbC123");
  });
});
