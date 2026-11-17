"use client";

import { PixelIcon } from "@/components/pixel/PixelIcon";
import { toast } from "sonner";

interface Props {
  serverName: string;
  address: string;
  slug: string;
}

// Players inviting friends is the cheapest acquisition channel a server list has. The native
// share sheet on phones goes straight to WhatsApp, Discord, TikTok DMs; desktop copies the text.
export function ShareServerButton({ serverName, address, slug }: Props) {
  const handleShare = async () => {
    const url = `${window.location.origin}/server/${slug}`;
    const text = `Main ${serverName} bareng yuk. IP: ${address}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: serverName, text, url });
        return;
      } catch (err) {
        if ((err as DOMException)?.name === "AbortError") return; // user closed the sheet
      }
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      toast.success("Link undangan disalin", { description: "Tempel di grup WhatsApp atau Discord kamu." });
    } catch {
      toast.error("Gagal menyalin link. Salin alamat halaman ini secara manual.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="px-btn px-btn-cream"
    >
      <PixelIcon name="share" size={16} />
      Ajak Teman
    </button>
  );
}
