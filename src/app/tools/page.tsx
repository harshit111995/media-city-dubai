import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import ToolsList from '@/components/ToolsList';
import styles from '@/styles/tools.module.css';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
    title: 'AdTech & MarTech Tools Directory | Media City Dubai',
    description: 'Explore the best advertising and marketing technology tools. Reviews, pricing, and features of top platforms used by Dubai media professionals.',
    openGraph: {
        title: 'AdTech & MarTech Tools Directory',
        description: 'Curated list of essential tools for the digital media ecosystem.',
        siteName: 'Media City Dubai',
    },
};

export const dynamic = 'force-dynamic';

export default async function ToolsPage() {
    const dbTools = await prisma.tool.findMany({
        orderBy: { title: 'asc' }
    });

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'AdTech & MarTech Tools Directory',
        description: 'Directory of software tools for marketing and advertising.',
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: dbTools.map((tool: { slug: string, title: string }, index: number) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `https://media-city-dubai.vercel.app/tools/${tool.slug}`,
                name: tool.title,
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
                    <Link href="/kpi" className="px-5 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:border-red-500/50 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.1)] flex items-center space-x-2 relative group overflow-hidden">
                        <span className="relative z-10 font-medium">KPI Calculators</span>
                        <div className="absolute inset-0 bg-red-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full z-0"></div>
                    </Link>
                    <Link href="/tools/category/AdTech" className="px-4 py-2 rounded-full border border-white/10 hover:border-accent hover:text-accent transition-colors">AdTech</Link>
                    <Link href="/tools/category/MarTech" className="px-4 py-2 rounded-full border border-white/10 hover:border-accent hover:text-accent transition-colors">MarTech</Link>
                    <Link href="/tools/category/AI%20Tools" className="px-4 py-2 rounded-full border border-white/10 hover:border-accent hover:text-accent transition-colors">AI Tools</Link>
                    <Link href="/tools/category/Analytics" className="px-4 py-2 rounded-full border border-white/10 hover:border-accent hover:text-accent transition-colors">Analytics</Link>
                </div>
            </header>

            <ToolsList tools={dbTools} />
        </div>
    );
}
