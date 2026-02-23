import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Dynamically retrieve the exact domain the user is accessing this sitemap from.
    // This perfectly solves Google's "url is not allowed" error by ensuring 
    // the sitemap URLs always 100% match the Search Console property domain.
    const headersList = await headers();
    const domain = headersList.get('host') || 'media-city-dubai.vercel.app';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${domain}`;

    // Fetch dynamic routes from database
    const posts = await prisma.post.findMany({ select: { slug: true, updatedAt: true } });
    const events = await prisma.event.findMany({ select: { slug: true, updatedAt: true } });
    const tools = await prisma.tool.findMany({ select: { slug: true, updatedAt: true } });

    const postUrls = posts.map((post: { slug: string, updatedAt: Date }) => ({
        url: `${baseUrl}/forum/topic/${post.slug}`,
        lastModified: post.updatedAt,
    }));

    const eventUrls = events.map((event: { slug: string, updatedAt: Date }) => ({
        url: `${baseUrl}/events/${event.slug}`,
        lastModified: event.updatedAt,
    }));

    const toolUrls = tools.map((tool: { slug: string, updatedAt: Date }) => ({
        url: `${baseUrl}/tools/${tool.slug}`,
        lastModified: tool.updatedAt,
    }));

    return [
        { url: baseUrl, lastModified: new Date() },
        { url: `${baseUrl}/events`, lastModified: new Date() },
        { url: `${baseUrl}/tools`, lastModified: new Date() },
        { url: `${baseUrl}/forum`, lastModified: new Date() },
        { url: `${baseUrl}/about`, lastModified: new Date() },
        ...postUrls,
        ...eventUrls,
        ...toolUrls,
    ];
}
