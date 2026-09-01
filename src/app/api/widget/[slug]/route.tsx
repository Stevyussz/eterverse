import { ImageResponse } from 'next/og';
import connectToDatabase from '@/lib/db';
import { Server } from '@/models/Server';

export const runtime = 'nodejs'; // Use nodejs because mongoose connection fails in pure edge without extra setup

export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
  try {
    const params = await props.params;
    const slug = params.slug;

    await connectToDatabase();
    const server = await Server.findOne({ slug }).lean();

    if (!server) {
      return new ImageResponse(
        (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: '#09090b', color: '#a1a1aa', fontSize: 24, border: '2px solid #27272a' }}>
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
            backgroundColor: '#050505',
            border: '2px solid rgba(255,255,255,0.1)',
            borderLeft: '4px solid #22D3EE',
            padding: '16px 24px',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 12, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 4 }}>EterVerse Live</span>
              <span style={{ fontSize: 24, fontWeight: 'bold', color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px' }}>
                {server.name}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: isOnline ? '#22c55e' : '#ef4444',
                boxShadow: isOnline ? '0 0 10px #22c55e' : 'none',
              }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: 20, fontWeight: 'bold', color: isOnline ? '#22D3EE' : '#a1a1aa' }}>
                  {isOnline ? `${currentPlayers.toLocaleString()} / ${maxPlayers.toLocaleString()}` : 'OFFLINE'}
                </span>
                <span style={{ fontSize: 10, color: '#71717a' }}>PLAYERS ONLINE</span>
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
