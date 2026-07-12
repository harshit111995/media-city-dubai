import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock } from 'lucide-react';
import styles from '@/styles/forum.module.css';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';


export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
    const { category } = await params;
    const decodedCategory = decodeURIComponent(category);

    return {
        title: `${decodedCategory} Community & Discussion | Media Forum`,
        description: `Join the latest ${decodedCategory} discussions and share your insights with media professionals in Dubai. Start a conversation today.`,
        alternates: {
            canonical: `/forum/category/${category}`,
        },
        openGraph: {
            title: `${decodedCategory} Discussions | Media City Dubai`,
            description: `Connect with peers in the ${decodedCategory} community. Insights and discussions for Dubai media pros.`,
            url: `https://mediacitydubai.com/forum/category/${category}`,
            siteName: 'Media City Dubai',
            locale: 'en_US',
            type: 'website',
            images: [
                {
                    url: 'https://mediacitydubai.com/images/forum-minimalist.png',
                    width: 1200,
                    height: 630,
                    alt: `${decodedCategory} Category`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${decodedCategory} Discussions | Media City Dubai`,
            description: `Join the ${decodedCategory} conversation in Dubai's media hub.`,
            images: ['https://mediacitydubai.com/images/forum-minimalist.png'],
            site: '@mediacitydubai',
            creator: '@mediacitydubai',
        },
    };
}

export default async function ForumCategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const decodedCategory = decodeURIComponent(category);

    const categoryTopics = await prisma.post.findMany({
        where: {
            category: decodedCategory,
            publishedAt: { lte: new Date() }
        },
        orderBy: { publishedAt: 'desc' },
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
                            <div className="flex items-start w-full">
                                {/* Thumbnail on left */}
                                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden relative mr-5 bg-white/5 border border-white/10 block">
                                    <Image 
                                        src={topic.thumbnail || topic.headerImage || (
                                            topic.category === 'Industry News' ? '/images/forum-minimalist.png' :
                                            topic.category === 'Career Advice' ? '/images/hero-minimalist.png' :
                                            '/images/events-minimalist.png'
                                        )}
                                        alt={topic.title}
                                        fill
                                        className="object-cover transition-transform hover:scale-105"
                                        sizes="80px"
                                    />
                                </div>
                                <div className={styles.topicMain}>
                                    <span className={styles.topicCategory}>{topic.category}</span>
                                    <Link href={`/forum/topic/${topic.slug}`} className={styles.topicTitle}>
                                        {topic.title}
                                    </Link>
                                    <p className="text-sm text-gray-400 mt-1 mb-2 line-clamp-2">
                                        {topic.shortDescription || topic.content.substring(0, 120) + '...'}
                                    </p>
                                    <div className={styles.topicMeta}>
                                        <span className="mr-4">by <span className="text-white">{topic.author}</span></span>
                                        <span className="flex items-center inline-flex gap-1">
                                            <Clock size={12} />
                                            {new Date(topic.publishedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            )}
        </div>
    );
}
