import mongoose, { Schema, Document, Model } from "mongoose";

// One vote per server per account per 24h. IP-only uniqueness blocked whole neighbourhoods
// on Indonesian mobile carriers (CGNAT shares one IP across many players) while VPN users
// could still vote repeatedly, so votes now require login. IP is kept for abuse limits.
export interface IVote extends Document {
  serverId: mongoose.Types.ObjectId;
  userId?: string;
  ipAddress: string;
  createdAt: Date;
}

const VoteSchema = new Schema<IVote>({
  serverId: { type: Schema.Types.ObjectId, ref: 'Server', required: true, index: true },
  userId: { type: String, default: "" },
  ipAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // TTL: auto-delete after 24h
});

// Partial: legacy guest votes (userId "") would otherwise collide while the index builds.
VoteSchema.index(
  { serverId: 1, userId: 1 },
  { unique: true, partialFilterExpression: { userId: { $type: "string", $gt: "" } } }
);

export const Vote: Model<IVote> =
  mongoose.models.Vote || mongoose.model<IVote>("Vote", VoteSchema);

let indexesReady: Promise<void> | null = null;

// The old { serverId, ipAddress } unique index lives on in Atlas until dropped. Runs once
// per server instance; missing index or missing permissions are both fine to ignore.
export function ensureVoteIndexes(): Promise<void> {
  if (!indexesReady) {
    indexesReady = (async () => {
      await Vote.collection.dropIndex("serverId_1_ipAddress_1").catch(() => {});
      await Vote.createIndexes().catch((err) => console.error("Vote index build failed:", err));
    })();
  }
  return indexesReady;
}
