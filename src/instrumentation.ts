import type { Instrumentation } from "next";

// Server error reporting without a third-party SDK:
// - every error lands in the Vercel logs as one structured JSON line (searchable by digest)
// - if ERROR_WEBHOOK_URL is set (a Discord channel webhook works), a short alert is posted
// Alerts for the same error are throttled per server instance so a hot loop cannot flood
// the channel. Nothing about the visitor (IP, cookies, headers) is included.

const lastSent = new Map<string, number>();
const THROTTLE_MS = 5 * 60 * 1000;

export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  const error = err as Error & { digest?: string };
  const message = error?.message || String(err);
  const digest = error?.digest;

  const entry = {
    level: "error",
    source: "onRequestError",
    message,
    digest,
    path: request.path,
    method: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
    renderSource: "renderSource" in context ? context.renderSource : undefined,
    stack: error?.stack?.split("\n").slice(0, 6).join("\n"),
  };
  console.error(JSON.stringify(entry));

  const webhook = process.env.ERROR_WEBHOOK_URL;
  if (!webhook) return;

  const key = `${context.routePath}:${message}`;
  const now = Date.now();
  if (now - (lastSent.get(key) ?? 0) < THROTTLE_MS) return;
  lastSent.set(key, now);

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Discord reads `content`; Slack-compatible hooks read `text`.
      body: JSON.stringify({
        content: `Error di ${context.routePath} (${request.method} ${request.path})\n${message.slice(0, 300)}${digest ? `\ndigest: ${digest}` : ""}`,
        text: `Error di ${context.routePath}: ${message.slice(0, 300)}`,
      }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // Reporting must never throw from the error path.
  }
};
