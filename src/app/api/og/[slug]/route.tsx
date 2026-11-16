import { ImageResponse } from "next/og";
import connectToDatabase from "@/lib/db";
import { Server } from "@/models/Server";
import { displayAddress } from "@/lib/server-queries";
import { OG_COLORS, StatusIcon, fetchImageDataUri } from "@/lib/og-shared";

export const runtime = "nodejs"; // mongoose needs Node APIs

const SIZE = { width: 1200, height: 630 };
const PLATFORM: Record<string, string> = { CROSSPLAY: "Java + Bedrock", JAVA: "Java", BEDROCK: "Bedrock" };

// Share card for /server/[slug]: what a friend sees in WhatsApp or Discord before tapping.
// It answers "is it up, how busy, what do I type" in one glance.
export async function GET(_req: Request, props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  let server: any = null;
  try {
    await connectToDatabase();
    server = await Server.findOne({ slug, moderationStatus: "APPROVED" })
      .select("name slug serverType platform ipAddress port realmCode bannerUrl liveStatus metrics isEterShopPartner tags")
      .lean();
  } catch (err) {
    console.error("og card db error:", err);
  }

  const host = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://eterverse.vercel.app").host;

  if (!server) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: "100%", height: "100%", background: OG_COLORS.bg, alignItems: "center", justifyContent: "center", color: OG_COLORS.muted, fontSize: 44 }}>
          EterVerse · Server Minecraft Indonesia
        </div>
      ),
      { ...SIZE, headers: { "Cache-Control": "public, max-age=300" } }
    );
  }

  const isRealm = server.serverType === "REALM";
  const online = !!server.liveStatus?.isOnline;
  const players = server.liveStatus?.currentPlayers || 0;
  const maxPlayers = server.liveStatus?.maxPlayers || 0;
  const banner = await fetchImageDataUri(server.bannerUrl);
  const address = displayAddress(server);
  const name: string = server.name.length > 34 ? `${server.name.slice(0, 33)}…` : server.name;
  const meta = [isRealm ? "Realm" : PLATFORM[server.platform || "CROSSPLAY"], ...(server.tags || []).slice(0, 2)].join(" · ");

  return new ImageResponse(
    (
      <div style={{ display: "flex", position: "relative", width: "100%", height: "100%", background: OG_COLORS.bg, color: OG_COLORS.text, fontFamily: "sans-serif" }}>
        {banner && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={banner} alt="" width={760} height={630} style={{ position: "absolute", right: 0, top: 0, width: 760, height: 630, objectFit: "cover", opacity: 0.55 }} />
        )}
        <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(90deg, #09090B 38%, rgba(9,9,11,0.75) 62%, rgba(9,9,11,0.2) 100%)" }} />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "56px 64px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>
              <span>Eter</span>
              <span style={{ color: OG_COLORS.muted }}>Verse</span>
            </div>
            {server.isEterShopPartner && (
              <div style={{ display: "flex", border: `2px solid ${OG_COLORS.gold}`, color: OG_COLORS.gold, borderRadius: 10, padding: "6px 16px", fontSize: 24 }}>
                Partner
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 820 }}>
            <div style={{ display: "flex", fontSize: 28, color: OG_COLORS.muted }}>{meta}</div>
            <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>{name}</div>

            {!isRealm && (
              <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 34, color: online ? OG_COLORS.cyan : OG_COLORS.muted }}>
                <StatusIcon online={online} size={38} />
                <span>{online ? `Online · ${players.toLocaleString("id-ID")}${maxPlayers ? ` / ${maxPlayers.toLocaleString("id-ID")}` : ""} pemain` : "Sedang offline"}</span>
              </div>
            )}

            {address && (
              <div style={{ display: "flex", alignItems: "center", gap: 16, alignSelf: "flex-start", border: `2px solid ${OG_COLORS.border}`, background: "rgba(0,0,0,0.7)", borderRadius: 12, padding: "14px 24px", fontSize: 38, fontFamily: "monospace" }}>
                <span style={{ color: OG_COLORS.cyan, fontWeight: 700 }}>&gt;</span>
                <span>{address.length > 36 ? `${address.slice(0, 35)}…` : address}</span>
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 26, color: OG_COLORS.muted }}>
            <div style={{ display: "flex", gap: 28 }}>
              <span>{(server.metrics?.votes || 0).toLocaleString("id-ID")} vote</span>
              {server.metrics?.rating > 0 && <span>Rating {Number(server.metrics.rating).toFixed(1)}</span>}
            </div>
            <span>{host}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      // Fresh enough for live status, cached enough that a viral link does not hammer Mongo.
      headers: { "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600" },
    }
  );
}
