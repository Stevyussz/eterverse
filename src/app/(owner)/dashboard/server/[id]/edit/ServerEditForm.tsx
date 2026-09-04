"use client";

import { useState } from "react";
import { Spinner } from "@phosphor-icons/react";
import { toast } from "sonner";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { VideoUploader } from "@/components/ui/VideoUploader";
import { MarkdownTextarea } from "@/components/ui/MarkdownTextarea";

interface ServerData {
  name: string;
  ipAddress: string;
  port: number;
  description: string;
  tags: string[];
  videoUrl: string;
  logoUrl?: string;
  bannerUrl?: string;
  galleryUrls?: string[];
  ownerWhatsApp?: string;
  socialLinks?: {
    discord?: string;
    whatsapp?: string;
    telegram?: string;
    website?: string;
  };
}

export function ServerEditForm({ action, server }: { action: (formData: FormData) => Promise<void>; server: ServerData }) {
  const [isPending, setIsPending] = useState(false);

  return (
    <form
      action={async (formData) => {
        setIsPending(true);
        try {
          await action(formData);
          toast.success("Server updated! It will be re-reviewed by our team.");
        } catch (e: any) {
          console.error(e);
          toast.error(e.message || "Failed to update server");
          setIsPending(false);
        }
      }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Server Name</label>
        <input name="name" required type="text" defaultValue={server.name} className="bg-black/50 border border-white/10 rounded-sm px-4 py-2.5 text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">IP Address</label>
          <input name="ipAddress" required defaultValue={server.ipAddress} type="text" className="bg-black/50 border border-white/10 rounded-sm px-4 py-2.5 text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Port</label>
          <input name="port" type="number" defaultValue={server.port} className="bg-black/50 border border-white/10 rounded-sm px-4 py-2.5 text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center justify-between">
            <span>Nomor WA (Owner)</span>
            <span className="bg-white/5 text-zinc-400 px-2 py-0.5 rounded-sm text-[10px]">Rahasia</span>
          </label>
          <input name="ownerWhatsApp" required type="text" defaultValue={server.ownerWhatsApp || ""} pattern="^62[0-9]{8,14}$" title="Awali dengan 62 tanpa spasi/simbol (contoh: 628123456789)" className="bg-black/50 border border-white/10 rounded-sm px-4 py-2.5 text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors" placeholder="628123456..." />
        </div>
      </div>

      {/* Visual Identity */}
      <div className="flex flex-col gap-4 p-6 border border-white/10 rounded-sm bg-white/[0.01]">
        <h3 className="text-sm font-display font-medium text-eter-starlight">Visual Identity</h3>
        <p className="text-xs text-zinc-500 mb-2">Upload new images or leave blank to keep existing ones.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageUploader name="logoUrl" label="Server Logo (Square)" aspectRatio="square" defaultValue={server.logoUrl} />
          <ImageUploader name="bannerUrl" label="Hero Banner (Wide)" aspectRatio="video" defaultValue={server.bannerUrl} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center justify-between">
          <span>Description</span>
          <span className="bg-eter-cyan/10 text-eter-cyan px-2 py-0.5 rounded-sm text-[10px] font-semibold">Rich Text</span>
        </label>
        <MarkdownTextarea name="description" required defaultValue={server.description} placeholder="Tulis deskripsi server Anda dengan memukau..." />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Tags (Comma separated)</label>
        <input name="tags" required type="text" defaultValue={server.tags?.join(", ")} className="bg-black/50 border border-white/10 rounded-sm px-4 py-2.5 text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors" />
      </div>

      <div className="flex flex-col gap-4 p-6 border border-white/10 rounded-sm bg-white/[0.01]">
        <h3 className="text-sm font-display font-medium text-eter-starlight flex items-center gap-2">
          Trailer Video
        </h3>
        <p className="text-xs text-zinc-500 font-body mb-2">Upload trailer server Anda (.mp4, max 50MB) untuk tampil memukau.</p>
        <VideoUploader name="videoUrl" defaultValue={server.videoUrl} />
      </div>

      <div className="flex flex-col gap-4 p-6 border border-white/10 rounded-sm bg-white/[0.01]">
        <ImageUploader name="galleryUrls" label="Gallery Screenshots (Multiple)" isGallery={true} defaultValue={server.galleryUrls?.join(",")} />
      </div>

      {/* Community Links */}
      <div className="flex flex-col gap-4 p-6 border border-white/10 rounded-sm bg-white/[0.01]">
        <h3 className="text-sm font-display font-medium text-eter-starlight">Community Hub (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "discordUrl", label: "Discord Invite URL", placeholder: "https://discord.gg/...", defaultValue: server.socialLinks?.discord },
            { name: "whatsappUrl", label: "WhatsApp Group URL", placeholder: "https://chat.whatsapp.com/...", defaultValue: server.socialLinks?.whatsapp },
            { name: "telegramUrl", label: "Telegram Group URL", placeholder: "https://t.me/...", defaultValue: server.socialLinks?.telegram },
            { name: "websiteUrl", label: "Website URL", placeholder: "https://yourserver.com", defaultValue: server.socialLinks?.website },
          ].map(field => (
            <div key={field.name} className="flex flex-col gap-2">
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{field.label}</label>
              <input name={field.name} type="url" defaultValue={field.defaultValue || ""} placeholder={field.placeholder} className="bg-black/50 border border-white/10 rounded-sm px-4 py-2 text-sm text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors" />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 bg-eter-cyan text-black font-semibold px-6 py-3 rounded-sm hover:bg-cyan-300 transition-colors border-l-2 border-l-white border-y border-r border-transparent flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isPending && <Spinner className="animate-spin" size={20} />}
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
