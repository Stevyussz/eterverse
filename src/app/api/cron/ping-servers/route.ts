import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { checkAndStore } from '@/lib/server-status';
import { Server } from '@/models/Server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Pings at a time: mcstatus.io is a shared public API, and a burst of every server at once
// would also blow past maxDuration on a large directory.
const CONCURRENCY = 8;

export async function GET(req: Request) {
  // Vercel Cron attaches Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    // Realms are cloud-managed and expose no status endpoint.
    const servers = await Server.find({ moderationStatus: 'APPROVED', serverType: { $ne: 'REALM' } })
      .select('_id ipAddress port platform serverType')
      .sort({ 'liveStatus.lastChecked': 1 }) // stalest first, in case the run is cut short
      .lean();

    if (!servers.length) {
      return NextResponse.json({ message: 'No servers to ping' });
    }

    let online = 0;
    let failed = 0;
    for (let i = 0; i < servers.length; i += CONCURRENCY) {
      const batch = servers.slice(i, i + CONCURRENCY);
      const results = await Promise.allSettled(batch.map((s: any) => checkAndStore(s)));
      for (const r of results) {
        if (r.status === 'rejected') failed++;
        else if (r.value?.online) online++;
      }
    }

    return NextResponse.json({ success: true, checked: servers.length, online, failed });
  } catch (error) {
    console.error('Cron ping error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
