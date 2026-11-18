import Link from "next/link";
import { PixelIcon } from "@/components/pixel/PixelIcon";

/**
 * An empty inventory slot shown where a row of server cards would otherwise end early.
 * It states a fact (the slot is open) and points owners to the free sign-up; it never
 * pretends to be a server.
 */
export function EmptySlotCard({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/dashboard/server/new"
      className={`px-slot group h-full min-h-[300px] flex flex-col items-center justify-center gap-4 p-6 text-center ${className}`}
    >
      <span className="w-16 h-16 flex items-center justify-center border-[3px] border-dashed border-ink/30 text-ink-2 group-hover:text-prism-t group-hover:border-prism-t transition-colors">
        <PixelIcon name="plus" size={24} />
      </span>
      <span className="font-pixel text-lg text-ink">Slot ini masih kosong</span>
      <span className="text-sm text-ink-2 max-w-[220px]">Servermu bisa tampil di sini, lengkap dengan trailer dan IP.</span>
      <span className="px-btn px-btn-gold px-btn-sm">Daftar gratis</span>
    </Link>
  );
}
