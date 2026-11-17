import { unstable_cache, revalidateTag } from "next/cache";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";

export interface ServerCardData {
  _id: string;
  ownerId?: string;
  name: string;
  slug: string;
  description?: string;
  serverType?: "SERVER" | "REALM";
  platform?: "JAVA" | "BEDROCK" | "CROSSPLAY";
  videoUrl?: string;
  bannerUrl?: string;
  logoUrl?: string;
  isEterShopPartner?: boolean;
  onlinePlayers: number;
  maxPlayers: number;
  votes: number;
  rating: number;
  tags?: string[];
  isOnline: boolean;
  /** Address players type into Minecraft: "host", "host:port", or the Realm code. */
  address: string;
}

export function displayAddress(s: { serverType?: string; ipAddress?: string; port?: number; realmCode?: string }): string {
  if (s.serverType === "REALM") return String(s.realmCode || "").replace(/^https?:\/\/realms\.gg\//, "");
  const host = s.ipAddress || "";
  return s.port && s.port !== 25565 && s.port !== 19132 ? `${host}:${s.port}` : host;
}

// Only the fields cards and the hero render. Full documents (gallery, long markdown,
// votifier config) were being serialized into the homepage payload.
// Every public list (homepage, discover, matchmaker) must go through these two: a raw lean()
// document carries the owner's private ownerWhatsApp into the HTML and API responses.
export const CARD_FIELDS =
  "name slug description serverType platform videoUrl bannerUrl logoUrl isEterShopPartner liveStatus metrics tags ownerId createdAt ipAddress port realmCode";

export function toCard(s: any): ServerCardData {
  return {
    _id: s._id.toString(),
    ownerId: s.ownerId?.toString(),
    name: s.name,
    slug: s.slug,
    description: s.description,
    serverType: s.serverType,
    platform: s.platform,
    videoUrl: s.videoUrl,
    bannerUrl: s.bannerUrl,
    logoUrl: s.logoUrl || "",
    isEterShopPartner: !!s.isEterShopPartner,
    onlinePlayers: s.liveStatus?.currentPlayers || 0,
    maxPlayers: s.liveStatus?.maxPlayers || 0,
    votes: s.metrics?.votes || 0,
    rating: s.metrics?.rating || 0,
    tags: Array.isArray(s.tags) ? s.tags : [],
    isOnline: !!s.liveStatus?.isOnline,
    address: displayAddress(s),
  };
}

/**
 * Call from every server action that approves, bans, edits or deletes a server, so the
 * cached homepage drops it immediately instead of after the 60s window. expire: 0 makes the
 * next visit refetch rather than serve the stale list (a banned server must vanish).
 */
export function invalidateServerLists() {
  revalidateTag("servers", { expire: 0 });
}

export interface HomeData {
  totalApproved: number;
  /** Live figures from the last status checks; shown as-is, never rounded up. */
  onlineServers: number;
  playersOnline: number;
  trending: ServerCardData[];
  topRated: ServerCardData[];
  newest: ServerCardData[];
  partners: ServerCardData[];
}

// Cached for 60s: the homepage ran 3 Mongo queries on every single visit.
// Vote counts on the homepage may lag up to a minute; the server page stays live.
export const getHomeData = unstable_cache(
  async (): Promise<HomeData> => {
    await connectToDatabase();
    const approved = { moderationStatus: "APPROVED" as const };

    const [totalApproved, live, trending, topRated, newest, partners] = await Promise.all([
      Server.countDocuments(approved),
      Server.aggregate<{ servers: number; players: number }>([
        { $match: { ...approved, "liveStatus.isOnline": true } },
        { $group: { _id: null, servers: { $sum: 1 }, players: { $sum: "$liveStatus.currentPlayers" } } },
      ]),
      Server.find(approved).sort({ "metrics.votes": -1 }).limit(8).select(CARD_FIELDS).lean(),
      Server.find(approved).sort({ "metrics.rating": -1 }).limit(4).select(CARD_FIELDS).lean(),
      Server.find(approved).sort({ createdAt: -1 }).limit(4).select(CARD_FIELDS).lean(),
      Server.find({ ...approved, isEterShopPartner: true })
        .sort({ "metrics.votes": -1 })
        .limit(5)
        .select(CARD_FIELDS)
        .lean(),
    ]);

    return {
      totalApproved,
      onlineServers: live[0]?.servers ?? 0,
      playersOnline: live[0]?.players ?? 0,
      trending: trending.map(toCard),
      topRated: topRated.map(toCard),
      newest: newest.map(toCard),
      partners: partners.map(toCard),
    };
  },
  ["home-data-v3"],
  { revalidate: 60, tags: ["servers"] }
);
