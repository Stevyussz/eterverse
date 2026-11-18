import { PixelIcon } from "@/components/pixel/PixelIcon";
import type { UptimeSummary } from "@/lib/server-status";

const DAY_LABEL = new Intl.DateTimeFormat("id-ID", { weekday: "short", timeZone: "UTC" });

// Server-rendered SVG: no chart library and no client JS, so it costs nothing on weak phones.
export function UptimePanel({ summary, version }: { summary: UptimeSummary | null; version?: string }) {
  if (!summary) return null;

  const max = Math.max(1, ...summary.daily.map((d) => d.players ?? 0));
  const label =
    summary.checks === 0
      ? "Belum ada data status"
      : `Uptime ${summary.uptimePct}% dari ${summary.checks} pengecekan dalam 7 hari, puncak ${summary.peakPlayers} pemain`;

  return (
    <section className="px-flat p-5 sm:p-6 flex flex-col sm:flex-row sm:items-stretch gap-6" aria-labelledby="uptime-title">
      <div className="flex flex-col gap-3 sm:w-52 shrink-0">
        <h2 id="uptime-title" className="px-title text-xl text-ink flex items-center gap-2">
          <PixelIcon name="signal" size={16} className="text-online" />
          Status 7 hari
        </h2>
        {summary.checks === 0 ? (
          <p className="text-sm text-ink-2">Riwayat mulai dicatat. Angka muncul setelah server dicek beberapa kali.</p>
        ) : (
          <dl className="grid grid-cols-2 gap-3">
            <div className="px-slot px-3 py-2">
              <dt className="text-xs text-ink-2">Uptime</dt>
              <dd className="text-xl font-bold text-ink tabular">{summary.uptimePct}%</dd>
            </div>
            <div className="px-slot px-3 py-2">
              <dt className="text-xs text-ink-2">Puncak</dt>
              <dd className="text-xl font-bold text-ink tabular">{summary.peakPlayers.toLocaleString("id-ID")}</dd>
            </div>
          </dl>
        )}
        {version && <p className="text-xs font-mono text-ink-2 break-words">Versi {version}</p>}
      </div>

      {/* Plain HTML bars: fixed 112px tall at any width (the scaled SVG grew huge labels on
          desktop). Server-rendered, no chart library, nothing to hydrate. */}
      {summary.checks > 0 && (
        <figure className="flex-1 min-w-0 flex flex-col gap-2" role="img" aria-label={label}>
          <div className="flex items-end gap-2 sm:gap-3 h-28 border-b-[3px] border-frame px-1">
            {summary.daily.map((d, i) => {
              const isToday = i === summary.daily.length - 1;
              const pct = d.players === null ? 0 : Math.max(6, Math.round((d.players / max) * 100));
              return (
                <div key={d.day} className="flex-1 h-full flex flex-col justify-end items-center gap-1" title={d.players === null ? "Belum dicek" : `${d.players} pemain`}>
                  {d.players !== null && <span className="text-[11px] text-ink-2 tabular">{d.players}</span>}
                  {d.players === null ? (
                    <div className="w-full h-1 bg-slot" />
                  ) : (
                    <div
                      className={`w-full px-grow-y ${isToday ? "bg-online" : "bg-prism"}`}
                      style={{ height: `${pct}%`, boxShadow: `inset 0 3px 0 0 ${isToday ? "#6DBA3A" : "#77C9BC"}` }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex gap-2 sm:gap-3 px-1" aria-hidden>
            {summary.daily.map((d, i) => (
              <span key={d.day} className={`flex-1 text-center font-pixel text-sm ${i === summary.daily.length - 1 ? "text-online-d" : "text-ink-2"}`}>
                {i === summary.daily.length - 1 ? "Ini" : DAY_LABEL.format(new Date(`${d.day}T00:00:00Z`))}
              </span>
            ))}
          </div>
          <figcaption className="text-xs text-ink-2">Pemain terbanyak per hari. Garis tipis: belum ada pengecekan hari itu.</figcaption>
        </figure>
      )}
    </section>
  );
}
