import mongoose, { Schema, Model } from "mongoose";

// Fixed-window counters. Upstash is in the blueprint but not configured, so this keeps
// abuse limits working on serverless with only MongoDB. Mongo's TTL monitor deletes
// expired windows (it runs about once a minute, so a window may outlive expiresAt slightly).
export interface IRateLimit {
  key: string;
  count: number;
  expiresAt: Date;
}

const RateLimitSchema = new Schema<IRateLimit>({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, expires: 0 },
});

export const RateLimit: Model<IRateLimit> =
  mongoose.models.RateLimit || mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);
