import { ImageResponse } from 'next/og';
import connectToDatabase from '@/lib/db';
import { Server } from '@/models/Server';
import { StatusIcon, OG_COLORS } from '@/lib/og-shared';

export const runtime = 'nodejs'; // Use nodejs because mongoose connection fails in pure edge without extra setup

export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
  try {
    const params = await props.params;
    const slug = params.slug;

    await connectToDatabase();
    // Banned servers must not keep advertising through an embedded EterVerse widget.
    const server = await Server.findOne({ slug, moderationStatus: 'APPROVED' }).lean();

    if (!server) {
      return new ImageResponse(
        (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: OG_COLORS.panel, color: OG_COLORS.muted, fontSize: 24, border: `4px solid ${OG_COLORS.ink}` }}>
            Server Not Found
          </div>
        ),
        { width: 400, height: 100 }
      );
    }

    const isOnline = server.liveStatus?.isOnline;
    const currentPlayers = server.liveStatus?.currentPlayers || 0;
    const maxPlayers = server.liveStatus?.maxPlayers || 0;

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: OG_COLORS.panel,
            border: `4px solid ${OG_COLORS.ink}`,
            borderTop: `10px solid ${OG_COLORS.prism}`,
            padding: '16px 24px',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 13, color: OG_COLORS.muted, marginBottom: 4 }}>Status di EterVerse</span>
              <span style={{ fontSize: 24, fontWeight: 'bold', color: OG_COLORS.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px' }}>
                {server.name}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <StatusIcon online={!!isOnline} size={22} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: 20, fontWeight: 'bold', color: isOnline ? OG_COLORS.onlineText : OG_COLORS.muted }}>
                  {isOnline ? `${currentPlayers.toLocaleString('id-ID')} / ${maxPlayers.toLocaleString('id-ID')}` : 'Offline'}
                </span>
                {/* The subtitle used to say "players online" even when the server was offline. */}
                <span style={{ fontSize: 12, color: OG_COLORS.muted }}>{isOnline ? 'pemain online' : 'server tidak merespons'}</span>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 480,
        height: 120,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
