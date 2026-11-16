import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectToDatabase from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { Server } from '@/models/Server';
import { Favorite, MAX_FAVORITES } from '@/models/Favorite';

type Params = { params: Promise<{ slug: string }> };

/** Toggles a favorite. Body { favorite: boolean } sets it explicitly so double taps stay consistent. */
export async function POST(req: Request, { params }: Params) {
  const { slug } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: 'login_required' }, { status: 401 });
  }

  const limit = await rateLimit(`fav:${userId}`, 60, 3600);
  if (!limit.ok) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  const body = await req.json().catch(() => ({}));
  const want = typeof body?.favorite === 'boolean' ? body.favorite : null;

  try {
    await connectToDatabase();
    const server = await Server.findOne({ slug, moderationStatus: 'APPROVED' }).select('_id');
    if (!server) return NextResponse.json({ error: 'not_found' }, { status: 404 });

    const existing = await Favorite.exists({ userId, serverId: server._id });
    const target = want ?? !existing;

    if (target && !existing) {
      if ((await Favorite.countDocuments({ userId })) >= MAX_FAVORITES) {
        return NextResponse.json({ error: 'limit', message: `Maksimal ${MAX_FAVORITES} server favorit.` }, { status: 409 });
      }
      await Favorite.create({ userId, serverId: server._id }).catch((err) => {
        if (err?.code !== 11000) throw err; // a parallel tap already saved it
      });
    } else if (!target && existing) {
      await Favorite.deleteOne({ userId, serverId: server._id });
    }
    return NextResponse.json({ favorited: target });
  } catch (err) {
    console.error('favorite error:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
