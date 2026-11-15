import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/auth';
import connectToDatabase from '@/lib/db';
import { getClientIp, rateLimit } from '@/lib/rate-limit';
import { Server } from '@/models/Server';
import { Vote, ensureVoteIndexes } from '@/models/Vote';
import { isValidMinecraftUsername, sendVotifierVote } from '@/lib/votifier';

type Params = { params: Promise<{ slug: string }> };

// Generous enough for a CGNAT exit shared by many players, low enough to slow account farms.
const VOTES_PER_IP_PER_DAY = 40;

export async function POST(req: Request, { params }: Params) {
  const { slug } = await params;
  const body = await req.json().catch(() => ({}));
  const username = isValidMinecraftUsername(body?.username) ? body.username : null;

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: 'login_required', message: 'Login dulu untuk vote server.' },
      { status: 401 }
    );
  }

  const ip = getClientIp(await headers());

  try {
    await connectToDatabase();
    await ensureVoteIndexes();

    const server = await Server.findOne({ slug, moderationStatus: 'APPROVED' }).select(
      '_id votifier.enabled +votifier.host +votifier.port +votifier.publicKey'
    );
    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    const ipLimit = await rateLimit(`vote-ip:${ip}`, VOTES_PER_IP_PER_DAY, 86400);
    if (!ipLimit.ok) {
      return NextResponse.json(
        { error: 'rate_limited', message: 'Terlalu banyak vote dari jaringan ini. Coba lagi nanti.' },
        { status: 429, headers: { 'Retry-After': String(ipLimit.retryAfterSec) } }
      );
    }

    // Unique index on { serverId, userId } rejects a second vote within the 24h TTL.
    await Vote.create({ serverId: server._id, userId, ipAddress: ip });

    const updated = await Server.findByIdAndUpdate(
      server._id,
      { $inc: { 'metrics.votes': 1 } },
      { new: true }
    ).select('metrics.votes');

    // The vote already counts; a reward failure must not turn it into an error for the player.
    let reward: 'sent' | 'failed' | 'skipped' = 'skipped';
    const v = server.votifier;
    if (v?.enabled && v.host && v.publicKey && username) {
      const result = await sendVotifierVote({
        host: v.host,
        port: v.port || 8192,
        publicKey: v.publicKey,
        username,
        address: ip,
      });
      reward = result.ok ? 'sent' : 'failed';
      await Server.updateOne(
        { _id: server._id },
        { $set: { 'votifier.lastResult': result.ok ? 'ok' : result.reason, 'votifier.lastSentAt': new Date() } }
      ).catch(() => {});
    }

    return NextResponse.json({ success: true, votes: updated?.metrics?.votes ?? 0, reward });
  } catch (err: unknown) {
    if ((err as { code?: number })?.code === 11000) {
      return NextResponse.json(
        { error: 'already_voted', message: 'Kamu sudah vote server ini dalam 24 jam terakhir.' },
        { status: 409 }
      );
    }
    console.error('Vote error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
