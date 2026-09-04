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
    if (confirm("Are you sure you want to delete this server? This action cannot be undone.")) {
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
      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-sm transition-colors border ${isPending ? 'text-zinc-500 border-white/5 cursor-not-allowed' : 'text-zinc-400 hover:text-red-400 border-white/10 hover:border-red-500/30'}`}
    >
      <Trash size={14} /> {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
