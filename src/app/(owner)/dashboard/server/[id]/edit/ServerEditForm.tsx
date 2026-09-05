"use client";

import { useState } from "react";
import { Spinner, Crown, Desktop, DeviceMobile, Lightning, Sparkle } from "@phosphor-icons/react";
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

export function ServerEditForm({ action, server }: { action: (formData: FormData) => Promise<void>; server: ServerData }) {
  const [isPending, setIsPending] = useState(false);
  const [serverType, setServerType] = useState<"SERVER" | "REALM">(server.serverType || "SERVER");
  const [platform, setPlatform] = useState<"JAVA" | "BEDROCK" | "CROSSPLAY">(server.platform || "CROSSPLAY");

  return (
    <form
      action={async (formData) => {
        setIsPending(true);
        try {
          await action(formData);
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

      {/* Type Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
          Tipe Listing
        </label>
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-zinc-950 border border-zinc-800 rounded-xl">
          <button
            type="button"
            onClick={() => setServerType("SERVER")}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              serverType === "SERVER"
                ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span className="font-semibold">Dedicated Server</span>
            <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">(Java / Bedrock / Crossplay)</span>
          </button>
          <button
            type="button"
            onClick={() => setServerType("REALM")}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              serverType === "REALM"
                ? "bg-purple-900/60 text-purple-200 shadow-sm border border-purple-600/50"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Crown size={15} weight="fill" className={serverType === "REALM" ? "text-purple-300" : "text-zinc-500"} />
            <span className="font-semibold">Minecraft Realm</span>
            <span className="text-[10px] font-mono text-purple-300/70 hidden sm:inline">(Mojang Realm)</span>
          </button>
        </div>
      </div>

      {/* Platform Selection (Only for Dedicated Servers) */}
      {serverType === "SERVER" && (
        <div className="flex flex-col gap-2.5 p-4 bg-zinc-950/60 border border-zinc-800/90 rounded-xl">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
              Platform & Edisi Minecraft
            </label>
            <span className="text-[10px] text-zinc-500 font-body">Pilih versi pemain yang didukung</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Crossplay */}
            <button
              type="button"
              onClick={() => setPlatform("CROSSPLAY")}
              className={`flex flex-col gap-1.5 p-3 rounded-xl border text-left transition-all ${
                platform === "CROSSPLAY"
                  ? "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.12)]"
                  : "bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700 text-zinc-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold flex items-center gap-1.5 ${platform === "CROSSPLAY" ? "text-cyan-300" : "text-zinc-200"}`}>
                  <Lightning size={14} weight="fill" className="text-cyan-400" /> Crossplay
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold uppercase tracking-wider">
                  Keduanya
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-body leading-tight">
                Java Edition + Bedrock (MCPE) bisa main bersama via GeyserMC.
              </span>
            </button>

            {/* Java Edition */}
            <button
              type="button"
              onClick={() => setPlatform("JAVA")}
              className={`flex flex-col gap-1.5 p-3 rounded-xl border text-left transition-all ${
                platform === "JAVA"
                  ? "bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.12)]"
                  : "bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700 text-zinc-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold flex items-center gap-1.5 ${platform === "JAVA" ? "text-blue-300" : "text-zinc-200"}`}>
                  <Desktop size={14} weight="fill" className="text-blue-400" /> Java Edition
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold uppercase tracking-wider">
                  PC Only
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-body leading-tight">
                Khusus pemain di PC/Mac menggunakan Minecraft Java Edition.
              </span>
            </button>

            {/* Bedrock Edition */}
            <button
              type="button"
              onClick={() => setPlatform("BEDROCK")}
              className={`flex flex-col gap-1.5 p-3 rounded-xl border text-left transition-all ${
                platform === "BEDROCK"
                  ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.12)]"
                  : "bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700 text-zinc-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold flex items-center gap-1.5 ${platform === "BEDROCK" ? "text-emerald-300" : "text-zinc-200"}`}>
                  <DeviceMobile size={14} weight="fill" className="text-emerald-400" /> Bedrock / MCPE
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold uppercase tracking-wider">
                  Mobile/PC
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-body leading-tight">
                Khusus pemain Android, iOS, Windows 10/11, & Konsol.
              </span>
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
          {serverType === "REALM" ? "Nama Realm" : "Nama Server"}
        </label>
        <input name="name" required type="text" defaultValue={server.name} className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-zinc-500 focus:outline-none transition-colors" />
      </div>

      {serverType === "SERVER" ? (
        <div className="flex flex-col gap-4">
          {platform === "CROSSPLAY" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2 sm:col-span-1">
                <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Alamat IP / Domain</label>
                <input name="ipAddress" required defaultValue={server.ipAddress} type="text" className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-zinc-500 focus:outline-none transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-blue-300 uppercase tracking-widest">Port Java</label>
                <input name="port" type="number" defaultValue={server.port || 25565} className="bg-zinc-950 border border-blue-500/30 focus:border-blue-400 rounded-lg px-4 py-2.5 text-white focus:outline-none transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-cyan-300 uppercase tracking-widest">Port Bedrock (MCPE)</label>
                <input name="bedrockPort" type="number" defaultValue={server.bedrockPort || 19132} className="bg-zinc-950 border border-cyan-500/30 focus:border-cyan-400 rounded-lg px-4 py-2.5 text-white focus:outline-none transition-colors" />
              </div>
            </div>
          )}

          {platform === "JAVA" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Alamat IP Java</label>
                <input name="ipAddress" required defaultValue={server.ipAddress} type="text" className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-zinc-500 focus:outline-none transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-blue-300 uppercase tracking-widest">Port Java (Default: 25565)</label>
                <input name="port" type="number" defaultValue={server.port || 25565} className="bg-zinc-950 border border-blue-500/30 focus:border-blue-400 rounded-lg px-4 py-2.5 text-white focus:outline-none transition-colors" />
              </div>
            </div>
          )}

          {platform === "BEDROCK" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Alamat IP Bedrock</label>
                <input name="ipAddress" required defaultValue={server.ipAddress} type="text" className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-zinc-500 focus:outline-none transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono text-emerald-300 uppercase tracking-widest">Port Bedrock (Default: 19132)</label>
                <input name="port" type="number" defaultValue={server.port || 19132} className="bg-zinc-950 border border-emerald-500/30 focus:border-emerald-400 rounded-lg px-4 py-2.5 text-white focus:outline-none transition-colors" />
              </div>
            </div>
          )}

          {/* Votifier Teaser Notice */}
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-start justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-cyan-300">
              <Sparkle size={16} weight="fill" className="shrink-0 text-cyan-400" />
              <span className="font-body">
                <strong>In-Game Vote Reward (NuVotifier)</strong> segera hadir! Pemainmu nanti bisa klaim reward in-game saat vote.
              </span>
            </div>
            <a 
              href="/dashboard/tools/votifier" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[11px] font-mono font-semibold text-cyan-400 hover:text-cyan-300 underline shrink-0"
            >
              Cek Syarat &rarr;
            </a>
          </div>

          {/* Owner WhatsApp */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center justify-between">
              <span>Nomor WhatsApp Owner</span>
              <span className="bg-white/5 text-zinc-400 px-2 py-0.5 rounded text-[10px]">Rahasia (Hanya untuk Admin)</span>
            </label>
            <input name="ownerWhatsApp" required type="text" defaultValue={server.ownerWhatsApp || ""} pattern="^62[0-9]{8,14}$" title="Awali dengan 62 tanpa spasi/simbol (contoh: 628123456789)" className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-zinc-500 focus:outline-none transition-colors" placeholder="628123456..." />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-mono text-purple-300 uppercase tracking-widest flex items-center justify-between">
              <span>Kode Undangan Realm / Invite Link</span>
              <span className="text-[10px] text-zinc-400 font-sans font-normal">realms.gg/...</span>
            </label>
            <input 
              name="realmCode" 
              required={serverType === "REALM"} 
              type="text" 
              defaultValue={server.realmCode || ""} 
              className="bg-zinc-950 border border-purple-500/30 focus:border-purple-400 rounded-lg px-4 py-2.5 text-white focus:outline-none transition-colors placeholder:text-zinc-600" 
              placeholder="Contoh: AB12cdEfGhI atau https://realms.gg/AB12cdEfGhI" 
            />
            <p className="text-[11px] text-zinc-500 font-body">
              💡 Temukan kode ini di Minecraft: <span className="text-zinc-300">Realms → Kelola Realm → Tautan Undangan</span>.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center justify-between">
              <span>Nomor WA (Owner)</span>
              <span className="bg-white/5 text-zinc-400 px-2 py-0.5 rounded text-[10px]">Rahasia</span>
            </label>
            <input name="ownerWhatsApp" required type="text" defaultValue={server.ownerWhatsApp || ""} pattern="^62[0-9]{8,14}$" title="Awali dengan 62 tanpa spasi/simbol (contoh: 628123456789)" className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-zinc-500 focus:outline-none transition-colors" placeholder="628123456..." />
          </div>
        </div>
      )}

      {/* Visual Identity */}
      <div className="flex flex-col gap-4 p-6 border border-zinc-800 rounded-xl bg-zinc-950/40">
        <h3 className="text-sm font-display font-medium text-white">Identitas Visual & Branding</h3>
        <p className="text-xs text-zinc-500 mb-2">Unggah gambar baru atau biarkan kosong untuk mempertahankan gambar lama.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageUploader name="logoUrl" label="Logo Server (Persegi 1:1)" aspectRatio="square" defaultValue={server.logoUrl} />
          <ImageUploader name="bannerUrl" label="Banner Utama (Landscape 16:9)" aspectRatio="video" defaultValue={server.bannerUrl} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center justify-between">
          <span>{serverType === "REALM" ? "Deskripsi Realm" : "Deskripsi Server"}</span>
          <span className="bg-white/10 text-zinc-300 px-2 py-0.5 rounded text-[10px] font-mono">Format Markdown</span>
        </label>
        <MarkdownTextarea name="description" required defaultValue={server.description} placeholder="Tulis deskripsi server Anda dengan memukau..." />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Kategori / Tags (Pisahkan dengan koma)</label>
        <input name="tags" required type="text" defaultValue={server.tags?.join(", ")} className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-zinc-500 focus:outline-none transition-colors" />
      </div>

      <div className="flex flex-col gap-4 p-6 border border-zinc-800 rounded-xl bg-zinc-950/40">
        <h3 className="text-sm font-display font-medium text-white flex items-center gap-2">
          Cuplikan Video Trailer
        </h3>
        <p className="text-xs text-zinc-500 font-body mb-2">Unggah video trailer (.mp4, maks 50MB) atau tautan YouTube untuk tampil di profil server.</p>
        <VideoUploader name="videoUrl" defaultValue={server.videoUrl} />
      </div>

      <div className="flex flex-col gap-4 p-6 border border-zinc-800 rounded-xl bg-zinc-950/40">
        <ImageUploader name="galleryUrls" label="Galeri Screenshot Gameplay (Bisa Lebih dari 1)" isGallery={true} defaultValue={server.galleryUrls?.join(",")} />
      </div>

      {/* Community Links */}
      <div className="flex flex-col gap-4 p-6 border border-zinc-800 rounded-xl bg-zinc-950/40">
        <h3 className="text-sm font-display font-medium text-white">Komunitas & Media Sosial (Opsional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "discordUrl", label: "Tautan Undangan Discord", placeholder: "https://discord.gg/...", defaultValue: server.socialLinks?.discord },
            { name: "whatsappUrl", label: "Tautan Grup WhatsApp", placeholder: "https://chat.whatsapp.com/...", defaultValue: server.socialLinks?.whatsapp },
            { name: "telegramUrl", label: "Tautan Grup Telegram", placeholder: "https://t.me/...", defaultValue: server.socialLinks?.telegram },
            { name: "websiteUrl", label: "Alamat Website Resmi", placeholder: "https://namaserver.com", defaultValue: server.socialLinks?.website },
          ].map(field => (
            <div key={field.name} className="flex flex-col gap-2">
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">{field.label}</label>
              <input name={field.name} type="url" defaultValue={field.defaultValue || ""} placeholder={field.placeholder} className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:border-zinc-500 focus:outline-none transition-colors" />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 bg-white text-zinc-950 font-medium px-6 py-3.5 rounded-lg hover:bg-zinc-200 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
      >
        {isPending && <Spinner className="animate-spin" size={20} />}
        {isPending ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
