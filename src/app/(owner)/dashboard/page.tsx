import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import Link from "next/link";
import mongoose from "mongoose";
import {
  Eye,
  CursorClick,
  CaretUp,
  PencilSimple,
  WarningCircle,
  ArrowSquareOut,
  Gift,
  Code,
  CheckCircle,
  Circle,
  Plus,
  Prohibit,
} from "@phosphor-icons/react/dist/ssr";
import { revalidatePath } from "next/cache";
import { displayAddress, invalidateServerLists } from "@/lib/server-queries";
import { getUptimeSummary } from "@/lib/server-status";
import { DeleteServerButton } from "@/components/dashboard/DeleteServerButton";
import { LiveIcon } from "@/components/ui/LiveIcon";

const STATUS: Record<string, { label: string; className: string }> = {
  APPROVED: { label: "Tayang", className: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10" },
  PENDING: { label: "Menunggu review", className: "text-amber-200 border-amber-500/30 bg-amber-500/10" },
  REJECTED: { label: "Ditolak", className: "text-rose-300 border-rose-500/30 bg-rose-500/10" },
  BANNED: { label: "Dibekukan", className: "text-orange-300 border-orange-500/30 bg-orange-500/10" },
};

interface ChecklistItem {
  done: boolean;
  label: string;
  href: string;
}

// What still stands between this listing and players finding it. Each item links to the
// exact place it gets fixed, instead of a generic "complete your profile" nag.
function checklistFor(s: any): ChecklistItem[] {
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

export default async function DashboardOverview() {
  const session = await auth();
  const ownerIdentifier = session?.user?.id;

  await connectToDatabase();
  const myServers: any[] = await Server.find({ ownerId: ownerIdentifier }).sort({ createdAt: -1 }).lean();

  const uptimes = await Promise.all(
    myServers.map((s) =>
      s.serverType === "REALM" || s.moderationStatus !== "APPROVED"
        ? Promise.resolve(null)
        : getUptimeSummary(s._id.toString()).catch(() => null)
    )
  );

  const totals = myServers.reduce(
    (acc, s) => ({
      views: acc.views + (s.metrics?.impressions || 0),
      clicks: acc.clicks + (s.metrics?.clicks || 0),
      votes: acc.votes + (s.metrics?.votes || 0),
      online: acc.online + (s.liveStatus?.isOnline ? s.liveStatus?.currentPlayers || 0 : 0),
    }),
    { views: 0, clicks: 0, votes: 0, online: 0 }
  );
  const conversion = totals.views > 0 ? Math.round((totals.clicks / totals.views) * 1000) / 10 : null;

  async function deleteMyServer(formData: FormData) {
    "use server";
    const serverId = formData.get("serverId") as string;
    const session = await auth();
    if (!session?.user?.id || !mongoose.Types.ObjectId.isValid(serverId)) return;

    await connectToDatabase();
    // Only delete if the user owns it
    await Server.findOneAndDelete({ _id: serverId, ownerId: session.user.id });
    revalidatePath("/dashboard");
    invalidateServerLists();
  }

  const firstName = (session?.user?.name || "").split(" ")[0];

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 animate-fade-in pb-20">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-white">
            {firstName ? `Halo, ${firstName}` : "Dashboard"}
          </h1>
          <p className="text-zinc-400 font-body mt-1 text-sm">
            {myServers.length > 0
              ? "Pantau server kamu dan lengkapi yang masih kurang."
              : "Daftarkan server pertamamu untuk mulai tampil di EterVerse."}
          </p>
        </div>
        {/* One server per account: the button only exists while the account has none. */}
        {myServers.length === 0 && (
          <Link
            href="/dashboard/server/new"
            className="inline-flex items-center gap-2 min-h-[44px] bg-white text-zinc-950 px-4 rounded-md font-semibold text-sm hover:bg-zinc-200 transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Plus size={16} weight="bold" aria-hidden /> Daftarkan Server
          </Link>
        )}
      </header>

      {myServers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 sm:p-16 bg-zinc-950/80 border border-zinc-800 rounded-xl text-center gap-4">
          <h2 className="text-xl font-display font-semibold text-white">Belum ada server</h2>
          <p className="text-zinc-400 font-body max-w-md text-sm">
            Siapkan IP server, trailer pendek (video atau link YouTube), dan logo. Setelah dikirim, admin meninjau sebelum server tampil publik.
          </p>
          <Link
            href="/dashboard/server/new"
            className="inline-flex items-center min-h-[48px] bg-white text-zinc-950 px-6 rounded-md font-semibold hover:bg-zinc-200 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Daftarkan Server Pertamamu
          </Link>
        </div>
      ) : (
        <>
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Metric label="Halaman dilihat" value={totals.views} icon={<Eye size={18} aria-hidden />} />
            <Metric
              label="Salin IP / Main"
              value={totals.clicks}
              icon={<CursorClick size={18} aria-hidden />}
              note={conversion !== null ? `${conversion}% dari pengunjung` : undefined}
            />
            <Metric label="Total vote" value={totals.votes} icon={<CaretUp size={18} weight="bold" aria-hidden />} />
            <Metric label="Pemain online" value={totals.online} icon={<LiveIcon online={totals.online > 0} size={18} />} />
          </dl>

          <section className="flex flex-col gap-4" aria-labelledby="my-servers">
            <h2 id="my-servers" className="text-lg font-display font-semibold text-white">
              {myServers.length > 1 ? (
                <>Server kamu <span className="text-zinc-400 font-normal">({myServers.length})</span></>
              ) : (
                "Server kamu"
              )}
            </h2>
            {myServers.map((server, i) => (
              <ServerPanel
                key={server._id.toString()}
                server={server}
                uptime={uptimes[i]}
                deleteAction={deleteMyServer}
              />
            ))}
          </section>
        </>
      )}
    </div>
  );
}

function Metric({ label, value, icon, note }: { label: string; value: number; icon: React.ReactNode; note?: string }) {
  return (
    <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-xl flex flex-col gap-2">
      <dt className="flex items-center justify-between gap-2 text-xs text-zinc-400">
        {label}
        <span className="text-zinc-400">{icon}</span>
      </dt>
      <dd className="text-2xl font-display font-semibold text-white">{value.toLocaleString("id-ID")}</dd>
      {note && <dd className="text-xs font-mono text-zinc-400">{note}</dd>}
    </div>
  );
}

function ServerPanel({
  server,
  uptime,
  deleteAction,
}: {
  server: any;
  uptime: Awaited<ReturnType<typeof getUptimeSummary>> | null;
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
    <article className="bg-zinc-950/80 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display text-lg font-semibold text-white truncate">{server.name}</h3>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-md border ${status.className}`}>{status.label}</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap text-xs font-mono text-zinc-300">
              {!isRealm && (
                <span className="inline-flex items-center gap-1.5">
                  <LiveIcon online={!!server.liveStatus?.isOnline} />
                  {server.liveStatus?.isOnline ? `${server.liveStatus.currentPlayers || 0} online` : "Offline"}
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
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-sm">
          <Stat label="Dilihat" value={(server.metrics?.impressions || 0).toLocaleString("id-ID")} />
          <Stat label="Salin IP / Main" value={(server.metrics?.clicks || 0).toLocaleString("id-ID")} />
          <Stat label="Vote" value={(server.metrics?.votes || 0).toLocaleString("id-ID")} />
          <Stat
            label="Uptime 7 hari"
            value={uptime && uptime.uptimePct !== null ? `${uptime.uptimePct}%` : isRealm ? "Realm" : "Belum ada data"}
          />
        </dl>

        {server.moderationStatus === "REJECTED" && (
          <div role="note" className="bg-rose-500/5 border border-rose-500/25 px-4 py-3 rounded-lg flex items-start gap-3">
            <WarningCircle className="text-rose-300 mt-0.5 shrink-0" size={18} weight="fill" aria-hidden />
            <div className="text-sm">
              <p className="font-semibold text-rose-200">Ditolak admin</p>
              <p className="text-rose-200/90">{server.rejectionReason || "Tidak ada alasan yang ditulis."} Perbaiki lalu simpan ulang untuk ditinjau lagi.</p>
            </div>
          </div>
        )}
        {server.moderationStatus === "BANNED" && (
          <div role="note" className="bg-orange-500/5 border border-orange-500/25 px-4 py-3 rounded-lg flex items-start gap-3 text-sm text-orange-200">
            <Prohibit className="mt-0.5 shrink-0" size={18} aria-hidden />
            <span>
              Server ini dibekukan dan tidak tampil publik.
              {server.rejectionReason ? ` Alasan: ${server.rejectionReason}` : ""} Hubungi admin lewat Pusat Informasi.
            </span>
          </div>
        )}

        {doneCount < checklist.length && (
          <details className="group rounded-lg border border-zinc-800 bg-black/40">
            <summary className="cursor-pointer list-none min-h-[44px] px-4 flex items-center justify-between gap-3 text-sm text-zinc-200 focus-visible:outline-2 focus-visible:outline-white rounded-lg">
              <span>
                Lengkapi listing <span className="font-mono text-zinc-400">{doneCount}/{checklist.length}</span>
              </span>
              <span className="h-1.5 flex-1 max-w-40 rounded-full bg-zinc-800 overflow-hidden" aria-hidden>
                <span className="block h-full bg-eter-cyan" style={{ width: `${(doneCount / checklist.length) * 100}%` }} />
              </span>
            </summary>
            <ul className="px-4 pb-3 flex flex-col">
              {checklist.map((item) => (
                <li key={item.label}>
                  {item.done ? (
                    <span className="flex items-center gap-2 min-h-[36px] text-sm text-zinc-400">
                      <CheckCircle size={16} weight="fill" className="text-emerald-400" aria-hidden />
                      <span className="line-through decoration-zinc-600">{item.label}</span>
                    </span>
                  ) : (
                    <Link href={item.href} className="flex items-center gap-2 min-h-[36px] text-sm text-white hover:text-eter-cyan transition-colors focus-visible:outline-2 focus-visible:outline-white rounded">
                      <Circle size={16} className="text-zinc-500" aria-hidden />
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>

      <div className="border-t border-zinc-800 px-3 py-2 flex items-center gap-1 flex-wrap">
        <PanelAction href={`/dashboard/server/${id}/edit`} icon={<PencilSimple size={16} aria-hidden />} label="Edit" />
        {isLive && (
          <PanelAction href={`/server/${server.slug}`} icon={<ArrowSquareOut size={16} aria-hidden />} label="Lihat halaman" external />
        )}
        {!isRealm && <PanelAction href="/dashboard/tools/votifier" icon={<Gift size={16} aria-hidden />} label="Hadiah vote" />}
        {isLive && <PanelAction href="/dashboard/tools/widget" icon={<Code size={16} aria-hidden />} label="Widget" />}
        <span className="ml-auto">
          <DeleteServerButton serverId={id} serverName={server.name} deleteAction={deleteAction} />
        </span>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-zinc-400">{label}</dt>
      <dd className="font-mono text-white">{value}</dd>
    </div>
  );
}

function PanelAction({ href, icon, label, external = false }: { href: string; icon: React.ReactNode; label: string; external?: boolean }) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      className="inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-md text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-2 focus-visible:outline-white"
    >
      {icon}
      {label}
    </Link>
  );
}
