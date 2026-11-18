import Link from "next/link";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { SafeImage } from "@/components/ui/SafeImage";
import { LiveIcon } from "@/components/ui/LiveIcon";
import { DeleteServerButton } from "@/components/dashboard/DeleteServerButton";
import { displayAddress } from "@/lib/server-queries";
import type { UptimeSummary } from "@/lib/server-status";

// Owner dashboard pieces, split from the page so they render without a session or a database
// (the page itself only fetches and composes).

// Status chips always pair an icon with the word, never colour alone.
const STATUS: Record<string, { label: string; className: string; icon: "check" | "clock" | "close" | "ban" }> = {
  APPROVED: { label: "Tayang", className: "px-chip-prism", icon: "check" },
  PENDING: { label: "Menunggu review", className: "px-chip-gold", icon: "clock" },
  REJECTED: { label: "Ditolak", className: "!bg-redstone-l", icon: "close" },
  BANNED: { label: "Dibekukan", className: "!bg-redstone-l", icon: "ban" },
};

interface ChecklistItem {
  done: boolean;
  label: string;
  href: string;
}

// What still stands between this listing and players finding it. Each item links to the
// exact place it gets fixed, instead of a generic "complete your profile" nag.
export function checklistFor(s: any): ChecklistItem[] {
  const id = s._id.toString();
  const edit = `/dashboard/server/${id}/edit`;
  const isRealm = s.serverType === "REALM";
  const items: ChecklistItem[] = [
    { done: !!s.videoUrl, label: "Trailer video", href: edit },
    { done: !!s.logoUrl, label: "Logo server", href: edit },
    { done: !!s.bannerUrl, label: "Banner", href: edit },
    { done: (s.tags?.length || 0) >= 2, label: "Minimal 2 tag mode game", href: edit },
    { done: !!s.socialLinks?.discord, label: "Link Discord komunitas", href: edit },
  ];
  if (!isRealm) {
    items.push({ done: !!s.votifier?.enabled, label: "Hadiah vote (Votifier)", href: "/dashboard/tools/votifier" });
    items.push({ done: !!s.liveStatus?.isOnline, label: "Server online saat terakhir dicek", href: "/dashboard/info" });
  }
  return items;
}

export function Metric({ label, value, icon, note }: { label: string; value: number; icon: React.ReactNode; note?: string }) {
  return (
    <div className="px-panel p-4 flex flex-col gap-2">
      <dt className="flex items-center justify-between gap-2 text-xs text-ink-2">
        {label}
        <span className="text-ink-2">{icon}</span>
      </dt>
      <dd className="text-2xl font-bold text-ink tabular">{value.toLocaleString("id-ID")}</dd>
      {note && <dd className="text-xs text-ink-2">{note}</dd>}
    </div>
  );
}

export function ServerPanel({
  server,
  uptime,
  deleteAction,
}: {
  server: any;
  uptime: UptimeSummary | null;
  deleteAction: (formData: FormData) => Promise<void>;
}) {
  const id = server._id.toString();
  const status = STATUS[server.moderationStatus] ?? STATUS.PENDING;
  const isRealm = server.serverType === "REALM";
  const isLive = server.moderationStatus === "APPROVED";
  const checklist = checklistFor(server);
  const doneCount = checklist.filter((c) => c.done).length;
  const address = displayAddress(server);

  return (
    <article className="px-panel">
      <div className="p-4 sm:p-5 flex flex-col gap-5">
        <div className="flex items-start gap-4 min-w-0">
          <SafeImage src={server.logoUrl} fallbackName={server.name} alt="" className="w-14 h-14 shrink-0 object-cover px-frame text-sm" />
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="px-title text-xl text-ink truncate">{server.name}</h3>
              <span className={`px-chip ${status.className}`}>
                <PixelIcon name={status.icon} size={12} />
                {status.label}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap text-sm">
              {!isRealm && (
                <span className="inline-flex items-center gap-1.5">
                  <LiveIcon online={!!server.liveStatus?.isOnline} />
                  <span className={server.liveStatus?.isOnline ? "text-online-d" : "text-ink-2"}>
                    {server.liveStatus?.isOnline ? `${server.liveStatus.currentPlayers || 0} online` : "Offline"}
                  </span>
                </span>
              )}
              {address && (
                <span className="ip-chip max-w-full">
                  <span className="ip-chip-caret" aria-hidden>&gt;</span>
                  <span className="truncate">{address}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Per-server numbers; uptime only exists for live, non-Realm servers. */}
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Dilihat" value={(server.metrics?.impressions || 0).toLocaleString("id-ID")} />
          <Stat label="Salin IP / Main" value={(server.metrics?.clicks || 0).toLocaleString("id-ID")} />
          <Stat label="Vote" value={(server.metrics?.votes || 0).toLocaleString("id-ID")} />
          <Stat
            label="Uptime 7 hari"
            value={uptime && uptime.uptimePct !== null ? `${uptime.uptimePct}%` : isRealm ? "Realm" : "Belum ada data"}
          />
        </dl>

        {server.moderationStatus === "REJECTED" && (
          <div role="note" className="px-note px-note-error">
            <PixelIcon name="alert" size={18} className="text-redstone mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-pixel text-base">Ditolak admin</p>
              <p>{server.rejectionReason || "Tidak ada alasan yang ditulis."} Perbaiki lalu simpan ulang untuk ditinjau lagi.</p>
            </div>
          </div>
        )}
        {server.moderationStatus === "BANNED" && (
          <div role="note" className="px-note px-note-error text-sm">
            <PixelIcon name="ban" size={18} className="text-redstone mt-0.5 shrink-0" />
            <span>
              Server ini dibekukan dan tidak tampil publik.
              {server.rejectionReason ? ` Alasan: ${server.rejectionReason}` : ""} Hubungi admin lewat Pusat Informasi.
            </span>
          </div>
        )}

        {/* Listing completeness as an XP bar: filled from what the owner actually set. */}
        {doneCount < checklist.length && (
          <details className="group px-slot">
            <summary className="cursor-pointer list-none min-h-[48px] px-4 flex items-center justify-between gap-4 text-sm">
              <span className="font-pixel text-base shrink-0">
                Lengkapi listing <span className="tabular">{doneCount}/{checklist.length}</span>
              </span>
              <span className="px-bar flex-1 max-w-48" aria-hidden>
                <span style={{ width: `${(doneCount / checklist.length) * 100}%` }} />
              </span>
              <PixelIcon name="chevron" size={12} className="shrink-0 group-open:rotate-180 transition-transform" />
            </summary>
            <ul className="px-4 pb-3 flex flex-col">
              {checklist.map((item) => (
                <li key={item.label}>
                  {item.done ? (
                    <span className="flex items-center gap-2 min-h-[40px] text-sm text-ink-2">
                      <PixelIcon name="check" size={14} className="text-online-d" />
                      <span className="line-through decoration-ink-3">{item.label}</span>
                    </span>
                  ) : (
                    <Link href={item.href} className="flex items-center gap-2 min-h-[40px] text-sm text-ink hover:text-prism-t underline-offset-4 hover:underline">
                      <PixelIcon name="plus" size={12} className="text-ink-2" />
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>

      <div className="border-t-[3px] border-frame bg-panel-2 px-3 py-3 flex items-center gap-3 flex-wrap">
        <PanelAction href={`/dashboard/server/${id}/edit`} icon="pencil" label="Edit" />
        {isLive && <PanelAction href={`/server/${server.slug}`} icon="external" label="Lihat halaman" external />}
        {!isRealm && <PanelAction href="/dashboard/tools/votifier" icon="gift" label="Hadiah vote" />}
        {isLive && <PanelAction href="/dashboard/tools/widget" icon="monitor" label="Widget" />}
        <span className="ml-auto">
          <DeleteServerButton serverId={id} serverName={server.name} deleteAction={deleteAction} />
        </span>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-slot px-3 py-2.5">
      <dt className="text-xs text-ink-2">{label}</dt>
      <dd className="font-bold text-ink tabular">{value}</dd>
    </div>
  );
}

function PanelAction({ href, icon, label, external = false }: { href: string; icon: "pencil" | "external" | "gift" | "monitor"; label: string; external?: boolean }) {
  return (
    <Link href={href} target={external ? "_blank" : undefined} className="px-btn px-btn-cream px-btn-sm">
      <PixelIcon name={icon} size={12} />
      {label}
    </Link>
  );
}
