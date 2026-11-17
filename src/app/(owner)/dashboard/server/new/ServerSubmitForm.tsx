"use client";

import { useState } from "react";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { ListingTypePicker } from "@/components/dashboard/ListingTypePicker";
import { toast } from "sonner";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { VideoUploader } from "@/components/ui/VideoUploader";
import { MarkdownTextarea } from "@/components/ui/MarkdownTextarea";

export function ServerSubmitForm({ action }: { action: (formData: FormData) => Promise<{ error: string } | void> }) {
  const [isPending, setIsPending] = useState(false);
  const [serverType, setServerType] = useState<"SERVER" | "REALM">("SERVER");
  const [platform, setPlatform] = useState<"JAVA" | "BEDROCK" | "CROSSPLAY">("CROSSPLAY");

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
          toast.success(
            serverType === "REALM" 
              ? "Realm berhasil didaftarkan dan menunggu peninjauan!" 
              : "Server berhasil didaftarkan dan menunggu peninjauan!"
          );
        } catch (e: any) {
          console.error(e);
          toast.error(e.message || "Gagal mendaftarkan listing");
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
        <input 
          name="name" 
          required 
          type="text" 
          className="px-input" 
          placeholder={serverType === "REALM" ? "Contoh: Nusantara Realm SMP" : "Contoh: Nusantara SMP"} 
        />
      </div>

      {serverType === "SERVER" ? (
        <div className="flex flex-col gap-4">
          {/* Connection Details Based on Platform */}
          {platform === "CROSSPLAY" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2 sm:col-span-1">
                <label className="px-label">Alamat IP / Domain</label>
                <input name="ipAddress" required type="text" className="px-input" placeholder="play.nusantara.net" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="px-label">Port Java</label>
                <input name="port" type="number" defaultValue={25565} className="px-input" placeholder="25565" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="px-label">Port Bedrock (MCPE)</label>
                <input name="bedrockPort" type="number" defaultValue={19132} className="px-input" placeholder="19132" />
              </div>
            </div>
          )}

          {platform === "JAVA" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="px-label">Alamat IP Java</label>
                <input name="ipAddress" required type="text" className="px-input" placeholder="play.nusantara.net" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="px-label">Port Java (Default: 25565)</label>
                <input name="port" type="number" defaultValue={25565} className="px-input" placeholder="25565" />
              </div>
            </div>
          )}

          {platform === "BEDROCK" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="px-label">Alamat IP Bedrock</label>
                <input name="ipAddress" required type="text" className="px-input" placeholder="pe.nusantara.net" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="px-label">Port Bedrock (Default: 19132)</label>
                <input name="port" type="number" defaultValue={19132} className="px-input" placeholder="19132" />
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
            <input name="ownerWhatsApp" required type="text" pattern="^62[0-9]{8,14}$" title="Awali dengan 62 tanpa spasi/simbol (contoh: 628123456789)" className="px-input" placeholder="628123456..." />
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
            <input name="ownerWhatsApp" required type="text" pattern="^62[0-9]{8,14}$" title="Awali dengan 62 tanpa spasi/simbol (contoh: 628123456789)" className="px-input" placeholder="628123456..." />
          </div>
        </div>
      )}

      {/* Visual Identity Section */}
      <div className="px-flat p-5 sm:p-6 flex flex-col gap-4">
        <h3 className="px-title text-lg text-ink flex items-center gap-2">
          Identitas Visual & Branding
        </h3>
        <p className="text-sm text-ink-2 -mt-2">Unggah aset terbaik server Anda. Aset ini akan tampil di etalase dan halaman profil server.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageUploader 
            name="logoUrl" 
            label="Logo Server (Persegi 1:1)" 
            aspectRatio="square" 
          />
          <ImageUploader 
            name="bannerUrl" 
            label="Banner Utama (Landscape 16:9)" 
            aspectRatio="video" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="px-label flex items-center justify-between gap-2">
          <span>{serverType === "REALM" ? "Deskripsi Realm" : "Deskripsi Server"}</span>
          <span className="px-chip !text-[11px] !py-0">Format Markdown</span>
        </label>
        <MarkdownTextarea 
          name="description" 
          required 
          placeholder={serverType === "REALM" ? "Tulis deskripsi Realm Anda, aturan bermain, gameplay, dan komunitas..." : "Tulis deskripsi server Anda dengan memukau, jelaskan fitur unggulan dan aturan..."}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="px-label">Kategori / Tags (Pisahkan dengan koma)</label>
        <input name="tags" required type="text" className="px-input" placeholder={serverType === "REALM" ? "Realm, Survival, Bedrock, Vanilla" : "Survival, Lifesteal, Economy, RPG"} />
      </div>
      
      <div className="px-flat p-5 sm:p-6 flex flex-col gap-4">
        <h3 className="px-title text-lg text-ink flex items-center gap-2">
          Cuplikan Video Trailer
        </h3>
        <p className="text-sm text-ink-2 -mt-2">Unggah video trailer server Anda (.mp4, maks 50MB) atau tautan YouTube untuk tampil di tab Trailer.</p>
        <VideoUploader name="videoUrl" />
      </div>

      <div className="px-flat p-5 sm:p-6 flex flex-col gap-4">
        <ImageUploader 
          name="galleryUrls" 
          label="Galeri Screenshot Gameplay (Bisa Lebih dari 1)" 
          isGallery={true} 
        />
      </div>

      {/* Community / Social Links */}
      <div className="px-flat p-5 sm:p-6 flex flex-col gap-4">
        <h3 className="px-title text-lg text-ink flex items-center gap-2">
          Komunitas & Media Sosial (Opsional)
        </h3>
        <p className="text-sm text-ink-2 -mt-2">Hubungkan pemain baru langsung ke media sosial dan grup komunitas server Anda.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="px-label">Tautan Undangan Discord</label>
            <input name="discordUrl" type="url" className="px-input" placeholder="https://discord.gg/namaserver" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="px-label">Tautan Grup WhatsApp</label>
            <input name="whatsappUrl" type="url" className="px-input" placeholder="https://chat.whatsapp.com/..." />
          </div>
          <div className="flex flex-col gap-2">
            <label className="px-label">Tautan Grup Telegram</label>
            <input name="telegramUrl" type="url" className="px-input" placeholder="https://t.me/..." />
          </div>
          <div className="flex flex-col gap-2">
            <label className="px-label">Alamat Website Resmi</label>
            <input name="websiteUrl" type="url" className="px-input" placeholder="https://namaserver.com" />
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="px-btn px-btn-gold px-btn-block mt-2 !min-h-[52px]"
      >
        {isPending && <PixelIcon name="refresh" size={16} className="px-spin" />}
        {isPending 
          ? (serverType === "REALM" ? "Mendaftarkan Realm..." : "Mendaftarkan Server...") 
          : (serverType === "REALM" ? "Daftarkan Realm untuk Ditinjau" : "Daftarkan Server untuk Ditinjau")}
      </button>

    </form>
  );
}
