import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Globe } from 'lucide-react';
import styles from '@/styles/tools.module.css';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        slug: string; // Use slug to match folder structure
    };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const tool = await prisma.tool.findUnique({ where: { slug } });

    if (!tool) return { title: 'Tool Not Found' };

    const title = `${tool.title} Review & Features | Media Tool Directory`;
    const description = tool.description.length > 150 
        ? tool.description.substring(0, 152) + '...' 
        : tool.description;

    return {
        title: title.substring(0, 60),
        description: description,
        alternates: {
            canonical: `/tools/${tool.slug}`,
        },
        openGraph: {
            title: tool.title,
            description: description,
            type: 'website',
            url: `https://mediacitydubai.com/tools/${tool.slug}`,
            siteName: 'Media City Dubai',
            images: [
                {
                    url: tool.imageUrl || 'https://mediacitydubai.com/images/forum-minimalist.png',
                    width: 1200,
                    height: 630,
                    alt: tool.title,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: tool.title,
            description: description,
            images: [tool.imageUrl || 'https://mediacitydubai.com/images/forum-minimalist.png'],
            site: '@mediacitydubai',
            creator: '@mediacitydubai',
        }
    };
}

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const tool = await prisma.tool.findUnique({ where: { slug } });

    if (!tool) notFound();

    const baseUrl = 'https://mediacitydubai.com';
    const pageUrl = `${baseUrl}/tools/${tool.slug}`;

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: tool.title,
            url: pageUrl,
            applicationCategory: tool.category,
            operatingSystem: 'Web',
            description: tool.description,
            ...(tool.imageUrl && { image: tool.imageUrl }),
            offers: {
                '@type': 'Offer',
                price: tool.pricing?.toLowerCase().includes('free') ? '0' : undefined,
                priceCurrency: 'USD',
                description: tool.pricing || 'See website for pricing',
            },
            publisher: {
                '@type': 'Organization',
                name: 'Media City Dubai',
                url: baseUrl,
            },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
                { '@type': 'ListItem', position: 2, name: 'Tools Directory', item: `${baseUrl}/tools` },
                { '@type': 'ListItem', position: 3, name: tool.title, item: pageUrl },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                {
                    '@type': 'Question',
                    name: `What is ${tool.title} used for?`,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: `${tool.title} is a premier solution in the ${tool.category} space, primarily used for ${tool.description.split('.')[0].toLowerCase()}.`
                    }
                },
                {
                    '@type': 'Question',
                    name: `Is there a free version of ${tool.title}?`,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: tool.pricing?.toLowerCase().includes('free')
                            ? `Yes, ${tool.title} offers a free tier: ${tool.pricing}.`
                            : `${tool.title} pricing model is ${tool.pricing}. Check their site for the latest trials.`
                    }
                }
            ]
        }
    ];

    return (
        <div className={styles.container}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Link href="/tools" className="flex items-center gap-2 text-accent mb-6 font-medium">
                <ArrowLeft size={20} /> Back to Directory
            </Link>

            <div className={styles.detailLayout}>
                <main className={styles.mainContent}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center font-bold text-2xl text-accent overflow-hidden relative">
                            {tool.imageUrl ? (
                                <img src={tool.imageUrl} alt={tool.title} className="w-full h-full object-cover" />
                            ) : (
                                tool.title.substring(0, 2)
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-playfair">{tool.title}</h1>
                            <span className="text-accent text-sm uppercase font-semibold">{tool.category}</span>
                        </div>
                    </div>

                    <div 
                        className="cms-content text-lg mb-8"
                        dangerouslySetInnerHTML={{ __html: tool.description }}
                    />

                    {tool.features && tool.features.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-white/10">Key Features</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {tool.features.map((feature: string, index: number) => (
                                    <div key={index} className="flex items-start gap-3 glass-panel p-4 rounded-lg">
                                        <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                                        <span className="text-gray-200">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>

                <aside className={styles.sidebar}>
                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">At a Glance</h3>

                        <div className="space-y-4">
                            {tool.pricing && (
                                <div className="mb-4">
                                    <span className="block text-sm text-gray-400 mb-1">Pricing Model</span>
                                    <div className="inline-block px-3 py-1 rounded bg-white/5 border border-white/10 font-medium">
                                        {tool.pricing}
                                    </div>
                                </div>
                            )}

                            <div>
                                <span className="block text-sm text-gray-400">Website</span>
                                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline break-all">
                                    Visit Site <ExternalLink size={14} className="flex-shrink-0" />
                                </a>
                            </div>

                            {/* Internal Cross-Link: KPIs */}
                            <div className="pt-4 mt-4 border-t border-white/10">
                                <span className="block text-sm text-gray-400 mb-3 uppercase tracking-tighter font-bold">Measure Performance</span>
                                <div className="space-y-2">
                                    {(await prisma.kpi.findMany({
                                        take: 3,
                                        orderBy: { title: 'asc' }
                                    })).map((k) => (
                                        <Link 
                                            key={k.id} 
                                            href={`/kpi/${k.slug}`}
                                            className="block text-sm text-gray-300 hover:text-accent transition-colors"
                                        >
                                            {k.title} Calculator →
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Similar Tools Section */}
            <div className="mt-16 pt-12 border-t border-white/10">
                <h2 className="text-3xl font-bold font-playfair mb-8">Similar {tool.category} Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(await prisma.tool.findMany({
                        where: {
                            category: tool.category,
                            NOT: { id: tool.id }
                        },
                        take: 3
                    })).map((similar) => (
                        <Link
                            key={similar.id}
                            href={`/tools/${similar.slug}`}
                            className="glass-panel p-6 rounded-xl hover:border-accent/50 transition-colors group"
                        >
                            <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                                {similar.title}
                            </h3>
                            <p className="text-gray-400 text-sm line-clamp-2">
                                {similar.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Tool FAQ Section */}
            <div className="mt-16 bg-white/5 rounded-2xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
                <div className="space-y-6">
                    <div>
                        <h4 className="text-lg font-bold mb-2 text-accent">What is {tool.title} used for?</h4>
                        <p className="text-gray-300">
                            {tool.title} is a premier solution in the {tool.category} space, primarily used for {tool.description.split('.')[0].toLowerCase()}.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-2 text-accent">Is there a free version of {tool.title}?</h4>
                        <p className="text-gray-300">
                            {tool.pricing?.toLowerCase().includes('free')
                                ? `Yes, ${tool.title} offers a free tier as part of its pricing model: ${tool.pricing}.`
                                : `Pricing for ${tool.title} starts with their ${tool.pricing} model. Check their website for the latest trials and tiers.`
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
