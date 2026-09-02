import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Server } from '@/models/Server';
import util from 'minecraft-server-util';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: Request) {
  // Vercel Cron attaches Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    
    const servers = await Server.find({ moderationStatus: 'APPROVED' }).select('_id ipAddress port').lean();
    
    if (!servers.length) {
      return NextResponse.json({ message: 'No servers to ping' });
    }

    const updates = await Promise.all(servers.map(async (srv: any) => {
      try {
        const result = await util.status(srv.ipAddress, srv.port || 25565, { timeout: 3000 });
        return {
          id: srv._id,
          status: {
            isOnline: true,
            currentPlayers: result.players.online,
            maxPlayers: result.players.max,
            lastChecked: new Date(),
          }
        };
      } catch (err) {
        return {
          id: srv._id,
          status: {
            isOnline: false,
            currentPlayers: 0,
            maxPlayers: 0,
            lastChecked: new Date(),
          }
        };
      }
    }));

    // Bulk write updates to MongoDB
    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: update.id },
        update: { $set: { liveStatus: update.status } }
      }
    }));

    await Server.bulkWrite(bulkOps);

    return NextResponse.json({ success: true, updatedCount: updates.length });
  } catch (error) {
    console.error('Cron ping error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
