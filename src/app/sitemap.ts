import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    const eventUrls = events.map((event: { slug: string, updatedAt: Date }) => ({
        url: `${baseUrl}/events/${event.slug}`,
        lastModified: event.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const toolUrls = tools.map((tool: { slug: string, updatedAt: Date }) => ({
        url: `${baseUrl}/tools/${tool.slug}`,
        lastModified: tool.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    const kpiUrls = kpis.map((kpi: { slug: string, updatedAt: Date }) => ({
        url: `${baseUrl}/kpi/${kpi.slug}`,
        lastModified: kpi.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    const postCategoryUrls = postCategories.map((c: { category: string }) => ({
        url: `${baseUrl}/forum/category/${encodeURIComponent(c.category)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    const toolCategoryUrls = toolCategories.map((c: { category: string }) => ({
        url: `${baseUrl}/tools/category/${encodeURIComponent(c.category)}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [
        // Core pages — highest priority
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${baseUrl}/events`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/forum`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/kpi`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        // Tools & features
        { url: `${baseUrl}/media-planner`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/media-metrics`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
        // Legal pages
        { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/gdpr`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        // Dynamic content
        ...postUrls,
        ...eventUrls,
        ...toolUrls,
        ...kpiUrls,
        ...postCategoryUrls,
        ...toolCategoryUrls,
    ];
}
