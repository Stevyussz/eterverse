import mongoose, { Schema, Model } from "mongoose";

export interface IFavorite {
  userId: string;
  serverId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>({
  userId: { type: String, required: true },
  serverId: { type: Schema.Types.ObjectId, ref: "Server", required: true },
  createdAt: { type: Date, default: Date.now },
});

FavoriteSchema.index({ userId: 1, serverId: 1 }, { unique: true });
FavoriteSchema.index({ userId: 1, createdAt: -1 });

export const Favorite: Model<IFavorite> =
  mongoose.models.Favorite || mongoose.model<IFavorite>("Favorite", FavoriteSchema);

export const MAX_FAVORITES = 100;
