"use client";

import { PixelIcon, type PixelIconName } from "@/components/pixel/PixelIcon";

type ServerType = "SERVER" | "REALM";
type Platform = "JAVA" | "BEDROCK" | "CROSSPLAY";

const PLATFORMS: { id: Platform; label: string; tag: string; icon: PixelIconName; body: string }[] = [
  { id: "CROSSPLAY", label: "Crossplay", tag: "Java + Bedrock", icon: "bolt", body: "Pemain Java dan Bedrock main bareng lewat GeyserMC." },
  { id: "JAVA", label: "Java Edition", tag: "PC", icon: "monitor", body: "Khusus pemain PC/Mac dengan Minecraft Java Edition." },
  { id: "BEDROCK", label: "Bedrock", tag: "HP & konsol", icon: "phone", body: "Pemain Android, iOS, Windows, dan konsol." },
];

/** Listing type and platform as inventory slots; the chosen one is gold-framed. Shared by
 *  the submit and edit forms (they used to carry two copies of this block). */
export function ListingTypePicker({
  serverType,
  platform,
  onType,
  onPlatform,
}: {
  serverType: ServerType;
  platform: Platform;
  onType: (t: ServerType) => void;
  onPlatform: (p: Platform) => void;
}) {
  return (
    <>
      <fieldset className="flex flex-col">
        <legend className="px-label">Tipe listing</legend>
        <div className="grid grid-cols-2 gap-4">
          <button type="button" onClick={() => onType("SERVER")} aria-pressed={serverType === "SERVER"} className="px-slot p-3.5 text-left flex flex-col gap-1">
            <span className="font-pixel text-base flex items-center gap-2"><PixelIcon name="block" size={14} />Server</span>
            <span className="text-xs text-ink-2">Java, Bedrock, atau crossplay</span>
          </button>
          <button type="button" onClick={() => onType("REALM")} aria-pressed={serverType === "REALM"} className="px-slot p-3.5 text-left flex flex-col gap-1">
            <span className="font-pixel text-base flex items-center gap-2"><PixelIcon name="crown" size={14} />Realm</span>
            <span className="text-xs text-ink-2">Minecraft Realms (Mojang)</span>
          </button>
        </div>
      </fieldset>

      {serverType === "SERVER" && (
        <fieldset className="flex flex-col">
          <legend className="px-label">Platform yang didukung</legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onPlatform(p.id)}
                aria-pressed={platform === p.id}
                className="px-slot p-3.5 text-left flex flex-col gap-1.5"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-pixel text-base flex items-center gap-2"><PixelIcon name={p.icon} size={14} />{p.label}</span>
                  <span className="px-chip !text-[11px] !py-0">{p.tag}</span>
                </span>
                <span className="text-xs text-ink-2 leading-snug">{p.body}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}
    </>
  );
}
