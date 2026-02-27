import styles from '@/styles/home.module.css';
import { Sparkles, Calendar, MessageSquare, Wrench, Newspaper } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://mediacitydubai.com',
  },
};

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch latest 3 general posts (excluding Industry News if we want a separate section)
  const latestPosts = await prisma.post.findMany({
    where: {
      category: { not: 'Industry News' },
      publishedAt: { lte: new Date() } // Only show published posts
    },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  });

  // Fetch latest 3 Industry News posts
  const industryNews = await prisma.post.findMany({
    where: {
      category: 'Industry News',
      publishedAt: { lte: new Date() } // Only show published posts
    },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  });

  // Fetch latest 3 Tools
  const latestTools = await prisma.tool.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className="flex justify-center">
            <span className={styles.tag}>
              <Sparkles className="w-4 h-4" />
              The Future of Media in Dubai
            </span>
          </div>
          <h1 className={`${styles.title} text-gradient`}>
            Media City Dubai
          </h1>
          <p className={styles.subtitle}>
            The premier digital ecosystem for Dubai's media sector.
            Connect, discover tools, and attend world-class events.
          </p>

        </div>
      </section>

      {/* Latest Industry News Section */}
      {industryNews.length > 0 && (
        <section className={styles.section}>
          <div className={styles.splitLayout}>
            <div className={styles.textContent}>
              <Newspaper className="w-10 h-10 text-accent mb-4" />
              <h2 className={styles.sectionTitle}>Industry News</h2>
              <p className={styles.sectionText}>
                Stay updated with the latest trends, announcements, and news from the Dubai media and tech landscape.
              </p>

              <div className="mt-6 flex flex-col gap-4">
                {industryNews.map(news => (
                  <Link href={`/forum/topic/${news.slug}`} key={news.id} className="bg-surface p-4 rounded-lg border border-white/5 hover:border-accent/50 transition-colors flex gap-4 items-center">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-white mb-1 truncate">{news.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{news.shortDescription || news.content.substring(0, 100)}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-6">
                <Link href="/forum/category/Industry%20News" className="text-accent hover:underline font-medium">
                  Read all news &rarr;
                </Link>
              </div>
            </div>
            <div className={`${styles.imageContainer} relative w-full min-h-[300px]`}>
              <Image
                src="/images/forum-minimalist.png"
                alt="Digital Network and Communication"
                fill
                className={`${styles.sectionImage} object-cover`}
              />
            </div>
          </div>
        </section>
      )}

      {/* Forums Section (Text Left, Image Right) */}
      <section className={styles.section}>
        <div className={styles.splitLayoutReverse}>
          <div className={`${styles.imageContainer} relative min-h-[400px]`}>
            <Image
              src="/images/forum-minimalist.png"
              alt="Digital Network and Communication"
              fill
              className={`${styles.sectionImage} object-cover blur-sm opacity-50 absolute inset-0 z-0`}
              priority
            />
            <div className="bg-surface/50 p-6 rounded-2xl border border-white/10 w-full max-w-md mx-auto relative backdrop-blur-sm z-10">
              <h3 className="text-xl font-bold mb-4 text-white">Recent Discussions</h3>
              <div className="flex flex-col gap-3">
                {latestPosts.length > 0 ? latestPosts.map(post => (
                  <div key={post.id} className="bg-background/80 p-3 rounded-lg flex gap-3 border border-white/5 items-center">
                    {post.headerImage && (
                      <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 relative">
                        <Image src={post.headerImage} alt={post.title} fill className="object-cover" sizes="48px" />
                      </div>
                    )}
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <Link href={`/forum/topic/${post.slug}`} className="font-medium text-blue-200 hover:text-accent truncate block">
                        {post.title}
                      </Link>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{post.category}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-400">No discussions yet.</p>
                )}
              </div>
              {latestPosts.length > 0 && (
                <div className="mt-4 text-center">
                  <Link href="/forum" className="text-xs text-accent uppercase tracking-wider font-semibold hover:underline">View All Forum Posts</Link>
                </div>
              )}
            </div>
          </div>
          <div className={styles.textContent}>
            <MessageSquare className="w-10 h-10 text-accent mb-4" />
            <h2 className={styles.sectionTitle}>Community Forum</h2>
            <p className={styles.sectionText}>
              Engage with Dubai's top media professionals. Share insights, ask questions,
              and build your network in our exclusive discussion boards. From creative direction
              to tech support, find the conversation that matters to you.
            </p>
            <Link href="/forum" className="btn-primary">
              Start Discussing
            </Link>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className={styles.section}>
        <div className={styles.splitLayout}>
          <div className={styles.textContent}>
            <Calendar className="w-10 h-10 text-accent mb-4" />
            <h2 className={styles.sectionTitle}>Industry Events</h2>
            <p className={styles.sectionText}>
              Stay ahead of the curve with our curated calendar. Discover upcoming
              conferences, workshops, and networking mixers happening right here in Media City used
              by industry leaders.
            </p>
            <Link href="/events" className="btn-glass">
              Browse Calendar
            </Link>
          </div>
          <div className={`${styles.imageContainer} relative w-full min-h-[300px]`}>
            <Image
              src="/images/events-minimalist.png"
              alt="Conference Stage"
              fill
              className={`${styles.sectionImage} object-cover`}
            />
          </div>
        </div>
      </section>

      {/* Tools Strip (Minimalist Grid) */}
      <section className={styles.toolsSection}>
        <div className="container text-center mb-12">
          <h2 className={styles.sectionTitle}>Essential Tools</h2>
          <p className="text-muted max-w-2xl mx-auto">
            Power your workflow with the best industry solutions across the platform.
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {latestTools.length > 0 ? (
            latestTools.map(tool => (
              <Link href={`/tools`} key={tool.id} className={styles.featureCard}>
                <Wrench className={`${styles.cardIcon} w-8 h-8`} />
                <h3 className={styles.cardTitle}>{tool.title}</h3>
                <p className={styles.cardText}>{tool.description}</p>
                <span className="text-xs text-accent mt-4 inline-block">{tool.category}</span>
              </Link>
            ))
          ) : (
            <>
              <Link href="/tools/category/AI%20Tools" className={styles.featureCard}>
                <Wrench className={`${styles.cardIcon} w-8 h-8`} />
                <h3 className={styles.cardTitle}>AI Tools</h3>
                <p className={styles.cardText}>Generative AI for content and design.</p>
              </Link>
              <Link href="/tools/category/AdTech" className={styles.featureCard}>
                <Wrench className={`${styles.cardIcon} w-8 h-8`} />
                <h3 className={styles.cardTitle}>AdTech</h3>
                <p className={styles.cardText}>Programmatic buying and data platforms.</p>
              </Link>
            </>
          )}

          <Link href="/tools" className={`${styles.featureCard} flex flex-col justify-center items-center text-center !bg-transparent border-dashed`}>
            <span className="text-accent font-bold">View All Tools &rarr;</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
