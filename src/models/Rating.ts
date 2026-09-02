import mongoose, { Schema, Document, Model } from "mongoose";

// One rating per user per server, stored permanently
export interface IRating extends Document {
  serverId: mongoose.Types.ObjectId;
  userId: string;
  stars: number; // 1-5
  createdAt: Date;
}

const RatingSchema = new Schema<IRating>({
  serverId: { type: Schema.Types.ObjectId, ref: 'Server', required: true, index: true },
  userId: { type: String, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
});

// One rating per user per server
RatingSchema.index({ serverId: 1, userId: 1 }, { unique: true });

export const Rating: Model<IRating> =
  mongoose.models.Rating || mongoose.model<IRating>("Rating", RatingSchema);
