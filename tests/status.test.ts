import { describe, expect, it } from "vitest";
import { editionFor, majorVersions } from "@/lib/mc-status";
import { wibDay } from "@/lib/server-status";

describe("editionFor", () => {
  it("uses the platform, not just port 19132", () => {
    expect(editionFor("BEDROCK", 19133)).toBe("bedrock");
    expect(editionFor("JAVA", 19132)).toBe("java");
    expect(editionFor("CROSSPLAY", 25565)).toBe("java");
    expect(editionFor(undefined, 19132)).toBe("bedrock");
  });
});

describe("majorVersions", () => {
  it("extracts 1.NN from real-world version strings", () => {
    expect(majorVersions("Paper 1.21.4")).toEqual(["1.21"]);
    expect(majorVersions("Velocity 3.3.0-SNAPSHOT 1.8.x-1.21.x")).toEqual(["1.8", "1.21"]);
    expect(majorVersions("1.20.1")).toEqual(["1.20"]);
    expect(majorVersions("BungeeCord")).toEqual([]);
  });
});

describe("wibDay", () => {
  it("buckets by Indonesian Western Time (UTC+7)", () => {
    expect(wibDay(new Date("2026-11-15T16:59:00Z"))).toBe("2026-11-15");
    expect(wibDay(new Date("2026-11-15T17:00:00Z"))).toBe("2026-11-16");
  });
});
