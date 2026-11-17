"use client";

import { PixelIcon } from "@/components/pixel/PixelIcon";
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
          <PixelIcon name="trash" size={12} /> Hapus
        </>
      }
      className="px-btn px-btn-cream px-btn-sm !text-redstone"
    />
  );
}
