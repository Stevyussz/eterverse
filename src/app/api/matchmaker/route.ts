import { groq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { Server } from '@/models/Server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Fetch all APPROVED servers with minimal fields to save AI context window
    const servers = await Server.find({ moderationStatus: 'APPROVED' })
      .select('slug name description tags')
      .lean();

    if (!servers.length) {
      return NextResponse.json({ results: [] });
    }

    // Build context for the AI
    const serverContext = servers.map((s: any) => `ID:${s.slug} | Name:${s.name} | Tags:${s.tags.join(',')} | Desc:${s.description}`).join('\n');

    const result = await generateObject({
      model: groq('llama-3.1-8b-instant'),
      system: `You are the EterVerse AI Matchmaker. You analyze user prompts looking for Minecraft servers and match them against the provided server database.
      Return the top 3 best matching server IDs (slugs) based on the user's intent. If no good match, return an empty array.
      
      Server Database:
      ${serverContext}`,
      prompt: `User query: "${prompt}"`,
      schema: z.object({
        matches: z.array(z.string()).describe("Array of server slugs that best match the query"),
      }),
    });

    const matchedSlugs = result.object.matches;
    
    // Fetch full data for the matched slugs
    const matchedServers = await Server.find({ slug: { $in: matchedSlugs } }).lean();
    
    // Sort matchedServers to match the AI's output order and serialize fields for ServerCard
    const sortedResults = matchedSlugs
      .map((slug: string) => {
        const s: any = matchedServers.find((server: any) => server.slug === slug);
        if (!s) return null;
        return {
          ...s,
          _id: s._id.toString(),
          ownerId: s.ownerId?.toString(),
          onlinePlayers: s.liveStatus?.currentPlayers || 0,
          maxPlayers: s.liveStatus?.maxPlayers || 0,
          votes: s.metrics?.votes || 0,
          rating: s.metrics?.rating || 0,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ results: sortedResults });
  } catch (error) {
    console.error('Matchmaker error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
