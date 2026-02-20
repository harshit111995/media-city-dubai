import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import styles from '@/styles/forum.module.css';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

interface Props {
    params: {
        category: string;
    };
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
    const { category } = await params;
    const decodedCategory = decodeURIComponent(category);

    return {
        title: `${decodedCategory} Discussions | Media City Dubai Forum`,
        description: `Join the conversation in ${decodedCategory}.`,
    };
}

export default async function ForumCategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const decodedCategory = decodeURIComponent(category);

    const categoryTopics = await prisma.post.findMany({
        where: { category: decodedCategory },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className={styles.container}>
            <Link href="/forum" className="flex items-center gap-2 text-accent mb-6 font-medium">
                <ArrowLeft size={20} /> Back to All Topics
            </Link>

            <header className={styles.header}>
                <div>
                    <h1 className={`${styles.title} text-gradient`}>{decodedCategory}</h1>
                    <p className="text-muted mt-2">Latest discussions in {decodedCategory}.</p>
                </div>

            </header>

            {categoryTopics.length === 0 ? (
                <div className="glass-panel p-8 text-center rounded-xl">
                    <h2 className="text-xl font-bold mb-2">No topics found</h2>
                    <p className="text-muted">Be the first to start a discussion in this category!</p>
                </div>
            ) : (
                <div className={styles.topicList}>
                    {categoryTopics.map((topic) => (
                        <div key={topic.id} className={styles.topicRow}>
                            <div className={styles.topicMain}>
                                <span className={styles.topicCategory}>{topic.category}</span>
                                <Link href={`/forum/topic/${topic.slug}`} className={styles.topicTitle}>
                                    {topic.title}
                                </Link>
                                <div className={styles.topicMeta}>
                                    <span className="mr-4">by <span className="text-white">{topic.author}</span></span>
                                    <span className="flex items-center inline-flex gap-1">
                                        <Clock size={12} />
                                        {new Date(topic.publishedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
