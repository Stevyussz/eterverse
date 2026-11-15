import { describe, expect, it } from "vitest";
import { normalizeHost, parseServerForm } from "@/lib/server-form";

function form(overrides: Record<string, string> = {}) {
  const fd = new FormData();
  const base: Record<string, string> = {
    name: "Nusantara SMP",
    serverType: "SERVER",
    platform: "CROSSPLAY",
    ipAddress: "play.nusantara.id",
    port: "25565",
    description: "Server survival santai dengan ekonomi dan event mingguan.",
    tags: "Survival, SMP, , Survival",
    videoUrl: "https://youtu.be/dQw4w9WgXcQ",
    ownerWhatsApp: "0812 3456 7890",
    ...overrides,
  };
  for (const [k, v] of Object.entries(base)) fd.append(k, v);
  return fd;
}

describe("parseServerForm", () => {
  it("accepts a normal submission and cleans it", () => {
    const r = parseServerForm(form());
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.data.tags).toEqual(["Survival", "SMP"]);
    expect(r.data.ownerWhatsApp).toBe("081234567890");
    expect(r.data.port).toBe(25565);
  });

  it("returns readable errors instead of throwing", () => {
    expect(parseServerForm(form({ name: "ab" }))).toMatchObject({ ok: false });
    expect(parseServerForm(form({ ipAddress: "not a host" }))).toMatchObject({ ok: false });
    expect(parseServerForm(form({ description: "pendek" }))).toMatchObject({ ok: false });
    expect(parseServerForm(form({ videoUrl: "" }))).toMatchObject({ ok: false });
    expect(parseServerForm(form({ ownerWhatsApp: "abc" }))).toMatchObject({ ok: false });
    expect(parseServerForm(form({ discordUrl: "javascript:alert(1)" }))).toMatchObject({ ok: false });
  });

  it("does not crash when tags are missing", () => {
    const fd = form();
    fd.delete("tags");
    const r = parseServerForm(fd);
    expect(r.ok && r.data.tags).toEqual([]);
  });

  it("falls back to safe enum values", () => {
    const r = parseServerForm(form({ serverType: "HACK", platform: "PS5" }));
    expect(r.ok && [r.data.serverType, r.data.platform]).toEqual(["SERVER", "CROSSPLAY"]);
  });

  it("builds the Realm address from a pasted link", () => {
    const r = parseServerForm(form({ serverType: "REALM", realmCode: "https://realms.gg/AbC123" }));
    expect(r.ok && r.data.ipAddress).toBe("realms.gg/AbC123");
  });

  it("keeps existing media on edit when fields are left empty", () => {
    const r = parseServerForm(form({ videoUrl: "" }), { videoUrl: "https://res.cloudinary.com/x/video.mp4", logoUrl: "https://i.ibb.co/a.png" });
    expect(r.ok && [r.data.videoUrl, r.data.logoUrl]).toEqual(["https://res.cloudinary.com/x/video.mp4", "https://i.ibb.co/a.png"]);
  });
});

describe("normalizeHost", () => {
  it("strips scheme, path and port that owners often paste", () => {
    expect(normalizeHost(" HTTPS://Play.Server.ID/ ")).toBe("play.server.id");
    expect(normalizeHost("play.server.id:25565")).toBe("play.server.id");
  });
});
