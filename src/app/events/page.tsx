import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import styles from '@/styles/events.module.css';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export const metadata: Metadata = {
    title: 'Upcoming Media & Technology Events in Dubai | Media City Dubai',
    description: 'Discover the latest media, AdTech, and MarTech events, conferences, and workshops in Dubai. Stay ahead with our curated event calendar.',
    openGraph: {
        title: 'Upcoming Media & Technology Events in Dubai',
        description: 'Join the premier community for media professionals. Find events and networking opportunities.',
        siteName: 'Media City Dubai',
        locale: 'en_AE',
        type: 'website',
    },
};

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
                            {event.description}
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
