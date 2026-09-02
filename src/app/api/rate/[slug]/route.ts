import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectToDatabase from '@/lib/db';
import { Server } from '@/models/Server';
import { Rating } from '@/models/Rating';

type Params = { params: Promise<{ slug: string }> };

export async function POST(req: Request, { params }: Params) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Login required to rate a server.' }, { status: 401 });
  }

  const body = await req.json();
  const stars = Number(body.stars);
  if (!stars || stars < 1 || stars > 5) {
    return NextResponse.json({ error: 'Invalid rating. Must be 1-5 stars.' }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const server = await Server.findOne({ slug, moderationStatus: 'APPROVED' }).select('_id');
    if (!server) {
      return NextResponse.json({ error: 'Server not found' }, { status: 404 });
    }

    // Upsert the user's rating for this server
    await Rating.findOneAndUpdate(
      { serverId: server._id, userId: session.user.id },
      { stars },
      { upsert: true, new: true }
    );

    // Recalculate average rating across all ratings for this server
    const ratingAgg = await Rating.aggregate([
      { $match: { serverId: server._id } },
      { $group: { _id: null, avg: { $avg: '$stars' }, count: { $sum: 1 } } },
    ]);

    const newAvg = ratingAgg[0]?.avg ?? stars;
    await Server.findByIdAndUpdate(server._id, { 'metrics.rating': parseFloat(newAvg.toFixed(2)) });

    return NextResponse.json({ success: true, rating: parseFloat(newAvg.toFixed(2)) });
  } catch (err: any) {
    console.error('Rating error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
