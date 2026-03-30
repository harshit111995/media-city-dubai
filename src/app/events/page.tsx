import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import styles from '@/styles/events.module.css';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
    title: 'Upcoming Media & Technology Events in Dubai | Media City Dubai',
    description: 'Discover the latest media, AdTech, and MarTech events, conferences, and workshops in Dubai. Stay ahead with our curated event calendar.',
    alternates: {
        canonical: '/events',
    },
    openGraph: {
        title: 'Upcoming Media & Technology Events in Dubai',
        description: 'Join the premier community for media professionals. Find conferences, workshops, and networking workshops.',
        url: 'https://mediacitydubai.com/events',
        siteName: 'Media City Dubai',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: 'https://mediacitydubai.com/images/events-minimalist.png',
                width: 1200,
                height: 630,
                alt: 'Media & Tech Events Dubai',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Upcoming Media & Technology Events in Dubai',
        description: 'Your central calendar for media and tech networking in Dubai.',
        images: ['https://mediacitydubai.com/images/events-minimalist.png'],
        site: '@mediacitydubai',
        creator: '@mediacitydubai',
    },
};

import { stripHtml, truncate } from '@/lib/utils';

export default async function EventsPage() {
    const events = await prisma.event.findMany({
        orderBy: { date: 'asc' },
    });

    // JSON-LD for the collection of events
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Upcoming Media & Technology Events in Dubai',
        description: 'A curated list of events for media professionals in Dubai.',
        url: 'https://mediacitydubai.com/events',
        mainEntity: {
            '@type': 'ItemList',
            itemListElement: events.map((event, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `https://mediacitydubai.com/events/${event.slug}`,
                name: event.title,
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
                <h1 className={`${styles.title} text-gradient`}>Media & Tech Events</h1>
                <p className={styles.subtitle}>
                    Explore the most anticipated conferences, workshops, and networking gatherings
                    shaping the future of media in Dubai.
                </p>
            </header>

            <div className={styles.grid}>
                {events.map((event) => (
                    <Link href={`/events/${event.slug}`} key={event.id} className={styles.card}>
                        <div className={styles.cardDate}>
                            <Calendar size={16} />
                            {new Date(event.date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </div>

                        <h2 className={styles.cardTitle}>{event.title}</h2>

                        <div className={styles.cardLocation}>
                            <MapPin size={16} />
                            {event.location}
                        </div>

                        <p className={styles.cardDescription}>
                            {truncate(stripHtml(event.shortDescription || event.description), 120)}
                        </p>

                        <div className={`${styles.cardFooter} flex items-center text-accent text-sm font-medium`}>
                            Event Details <ArrowRight size={16} className="ml-2" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
