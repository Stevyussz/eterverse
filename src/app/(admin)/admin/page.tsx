import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Prohibit,
  ArrowSquareOut,
  WhatsappLogo,
  Trash,
  Star,
  ArrowsClockwise,
  FilmStrip,
  ArrowCounterClockwise,
} from "@phosphor-icons/react/dist/ssr";
import { displayAddress } from "@/lib/server-queries";
import { plainExcerpt } from "@/lib/text";
import { SafeImage } from "@/components/ui/SafeImage";
import { ConfirmActionButton } from "@/components/dashboard/ConfirmActionButton";
import { SubmitButton } from "@/components/dashboard/SubmitButton";
import {
  approveServer,
  rejectServer,
  banServer,
  unbanServer,
  deleteServer,
  togglePartner,
  pingServerNow,
} from "./actions";

const BTN = "inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 rounded-md text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-white";

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

export default async function AdminModerationPage() {
  await connectToDatabase();

  const [pending, approved, blocked] = await Promise.all([
    Server.find({ moderationStatus: "PENDING" }).sort({ createdAt: 1 }).lean(),
    Server.find({ moderationStatus: "APPROVED" }).sort({ "metrics.votes": -1 }).lean(),
    Server.find({ moderationStatus: { $in: ["REJECTED", "BANNED"] as any } }).sort({ createdAt: -1 }).lean(),
  ]);
  const onlineNow = approved.filter((s: any) => s.liveStatus?.isOnline).length;

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-10 animate-fade-in pb-20">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-display font-semibold text-white">Moderasi</h1>
        <p className="text-sm text-zinc-400">Tinjau server baru, kelola partner, dan tangani pelanggaran.</p>
      </header>

      <dl className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Antrean review" value={pending.length} highlight={pending.length > 0} />
        <Stat label="Tayang" value={approved.length} />
        <Stat label="Online sekarang" value={onlineNow} />
        <Stat label="Ditolak / dibekukan" value={blocked.length} />
      </dl>

      {/* Queue first: it is the only list that needs a decision. Oldest submission on top. */}
      <section className="flex flex-col gap-4" aria-labelledby="queue">
        <h2 id="queue" className="text-lg font-display font-semibold text-white">
          Antrean review <span className="text-zinc-400 font-normal">({pending.length})</span>
        </h2>
        {pending.length === 0 ? (
          <div className="p-10 border border-zinc-800 bg-zinc-950/80 text-center rounded-xl text-sm text-zinc-300">
            Antrean kosong. Server baru akan muncul di sini.
          </div>
        ) : (
          pending.map((s: any) => <ReviewCard key={s._id.toString()} server={s} />)
        )}
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="live">
        <h2 id="live" className="text-lg font-display font-semibold text-white">
          Tayang <span className="text-zinc-400 font-normal">({approved.length})</span>
        </h2>
        {approved.length === 0 ? (
          <p className="text-sm text-zinc-400">Belum ada server yang tayang.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-zinc-800 border border-zinc-800 rounded-xl bg-zinc-950/80">
            {approved.map((s: any) => (
              <CompactRow key={s._id.toString()} server={s}>
                <form action={togglePartner}>
                  <input type="hidden" name="serverId" value={s._id.toString()} />
                  <SubmitButton
                    className={`${BTN} ${s.isEterShopPartner ? "text-amber-200 bg-amber-500/15 hover:bg-amber-500/25" : "text-zinc-300 hover:bg-white/5"}`}
                  >
                    <Star size={16} weight={s.isEterShopPartner ? "fill" : "regular"} aria-hidden />
                    {s.isEterShopPartner ? "Partner" : "Jadikan partner"}
                  </SubmitButton>
                </form>
                <ConfirmActionButton
                  action={banServer}
                  fields={{ serverId: s._id.toString() }}
                  tone="warning"
                  title={`Bekukan ${s.name}?`}
                  body="Server hilang dari semua daftar publik dan halamannya jadi 404. Owner melihat alasannya di dashboard. Bisa dibatalkan kapan saja."
                  reasonField={{ name: "reason", label: "Alasan (dilihat owner)", placeholder: "Contoh: IP mengarah ke server lain" }}
                  confirmLabel="Bekukan server"
                  label={<><Prohibit size={16} aria-hidden /> Bekukan</>}
                  className={`${BTN} text-orange-300 hover:bg-orange-500/10`}
                />
              </CompactRow>
            ))}
          </ul>
        )}
      </section>

      {blocked.length > 0 && (
        <section className="flex flex-col gap-3" aria-labelledby="blocked">
          <h2 id="blocked" className="text-lg font-display font-semibold text-white">
            Ditolak & dibekukan <span className="text-zinc-400 font-normal">({blocked.length})</span>
          </h2>
          <ul className="flex flex-col divide-y divide-zinc-800 border border-zinc-800 rounded-xl bg-zinc-950/80">
            {blocked.map((s: any) => (
              <CompactRow key={s._id.toString()} server={s} note={s.rejectionReason}>
                <form action={unbanServer}>
                  <input type="hidden" name="serverId" value={s._id.toString()} />
                  <SubmitButton className={`${BTN} text-emerald-300 hover:bg-emerald-500/10`}>
                    <ArrowCounterClockwise size={16} aria-hidden /> Tayangkan
                  </SubmitButton>
                </form>
                <HardDelete server={s} />
              </CompactRow>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 bg-zinc-950/80 ${highlight ? "border-amber-500/40" : "border-zinc-800"}`}>
      <dt className="text-xs text-zinc-400">{label}</dt>
      <dd className={`text-2xl font-display font-semibold ${highlight ? "text-amber-200" : "text-white"}`}>{value}</dd>
    </div>
  );
}

function HardDelete({ server }: { server: any }) {
  return (
    <ConfirmActionButton
      action={deleteServer}
      fields={{ serverId: server._id.toString() }}
      tone="danger"
      title={`Hapus permanen ${server.name}?`}
      body="Data server, vote, dan riwayatnya dihapus dari database. Ini tidak bisa dibatalkan."
      requireText={server.name}
      confirmLabel="Hapus permanen"
      label={<><Trash size={16} aria-hidden /> Hapus</>}
      className={`${BTN} text-zinc-400 hover:text-rose-300 hover:bg-rose-500/10`}
    />
  );
}

function StatusLine({ server }: { server: any }) {
  if (server.serverType === "REALM") return <span className="text-purple-200">Realm</span>;
  const checked = server.liveStatus?.lastChecked;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`live-dot ${server.liveStatus?.isOnline ? "is-online" : ""}`} aria-hidden />
      {server.liveStatus?.isOnline ? `Online, ${server.liveStatus.currentPlayers || 0} pemain` : "Offline"}
      {checked && <span className="text-zinc-400">· dicek {timeAgo(checked)}</span>}
      {server.liveStatus?.version && <span className="text-zinc-400">· {server.liveStatus.version}</span>}
    </span>
  );
}

function ReviewCard({ server }: { server: any }) {
  const id = server._id.toString();
  const wa = waLink(server.ownerWhatsApp);
  const address = displayAddress(server);

  return (
    <article className="border border-zinc-800 rounded-xl bg-zinc-950/80 overflow-hidden">
      <div className="grid md:grid-cols-[220px_1fr]">
        <div className="relative aspect-video md:aspect-auto md:min-h-full bg-zinc-900">
          <SafeImage src={server.bannerUrl} fallbackName={server.name} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute left-3 bottom-3 w-12 h-12 rounded-lg overflow-hidden border border-zinc-700 bg-black">
            <SafeImage src={server.logoUrl} fallbackName={server.name} alt={`Logo ${server.name}`} className="w-full h-full object-cover text-xs" />
          </div>
        </div>

        <div className="p-4 sm:p-5 flex flex-col gap-3 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <h3 className="font-display text-lg font-semibold text-white">{server.name}</h3>
              <p className="text-xs text-zinc-400">
                {server.serverType === "REALM" ? "Realm" : server.platform || "CROSSPLAY"} · dikirim {timeAgo(server.createdAt)}
              </p>
            </div>
            {address && (
              <span className="ip-chip max-w-full">
                <span className="ip-chip-caret" aria-hidden>&gt;</span>
                <span className="truncate">{address}</span>
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap text-xs font-mono text-zinc-300">
            <StatusLine server={server} />
            {server.serverType !== "REALM" && (
              <form action={pingServerNow}>
                <input type="hidden" name="serverId" value={id} />
                <SubmitButton pendingLabel="Mengecek..." className={`${BTN} text-zinc-200 border border-zinc-700 hover:border-zinc-500`}>
                  <ArrowsClockwise size={16} aria-hidden /> Ping sekarang
                </SubmitButton>
              </form>
            )}
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed line-clamp-3">{plainExcerpt(server.description, 320, server.name)}</p>

          {server.tags?.length > 0 && (
            <p className="text-xs font-mono text-zinc-400">{server.tags.join(" · ")}</p>
          )}

          <div className="flex flex-wrap gap-1">
            {server.videoUrl && (
              <a href={server.videoUrl} target="_blank" rel="noopener noreferrer" className={`${BTN} text-zinc-300 hover:bg-white/5`}>
                <FilmStrip size={16} aria-hidden /> Tonton trailer
              </a>
            )}
            <Link href={`/server/${server.slug}`} target="_blank" className={`${BTN} text-zinc-300 hover:bg-white/5`}>
              <ArrowSquareOut size={16} aria-hidden /> Pratinjau halaman
            </Link>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className={`${BTN} text-emerald-300 hover:bg-emerald-500/10`}>
                <WhatsappLogo size={16} weight="fill" aria-hidden /> Chat owner
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800 px-3 py-2 flex flex-wrap items-center gap-2">
        <form action={approveServer}>
          <input type="hidden" name="serverId" value={id} />
          <SubmitButton pendingLabel="Menayangkan..." className={`${BTN} bg-emerald-500 text-zinc-950 font-semibold hover:bg-emerald-400`}>
            <CheckCircle size={16} weight="bold" aria-hidden /> Setujui & tayangkan
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
          label={<><XCircle size={16} aria-hidden /> Tolak</>}
          className={`${BTN} text-rose-300 hover:bg-rose-500/10`}
        />
        <span className="ml-auto">
          <HardDelete server={server} />
        </span>
      </div>
    </article>
  );
}

function CompactRow({ server, note, children }: { server: any; note?: string; children: React.ReactNode }) {
  const wa = waLink(server.ownerWhatsApp);
  return (
    <li className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Link href={`/server/${server.slug}`} target="_blank" className="font-display font-semibold text-white hover:underline underline-offset-4 truncate">
            {server.name}
          </Link>
          {server.moderationStatus !== "APPROVED" && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-md border border-zinc-700 text-zinc-300">
              {server.moderationStatus === "BANNED" ? "Dibekukan" : "Ditolak"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap text-xs font-mono text-zinc-300">
          <StatusLine server={server} />
          <span className="text-zinc-400">{server.metrics?.votes || 0} vote · {server.metrics?.impressions || 0} dilihat</span>
        </div>
        {note && <p className="text-xs text-zinc-400">Alasan: {note}</p>}
      </div>
      <div className="flex items-center gap-1 flex-wrap">
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" aria-label={`Chat owner ${server.name}`} className={`${BTN} text-emerald-300 hover:bg-emerald-500/10`}>
            <WhatsappLogo size={16} weight="fill" aria-hidden />
          </a>
        )}
        {children}
      </div>
    </li>
  );
}
