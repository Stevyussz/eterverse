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
        <div style={{ display: "flex", width: "100%", height: "100%", background: OG_COLORS.bg, alignItems: "center", justifyContent: "center", color: OG_COLORS.ink, fontSize: 44, fontWeight: 700 }}>
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

  // Same language as the site: cream panel framed in ink, prismarine top bar, the trailer
  // "screen" on the right, the IP as a dark chip with a gold caret.
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: OG_COLORS.bg, color: OG_COLORS.ink, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 84, padding: "0 56px", background: OG_COLORS.prism, color: "#FFFFFF", borderBottom: `6px solid ${OG_COLORS.ink}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 34, fontWeight: 800 }}>
            <div style={{ display: "flex", width: 34, height: 34, background: "#7A44B5", border: `5px solid ${OG_COLORS.prismL}` }} />
            <span>Eter</span>
            <span style={{ color: OG_COLORS.prismL, marginLeft: -14 }}>Verse</span>
          </div>
          {server.isEterShopPartner && (
            <div style={{ display: "flex", background: OG_COLORS.goldL, color: OG_COLORS.ink, border: `4px solid ${OG_COLORS.ink}`, padding: "4px 16px", fontSize: 26, fontWeight: 700 }}>
              Partner
            </div>
          )}
        </div>

        <div style={{ display: "flex", flex: 1, padding: "40px 56px", gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 20, flex: 1 }}>
            <div style={{ display: "flex", fontSize: 28, color: OG_COLORS.muted }}>{meta}</div>
            <div style={{ display: "flex", fontSize: 68, fontWeight: 800, lineHeight: 1.05 }}>{name}</div>

            {!isRealm && (
              <div style={{ display: "flex", alignItems: "center", gap: 14, alignSelf: "flex-start", background: OG_COLORS.panel, border: `4px solid ${OG_COLORS.ink}`, padding: "8px 18px", fontSize: 30, color: online ? OG_COLORS.onlineText : OG_COLORS.muted }}>
                <StatusIcon online={online} size={30} />
                <span>{online ? `${players.toLocaleString("id-ID")}${maxPlayers ? ` / ${maxPlayers.toLocaleString("id-ID")}` : ""} online` : "Sedang offline"}</span>
              </div>
            )}

            {address && (
              <div style={{ display: "flex", alignItems: "center", gap: 16, alignSelf: "flex-start", background: OG_COLORS.ink, color: "#F7EFDC", padding: "14px 24px", fontSize: 36, fontFamily: "monospace" }}>
                <span style={{ color: OG_COLORS.gold, fontWeight: 700 }}>&gt;</span>
                <span>{address.length > 30 ? `${address.slice(0, 29)}…` : address}</span>
              </div>
            )}

            <div style={{ display: "flex", gap: 28, fontSize: 26, color: OG_COLORS.muted }}>
              <span>{(server.metrics?.votes || 0).toLocaleString("id-ID")} vote</span>
              {server.metrics?.rating > 0 && <span>Rating {Number(server.metrics.rating).toFixed(1)}</span>}
              <span>{host}</span>
            </div>
          </div>

          {banner && (
            <div style={{ display: "flex", width: 420, height: 420, alignSelf: "center", border: `6px solid ${OG_COLORS.ink}`, background: OG_COLORS.screen }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={banner} alt="" width={408} height={408} style={{ width: 408, height: 408, objectFit: "cover" }} />
            </div>
          )}
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
