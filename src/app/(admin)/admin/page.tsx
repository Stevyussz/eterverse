import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { Sprite } from "@/components/pixel/PixelArt";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { DashHeader } from "@/components/dashboard/DashHeader";
import { ConfirmActionButton } from "@/components/dashboard/ConfirmActionButton";
import { SubmitButton } from "@/components/dashboard/SubmitButton";
import { BTN, Stat, ReviewCard, CompactRow, HardDelete } from "@/components/admin/ModerationCards";
import { banServer, unbanServer, togglePartner } from "./actions";

export default async function AdminModerationPage() {
  await connectToDatabase();

  const [pending, approved, blocked] = await Promise.all([
    Server.find({ moderationStatus: "PENDING" }).sort({ createdAt: 1 }).lean(),
    Server.find({ moderationStatus: "APPROVED" }).sort({ "metrics.votes": -1 }).lean(),
    Server.find({ moderationStatus: { $in: ["REJECTED", "BANNED"] as any } }).sort({ createdAt: -1 }).lean(),
  ]);
  const onlineNow = approved.filter((s: any) => s.liveStatus?.isOnline).length;

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-10 px-pop pb-20">
      <DashHeader title="Moderasi" sprite="server">Tinjau server baru, kelola partner, dan tangani pelanggaran.</DashHeader>

      <dl className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <Stat label="Antrean review" value={pending.length} highlight={pending.length > 0} />
        <Stat label="Tayang" value={approved.length} />
        <Stat label="Online sekarang" value={onlineNow} />
        <Stat label="Ditolak / dibekukan" value={blocked.length} />
      </dl>

      {/* Queue first: it is the only list that needs a decision. Oldest submission on top. */}
      <section className="flex flex-col gap-4" aria-labelledby="queue">
        <h2 id="queue" className="px-title text-2xl text-ink">
          Antrean review ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <div className="px-flat p-10 text-center flex flex-col items-center gap-3">
            <Sprite name="chestOpen" size={48} />
            <p className="text-sm text-ink-2">Antrean kosong. Server baru akan muncul di sini.</p>
          </div>
        ) : (
          pending.map((s: any) => <ReviewCard key={s._id.toString()} server={s} />)
        )}
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="live">
        <h2 id="live" className="px-title text-2xl text-ink">
          Tayang ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="text-sm text-ink-2">Belum ada server yang tayang.</p>
        ) : (
          <ul className="px-panel flex flex-col [&>li+li]:border-t-2 [&>li+li]:border-ink/15">
            {approved.map((s: any) => (
              <CompactRow key={s._id.toString()} server={s}>
                <form action={togglePartner}>
                  <input type="hidden" name="serverId" value={s._id.toString()} />
                  <SubmitButton
                    className={`${BTN} ${s.isEterShopPartner ? "px-btn-gold" : "px-btn-cream"}`}
                  >
                    <PixelIcon name="sparkle" size={12} />
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
                  label={<><PixelIcon name="ban" size={12} /> Bekukan</>}
                  className={`${BTN} px-btn-cream !text-redstone`}
                />
              </CompactRow>
            ))}
          </ul>
        )}
      </section>

      {blocked.length > 0 && (
        <section className="flex flex-col gap-3" aria-labelledby="blocked">
          <h2 id="blocked" className="px-title text-2xl text-ink">
            Ditolak & dibekukan ({blocked.length})
          </h2>
          <ul className="px-panel flex flex-col [&>li+li]:border-t-2 [&>li+li]:border-ink/15">
            {blocked.map((s: any) => (
              <CompactRow key={s._id.toString()} server={s} note={s.rejectionReason}>
                <form action={unbanServer}>
                  <input type="hidden" name="serverId" value={s._id.toString()} />
                  <SubmitButton className={BTN}>
                    <PixelIcon name="refresh" size={12} /> Tayangkan
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

