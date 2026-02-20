import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, ExternalLink, Globe } from 'lucide-react';
import { tools } from '@/data/tools';
import styles from '@/styles/tools.module.css';

interface Props {
    params: {
        slug: string; // Use slug to match folder structure if needed, or stick to id logic
    };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const tool = tools.find((t) => t.slug === id);

    if (!tool) return { title: 'Tool Not Found' };

    return {
        title: `${tool.name} Review & Features | Media City Dubai`,
        description: tool.description,
    };
}

export default async function ToolDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const tool = tools.find((t) => t.slug === id);

    if (!tool) notFound();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.name,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description: tool.description,
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
                        <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center font-bold text-2xl text-accent">
                            {tool.name.substring(0, 2)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-playfair">{tool.name}</h1>
                            <span className="text-accent text-sm uppercase font-semibold">{tool.category}</span>
                        </div>
                    </div>

                    <p className="text-lg leading-relaxed text-gray-200 mb-8">
                        {tool.description}
                    </p>

                    <h2 className="text-xl font-bold mb-4 font-playfair text-accent">Key Features</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tool.features.map((feature, idx) => (
                            <li key={idx} className={styles.featureItem}>
                                <Check className={styles.checkIcon} size={18} />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </main>

                <aside className={styles.sidebar}>
                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">At a Glance</h3>

                        <div className="space-y-4">
                            <div>
                                <span className="block text-sm text-gray-400">Pricing Model</span>
                                <span className="font-medium">{tool.pricing}</span>
                            </div>

                            <div>
                                <span className="block text-sm text-gray-400">Website</span>
                                <a href={tool.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                                    Visit Site <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>


                    </div>
                </aside>
            </div>
        </div>
    );
}
