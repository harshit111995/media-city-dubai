import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { tools } from '@/data/tools';
import ToolsList from '@/components/ToolsList';
import styles from '@/styles/tools.module.css';

export const metadata: Metadata = {
    title: 'AdTech & MarTech Tools Directory | Media City Dubai',
    description: 'Explore the best advertising and marketing technology tools. Reviews, pricing, and features of top platforms used by Dubai media professionals.',
    openGraph: {
        title: 'AdTech & MarTech Tools Directory',
        description: 'Curated list of essential tools for the digital media ecosystem.',
        siteName: 'Media City Dubai',
    },
};

export default function ToolsPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'AdTech & MarTech Tools Directory',
        description: 'Directory of software tools for marketing and advertising.',
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: tools.map((tool, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `https://mediacitydubai.com/tools/${tool.slug}`,
                name: tool.name,
            })),
        },
    };

    return (
        <div className={styles.container}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <header className={styles.pageHeader}>
                <h1 className={`${styles.title} text-gradient !text-5xl mb-4`}>Tools Directory</h1>
                <p className={styles.description}>
                    Discover and compare the technology powering the future of media.
                    From programmatic platforms to creative suites.
                </p>

                <div className="flex gap-4 justify-center mt-6 flex-wrap">
                    <Link href="/tools/category/AdTech" className="px-4 py-2 rounded-full border border-white/10 hover:border-accent hover:text-accent transition-colors">AdTech</Link>
                    <Link href="/tools/category/MarTech" className="px-4 py-2 rounded-full border border-white/10 hover:border-accent hover:text-accent transition-colors">MarTech</Link>
                    <Link href="/tools/category/AI%20Tools" className="px-4 py-2 rounded-full border border-white/10 hover:border-accent hover:text-accent transition-colors">AI Tools</Link>
                    <Link href="/tools/category/Analytics" className="px-4 py-2 rounded-full border border-white/10 hover:border-accent hover:text-accent transition-colors">Analytics</Link>
                </div>
            </header>

            <ToolsList tools={tools} />
        </div>
    );
}
