import type { UptimeSummary } from "@/lib/server-status";

const DAY_LABEL = new Intl.DateTimeFormat("id-ID", { weekday: "short", timeZone: "UTC" });

// Server-rendered SVG: no chart library and no client JS, so it costs nothing on weak phones.
export function UptimePanel({ summary, version }: { summary: UptimeSummary | null; version?: string }) {
  if (!summary) return null;

  const max = Math.max(1, ...summary.daily.map((d) => d.players ?? 0));
  const W = 280;
  const H = 72;
  const gap = 8;
  const barW = (W - gap * (summary.daily.length - 1)) / summary.daily.length;
  const label =
    summary.checks === 0
      ? "Belum ada data status"
      : `Uptime ${summary.uptimePct}% dari ${summary.checks} pengecekan dalam 7 hari, puncak ${summary.peakPlayers} pemain`;

  return (
    <section className="rounded-xl border border-zinc-800/80 bg-zinc-950/80 p-5 flex flex-col sm:flex-row sm:items-end gap-5" aria-labelledby="uptime-title">
      <div className="flex flex-col gap-3 sm:w-48 shrink-0">
        <h2 id="uptime-title" className="text-sm font-display font-semibold text-zinc-200">Status 7 Hari</h2>
        {summary.checks === 0 ? (
          <p className="text-sm text-zinc-400">Riwayat mulai dicatat. Angka muncul setelah server dicek beberapa kali.</p>
        ) : (
          <dl className="grid grid-cols-2 sm:grid-cols-1 gap-3">
            <div>
              <dt className="text-xs font-mono text-zinc-400">Uptime</dt>
              <dd className="text-2xl font-display font-semibold text-white">{summary.uptimePct}%</dd>
            </div>
            <div>
              <dt className="text-xs font-mono text-zinc-400">Puncak pemain</dt>
              <dd className="text-2xl font-display font-semibold text-white">{summary.peakPlayers.toLocaleString("id-ID")}</dd>
            </div>
          </dl>
        )}
        {version && <p className="text-xs font-mono text-zinc-400 break-words">Versi: {version}</p>}
      </div>

      {summary.checks > 0 && (
        <figure className="flex-1 min-w-0">
          <svg viewBox={`0 0 ${W} ${H + 18}`} className="w-full h-auto" role="img" aria-label={label}>
            {summary.daily.map((d, i) => {
              const x = i * (barW + gap);
              const h = d.players === null ? 0 : Math.max(2, (d.players / max) * H);
              const isToday = i === summary.daily.length - 1;
              return (
                <g key={d.day}>
                  {d.players === null ? (
                    <rect x={x} y={H - 2} width={barW} height={2} fill="#3f3f46" />
                  ) : (
                    <rect x={x} y={H - h} width={barW} height={h} rx={2} fill={isToday ? "#22D3EE" : "#52525b"} />
                  )}
                  <text x={x + barW / 2} y={H + 14} textAnchor="middle" fontSize="10" fill="#a1a1aa" fontFamily="var(--font-mono)">
                    {DAY_LABEL.format(new Date(`${d.day}T00:00:00Z`))}
                  </text>
                </g>
              );
            })}
          </svg>
          <figcaption className="text-xs font-mono text-zinc-400 mt-1">
            Pemain terbanyak per hari. Batang tipis abu-abu: belum ada pengecekan hari itu.
          </figcaption>
        </figure>
      )}
    </section>
  );
}
