// Shared validation for the submit and edit server actions. Errors are returned as
// messages, not thrown: Next.js hides thrown server action errors in production, so owners
// only ever saw a generic failure toast.

const SERVER_TYPES = ["SERVER", "REALM"] as const;
const PLATFORMS = ["JAVA", "BEDROCK", "CROSSPLAY"] as const;

export interface ServerFormData {
  name: string;
  serverType: (typeof SERVER_TYPES)[number];
  platform: (typeof PLATFORMS)[number];
  realmCode: string;
  ipAddress: string;
  port: number;
  bedrockPort: number;
  description: string;
  tags: string[];
  videoUrl: string;
  logoUrl: string;
  bannerUrl: string;
  galleryUrls: string[];
  ownerWhatsApp: string;
  socialLinks: { discord: string; whatsapp: string; telegram: string; website: string };
}

export type ParseResult = { ok: true; data: ServerFormData } | { ok: false; error: string };

interface Existing {
  ipAddress?: string;
  bedrockPort?: number;
  videoUrl?: string;
  logoUrl?: string;
  bannerUrl?: string;
  galleryUrls?: string[];
}

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

function port(raw: string, fallback: number): number {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 && n <= 65535 ? n : fallback;
}

const HOST_RE = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/;
const IPV4_RE = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;

export function normalizeHost(raw: string): string {
  return raw.trim().toLowerCase().replace(/^[a-z]+:\/\//, "").replace(/\/.*$/, "").replace(/:\d+$/, "");
}

export function parseServerForm(fd: FormData, existing?: Existing): ParseResult {
  const name = str(fd, "name").replace(/\s+/g, " ");
  if (name.length < 3 || name.length > 60) return { ok: false, error: "Nama server 3-60 karakter." };

  const typeRaw = str(fd, "serverType");
  const serverType = (SERVER_TYPES as readonly string[]).includes(typeRaw) ? (typeRaw as ServerFormData["serverType"]) : "SERVER";
  const platformRaw = str(fd, "platform");
  const platform = (PLATFORMS as readonly string[]).includes(platformRaw) ? (platformRaw as ServerFormData["platform"]) : "CROSSPLAY";

  let realmCode = "";
  let ipAddress: string;
  let srvPort: number;
  if (serverType === "REALM") {
    realmCode = str(fd, "realmCode").replace(/^https?:\/\/(www\.)?realms\.gg\//i, "").replace(/\/+$/, "");
    if (!/^[A-Za-z0-9_-]{3,40}$/.test(realmCode)) return { ok: false, error: "Kode Realm tidak valid. Tempel link realms.gg atau kodenya saja." };
    ipAddress = `realms.gg/${realmCode}`;
    srvPort = 19132;
  } else {
    ipAddress = normalizeHost(str(fd, "ipAddress") || existing?.ipAddress || "");
    if (!HOST_RE.test(ipAddress) && !IPV4_RE.test(ipAddress)) {
      return { ok: false, error: "IP atau domain server tidak valid. Contoh: play.servermu.id atau 103.10.20.30" };
    }
    srvPort = port(str(fd, "port"), platform === "BEDROCK" ? 19132 : 25565);
  }
  const bedrockPort = port(str(fd, "bedrockPort"), existing?.bedrockPort || 19132);

  const description = str(fd, "description");
  if (description.length < 20) return { ok: false, error: "Deskripsi minimal 20 karakter, ceritakan servermu." };
  if (description.length > 8000) return { ok: false, error: "Deskripsi maksimal 8000 karakter." };

  const tags = Array.from(
    new Set(
      str(fd, "tags")
        .split(",")
        .map((t) => t.trim().slice(0, 24))
        .filter(Boolean)
    )
  ).slice(0, 8);

  const videoUrl = str(fd, "videoUrl") || existing?.videoUrl || "";
  if (!isHttpUrl(videoUrl)) return { ok: false, error: "Trailer wajib: upload video atau tempel link YouTube." };

  const logoUrl = str(fd, "logoUrl") || existing?.logoUrl || "";
  const bannerUrl = str(fd, "bannerUrl") || existing?.bannerUrl || "";
  for (const [label, url] of [["Logo", logoUrl], ["Banner", bannerUrl]] as const) {
    if (url && !isHttpUrl(url)) return { ok: false, error: `${label} harus berupa link gambar (https://...).` };
  }

  const galleryRaw = str(fd, "galleryUrls");
  const galleryUrls = galleryRaw
    ? galleryRaw.split(",").map((u) => u.trim()).filter(isHttpUrl).slice(0, 12)
    : existing?.galleryUrls || [];

  const socialLinks = {
    discord: str(fd, "discordUrl"),
    whatsapp: str(fd, "whatsappUrl"),
    telegram: str(fd, "telegramUrl"),
    website: str(fd, "websiteUrl"),
  };
  for (const [key, url] of Object.entries(socialLinks)) {
    if (url && !isHttpUrl(url)) return { ok: false, error: `Link ${key} harus diawali https://` };
  }

  const ownerWhatsApp = str(fd, "ownerWhatsApp").replace(/[\s-]/g, "");
  if (!/^\+?\d{8,16}$/.test(ownerWhatsApp)) {
    return { ok: false, error: "Nomor WhatsApp owner tidak valid. Contoh: 081234567890 atau +6281234567890" };
  }

  return {
    ok: true,
    data: {
      name, serverType, platform, realmCode, ipAddress, port: srvPort, bedrockPort, description, tags,
      videoUrl, logoUrl, bannerUrl, galleryUrls, ownerWhatsApp, socialLinks,
    },
  };
}
