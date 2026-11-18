import Link from "next/link";
// WhatsApp keeps its brand mark; every other icon is a pixel icon.
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { displayAddress } from "@/lib/server-queries";
import { plainExcerpt } from "@/lib/text";
import { SafeImage } from "@/components/ui/SafeImage";
import { ConfirmActionButton } from "@/components/dashboard/ConfirmActionButton";
import { SubmitButton } from "@/components/dashboard/SubmitButton";
import { LiveIcon } from "@/components/ui/LiveIcon";
import { approveServer, rejectServer, deleteServer, pingServerNow } from "@/app/(admin)/admin/actions";

// Moderation pieces, split from the page so they render without a database.

const PLATFORM_LABEL: Record<string, string> = { CROSSPLAY: "Java + Bedrock", JAVA: "Java", BEDROCK: "Bedrock" };

export const BTN = "px-btn px-btn-sm";

function timeAgo(date?: Date | string) {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.round(diff / 60000);
  if (m < 60) return `${Math.max(1, m)} menit lalu`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h} jam lalu`;
  return `${Math.round(h / 24)} hari lalu`;
}

function waLink(raw?: string) {
  const digits = (raw || "").replace(/\D/g, "");
  if (!digits) return null;
  // Indonesian numbers are often typed as 08xx; wa.me needs the country code.
  return `https://wa.me/${digits.startsWith("0") ? `62${digits.slice(1)}` : digits}`;
}

export function Stat({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`px-panel p-4 ${highlight ? "!bg-gold-l" : ""}`}>
      <dt className="text-xs text-ink-2 flex items-center gap-1.5">{highlight && <PixelIcon name="clock" size={11} className="text-gold-d" />}{label}</dt>
      <dd className="text-2xl font-bold text-ink tabular">{value}</dd>
    </div>
  );
}

export function HardDelete({ server }: { server: any }) {
  return (
    <ConfirmActionButton
      action={deleteServer}
      fields={{ serverId: server._id.toString() }}
      tone="danger"
      title={`Hapus permanen ${server.name}?`}
      body="Data server, vote, dan riwayatnya dihapus dari database. Ini tidak bisa dibatalkan."
      requireText={server.name}
      confirmLabel="Hapus permanen"
      label={<><PixelIcon name="trash" size={12} /> Hapus</>}
      className={`${BTN} px-btn-cream !text-redstone`}
    />
  );
}

export function StatusLine({ server }: { server: any }) {
  if (server.serverType === "REALM") return <span className="inline-flex items-center gap-1.5"><PixelIcon name="crown" size={12} className="text-gold-d" />Realm</span>;
  const checked = server.liveStatus?.lastChecked;
  // Each fact is one unbreakable chunk, so a narrow screen wraps between facts, not inside them.
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-0.5">
      <span className={`inline-flex items-center gap-1.5 whitespace-nowrap ${server.liveStatus?.isOnline ? "text-online-d" : ""}`}>
        <LiveIcon online={!!server.liveStatus?.isOnline} />
        {server.liveStatus?.isOnline ? `Online, ${server.liveStatus.currentPlayers || 0} pemain` : "Offline"}
      </span>
      {checked && <span className="text-ink-2 whitespace-nowrap">· dicek {timeAgo(checked)}</span>}
      {server.liveStatus?.version && <span className="text-ink-2 whitespace-nowrap">· {server.liveStatus.version}</span>}
    </span>
  );
}

export function ReviewCard({ server }: { server: any }) {
  const id = server._id.toString();
  const wa = waLink(server.ownerWhatsApp);
  const address = displayAddress(server);

  return (
    <article className="px-panel">
      <div className="grid md:grid-cols-[220px_1fr]">
        <div className="relative aspect-video md:aspect-auto md:min-h-full px-screen !shadow-none border-b-[3px] md:border-b-0 md:border-r-[3px] border-frame">
          {/* No initials fallback here: the logo slot below already shows them. */}
          <SafeImage src={server.bannerUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute left-3 bottom-3 w-12 h-12 px-frame bg-slot">
            <SafeImage src={server.logoUrl} fallbackName={server.name} alt={`Logo ${server.name}`} className="w-full h-full object-cover text-xs" />
          </div>
        </div>

        <div className="p-4 sm:p-5 flex flex-col gap-3 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <h3 className="px-title text-xl text-ink">{server.name}</h3>
              <p className="text-xs text-ink-2 mt-1">
                {server.serverType === "REALM" ? "Realm" : PLATFORM_LABEL[server.platform] || "Java + Bedrock"} · dikirim {timeAgo(server.createdAt)}
              </p>
            </div>
            {address && (
              <span className="ip-chip max-w-full">
                <span className="ip-chip-caret" aria-hidden>&gt;</span>
                <span className="truncate">{address}</span>
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap text-sm">
            <StatusLine server={server} />
            {server.serverType !== "REALM" && (
              <form action={pingServerNow}>
                <input type="hidden" name="serverId" value={id} />
                <SubmitButton pendingLabel="Mengecek" className={`${BTN} px-btn-cream`}>
                  <PixelIcon name="refresh" size={12} /> Ping sekarang
                </SubmitButton>
              </form>
            )}
          </div>

          <p className="text-sm text-ink-2 leading-relaxed line-clamp-3">{plainExcerpt(server.description, 320, server.name)}</p>

          {server.tags?.length > 0 && (
            <p className="flex flex-wrap gap-2">{server.tags.map((tag: string) => <span key={tag} className="px-chip !text-xs">{tag}</span>)}</p>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            {server.videoUrl && (
              <a href={server.videoUrl} target="_blank" rel="noopener noreferrer" className={`${BTN} px-btn-cream`}>
                <PixelIcon name="play" size={12} /> Tonton trailer
              </a>
            )}
            <Link href={`/server/${server.slug}`} target="_blank" className={`${BTN} px-btn-cream`}>
              <PixelIcon name="external" size={12} /> Pratinjau halaman
            </Link>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className={`${BTN} px-btn-cream`}>
                <WhatsappLogo size={16} weight="fill" className="text-[#128C3E]" aria-hidden /> Chat owner
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t-[3px] border-frame bg-panel-2 px-3 py-3 flex flex-wrap items-center gap-3">
        <form action={approveServer}>
          <input type="hidden" name="serverId" value={id} />
          <SubmitButton pendingLabel="Menayangkan" className="px-btn px-btn-gold">
            <PixelIcon name="check" size={14} /> Setujui & tayangkan
          </SubmitButton>
        </form>
        <ConfirmActionButton
          action={rejectServer}
          fields={{ serverId: id }}
          tone="danger"
          title={`Tolak ${server.name}?`}
          body="Owner melihat alasan ini di dashboard dan bisa memperbaiki lalu mengirim ulang."
          reasonField={{ name: "reason", label: "Alasan penolakan", placeholder: "Contoh: trailer bukan gameplay server ini" }}
          confirmLabel="Tolak listing"
          label={<><PixelIcon name="close" size={12} /> Tolak</>}
          className="px-btn px-btn-red"
        />
        <span className="ml-auto">
          <HardDelete server={server} />
        </span>
      </div>
    </article>
  );
}

export function CompactRow({ server, note, children }: { server: any; note?: string; children: React.ReactNode }) {
  const wa = waLink(server.ownerWhatsApp);
  return (
    <li className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href={`/server/${server.slug}`} target="_blank" className="font-pixel text-base text-ink hover:underline underline-offset-4 truncate">
            {server.name}
          </Link>
          {server.moderationStatus !== "APPROVED" && (
            <span className="px-chip !bg-redstone-l !text-xs">
              {server.moderationStatus === "BANNED" ? "Dibekukan" : "Ditolak"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap text-sm">
          <StatusLine server={server} />
          <span className="text-ink-2 tabular whitespace-nowrap">{server.metrics?.votes || 0} vote · {server.metrics?.impressions || 0} dilihat</span>
        </div>
        {note && <p className="text-sm text-ink-2">Alasan: {note}</p>}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" aria-label={`Chat owner ${server.name}`} className={`${BTN} px-btn-cream px-btn-icon !min-h-[36px] !min-w-[36px]`}>
            <WhatsappLogo size={16} weight="fill" className="text-[#128C3E]" aria-hidden />
          </a>
        )}
        {children}
      </div>
    </li>
  );
}
