import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Server } from '@/models/Server';

// Increment impressions when a server profile page is opened
type Params = { params: Promise<{ slug: string }> };

export async function POST(_req: Request, { params }: Params) {
  const { slug } = await params;
  try {
    await connectToDatabase();
    await Server.findOneAndUpdate(
      { slug, moderationStatus: 'APPROVED' },
      { $inc: { 'metrics.impressions': 1 } }
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
