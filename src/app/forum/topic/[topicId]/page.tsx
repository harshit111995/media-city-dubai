import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Share2 } from 'lucide-react';
import styles from '@/styles/forum.module.css';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ topicId: string }> }): Promise<Metadata> {
    const { topicId } = await params;
    const topic = await prisma.post.findUnique({
        where: { slug: topicId }
    });

    if (!topic) return { title: 'Topic Not Found' };

    const title = `${topic.title} | Media Forum Topic`;
    const description = topic.content.length > 150 
        ? topic.content.substring(0, 150) + '...' 
        : topic.content;

    return {
        title: title.substring(0, 60),
        description: description,
        alternates: {
            canonical: `/forum/topic/${topicId}`,
        },
        openGraph: {
            title: topic.title,
            description: description,
            type: 'article',
            authors: [topic.author],
            url: `https://mediacitydubai.com/forum/topic/${topicId}`,
            siteName: 'Media City Dubai',
            images: [
                {
                    url: topic.headerImage || 'https://mediacitydubai.com/images/forum-minimalist.png',
                    width: 1200,
                    height: 630,
                    alt: topic.title,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: topic.title,
            description: description,
            images: [topic.headerImage || 'https://mediacitydubai.com/images/forum-minimalist.png'],
            site: '@mediacitydubai',
            creator: '@mediacitydubai',
        },
    };
}

export default async function TopicPage({ params }: { params: Promise<{ topicId: string }> }) {
    const { topicId } = await params;
    const topic = await prisma.post.findUnique({
        where: { slug: topicId }
    });

    if (!topic) notFound();

    const baseUrl = 'https://mediacitydubai.com';
    const pageUrl = `${baseUrl}/forum/topic/${topicId}`;

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'Article',
            '@id': pageUrl,
            headline: topic.title,
            description: topic.shortDescription || topic.content.substring(0, 160),
            author: {
                '@type': 'Person',
                name: topic.author,
            },
            publisher: {
                '@type': 'Organization',
                name: 'Media City Dubai',
                url: baseUrl,
            },
            datePublished: topic.publishedAt.toISOString(),
            dateModified: topic.updatedAt.toISOString(),
            url: pageUrl,
            ...(topic.headerImage && { image: topic.headerImage }),
            articleSection: topic.category,
            keywords: topic.tags || '',
        },
        {
            '@context': 'https://schema.org',
            '@type': 'DiscussionForumPosting',
            headline: topic.title,
            author: {
                '@type': 'Person',
                name: topic.author,
            },
            datePublished: topic.publishedAt.toISOString(),
            interactionStatistic: {
                '@type': 'InteractionCounter',
                interactionType: 'https://schema.org/CommentAction',
                userInteractionCount: topic.replies,
            },
            articleBody: topic.content,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
                { '@type': 'ListItem', position: 2, name: 'Forum', item: `${baseUrl}/forum` },
                { '@type': 'ListItem', position: 3, name: topic.title, item: pageUrl },
            ],
        },
    ];

    return (
        <div className={styles.threadContainer}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Visible Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-semibold uppercase tracking-wider">
                <Link href="/" className="hover:text-accent transition-colors">Home</Link>
                <span>/</span>
                <Link href="/forum" className="hover:text-accent transition-colors">Forum</Link>
                <span>/</span>
                <span className="text-gray-400">{topic.title}</span>
            </nav>

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
                        <Image
                            src={topic.headerImage}
                            alt={topic.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 1200px) 100vw, 1200px"
                        />
                    </div>
                )}

                <div 
                    className="cms-content text-gray-800"
                    dangerouslySetInnerHTML={{ __html: topic.content }}
                />

                {/* Related Articles — Depth Enrichment */}
                <div className="mt-16 pt-10 border-t border-gray-100">
                    <h2 className="text-2xl font-bold mb-8 text-gray-900 font-playfair">More in {topic.category}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {(await prisma.post.findMany({
                            where: {
                                category: topic.category,
                                NOT: { id: topic.id }
                            },
                            take: 2,
                            orderBy: { publishedAt: 'desc' }
                        })).map((rel) => (
                            <Link 
                                key={rel.id} 
                                href={`/forum/topic/${rel.slug}`}
                                className="group block"
                            >
                                {rel.headerImage && (
                                    <div className="relative h-40 w-full mb-4 rounded-xl overflow-hidden">
                                        <Image
                                            src={rel.headerImage}
                                            alt={rel.title}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 400px"
                                        />
                                    </div>
                                )}
                                <h3 className="font-bold text-gray-900 group-hover:text-accent transition-colors line-clamp-2">{rel.title}</h3>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Article FAQ Section */}
                <div className="mt-16 bg-gray-50 rounded-2xl p-8 border border-gray-200">
                    <h3 className="text-xl font-bold mb-6 text-gray-900 font-playfair">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-accent mb-2">Who is the author of this article?</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                This article is authored by <strong>{topic.author}</strong>, focusing on key developments in the <strong>{topic.category}</strong> industry.
                            </p>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-accent mb-2">What is the primary topic category?</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                This publication belongs to the <strong>{topic.category}</strong> category, representing trending market insights in Dubai's media and tech landscape.
                            </p>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-accent mb-2">Can I reference or cite this article?</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Yes, you can cite this article by referencing Media City Dubai and utilizing the canonical URL: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-accent font-semibold">/forum/topic/{topic.slug}</span>.
                            </p>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-accent mb-2">How can I submit my own article or discussion?</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Registered media professionals and verified contributors can submit threads, editorial topics, and market reports directly via the publisher dashboard.
                            </p>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-accent mb-2">How frequently is the community forum updated?</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                New articles, regulatory updates, event schedules, and forum topics are updated daily to reflect the fast-evolving media and tech sectors in Dubai.
                            </p>
                        </div>
                    </div>
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
