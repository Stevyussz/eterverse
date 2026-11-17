import { Sprite, type SpriteName } from "@/components/pixel/PixelArt";

/** Page header for the owner and admin panels: sprite, pixel title, one line of context. */
export function DashHeader({ title, sprite, children }: { title: string; sprite?: SpriteName; children?: React.ReactNode }) {
  return (
    <header className="flex items-center gap-4">
      {sprite && <Sprite name={sprite} size={48} className="hidden sm:block shrink-0" />}
      <div className="flex flex-col gap-2 min-w-0">
        <h1 className="px-title px-title-shadow text-3xl md:text-4xl text-ink">{title}</h1>
        {children && <div className="text-sm text-ink-2 max-w-2xl">{children}</div>}
      </div>
    </header>
  );
}
