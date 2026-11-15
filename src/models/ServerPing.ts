import mongoose, { Schema, Model } from "mongoose";

// One row per status check, kept 8 days, for the uptime figure and 7-day player chart.
// Checks happen at most every 5 minutes per server (on page view) plus the daily cron,
// so a busy server tops out near 2,300 rows per week.
export interface IServerPing {
  serverId: mongoose.Types.ObjectId;
  at: Date;
  online: boolean;
  players: number;
}

const ServerPingSchema = new Schema<IServerPing>({
  serverId: { type: Schema.Types.ObjectId, ref: "Server", required: true },
  at: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 8 },
  online: { type: Boolean, required: true },
  players: { type: Number, default: 0 },
});

ServerPingSchema.index({ serverId: 1, at: -1 });

export const ServerPing: Model<IServerPing> =
  mongoose.models.ServerPing || mongoose.model<IServerPing>("ServerPing", ServerPingSchema);
