import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import connectToDatabase from '@/lib/db';
import { Server } from '@/models/Server';
import { Vote } from '@/models/Vote';

type Params = { params: Promise<{ slug: string }> };

export async function POST(_req: Request, { params }: Params) {
  const { slug } = await params;

  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

  try {
    await connectToDatabase();

    const server = await Server.findOne({ slug, moderationStatus: 'APPROVED' }).select('_id');
    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    // Try inserting vote — will throw if duplicate (unique index)
    await Vote.create({ serverId: server._id, ipAddress: ip });

    // Increment the vote counter on the server
    const updated = await Server.findByIdAndUpdate(
      server._id,
      { $inc: { 'metrics.votes': 1 } },
      { new: true }
    ).select('metrics.votes');

    return NextResponse.json({ success: true, votes: updated?.metrics?.votes ?? 0 });
  } catch (err: any) {
    if (err.code === 11000) {
      // Duplicate key = already voted in last 24h
      return NextResponse.json({ error: 'already_voted', message: 'You already voted for this server in the last 24 hours.' }, { status: 409 });
    }
    console.error('Vote error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
