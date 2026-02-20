import styles from '@/styles/home.module.css';
import { Sparkles, Calendar, MessageSquare, Wrench } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
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

          <div className={styles.ctaGroup}>
            <Link href="/forum" className="btn-primary">
              Join the Community
            </Link>
          </div>
        </div>
      </section>

      {/* Forums Section (Text Left, Image Right) */}
      <section className={styles.section}>
        <div className={styles.splitLayout}>
          <div className={styles.textContent}>
            <MessageSquare className="w-10 h-10 text-accent mb-4" />
            <h2 className={styles.sectionTitle}>Community Forum</h2>
            <p className={styles.sectionText}>
              Engage with Dubai's top media professionals. Share insights, ask questions,
              and build your network in our exclusive discussion boards. From industry news
              to tech support, find the conversation that matters to you.
            </p>
            <Link href="/forum" className="btn-primary">
              Start Discussing
            </Link>
          </div>
          <div className={styles.imageContainer}>
            {/* Using standard img for simplicity in this demo, or Next.js Image if configured */}
            <img
              src="/images/forum-minimalist.png"
              alt="Digital Network and Communication"
              className={styles.sectionImage}
            />
          </div>
        </div>
      </section>

      {/* Events Section (Image Left, Text Right) - using reverse layout logic if css class exists, or manual order */}
      <section className={styles.section}>
        <div className={styles.splitLayoutReverse}>
          {/* In CSS grid, we can just swap visual order, or structurally swap. 
               Let's structurally swap to ensure standard stacking on mobile if using simple logic. 
               Ideally on mobile: Image then Text, or Text then Image. 
               Let's keep Text First on Mobile (default) -> Image. 
               But on Desktop: Image Left, Text Right. 
               We'll use specific order classes or just rely on the DOM order 
               if we defined splitLayoutReverse to handle grid-template-areas or swapped columns.
               The CSS defined `splitLayoutReverse` as just `grid-template-columns: 1fr 1fr` same as normal.
               Wait, I should check the CSS I wrote. 
               I defined them identical. So I need to rely on DOM order. 
               For "Image Left, Text Right", I put Image Div first.
           */}
          <div className={styles.imageContainer}>
            <img
              src="/images/events-minimalist.png"
              alt="Conference Stage"
              className={styles.sectionImage}
            />
          </div>
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
        </div>
      </section>

      {/* Tools Strip (Minimalist Grid) */}
      <section className={styles.toolsSection}>
        <div className="container text-center mb-12">
          <h2 className={styles.sectionTitle}>Essential Tools</h2>
          <p className="text-muted max-w-2xl mx-auto">
            Power your workflow with the best AdTech, MarTech, and AI solutions.
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {/* We can reuse the feature card style for a quick tools preview */}
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
          <Link href="/tools" className={`${styles.featureCard} flex flex-col justify-center items-center text-center !bg-transparent border-dashed`}>
            <span className="text-accent font-bold">View All Tools &rarr;</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
