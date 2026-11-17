"use client";

// Replaces the root layout when the layout itself crashes, so it cannot rely on globals.css,
// fonts or providers: plain inline styles only, in the site's cream/ink palette.
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, minHeight: "100vh", background: "#F2EAD3", color: "#2E2216", fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <title>EterVerse sedang bermasalah</title>
        <div role="alert" style={{ maxWidth: 420, textAlign: "center", padding: 32, background: "#FFFBF0", boxShadow: "0 -3px 0 #2E2216, 0 3px 0 #2E2216, -3px 0 0 #2E2216, 3px 0 0 #2E2216, 6px 9px 0 rgba(46,34,22,0.22)" }}>
          <h1 style={{ fontSize: 22, margin: "0 0 12px" }}>EterVerse sedang bermasalah</h1>
          <p style={{ fontSize: 14, color: "#5E4A33", lineHeight: 1.6, margin: "0 0 16px" }}>
            Coba muat ulang sebentar lagi. Kalau tetap gagal, kirim kode di bawah ke admin.
          </p>
          {error.digest && <p style={{ fontFamily: "monospace", fontSize: 12, color: "#5E4A33" }}>Kode: {error.digest}</p>}
          <button
            onClick={retry}
            style={{ minHeight: 44, padding: "0 20px", border: 0, background: "#1D5E57", color: "#FFFFFF", boxShadow: "0 0 0 3px #2E2216", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
          >
            Coba lagi
          </button>
        </div>
      </body>
    </html>
  );
}
