import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import styles from '@/styles/forum.module.css';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: { params: Promise<{ topicId: string }> }): Promise<Metadata> {
    const { topicId } = await params;
    const topic = await prisma.post.findUnique({
        where: { slug: topicId }
    });

    if (!topic) return { title: 'Topic Not Found' };

    return {
        title: `${topic.title} | Media City Dubai Forum`,
        description: topic.content.substring(0, 160),
        openGraph: {
            title: topic.title,
            type: 'article',
            authors: [topic.author],
        },
    };
}

export default async function TopicPage({ params }: { params: Promise<{ topicId: string }> }) {
    const { topicId } = await params;
    const topic = await prisma.post.findUnique({
        where: { slug: topicId }
    });

    if (!topic) notFound();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'DiscussionForumPosting',
        headline: topic.title,
        author: {
            '@type': 'Person',
            name: topic.author,
        },
        datePublished: topic.publishedAt,
        interactionStatistic: {
            '@type': 'InteractionCounter',
            interactionType: 'https://schema.org/CommentAction',
            userInteractionCount: topic.replies,
        },
        articleBody: topic.content,
    };

    return (
        <div className={styles.threadContainer}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Link href="/forum" className="flex items-center gap-2 text-accent mb-6 font-medium">
                <ArrowLeft size={20} /> Back to Forum
            </Link>

            <div className={styles.originalPost}>
                <div className={styles.postHeader}>
                    <div className={styles.avatar}>
                        {topic.author.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-tight">{topic.title}</h1>
                        <div className="flex gap-2 text-sm text-gray-500 mt-1">
                            <span className="text-accent">{topic.author}</span>
                            <span>•</span>
                            <span>{new Date(topic.publishedAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{topic.category}</span>
                        </div>
                    </div>
                </div>

                {topic.headerImage && (
                    <div className="relative h-[50vh] w-full mb-8 rounded-xl overflow-hidden shadow-lg">
                        <img
                            src={topic.headerImage}
                            alt={topic.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className={styles.postContent}>
                    <ReactMarkdown>{topic.content}</ReactMarkdown>
                </div>

                {/* Footer / Share only - Comments removed */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
                    <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-accent transition-colors">
                        <Share2 size={16} /> Share Article
                    </button>
                    <div className="ml-auto text-sm text-gray-400 italic">
                        Comments range disabled for this article.
                    </div>
                </div>
            </div>
        </div>
    );
}
