import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, ArrowLeft, Clock, User } from 'lucide-react';
import styles from '@/styles/events.module.css';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

interface Props {
    params: {
        slug: string; // Updated to match the [slug] folder or mock data approach
    };
}

// Generate dynamic metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const event = await prisma.event.findUnique({
        where: { slug: id }
    });

    if (!event) {
        return {
            title: 'Event Not Found',
        };
    }

    return {
        title: `${event.title} | Media City Dubai`,
        description: `Join us at ${event.title} on ${event.date} at ${event.location}. ${event.description}`,
        openGraph: {
            title: event.title,
            description: event.description,
            type: 'article',
            publishedTime: event.date.toISOString(),
        },
    };
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await prisma.event.findUnique({
        where: { slug: id }
    });

    if (!event) {
        notFound();
    }

    // Schema.org Event structured data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: event.title,
        startDate: event.date,
        endDate: event.date, // Assuming 1-day event for simplification in mock
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
            '@type': 'Place',
            name: event.location,
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Dubai',
                addressCountry: 'AE',
            },
        },
        description: event.description,
        organizer: {
            '@type': 'Organization',
            name: event.organizer,
        },
    };

    return (
        <div className={styles.detailContainer}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Link href="/events" className="flex items-center gap-2 text-accent mb-6 font-medium">
                <ArrowLeft size={20} /> Back to Events
            </Link>

            <header className={styles.detailHeader}>
                <div className="flex items-center gap-2 mb-4 text-accent uppercase tracking-wider text-sm font-semibold">
                    {event.category}
                </div>
                <h1 className={`${styles.title} text-gradient !text-left !text-5xl`}>
                    {event.title}
                </h1>

                <div className={styles.detailMeta}>
                    <div className={styles.metaItem}>
                        <Calendar className="text-accent" size={20} />
                        <span>
                            {new Date(event.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>

                    <div className={styles.metaItem}>
                        <Clock className="text-accent" size={20} />
                        <span>09:00 AM - 05:00 PM</span> {/* Mock time */}
                    </div>

                    <div className={styles.metaItem}>
                        <MapPin className="text-accent" size={20} />
                        <span>{event.location}</span>
                    </div>

                    <div className={styles.metaItem}>
                        <User className="text-accent" size={20} />
                        <span>Organized by {event.organizer}</span>
                    </div>
                </div>
            </header>

            <article className={styles.detailBody}>
                <p className="mb-6 text-lg leading-relaxed text-white">
                    {event.description}
                </p>

                <h2 className="text-2xl font-playfair mb-4 text-accent">About the Event</h2>
                <p className="mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>

                <h2 className="text-2xl font-playfair mb-4 text-accent">What to Expect</h2>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Keynote speeches from industry leaders</li>
                    <li>Interactive workshops and breakout sessions</li>
                    <li>Networking opportunities with 500+ attendees</li>
                    <li>Exclusive access to premium tools demonstrations</li>
                </ul>

                <button className="btn-primary w-full md:w-auto mt-8 text-lg px-8 py-3">
                    Register for Event
                </button>
            </article>
        </div>
    );
}
