import mongoose, { Schema, Document, Model } from "mongoose";
import { slugify } from "@/utils/slugify";

export interface IServer extends Document {
  name: string;
  slug: string;
  description: string;
  ipAddress: string;
  port: number;
  videoUrl: string;
  tags: string[];
  isEterShopPartner: boolean;
  moderationStatus: 'PENDING' | 'APPROVED' | 'BANNED';
  metrics: {
    impressions: number;
    clicks: number;
    votes: number;
    rating: number;
  };
  liveStatus: {
    isOnline: boolean;
    currentPlayers: number;
    maxPlayers: number;
    lastChecked: Date;
  };
  ownerId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ServerSchema = new Schema<IServer>({
  name: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  description: { type: String, required: true },
  ipAddress: { type: String, required: true },
  port: { type: Number, default: 25565 },
  videoUrl: { type: String, required: true },
  tags: { type: [String], default: [] },
  isEterShopPartner: { type: Boolean, default: false },
  moderationStatus: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'BANNED'],
    default: 'PENDING',
  },
  metrics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    votes: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
  liveStatus: {
    isOnline: { type: Boolean, default: false },
    currentPlayers: { type: Number, default: 0 },
    maxPlayers: { type: Number, default: 0 },
    lastChecked: { type: Date, default: Date.now },
  },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to automatically generate slug from name
ServerSchema.pre("save", async function () {
  if (this.isModified("name") || !this.slug) {
    this.slug = slugify(this.name);
  }
});

export const Server: Model<IServer> =
  mongoose.models.Server || mongoose.model<IServer>("Server", ServerSchema);
