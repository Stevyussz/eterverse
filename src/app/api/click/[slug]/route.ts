import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import connectToDatabase from '@/lib/db';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { Server } from '@/models/Server';

// A "click" is a join intent: the player copied the IP or tapped Main Langsung. The owner
// dashboard showed a "Total Klik" figure that nothing ever incremented, so it was always 0.
// Counted once per visitor IP per server per hour so repeated copying does not inflate it.
type Params = { params: Promise<{ slug: string }> };

export async function POST(_req: Request, { params }: Params) {
  const { slug } = await params;
  const ip = getClientIp(await headers());

  try {
    const limit = await rateLimit(`clk:${slug}:${ip}`, 1, 3600);
    if (!limit.ok) return NextResponse.json({ success: true, counted: false });

    await connectToDatabase();
    await Server.updateOne({ slug, moderationStatus: 'APPROVED' }, { $inc: { 'metrics.clicks': 1 } });
    return NextResponse.json({ success: true, counted: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
