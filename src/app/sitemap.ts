import { MetadataRoute } from 'next';
import connectToDatabase from '@/lib/db';
import { Server } from '@/models/Server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://eterverse.com';
  
  try {
    await connectToDatabase();
    
    // Fetch all APPROVED servers for SEO indexing
    const servers = await Server.find({ moderationStatus: 'APPROVED' })
      .select('slug createdAt')
      .lean();
      
    const serverRoutes = servers.map((server) => ({
      url: `${baseUrl}/server/${server.slug}`,
      lastModified: server.createdAt,
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    }));
    
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/discover`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      ...serverRoutes,
    ];
  } catch (error) {
    // Fallback if DB fails during build
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      }
    ];
  }
}
