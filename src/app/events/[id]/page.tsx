import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, ArrowLeft, Clock, User } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';


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
        <div className="container mx-auto px-4 py-8 max-w-4xl font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Link href="/events" className="inline-flex items-center gap-2 text-accent hover:underline mb-8 font-medium">
                <ArrowLeft size={16} /> Back to Events
            </Link>

            {event.headerImage && (
                <div className="w-full h-[360px] md:h-[420px] rounded-2xl overflow-hidden relative mb-8 border border-slate-100 shadow-sm bg-slate-50">
                    <Image
                        src={event.headerImage}
                        alt={event.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            <header className="mb-10 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-4 text-accent uppercase tracking-wider text-xs font-bold">
                    {event.category}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                    {event.title}
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-2">
                        <Calendar className="text-accent flex-shrink-0" size={16} />
                        <span>
                            {new Date(event.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock className="text-accent flex-shrink-0" size={16} />
                        <span>09:00 AM - 05:00 PM</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <MapPin className="text-accent flex-shrink-0" size={16} />
                        <span>{event.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <User className="text-accent flex-shrink-0" size={16} />
                        <span>By {event.organizer}</span>
                    </div>
                </div>
            </header>

            {/* AWS S3 Assets Metadata Table */}
            {event.headerImage && (
                <div className="mb-10 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm max-w-2xl">
                    <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                        Asset Storage Specifications
                    </div>
                    <table className="w-full text-xs text-left border-collapse">
                        <tbody>
                            <tr className="border-b border-slate-100">
                                <td className="px-4 py-2.5 font-bold text-slate-400 w-1/3 bg-slate-50/50 uppercase tracking-wider text-[9px]">Storage Service</td>
                                <td className="px-4 py-2.5 text-slate-700 font-semibold">Amazon S3 (Simple Storage Service)</td>
                            </tr>
                            <tr className="border-b border-slate-100">
                                <td className="px-4 py-2.5 font-bold text-slate-400 bg-slate-50/50 uppercase tracking-wider text-[9px]">S3 Bucket Name</td>
                                <td className="px-4 py-2.5 font-mono text-slate-600 break-all select-all">media-city-dubai-assets</td>
                            </tr>
                            <tr className="border-b border-slate-100">
                                <td className="px-4 py-2.5 font-bold text-slate-400 bg-slate-50/50 uppercase tracking-wider text-[9px]">AWS Region</td>
                                <td className="px-4 py-2.5 text-slate-700 font-semibold">us-east-1 (N. Virginia)</td>
                            </tr>
                            <tr className="border-b border-slate-100">
                                <td className="px-4 py-2.5 font-bold text-slate-400 bg-slate-50/50 uppercase tracking-wider text-[9px]">CDN Distribution</td>
                                <td className="px-4 py-2.5 text-slate-700 font-semibold">CloudFront Edge Accelerated</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2.5 font-bold text-slate-400 bg-slate-50/50 uppercase tracking-wider text-[9px]">Object Access</td>
                                <td className="px-4 py-2.5 text-green-600 font-bold flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Active (Public-Read)
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            <article className="max-w-none">
                <div className="max-w-none">
                    <div 
                        className="cms-content mb-8"
                        dangerouslySetInnerHTML={{ __html: event.description }}
                    />

                    <h2 className="text-2xl font-bold mb-4 text-slate-800">Event Overview</h2>
                    <p className="mb-8 text-slate-600 leading-relaxed text-sm">
                        Join industry leaders at <strong>{event.title}</strong> in {event.location.split(',')[0]}. 
                        This event is specifically curated for professionals in the <strong>{event.category}</strong> sector 
                        looking to expand their network and gain insights into the latest market trends across the MENA region.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12 bg-slate-50/50 p-8 rounded-2xl border border-slate-100">
                        <div>
                            <h3 className="text-base font-bold mb-4 text-slate-800 uppercase tracking-wider">Why Attend?</h3>
                            <ul className="space-y-3 text-slate-600 text-sm">
                                <li className="flex gap-2">
                                    <span className="text-accent font-bold">✓</span> 
                                    Gain first-hand insights from {event.organizer} specialists.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-accent font-bold">✓</span> 
                                    Network with top-tier {event.category} professionals in Dubai.
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-accent font-bold">✓</span> 
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
                                    className="btn-primary w-full text-base px-8 py-3.5 rounded-xl shadow-md transition-transform active:scale-95 text-center flex items-center justify-center font-bold"
                                >
                                    Secure Your Spot
                                </Link>
                            ) : (
                                <button className="btn-primary w-full text-base px-8 py-3.5 rounded-xl shadow-md opacity-50 cursor-not-allowed font-bold">
                                    Registration Opening Soon
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </article>

            {/* Related Events */}
            <div className="mt-16 pt-8 border-t border-slate-100">
                <h2 className="text-xl font-bold mb-8 text-slate-800 uppercase tracking-wider">More {event.category} Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            className="bg-white group overflow-hidden rounded-xl border border-slate-200 hover:border-accent/40 shadow-sm transition-all"
                        >
                            <div className="p-6">
                                <div className="text-accent text-[10px] font-bold uppercase tracking-widest mb-2">{rel.category}</div>
                                <h3 className="text-lg font-bold mb-3 text-slate-800 group-hover:text-accent transition-colors leading-snug">{rel.title}</h3>
                                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={13} />
                                        {new Date(rel.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin size={13} />
                                        {rel.location.split(',')[0]}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Event FAQ Section */}
            <div className="mt-16 bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-sm">
                <h2 className="text-lg font-bold mb-8 text-slate-800 uppercase tracking-wider border-b border-slate-200 pb-3">Frequently Asked Questions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-sm font-bold mb-2 text-slate-800">Where is {event.title} held?</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                            The event will take place at <strong>{event.location}</strong>. We recommend arriving 15 minutes early for registration.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold mb-2 text-slate-800">How can I contact the organizer?</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                            This event is organized by <strong>{event.organizer}</strong>. You can find more details or register via the button above.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold mb-2 text-slate-800">Who should attend {event.title}?</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                            This event is specifically designed for professionals, founders, and decision-makers in the <strong>{event.category}</strong> sector looking to expand their regional network.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold mb-2 text-slate-800">Is there a registration fee?</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                            Registration parameters vary. Click the "Secure Your Spot" button above to review ticket tiers, delegate passes, and exclusive discounts for local businesses.
                        </p>
                    </div>
                    <div className="md:col-span-2">
                        <h4 className="text-sm font-bold mb-2 text-slate-800">Will food and beverages be provided?</h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                            Complimentary catering, coffee, and refreshments will be served during networking breaks throughout the event.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
