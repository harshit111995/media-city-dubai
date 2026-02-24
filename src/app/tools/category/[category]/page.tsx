import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import styles from '@/styles/tools.module.css';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        category: string;
    };
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
    const { category } = await params;
    const decodedCategory = decodeURIComponent(category);

    return {
        title: `${decodedCategory} Tools | Media City Dubai`,
        description: `Discover the best ${decodedCategory} solutions for media professionals in Dubai.`,
    };
}

export default async function ToolCategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    // Decode URL encoded category (e.g., AI%20Tools -> AI Tools)
    const decodedCategory = decodeURIComponent(category);

    // Case-insensitive comparison via Prisma
    const categoryTools = await prisma.tool.findMany({
        where: {
            category: {
                equals: decodedCategory,
                mode: 'insensitive' // case-insensitive match
            }
        },
        orderBy: { title: 'asc' }
    });

    if (categoryTools.length === 0) {
        return (
            <div className={styles.container}>
                <div className="text-center py-20">
                    <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
                    <Link href="/tools" className="text-accent hover:underline">Return to Tools Directory</Link>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <Link href="/tools" className="flex items-center gap-2 text-accent mb-6 font-medium">
                <ArrowLeft size={20} /> Back to All Tools
            </Link>

            <header className={styles.pageHeader}>
                <h1 className={`${styles.title} text-gradient !text-5xl mb-4`}>{decodedCategory}</h1>
                <p className={styles.description}>
                    Curated selection of top {decodedCategory} solutions.
                </p>
            </header>

            <div className={styles.grid}>
                {categoryTools.map((tool: { slug: string, id: string, imageUrl: string | null, title: string, category: string, description: string }) => (
                    <Link href={`/tools/${tool.slug}`} key={tool.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center font-bold text-xl text-accent overflow-hidden relative">
                                {tool.imageUrl ? (
                                    <img src={tool.imageUrl} alt={tool.title} className="w-full h-full object-cover" />
                                ) : (
                                    tool.title.substring(0, 2)
                                )}
                            </div>
                            <span className={styles.categoryTag}>{tool.category}</span>
                        </div>

                        <h2 className={styles.cardTitle}>{tool.title}</h2>
                        <p className={styles.shortDesc}>{tool.description.substring(0, 80)}...</p>

                        <div className={styles.cardFooter}>
                            <ArrowRight className="text-accent" size={20} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
