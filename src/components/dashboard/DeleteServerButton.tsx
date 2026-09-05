"use client";

import { Trash } from "@phosphor-icons/react";
import { useTransition } from "react";

interface Props {
  serverId: string;
  deleteAction: (formData: FormData) => Promise<void>;
}

export function DeleteServerButton({ serverId, deleteAction }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Apakah Anda yakin ingin menghapus server ini? Tindakan ini tidak dapat dibatalkan.")) {
      const formData = new FormData();
      formData.append("serverId", serverId);
      startTransition(async () => {
        await deleteAction(formData);
      });
    }
  };

  return (
    <button 
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border bg-zinc-900/60 ${isPending ? 'text-zinc-600 border-zinc-800 cursor-not-allowed' : 'text-zinc-400 hover:text-red-400 border-zinc-800 hover:border-red-500/30'}`}
    >
      <Trash size={14} /> {isPending ? 'Menghapus...' : 'Hapus'}
    </button>
  );
}
