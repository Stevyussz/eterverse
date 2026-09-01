"use client";

import { useState } from "react";
import { Spinner } from "@phosphor-icons/react";
import { toast } from "sonner";

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">IP Address</label>
          <input name="ipAddress" required type="text" className="bg-black/50 border border-white/10 rounded-sm px-4 py-2.5 text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors" placeholder="play.nusantara.net" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Port</label>
          <input name="port" type="number" defaultValue={25565} className="bg-black/50 border border-white/10 rounded-sm px-4 py-2.5 text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors" placeholder="25565" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Description</label>
        <textarea name="description" required rows={4} className="bg-black/50 border border-white/10 rounded-sm px-4 py-2.5 text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors resize-none" placeholder="Describe what makes your server unique..." />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Tags (Comma separated)</label>
        <input name="tags" required type="text" className="bg-black/50 border border-white/10 rounded-sm px-4 py-2.5 text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors" placeholder="Survival, Lifesteal, Economy" />
      </div>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Trailer Video URL (MP4)</label>
        <input name="videoUrl" required type="url" className="bg-black/50 border border-white/10 rounded-sm px-4 py-2.5 text-eter-starlight focus:border-eter-cyan focus:outline-none transition-colors" placeholder="https://example.com/trailer.mp4" />
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
