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

    return {
        title: `${tool.title} Review & Features | Media City Dubai`,
        description: tool.description,
        openGraph: {
            title: tool.title,
            description: tool.description,
            type: 'website'
        }
    };
}

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const tool = await prisma.tool.findUnique({ where: { slug } });

    if (!tool) notFound();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.title,
        applicationCategory: tool.category,
        operatingSystem: 'Web',
        description: tool.description,
        url: tool.url,
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
    };

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

                    <p className="text-lg leading-relaxed text-gray-200 mb-8">
                        {tool.description}
                    </p>

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
                        </div>


                    </div>
                </aside>
            </div>
        </div>
    );
}
