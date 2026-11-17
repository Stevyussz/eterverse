import { PixelIcon } from "@/components/pixel/PixelIcon";
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
    <section className="px-flat p-5 flex flex-col sm:flex-row sm:items-end gap-6" aria-labelledby="uptime-title">
      <div className="flex flex-col gap-3 sm:w-48 shrink-0">
        <h2 id="uptime-title" className="px-title text-lg text-ink flex items-center gap-2"><PixelIcon name="signal" size={14} className="text-online" />Status 7 hari</h2>
        {summary.checks === 0 ? (
          <p className="text-sm text-ink-2">Riwayat mulai dicatat. Angka muncul setelah server dicek beberapa kali.</p>
        ) : (
          <dl className="grid grid-cols-2 sm:grid-cols-1 gap-3">
            <div>
              <dt className="text-xs text-ink-2">Uptime</dt>
              <dd className="text-2xl font-bold text-ink tabular">{summary.uptimePct}%</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-2">Puncak pemain</dt>
              <dd className="text-2xl font-bold text-ink tabular">{summary.peakPlayers.toLocaleString("id-ID")}</dd>
            </div>
          </dl>
        )}
        {version && <p className="text-xs font-mono text-ink-2 break-words">Versi: {version}</p>}
      </div>

      {summary.checks > 0 && (
        <figure className="flex-1 min-w-0">
          <svg viewBox={`0 0 ${W} ${H + 18}`} className="w-full h-auto" shapeRendering="crispEdges" role="img" aria-label={label}>
            {summary.daily.map((d, i) => {
              const x = i * (barW + gap);
              const h = d.players === null ? 0 : Math.max(2, (d.players / max) * H);
              const isToday = i === summary.daily.length - 1;
              return (
                <g key={d.day}>
                  {d.players === null ? (
                    <rect x={x} y={H - 3} width={barW} height={3} fill="#C9B994" />
                  ) : (
                    <>
                      <rect x={x} y={H - h} width={barW} height={h} fill={isToday ? "#2F8F1F" : "#2E8077"} />
                      <rect x={x} y={H - h} width={barW} height={Math.min(3, h)} fill={isToday ? "#6DBA3A" : "#77C9BC"} />
                    </>
                  )}
                  <text x={x + barW / 2} y={H + 14} textAnchor="middle" fontSize="10" fill="#5E4A33" fontFamily="var(--font-pixelify)">
                    {DAY_LABEL.format(new Date(`${d.day}T00:00:00Z`))}
                  </text>
                </g>
              );
            })}
          </svg>
          <figcaption className="text-xs text-ink-2 mt-1">
            Pemain terbanyak per hari. Hijau: hari ini. Garis tipis: belum ada pengecekan hari itu.
          </figcaption>
        </figure>
      )}
    </section>
  );
}
