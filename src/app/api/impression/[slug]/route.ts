import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import connectToDatabase from '@/lib/db';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { Server } from '@/models/Server';

// Increment impressions when a server profile page is opened.
// One count per visitor IP per server per hour, so refreshing or a curl loop cannot inflate it.
type Params = { params: Promise<{ slug: string }> };

export async function POST(_req: Request, { params }: Params) {
  const { slug } = await params;
  const ip = getClientIp(await headers());

  try {
    const limit = await rateLimit(`imp:${slug}:${ip}`, 1, 3600);
    if (!limit.ok) {
      // Not an error for the visitor: the view was simply already counted.
      return NextResponse.json({ success: true, counted: false });
    }

    await connectToDatabase();
    await Server.findOneAndUpdate(
      { slug, moderationStatus: 'APPROVED' },
      { $inc: { 'metrics.impressions': 1 } }
    );
    return NextResponse.json({ success: true, counted: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
