import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import Link from "next/link";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { DashHeader } from "@/components/dashboard/DashHeader";
import { escapeRegex, safeSearchTerm } from "@/lib/text";
import { displayAddress } from "@/lib/server-queries";
import { ConfirmActionButton } from "@/components/dashboard/ConfirmActionButton";
import { SubmitButton } from "@/components/dashboard/SubmitButton";
import { banServer, deleteServer, togglePartner, unbanServer } from "../actions";

const STATUSES = [
  { id: "", label: "Semua" },
  { id: "APPROVED", label: "Tayang" },
  { id: "PENDING", label: "Menunggu" },
  { id: "REJECTED", label: "Ditolak" },
  { id: "BANNED", label: "Dibekukan" },
];

// Chip background + the status word: never colour alone.
const STATUS_STYLE: Record<string, string> = {
  APPROVED: "px-chip-prism",
  PENDING: "px-chip-gold",
  REJECTED: "!bg-redstone-l",
  BANNED: "!bg-redstone-l",
};

const BTN = "px-btn px-btn-cream px-btn-icon";

type Props = { searchParams: Promise<{ q?: string; status?: string }> };

export default async function AdminDatabasePage({ searchParams }: Props) {
  const params = await searchParams;
  const q = safeSearchTerm(params.q);
  const status = STATUSES.some((s) => s.id === params.status) ? params.status! : "";

  await connectToDatabase();
  const filter: Record<string, unknown> = {};
  if (status) filter.moderationStatus = status;
  if (q) {
    const rx = { $regex: escapeRegex(q), $options: "i" };
    filter.$or = [{ name: rx }, { ipAddress: rx }, { slug: rx }];
  }
  const [servers, total] = await Promise.all([
    Server.find(filter).sort({ createdAt: -1 }).limit(200).lean(),
    Server.countDocuments({}),
  ]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 px-pop pb-20">
      <DashHeader title="Database server" sprite="chest">{total} server tersimpan. Cari, filter, dan kelola semuanya di sini.</DashHeader>

      <form method="GET" className="px-panel p-3 flex flex-col sm:flex-row gap-3" role="search">
        {status && <input type="hidden" name="status" value={status} />}
        <label className="relative flex-1">
          <span className="sr-only">Cari nama, IP, atau slug</span>
          <PixelIcon name="search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-2" />
          <input
            name="q"
            defaultValue={q}
            maxLength={60}
            placeholder="Cari nama, IP, atau slug"
            className="px-input !pl-10"
          />
        </label>
        <button type="submit" className="px-btn">
          Cari
        </button>
      </form>

      <nav className="filter-row" aria-label="Filter status">
        {STATUSES.map((s) => {
          const active = status === s.id;
          const qs = new URLSearchParams({ ...(q && { q }), ...(s.id && { status: s.id }) }).toString();
          return (
            <Link
              key={s.id || "all"}
              href={`/admin/database${qs ? `?${qs}` : ""}`}
              aria-current={active ? "page" : undefined}
              className="px-slot shrink-0 inline-flex items-center min-h-[40px] px-3.5 font-pixel text-sm"
            >
              {s.label}
            </Link>
          );
        })}
      </nav>

      {servers.length === 0 ? (
        <div className="px-flat p-10 text-center text-sm text-ink-2 flex flex-col items-center gap-3">
          {q || status ? "Tidak ada server yang cocok dengan filter ini." : "Database masih kosong."}
          {(q || status) && (
            <Link href="/admin/database" className="px-btn px-btn-cream px-btn-sm">Reset filter</Link>
          )}
        </div>
      ) : (
        // A list instead of a 5-column table: the table needed sideways scrolling on phones.
        <ul className="px-panel flex flex-col [&>li+li]:border-t-2 [&>li+li]:border-ink/15">
          {servers.map((s: any) => {
            const id = s._id.toString();
            return (
              <li key={id} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/server/${s.slug}`} target="_blank" className="font-pixel text-base text-ink hover:underline underline-offset-4 truncate">
                      {s.name}
                    </Link>
                    <span className={`px-chip !text-xs ${STATUS_STYLE[s.moderationStatus] ?? ""}`}>
                      {STATUSES.find((x) => x.id === s.moderationStatus)?.label ?? s.moderationStatus}
                    </span>
                    {s.isEterShopPartner && <span className="px-chip px-chip-gold !text-xs"><PixelIcon name="sparkle" size={10} />Partner</span>}
                  </div>
                  <p className="text-xs font-mono text-ink-2 truncate">
                    {displayAddress(s)} · {s.metrics?.votes || 0} vote · dibuat {new Date(s.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <form action={togglePartner}>
                    <input type="hidden" name="serverId" value={id} />
                    <SubmitButton
                      pendingLabel="..."
                      title={s.isEterShopPartner ? "Cabut partner" : "Jadikan partner"}
                      className={`${BTN} ${s.isEterShopPartner ? "px-btn-gold" : ""}`}
                    >
                      <PixelIcon name="sparkle" size={14} />
                      <span className="sr-only">{s.isEterShopPartner ? "Cabut partner" : "Jadikan partner"}</span>
                    </SubmitButton>
                  </form>

                  {s.moderationStatus === "BANNED" ? (
                    <form action={unbanServer}>
                      <input type="hidden" name="serverId" value={id} />
                      <SubmitButton className="px-btn px-btn-sm">
                        <PixelIcon name="refresh" size={12} /> Buka
                      </SubmitButton>
                    </form>
                  ) : (
                    <ConfirmActionButton
                      action={banServer}
                      fields={{ serverId: id }}
                      tone="warning"
                      title={`Bekukan ${s.name}?`}
                      body="Server hilang dari semua daftar publik. Owner melihat alasannya di dashboard."
                      reasonField={{ name: "reason", label: "Alasan (dilihat owner)" }}
                      confirmLabel="Bekukan server"
                      label={<><PixelIcon name="ban" size={14} /><span className="sr-only">Bekukan</span></>}
                      className={`${BTN} !text-redstone`}
                    />
                  )}

                  <ConfirmActionButton
                    action={deleteServer}
                    fields={{ serverId: id }}
                    tone="danger"
                    title={`Hapus permanen ${s.name}?`}
                    body="Data server, vote, dan riwayatnya dihapus dari database. Ini tidak bisa dibatalkan."
                    requireText={s.name}
                    confirmLabel="Hapus permanen"
                    label={<><PixelIcon name="trash" size={14} /><span className="sr-only">Hapus</span></>}
                    className={`${BTN} !text-redstone`}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
