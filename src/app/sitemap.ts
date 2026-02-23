import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://media-city-dubai.vercel.app';

    // Fetch dynamic routes from database
    const posts = await prisma.post.findMany({ select: { slug: true, updatedAt: true } });
    const events = await prisma.event.findMany({ select: { slug: true, updatedAt: true } });
    const tools = await prisma.tool.findMany({ select: { slug: true, updatedAt: true } });

    const postUrls = posts.map(post => ({
        url: `${baseUrl}/forum/topic/${post.slug}`,
        lastModified: post.updatedAt,
    }));

    const eventUrls = events.map(event => ({
        url: `${baseUrl}/events/${event.slug}`,
        lastModified: event.updatedAt,
    }));

    const toolUrls = tools.map((tool) => ({
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
