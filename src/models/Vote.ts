import mongoose, { Schema, Document, Model } from "mongoose";

// A single vote is tied to a user IP (for guests) or userId (for logged in)
// One vote per server per user per 24h
export interface IVote extends Document {
  serverId: mongoose.Types.ObjectId;
  userId?: string;       // session user id if logged in
  ipAddress: string;    // fallback for rate-limiting
  createdAt: Date;
}

const VoteSchema = new Schema<IVote>({
  serverId: { type: Schema.Types.ObjectId, ref: 'Server', required: true, index: true },
  userId: { type: String, default: "" },
  ipAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // TTL: auto-delete after 24h
});

// Compound index to prevent duplicate votes within the TTL window
VoteSchema.index({ serverId: 1, ipAddress: 1 }, { unique: true });

export const Vote: Model<IVote> =
  mongoose.models.Vote || mongoose.model<IVote>("Vote", VoteSchema);
