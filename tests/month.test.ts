import { describe, expect, it } from "vitest";
import { wibMonth } from "@/models/VoteMonthly";

describe("wibMonth", () => {
  it("flips at midnight WIB, not UTC", () => {
    expect(wibMonth(new Date("2026-11-30T16:59:00Z"))).toBe("2026-11");
    expect(wibMonth(new Date("2026-11-30T17:00:00Z"))).toBe("2026-12");
  });

  it("handles year boundaries and offsets", () => {
    expect(wibMonth(new Date("2027-01-10T00:00:00Z"), -1)).toBe("2026-12");
    expect(wibMonth(new Date("2026-12-31T18:00:00Z"))).toBe("2027-01");
  });
});
