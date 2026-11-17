import { Sprite, type SpriteName } from "@/components/pixel/PixelArt";

/** Sandstone header band for public pages. pt-16 clears the fixed 64px navbar plus its drips. */
export function PageHero({
  title,
  sprite,
  eyebrow,
  children,
}: {
  title: string;
  sprite?: SpriteName;
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="sand-band pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 flex items-center gap-5">
        {sprite && <Sprite name={sprite} size={56} className="hidden sm:block shrink-0" />}
        <div className="flex flex-col gap-2 min-w-0">
          {eyebrow && <p className="font-pixel text-sm text-prism-d">{eyebrow}</p>}
          <h1 className="px-title px-title-shadow text-3xl sm:text-4xl md:text-5xl text-ink text-balance">{title}</h1>
          {children}
        </div>
      </div>
    </header>
  );
}
