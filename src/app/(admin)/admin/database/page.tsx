import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import Link from "next/link";
import { Trophy, Prohibit, Trash, MagnifyingGlass, ArrowCounterClockwise } from "@phosphor-icons/react/dist/ssr";
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

const STATUS_STYLE: Record<string, string> = {
  APPROVED: "text-emerald-300 border-emerald-500/30",
  PENDING: "text-amber-200 border-amber-500/30",
  REJECTED: "text-rose-300 border-rose-500/30",
  BANNED: "text-orange-300 border-orange-500/30",
};

const BTN = "inline-flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-2.5 rounded-md text-sm transition-colors focus-visible:outline-2 focus-visible:outline-white";

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
    <div className="max-w-6xl mx-auto flex flex-col gap-6 animate-fade-in pb-20">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-display font-semibold text-white">Database server</h1>
        <p className="text-sm text-zinc-400">{total} server tersimpan. Cari, filter, dan kelola semuanya di sini.</p>
      </header>

      <form method="GET" className="flex flex-col sm:flex-row gap-3" role="search">
        {status && <input type="hidden" name="status" value={status} />}
        <label className="relative flex-1">
          <span className="sr-only">Cari nama, IP, atau slug</span>
          <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} aria-hidden />
          <input
            name="q"
            defaultValue={q}
            maxLength={60}
            placeholder="Cari nama, IP, atau slug"
            className="w-full min-h-[44px] bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          />
        </label>
        <button type="submit" className="min-h-[44px] px-5 rounded-lg bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
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
              aria-current={active ? "true" : undefined}
              className={`shrink-0 inline-flex items-center min-h-[44px] sm:min-h-0 sm:py-1.5 px-3 rounded-full border text-xs font-mono transition-colors focus-visible:outline-2 focus-visible:outline-white ${
                active ? "bg-white text-zinc-950 border-white font-semibold" : "border-zinc-800 text-zinc-300 hover:border-zinc-600"
              }`}
            >
              {s.label}
            </Link>
          );
        })}
      </nav>

      {servers.length === 0 ? (
        <div className="p-10 border border-zinc-800 bg-zinc-950/80 text-center rounded-xl text-sm text-zinc-300 flex flex-col items-center gap-2">
          {q || status ? "Tidak ada server yang cocok dengan filter ini." : "Database masih kosong."}
          {(q || status) && (
            <Link href="/admin/database" className="text-white underline underline-offset-4 font-mono text-xs">Reset filter</Link>
          )}
        </div>
      ) : (
        // A list instead of a 5-column table: the table needed sideways scrolling on phones.
        <ul className="flex flex-col divide-y divide-zinc-800 border border-zinc-800 rounded-xl bg-zinc-950/80">
          {servers.map((s: any) => {
            const id = s._id.toString();
            return (
              <li key={id} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/server/${s.slug}`} target="_blank" className="font-display font-semibold text-white hover:underline underline-offset-4 truncate">
                      {s.name}
                    </Link>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-md border ${STATUS_STYLE[s.moderationStatus] ?? "text-zinc-300 border-zinc-700"}`}>
                      {STATUSES.find((x) => x.id === s.moderationStatus)?.label ?? s.moderationStatus}
                    </span>
                    {s.isEterShopPartner && <Trophy size={16} weight="fill" className="text-amber-400" aria-label="Partner" />}
                  </div>
                  <p className="text-xs font-mono text-zinc-400 truncate">
                    {displayAddress(s)} · {s.metrics?.votes || 0} vote · dibuat {new Date(s.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </div>

                <div className="flex items-center gap-1 flex-wrap">
                  <form action={togglePartner}>
                    <input type="hidden" name="serverId" value={id} />
                    <SubmitButton
                      pendingLabel="..."
                      title={s.isEterShopPartner ? "Cabut partner" : "Jadikan partner"}
                      className={`${BTN} ${s.isEterShopPartner ? "text-amber-300 bg-amber-500/10" : "text-zinc-400 hover:text-amber-300 hover:bg-amber-500/10"}`}
                    >
                      <Trophy size={16} weight={s.isEterShopPartner ? "fill" : "regular"} aria-hidden />
                      <span className="sr-only">{s.isEterShopPartner ? "Cabut partner" : "Jadikan partner"}</span>
                    </SubmitButton>
                  </form>

                  {s.moderationStatus === "BANNED" ? (
                    <form action={unbanServer}>
                      <input type="hidden" name="serverId" value={id} />
                      <SubmitButton className={`${BTN} text-emerald-300 hover:bg-emerald-500/10`}>
                        <ArrowCounterClockwise size={16} aria-hidden /> Buka
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
                      label={<><Prohibit size={16} aria-hidden /><span className="sr-only">Bekukan</span></>}
                      className={`${BTN} text-zinc-400 hover:text-orange-300 hover:bg-orange-500/10`}
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
                    label={<><Trash size={16} aria-hidden /><span className="sr-only">Hapus</span></>}
                    className={`${BTN} text-zinc-400 hover:text-rose-300 hover:bg-rose-500/10`}
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
