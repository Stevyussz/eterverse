"use client";

import { Trash } from "@phosphor-icons/react";
import { ConfirmActionButton } from "@/components/dashboard/ConfirmActionButton";

interface Props {
  serverId: string;
  serverName: string;
  deleteAction: (formData: FormData) => Promise<void>;
}

export function DeleteServerButton({ serverId, serverName, deleteAction }: Props) {
  return (
    <ConfirmActionButton
      action={deleteAction}
      fields={{ serverId }}
      tone="danger"
      title={`Hapus ${serverName}?`}
      body="Halaman server, vote, rating, dan riwayat statusnya hilang permanen. Link yang sudah kamu bagikan akan mati."
      confirmLabel="Hapus permanen"
      requireText={serverName}
      pendingLabel="Menghapus..."
      label={
        <>
          <Trash size={16} aria-hidden /> Hapus
        </>
      }
      className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-md text-sm text-zinc-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-white"
    />
  );
}
