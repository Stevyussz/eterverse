import connectToDatabase from "@/lib/db";
import { RateLimit } from "@/models/RateLimit";

export interface RateLimitResult {
  ok: boolean;
  count: number;
  retryAfterSec: number;
}

/**
 * Counts one hit for `key` in the current fixed window and reports whether it is within `limit`.
 * Fails open on database errors: a limiter outage must not take voting or search down.
 */
export async function rateLimit(key: string, limit: number, windowSec: number): Promise<RateLimitResult> {
  const now = Date.now();
  const windowMs = windowSec * 1000;
  const bucket = Math.floor(now / windowMs);
  const windowEnd = (bucket + 1) * windowMs;
  const bucketKey = `${key}:${bucket}`;
  const retryAfterSec = Math.max(1, Math.ceil((windowEnd - now) / 1000));

  try {
    await connectToDatabase();
    const doc = await hit(bucketKey, windowEnd);
    const count = doc?.count ?? 1;
    return { ok: count <= limit, count, retryAfterSec };
  } catch (err) {
    console.error("rateLimit error:", err);
    return { ok: true, count: 0, retryAfterSec };
  }
}

async function hit(bucketKey: string, windowEnd: number) {
  const update = { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(windowEnd) } };
  try {
    return await RateLimit.findOneAndUpdate({ key: bucketKey }, update, { upsert: true, new: true }).lean();
  } catch (err: unknown) {
    // Two concurrent upserts on a fresh key: one wins the insert, the retry increments it.
    if ((err as { code?: number })?.code === 11000) {
      return await RateLimit.findOneAndUpdate({ key: bucketKey }, update, { new: true }).lean();
    }
    throw err;
  }
}

export function getClientIp(headersList: Headers): string {
  // Vercel sets x-real-ip itself; x-forwarded-for's first hop is the client.
  const real = headersList.get("x-real-ip");
  if (real) return real.trim();
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
