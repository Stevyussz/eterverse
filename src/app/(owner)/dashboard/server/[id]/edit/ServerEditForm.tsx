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
          toast.success("Perubahan server berhasil disimpan! Status dikembalikan ke peninjauan.");
        } catch (e: any) {
          console.error(e);
          toast.error(e.message || "Gagal memperbarui server");
          setIsPending(false);
        }
      }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Nama Server</label>
        <input name="name" required type="text" defaultValue={server.name} className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-zinc-500 focus:outline-none transition-colors" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Alamat IP Server</label>
          <input name="ipAddress" required defaultValue={server.ipAddress} type="text" className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-zinc-500 focus:outline-none transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Port Server</label>
          <input name="port" type="number" defaultValue={server.port} className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-zinc-500 focus:outline-none transition-colors" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center justify-between">
            <span>Nomor WA (Owner)</span>
            <span className="bg-white/5 text-zinc-400 px-2 py-0.5 rounded text-[10px]">Rahasia</span>
          </label>
          <input name="ownerWhatsApp" required type="text" defaultValue={server.ownerWhatsApp || ""} pattern="^62[0-9]{8,14}$" title="Awali dengan 62 tanpa spasi/simbol (contoh: 628123456789)" className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:border-zinc-500 focus:outline-none transition-colors" placeholder="628123456..." />
        </div>
      </div>

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
          <span>Deskripsi Server</span>
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
        <p className="text-xs text-zinc-500 font-body mb-2">Unggah video trailer server (.mp4, maks 50MB) atau tautan YouTube untuk tampil di profil server.</p>
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
