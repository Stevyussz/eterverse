"use client";

import { useState } from "react";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { ListingTypePicker } from "@/components/dashboard/ListingTypePicker";
import { toast } from "sonner";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { VideoUploader } from "@/components/ui/VideoUploader";
import { MarkdownTextarea } from "@/components/ui/MarkdownTextarea";

interface ServerData {
  name: string;
  serverType?: "SERVER" | "REALM";
  platform?: "JAVA" | "BEDROCK" | "CROSSPLAY";
  realmCode?: string;
  ipAddress: string;
  port: number;
  bedrockPort?: number;
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

export function ServerEditForm({ action, server }: { action: (formData: FormData) => Promise<{ error: string } | void>; server: ServerData }) {
  const [isPending, setIsPending] = useState(false);
  const [serverType, setServerType] = useState<"SERVER" | "REALM">(server.serverType || "SERVER");
  const [platform, setPlatform] = useState<"JAVA" | "BEDROCK" | "CROSSPLAY">(server.platform || "CROSSPLAY");

  return (
    <form
      action={async (formData) => {
        setIsPending(true);
        try {
          const result = await action(formData);
          // Validation problems come back as a message (thrown errors are hidden in production).
          if (result?.error) {
            toast.error(result.error);
            setIsPending(false);
            return;
          }
          toast.success("Perubahan listing berhasil disimpan! Status dikembalikan ke peninjauan.");
        } catch (e: any) {
          console.error(e);
          toast.error(e.message || "Gagal memperbarui listing");
          setIsPending(false);
        }
      }}
      className="flex flex-col gap-6"
    >
      <input type="hidden" name="serverType" value={serverType} />
      <input type="hidden" name="platform" value={platform} />

      <ListingTypePicker serverType={serverType} platform={platform} onType={setServerType} onPlatform={setPlatform} />

      <div className="flex flex-col gap-2">
        <label className="px-label">
          {serverType === "REALM" ? "Nama Realm" : "Nama Server"}
        </label>
        <input name="name" required type="text" defaultValue={server.name} className="px-input" />
      </div>

      {serverType === "SERVER" ? (
        <div className="flex flex-col gap-4">
          {platform === "CROSSPLAY" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2 sm:col-span-1">
                <label className="px-label">Alamat IP / Domain</label>
                <input name="ipAddress" required defaultValue={server.ipAddress} type="text" className="px-input" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="px-label">Port Java</label>
                <input name="port" type="number" defaultValue={server.port || 25565} className="px-input" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="px-label">Port Bedrock (MCPE)</label>
                <input name="bedrockPort" type="number" defaultValue={server.bedrockPort || 19132} className="px-input" />
              </div>
            </div>
          )}

          {platform === "JAVA" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="px-label">Alamat IP Java</label>
                <input name="ipAddress" required defaultValue={server.ipAddress} type="text" className="px-input" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="px-label">Port Java (Default: 25565)</label>
                <input name="port" type="number" defaultValue={server.port || 25565} className="px-input" />
              </div>
            </div>
          )}

          {platform === "BEDROCK" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="px-label">Alamat IP Bedrock</label>
                <input name="ipAddress" required defaultValue={server.ipAddress} type="text" className="px-input" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="px-label">Port Bedrock (Default: 19132)</label>
                <input name="port" type="number" defaultValue={server.port || 19132} className="px-input" />
              </div>
            </div>
          )}

          <div className="px-note px-note-info text-sm">
            <PixelIcon name="gift" size={16} className="text-lapis shrink-0 mt-0.5" />
            <span>
              Hadiah vote in-game (NuVotifier) bisa disambungkan setelah server tayang, di{" "}
              <a href="/dashboard/tools/votifier" className="underline underline-offset-4 font-semibold">Dashboard, Hadiah Vote</a>.
            </span>
          </div>

          {/* Owner WhatsApp */}
          <div className="flex flex-col gap-2">
            <label className="px-label flex items-center justify-between gap-2">
              <span>Nomor WhatsApp Owner</span>
              <span className="px-chip !text-[11px] !py-0">Rahasia (Hanya untuk Admin)</span>
            </label>
            <input name="ownerWhatsApp" required type="text" defaultValue={server.ownerWhatsApp || ""} pattern="^62[0-9]{8,14}$" title="Awali dengan 62 tanpa spasi/simbol (contoh: 628123456789)" className="px-input" placeholder="628123456..." />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="px-label flex items-center justify-between gap-2">
              <span>Kode Undangan Realm / Invite Link</span>
              <span className="font-mono text-xs text-ink-2">realms.gg/...</span>
            </label>
            <input 
              name="realmCode" 
              required={serverType === "REALM"} 
              type="text" 
              defaultValue={server.realmCode || ""} 
              className="px-input" 
              placeholder="Contoh: AB12cdEfGhI atau https://realms.gg/AB12cdEfGhI" 
            />
            <p className="px-help">
              Temukan kode ini di Minecraft: <span className="text-ink font-semibold">Realms → Kelola Realm → Tautan Undangan</span>.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="px-label flex items-center justify-between gap-2">
              <span>Nomor WA (Owner)</span>
              <span className="px-chip !text-[11px] !py-0">Rahasia</span>
            </label>
            <input name="ownerWhatsApp" required type="text" defaultValue={server.ownerWhatsApp || ""} pattern="^62[0-9]{8,14}$" title="Awali dengan 62 tanpa spasi/simbol (contoh: 628123456789)" className="px-input" placeholder="628123456..." />
          </div>
        </div>
      )}

      {/* Visual Identity */}
      <div className="px-flat p-5 sm:p-6 flex flex-col gap-4">
        <h3 className="px-title text-lg text-ink">Identitas Visual & Branding</h3>
        <p className="text-sm text-ink-2 -mt-2">Unggah gambar baru atau biarkan kosong untuk mempertahankan gambar lama.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageUploader name="logoUrl" label="Logo Server (Persegi 1:1)" aspectRatio="square" defaultValue={server.logoUrl} />
          <ImageUploader name="bannerUrl" label="Banner Utama (Landscape 16:9)" aspectRatio="video" defaultValue={server.bannerUrl} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="px-label flex items-center justify-between gap-2">
          <span>{serverType === "REALM" ? "Deskripsi Realm" : "Deskripsi Server"}</span>
          <span className="px-chip !text-[11px] !py-0">Format Markdown</span>
        </label>
        <MarkdownTextarea name="description" required defaultValue={server.description} placeholder="Tulis deskripsi server Anda dengan memukau..." />
      </div>

      <div className="flex flex-col gap-2">
        <label className="px-label">Kategori / Tags (Pisahkan dengan koma)</label>
        <input name="tags" required type="text" defaultValue={server.tags?.join(", ")} className="px-input" />
      </div>

      <div className="px-flat p-5 sm:p-6 flex flex-col gap-4">
        <h3 className="px-title text-lg text-ink flex items-center gap-2">
          Cuplikan Video Trailer
        </h3>
        <p className="text-sm text-ink-2 -mt-2">Unggah video trailer (.mp4, maks 50MB) atau tautan YouTube untuk tampil di profil server.</p>
        <VideoUploader name="videoUrl" defaultValue={server.videoUrl} />
      </div>

      <div className="px-flat p-5 sm:p-6 flex flex-col gap-4">
        <ImageUploader name="galleryUrls" label="Galeri Screenshot Gameplay (Bisa Lebih dari 1)" isGallery={true} defaultValue={server.galleryUrls?.join(",")} />
      </div>

      {/* Community Links */}
      <div className="px-flat p-5 sm:p-6 flex flex-col gap-4">
        <h3 className="px-title text-lg text-ink">Komunitas & Media Sosial (Opsional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "discordUrl", label: "Tautan Undangan Discord", placeholder: "https://discord.gg/...", defaultValue: server.socialLinks?.discord },
            { name: "whatsappUrl", label: "Tautan Grup WhatsApp", placeholder: "https://chat.whatsapp.com/...", defaultValue: server.socialLinks?.whatsapp },
            { name: "telegramUrl", label: "Tautan Grup Telegram", placeholder: "https://t.me/...", defaultValue: server.socialLinks?.telegram },
            { name: "websiteUrl", label: "Alamat Website Resmi", placeholder: "https://namaserver.com", defaultValue: server.socialLinks?.website },
          ].map(field => (
            <div key={field.name} className="flex flex-col gap-2">
              <label className="px-label">{field.label}</label>
              <input name={field.name} type="url" defaultValue={field.defaultValue || ""} placeholder={field.placeholder} className="px-input" />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-btn px-btn-gold px-btn-block mt-2 !min-h-[52px]"
      >
        {isPending && <PixelIcon name="refresh" size={16} className="px-spin" />}
        {isPending ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
