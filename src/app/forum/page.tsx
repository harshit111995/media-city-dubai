import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import styles from '@/styles/forum.module.css';
import { prisma } from '@/lib/prisma';
import { stripHtml, truncate } from '@/lib/utils';

export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
    title: 'Media Community Forum | Media City Dubai',
    description: 'Join the conversation. Discuss industry trends, career advice, and tech support with Dubai\'s media professionals.',
    alternates: {
        canonical: '/forum',
    },
    openGraph: {
        title: 'Media Community Forum | Media City Dubai',
        description: 'Connect with peers in Dubai\'s media and adtech community. Share insights and build your network.',
        url: 'https://mediacitydubai.com/forum',
        siteName: 'Media City Dubai',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: 'https://mediacitydubai.com/images/forum-minimalist.png',
                width: 1200,
                height: 630,
                alt: 'Media City Dubai Forum',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Media Community Forum | Media City Dubai',
        description: 'Discuss the latest industry trends with professionals in Media City Dubai.',
        images: ['https://mediacitydubai.com/images/forum-minimalist.png'],
        site: '@mediacitydubai',
        creator: '@mediacitydubai',
    },
};

export default async function ForumPage() {
    const forumTopics = await prisma.post.findMany({
        where: {
            publishedAt: { lte: new Date() }
        },
        orderBy: { publishedAt: 'desc' },
    });

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Media City Dubai Community Forum',
        description: 'Discussion board for media professionals.',
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: forumTopics.map((topic, index) => ({
                '@type': 'DiscussionForumPosting',
                position: index + 1,
                url: `https://mediacitydubai.com/forum/topic/${topic.slug}`,
                headline: topic.title,
                interactionStatistic: {
                    '@type': 'InteractionCounter',
                    interactionType: 'https://schema.org/CommentAction',
                    userInteractionCount: topic.replies,
                },
            })),
        },
    };

    return (
        <div className={styles.container}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <header className={styles.header}>
                <div>
                    <h1 className={`${styles.title} text-gradient`}>Community Forum</h1>
                    <p className="text-muted mt-2">Connect, share, and grow with your peers.</p>

                    <div className="flex gap-2 mt-4 text-sm">
                        <Link href="/forum/category/Industry%20News" className="text-accent hover:underline">Industry News</Link> •
                        <Link href="/forum/category/Career%20Advice" className="text-accent hover:underline">Career Advice</Link> •
                        <Link href="/forum/category/Tech%20Support" className="text-accent hover:underline">Tech Support</Link> •
                        <Link href="/forum/category/General%20Discussion" className="text-accent hover:underline">General</Link>
                    </div>
                </div>
            </header>

            <div className={styles.topicList}>
                {forumTopics.map((topic) => (
                    <div key={topic.id} className={styles.topicRow}>
                        <div className={styles.topicMain}>
                            <span className={styles.topicCategory}>{topic.category}</span>
                            <Link href={`/forum/topic/${topic.slug}`} className={styles.topicTitle}>
                                {topic.title}
                            </Link>
                            <p className="text-sm text-gray-400 mt-1 mb-2 line-clamp-2">
                                {truncate(stripHtml(topic.shortDescription || topic.content), 120)}
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
                ))}
            </div>
        </div>
    );
}
