"use client";

// Replaces the root layout when the layout itself crashes, so it cannot rely on globals.css,
// fonts or providers: plain inline styles only, in the site's dark palette.
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, minHeight: "100vh", background: "#09090B", color: "#FAFAFA", fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <title>EterVerse sedang bermasalah</title>
        <div role="alert" style={{ maxWidth: 420, textAlign: "center", border: "1px solid #27272a", borderRadius: 12, padding: 32, background: "#0c0c0f" }}>
          <h1 style={{ fontSize: 22, margin: "0 0 12px" }}>EterVerse sedang bermasalah</h1>
          <p style={{ fontSize: 14, color: "#d4d4d8", lineHeight: 1.6, margin: "0 0 16px" }}>
            Coba muat ulang sebentar lagi. Kalau tetap gagal, kirim kode di bawah ke admin.
          </p>
          {error.digest && <p style={{ fontFamily: "monospace", fontSize: 12, color: "#a1a1aa" }}>Kode: {error.digest}</p>}
          <button
            onClick={retry}
            style={{ minHeight: 44, padding: "0 20px", borderRadius: 6, border: 0, background: "#FAFAFA", color: "#09090B", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
          >
            Coba lagi
          </button>
        </div>
      </body>
    </html>
  );
}
