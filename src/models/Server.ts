import mongoose, { Schema, Document, Model } from "mongoose";
import { slugify } from "@/utils/slugify";

export interface IServer extends Document {
  name: string;
  slug: string;
  serverType: 'SERVER' | 'REALM';
  realmCode?: string;
  description: string;
  ipAddress: string;
  port: number;
  videoUrl: string;
  logoUrl?: string;
  bannerUrl?: string;
  galleryUrls?: string[];
  tags: string[];
  isEterShopPartner: boolean;
  socialLinks: {
    discord?: string;
    whatsapp?: string;
    telegram?: string;
    website?: string;
  };
  moderationStatus: 'PENDING' | 'APPROVED' | 'BANNED' | 'REJECTED';
  rejectionReason?: string;
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
  ownerWhatsApp: string;
  createdAt: Date;
}

const ServerSchema = new Schema<IServer>({
  name: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  serverType: { type: String, enum: ['SERVER', 'REALM'], default: 'SERVER' },
  realmCode: { type: String, default: "" },
  description: { type: String, required: true },
  ipAddress: { type: String, required: true },
  port: { type: Number, default: 25565 },
  videoUrl: { type: String, required: true },
  logoUrl: { type: String, default: "" },
  bannerUrl: { type: String, default: "" },
  galleryUrls: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  isEterShopPartner: { type: Boolean, default: false },
  socialLinks: {
    discord: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    telegram: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  moderationStatus: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'BANNED'],
    default: 'PENDING',
  },
  rejectionReason: { type: String, default: "" },
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
  ownerWhatsApp: { type: String, required: true },
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
