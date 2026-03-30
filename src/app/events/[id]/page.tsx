import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, ArrowLeft, Clock, User } from 'lucide-react';
import styles from '@/styles/events.module.css';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';


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

    const title = `${event.title} | Dubai Media Event`;
    const description = `Attend ${event.title} on ${event.date.toLocaleDateString()} in ${event.location}. ${event.description.substring(0, 100)}...`;

    return {
        title: title.substring(0, 60),
        description: description.substring(0, 155),
        alternates: {
            canonical: `/events/${event.slug}`,
        },
        openGraph: {
            title: event.title,
            description: description,
            type: 'article',
            publishedTime: event.date.toISOString(),
            url: `https://mediacitydubai.com/events/${event.slug}`,
            siteName: 'Media City Dubai',
            images: [
                {
                    url: event.imageUrl || 'https://mediacitydubai.com/images/forum-minimalist.png',
                    width: 1200,
                    height: 630,
                    alt: event.title,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: event.title,
            description: description,
            images: [event.imageUrl || 'https://mediacitydubai.com/images/forum-minimalist.png'],
            site: '@mediacitydubai',
            creator: '@mediacitydubai',
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

    const baseUrl = 'https://mediacitydubai.com';
    const pageUrl = `${baseUrl}/events/${event.slug}`;

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: event.title,
            url: pageUrl,
            startDate: event.date.toISOString(),
            endDate: event.date.toISOString(),
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
            ...(event.headerImage && { image: [event.headerImage] }),
            organizer: {
                '@type': 'Organization',
                name: event.organizer,
                url: baseUrl,
            },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
                { '@type': 'ListItem', position: 2, name: 'Events', item: `${baseUrl}/events` },
                { '@type': 'ListItem', position: 3, name: event.title, item: pageUrl },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                {
                    '@type': 'Question',
                    name: `Where is ${event.title} held?`,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: `The event will take place at ${event.location}.`
                    }
                },
                {
                    '@type': 'Question',
                    name: `Who is organizing ${event.title}?`,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: `This event is organized by ${event.organizer}.`
                    }
                }
            ]
        }
    ];

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
                <div className="max-w-none">
                    <div 
                        className="cms-content mb-8"
                        dangerouslySetInnerHTML={{ __html: event.description }}
                    />

                    <h2 className="text-3xl font-playfair mb-6 text-accent">Event Overview</h2>
                    <p className="mb-8 text-gray-300 leading-relaxed">
                        Join industry leaders at <strong>{event.title}</strong> in {event.location.split(',')[0]}. 
                        This event is specifically curated for professionals in the <strong>{event.category}</strong> sector 
                        looking to expand their network and gain insights into the latest market trends across the MENA region.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12 bg-white/5 p-8 rounded-2xl border border-white/10">
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-white">Why Attend?</h3>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex gap-2">
                                    <span className="text-accent">✓</span> 
                                    Gain first-hand insights from {event.organizer} specialists.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-accent">✓</span> 
                                    Network with top-tier {event.category} professionals in Dubai.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-accent">✓</span> 
                                    Stay ahead of regional regulatory and technology shifts.
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col justify-center">
                            {(event as any).registrationUrl ? (
                                <Link 
                                    href={(event as any).registrationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary w-full text-lg px-8 py-4 rounded-xl shadow-lg shadow-accent/20 transition-transform active:scale-95 text-center flex items-center justify-center"
                                >
                                    Secure Your Spot
                                </Link>
                            ) : (
                                <button className="btn-primary w-full text-lg px-8 py-4 rounded-xl shadow-lg shadow-accent/20 opacity-50 cursor-not-allowed">
                                    Registration Opening Soon
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </article>

            {/* Related Events */}
            <div className="mt-20 pt-12 border-t border-white/10">
                <h2 className="text-3xl font-bold font-playfair mb-10">More {event.category} Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {(await prisma.event.findMany({
                        where: {
                            category: event.category,
                            NOT: { id: event.id }
                        },
                        take: 2,
                        orderBy: { date: 'asc' }
                    })).map((rel) => (
                        <Link 
                            key={rel.id} 
                            href={`/events/${rel.slug}`}
                            className="glass-panel group overflow-hidden rounded-2xl border border-white/10 hover:border-accent/40 transition-all"
                        >
                            <div className="p-6">
                                <div className="text-accent text-xs font-bold uppercase tracking-widest mb-2">{rel.category}</div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">{rel.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        {new Date(rel.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        {rel.location.split(',')[0]}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Event FAQ Section */}
            <div className="mt-16 bg-white/5 rounded-2xl p-10 border border-white/10">
                <h2 className="text-2xl font-bold mb-8 font-playfair">Frequently Asked Questions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                        <h4 className="text-lg font-bold mb-3 text-accent transition-colors">Where is {event.title} held?</h4>
                        <p className="text-gray-400 leading-relaxed">
                            The event will take place at <strong>{event.location}</strong>. We recommend arriving 15 minutes early for registration.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-3 text-accent">How can I contact the organizer?</h4>
                        <p className="text-gray-400 leading-relaxed">
                            This event is organized by <strong>{event.organizer}</strong>. You can find more details or register via the button above.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
