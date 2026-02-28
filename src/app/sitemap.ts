import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Force the exact canonical domain to prevent www/non-www duplicate indexation issues
    const baseUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://mediacitydubai.com';

    const posts = await prisma.post.findMany({ select: { slug: true, updatedAt: true } });
    const events = await prisma.event.findMany({ select: { slug: true, updatedAt: true } });
    const tools = await prisma.tool.findMany({ select: { slug: true, updatedAt: true } });
    const kpis = await prisma.kpi.findMany({ select: { slug: true, updatedAt: true } });

    const postCategories = await prisma.post.findMany({ distinct: ['category'], select: { category: true } });
    const toolCategories = await prisma.tool.findMany({ distinct: ['category'], select: { category: true } });

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

    const kpiUrls = kpis.map((kpi: { slug: string, updatedAt: Date }) => ({
        url: `${baseUrl}/kpi/${kpi.slug}`,
        lastModified: kpi.updatedAt,
    }));

    const postCategoryUrls = postCategories.map((c: { category: string }) => ({
        url: `${baseUrl}/forum/category/${encodeURIComponent(c.category)}`,
        lastModified: new Date(),
    }));

    const toolCategoryUrls = toolCategories.map((c: { category: string }) => ({
        url: `${baseUrl}/tools/category/${encodeURIComponent(c.category)}`,
        lastModified: new Date(),
    }));

    return [
        { url: baseUrl, lastModified: new Date() },
        { url: `${baseUrl}/events`, lastModified: new Date() },
        { url: `${baseUrl}/tools`, lastModified: new Date() },
        { url: `${baseUrl}/forum`, lastModified: new Date() },
        { url: `${baseUrl}/about`, lastModified: new Date() },
        { url: `${baseUrl}/kpi`, lastModified: new Date() },
        ...postUrls,
        ...eventUrls,
        ...toolUrls,
        ...kpiUrls,
        ...postCategoryUrls,
        ...toolCategoryUrls,
    ];
}
