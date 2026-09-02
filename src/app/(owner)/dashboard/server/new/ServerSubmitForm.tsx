"use client";

import { useState } from "react";
import { Spinner } from "@phosphor-icons/react";
import { toast } from "sonner";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { MarkdownTextarea } from "@/components/ui/MarkdownTextarea";

export function ServerSubmitForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  const [isPending, setIsPending] = useState(false);

  return (
    <form 
      action={async (formData) => {
        setIsPending(true);
        try {
          await action(formData);
          toast.success("Server submitted successfully for review!");
        } catch (e: any) {
          console.error(e);
          toast.error(e.message || "Failed to submit server");
          setIsPending(false);
        }
      }} 
      className="flex flex-col gap-6"
    >
      
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Server Name</label>
        <input name="name" required type="text" className="bg-black/50 border border-white/10 rounded-sm px-4 py-2.5 text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors" placeholder="E.g. Nusantara SMP" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">IP Address</label>
          <input name="ipAddress" required type="text" className="bg-black/50 border border-white/10 rounded-sm px-4 py-2.5 text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors" placeholder="play.nusantara.net" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Port</label>
          <input name="port" type="number" defaultValue={25565} className="bg-black/50 border border-white/10 rounded-sm px-4 py-2.5 text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors" placeholder="25565" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center justify-between">
            <span>Nomor WA (Owner)</span>
            <span className="bg-white/5 text-zinc-400 px-2 py-0.5 rounded-sm text-[10px]">Rahasia</span>
          </label>
          <input name="ownerWhatsApp" required type="text" pattern="^62[0-9]{8,14}$" title="Awali dengan 62 tanpa spasi/simbol (contoh: 628123456789)" className="bg-black/50 border border-white/10 rounded-sm px-4 py-2.5 text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors" placeholder="628123456..." />
        </div>
      </div>

      {/* Visual Identity Section */}
      <div className="flex flex-col gap-4 p-6 border border-white/10 rounded-sm bg-white/[0.01]">
        <h3 className="text-sm font-display font-medium text-eter-starlight flex items-center gap-2">
          Visual Identity
        </h3>
        <p className="text-xs text-zinc-500 font-body mb-4">Upload your server's best assets. These will be displayed beautifully on your portfolio.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageUploader 
            name="logoUrl" 
            label="Server Logo (Square)" 
            aspectRatio="square" 
          />
          <ImageUploader 
            name="bannerUrl" 
            label="Hero Banner (Wide)" 
            aspectRatio="video" 
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center justify-between">
          <span>Description</span>
          <span className="bg-eter-cyan/10 text-eter-cyan px-2 py-0.5 rounded-sm text-[10px] font-semibold">Markdown Supported</span>
        </label>
        <MarkdownTextarea 
          name="description" 
          required 
          placeholder="Use Markdown to style your description...&#10;&#10;## Features&#10;- Custom Enchants&#10;- Economy&#10;&#10;**Join now!**"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Tags (Comma separated)</label>
        <input name="tags" required type="text" className="bg-black/50 border border-white/10 rounded-sm px-4 py-2.5 text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors" placeholder="Survival, Lifesteal, Economy" />
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center justify-between">
          <span>Trailer Video URL</span>
          <span className="bg-white/5 text-zinc-400 px-2 py-0.5 rounded-sm text-[10px]">YouTube Recommended</span>
        </label>
        <input name="videoUrl" required type="url" className="bg-black/50 border border-white/10 rounded-sm px-4 py-2.5 text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors" placeholder="https://youtube.com/watch?v=..." />
        <p className="text-[10px] text-zinc-500 font-mono">Untuk performa dan keamanan terbaik, kami sangat merekomendasikan menggunakan link YouTube.</p>
      </div>

      <div className="flex flex-col gap-4 p-6 border border-white/10 rounded-sm bg-white/[0.01]">
        <ImageUploader 
          name="galleryUrls" 
          label="Gallery Screenshots (Multiple)" 
          isGallery={true} 
        />
      </div>

      {/* Community / Social Links */}
      <div className="flex flex-col gap-4 p-6 border border-white/10 rounded-sm bg-white/[0.01]">
        <h3 className="text-sm font-display font-medium text-eter-starlight flex items-center gap-2">
          Community Hub (Optional)
        </h3>
        <p className="text-xs text-zinc-500 font-body mb-2">Connect your players straight to your community.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Discord Invite URL</label>
            <input name="discordUrl" type="url" className="bg-black/50 border border-white/10 rounded-sm px-4 py-2 text-sm text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors" placeholder="https://discord.gg/yourserver" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">WhatsApp Group URL</label>
            <input name="whatsappUrl" type="url" className="bg-black/50 border border-white/10 rounded-sm px-4 py-2 text-sm text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors" placeholder="https://chat.whatsapp.com/..." />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Telegram Group URL</label>
            <input name="telegramUrl" type="url" className="bg-black/50 border border-white/10 rounded-sm px-4 py-2 text-sm text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors" placeholder="https://t.me/..." />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Website URL</label>
            <input name="websiteUrl" type="url" className="bg-black/50 border border-white/10 rounded-sm px-4 py-2 text-sm text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors" placeholder="https://yourserver.com" />
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="mt-4 bg-eter-cyan text-black font-semibold px-6 py-3 rounded-sm hover:bg-cyan-300 transition-colors border-l-2 border-l-white border-y border-r border-transparent flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isPending && <Spinner className="animate-spin" size={20} />}
        {isPending ? 'Submitting...' : 'Submit Server for Review'}
      </button>

    </form>
  );
}
