import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import { pingServer } from "@/lib/mc-status";
import { Server } from "@/models/Server";
import { ServerPing } from "@/models/ServerPing";

export const STALE_AFTER_MS = 5 * 60 * 1000;

// Day buckets follow WIB (UTC+7) so "today" on the chart matches the player's calendar.
export function wibDay(d: Date): string {
  return new Date(d.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

interface PingTarget {
  _id: mongoose.Types.ObjectId | string;
  ipAddress: string;
  port?: number;
  platform?: string;
  serverType?: string;
}

/** Pings one server, stores the result on the server and in the 8-day history. */
export async function checkAndStore(target: PingTarget) {
  if (target.serverType === "REALM") return null; // Realms expose no status endpoint
  const status = await pingServer({ host: target.ipAddress, port: target.port, platform: target.platform });
  const now = new Date();
  await Promise.all([
    Server.updateOne(
      { _id: target._id },
      {
        $set: {
          "liveStatus.isOnline": status.online,
          "liveStatus.currentPlayers": status.players,
          "liveStatus.maxPlayers": status.maxPlayers,
          // Keep the last known version while offline instead of blanking the badge.
          ...(status.version && { "liveStatus.version": status.version }),
          "liveStatus.lastChecked": now,
        },
      }
    ),
    ServerPing.create({ serverId: target._id, at: now, online: status.online, players: status.players }),
  ]);
  return status;
}

/**
 * Called after a server page responds. The daily cron alone left "online" figures up to
 * 24h old; this refreshes any viewed server whose status is older than 5 minutes.
 * The conditional update claims the slot so simultaneous visitors trigger one ping.
 */
export async function refreshIfStale(serverId: string) {
  await connectToDatabase();
  const cutoff = new Date(Date.now() - STALE_AFTER_MS);
  const claimed = await Server.findOneAndUpdate(
    {
      _id: serverId,
      moderationStatus: "APPROVED",
      serverType: { $ne: "REALM" },
      $or: [{ "liveStatus.lastChecked": { $lt: cutoff } }, { "liveStatus.lastChecked": { $exists: false } }],
    },
    { $set: { "liveStatus.lastChecked": new Date() } },
    { new: false }
  )
    .select("_id ipAddress port platform serverType")
    .lean();
  if (!claimed) return null;
  return checkAndStore(claimed as PingTarget);
}

export interface UptimeSummary {
  checks: number;
  uptimePct: number | null;
  peakPlayers: number;
  /** Max players per day, oldest first, 7 entries (null = no check that day). */
  daily: { day: string; players: number | null }[];
}

export async function getUptimeSummary(serverId: string): Promise<UptimeSummary> {
  await connectToDatabase();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const pings = await ServerPing.find({ serverId, at: { $gte: since } }).select("at online players").lean();

  const days: { day: string; players: number | null }[] = [];
  for (let i = 6; i >= 0; i--) {
    days.push({ day: wibDay(new Date(Date.now() - i * 24 * 60 * 60 * 1000)), players: null });
  }
  const byDay = new Map(days.map((d) => [d.day, d]));
  let online = 0;
  let peak = 0;
  for (const p of pings) {
    if (p.online) online++;
    peak = Math.max(peak, p.players || 0);
    const slot = byDay.get(wibDay(new Date(p.at)));
    if (slot) slot.players = Math.max(slot.players ?? 0, p.players || 0);
  }

  return {
    checks: pings.length,
    uptimePct: pings.length ? Math.round((online / pings.length) * 1000) / 10 : null,
    peakPlayers: peak,
    daily: days,
  };
}
