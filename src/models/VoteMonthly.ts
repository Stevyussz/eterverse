import mongoose, { Schema, Model } from "mongoose";

// Monthly vote totals for the leaderboard. Individual votes expire after 24h (TTL), so
// without this there is no history to rank a month by. Counting starts when this ships.
export interface IVoteMonthly {
  serverId: mongoose.Types.ObjectId;
  /** WIB calendar month, "YYYY-MM". */
  month: string;
  votes: number;
}

const VoteMonthlySchema = new Schema<IVoteMonthly>({
  serverId: { type: Schema.Types.ObjectId, ref: "Server", required: true },
  month: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

VoteMonthlySchema.index({ serverId: 1, month: 1 }, { unique: true });
VoteMonthlySchema.index({ month: 1, votes: -1 });

export const VoteMonthly: Model<IVoteMonthly> =
  mongoose.models.VoteMonthly || mongoose.model<IVoteMonthly>("VoteMonthly", VoteMonthlySchema);

/** "YYYY-MM" in Indonesian Western Time, so the month flips at midnight WIB. */
export function wibMonth(d = new Date(), offsetMonths = 0): string {
  const wib = new Date(d.getTime() + 7 * 60 * 60 * 1000);
  const shifted = new Date(Date.UTC(wib.getUTCFullYear(), wib.getUTCMonth() + offsetMonths, 1));
  return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}`;
}
