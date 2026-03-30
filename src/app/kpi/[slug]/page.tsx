import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, FlaskConical } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import KpiCalculatorClient from '@/components/KpiCalculatorClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const kpi = await prisma.kpi.findUnique({ where: { slug } });

    if (!kpi) return { title: 'KPI Not Found' };

    const title = `${kpi.title} | Marketing KPI Calculator`;
    const description = kpi.seoDescription || kpi.description;
    const finalDesc = description.length > 150 ? description.substring(0, 152) + '...' : description;

    return {
        title: title.substring(0, 60),
        description: finalDesc,
        alternates: {
            canonical: `/kpi/${kpi.slug}`,
        },
        openGraph: {
            title: kpi.title,
            description: finalDesc,
            type: 'website',
            url: `https://mediacitydubai.com/kpi/${kpi.slug}`,
            siteName: 'Media City Dubai',
            images: [
                {
                    url: 'https://mediacitydubai.com/images/forum-minimalist.png',
                    width: 1200,
                    height: 630,
                    alt: kpi.title,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: kpi.title,
            description: finalDesc,
            images: ['https://mediacitydubai.com/images/forum-minimalist.png'],
            site: '@mediacitydubai',
            creator: '@mediacitydubai',
        },
    };
}

export default async function KpiDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const kpi = await prisma.kpi.findUnique({ where: { slug } });

    if (!kpi) notFound();

    // Parse fields safely to pass to client component
    let parsedFields = [];
    try {
        parsedFields = JSON.parse(kpi.fields);
    } catch (e) {
        console.error("Failed to parse KPI fields", e);
    }

    const baseUrl = 'https://mediacitydubai.com';
    const pageUrl = `${baseUrl}/kpi/${kpi.slug}`;

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: `${kpi.title} Calculator`,
            url: pageUrl,
            description: kpi.description,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
            },
            publisher: {
                '@type': 'Organization',
                name: 'Media City Dubai',
                url: baseUrl,
            },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
                { '@type': 'ListItem', position: 2, name: 'KPI Calculators', item: `${baseUrl}/kpi` },
                { '@type': 'ListItem', position: 3, name: kpi.title, item: pageUrl },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                {
                    '@type': 'Question',
                    name: `How do I improve my ${kpi.title}?`,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: `Improving ${kpi.title} requires a dual focus on quality and efficiency. Audit your top-performing segments and re-allocate budget areas with higher baseline ${kpi.title} potential.`
                    }
                },
                {
                    '@type': 'Question',
                    name: `Is ${kpi.title} a primary KPI?`,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: `${kpi.title} is a critical indicator of performance, but it should always be viewed alongside downstream metrics like ROI to ensure volume isn't coming at the expense of profitability.`
                    }
                }
            ]
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Link href="/kpi" className="inline-flex items-center text-accent hover:underline mb-8 font-medium">
                <ArrowLeft size={16} className="mr-2" />
                Back to Calculators
            </Link>

            {/* Calculator */}
            <div className="mb-10">
                <KpiCalculatorClient
                    title={kpi.title}
                    formula={kpi.formula}
                    description={kpi.description}
                    fields={parsedFields}
                />
            </div>

            {/* Explanation & Example panel */}
            <div className="max-w-4xl mx-auto space-y-4 pb-16">

                {/* What is it? */}
                <div style={{
                    background: '#f8f9fa',
                    border: '1px solid #e5e7eb',
                    borderRadius: '16px',
                    padding: '28px 32px',
                }}>
                    <div className="flex items-center gap-2 mb-3">
                        <BookOpen size={18} style={{ color: '#C8102E' }} />
                        <h2 style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: '#C8102E',
                            margin: 0,
                        }}>
                            What is {kpi.title}?
                        </h2>
                    </div>
                    <div 
                        className="cms-content text-sm"
                        style={{ color: '#374151' }}
                        dangerouslySetInnerHTML={{ __html: kpi.description }}
                    />
                </div>

                {/* Worked Example */}
                {(kpi as any).example && (
                    <div style={{
                        background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                        border: '1px solid #fcd34d',
                        borderLeft: '4px solid #f59e0b',
                        borderRadius: '16px',
                        padding: '28px 32px',
                    }}>
                        <div className="flex items-center gap-2 mb-3">
                            <FlaskConical size={18} style={{ color: '#d97706' }} />
                            <h2 style={{
                                fontSize: '13px',
                                fontWeight: 700,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: '#d97706',
                                margin: 0,
                            }}>
                                Worked Example
                            </h2>
                        </div>
                        <p style={{
                            fontSize: '15px',
                            lineHeight: '1.75',
                            color: '#92400e',
                            margin: 0,
                        }}>
                            {(kpi as any).example}
                        </p>
                    </div>
                )}

                {/* Related Metrics Section */}
                <div className="mt-12 pt-10 border-t border-gray-200">
                    <h3 className="text-xl font-bold mb-6 text-gray-900 font-playfair">Related {kpi.category} Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(await prisma.kpi.findMany({
                            where: {
                                category: kpi.category,
                                NOT: { id: kpi.id }
                            },
                            take: 4
                        })).map((rel) => (
                            <Link 
                                key={rel.id} 
                                href={`/kpi/${rel.slug}`}
                                className="p-4 rounded-xl border border-gray-200 hover:border-accent/40 hover:bg-gray-50 transition-all group"
                            >
                                <div className="font-bold text-gray-900 group-hover:text-accent transition-colors">{rel.title}</div>
                                <div className="text-xs text-gray-500 mt-1 line-clamp-1">{rel.description}</div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* KPI FAQ Section */}
                <div className="mt-8 bg-gray-50 rounded-2xl p-8 border border-gray-200">
                    <h3 className="text-lg font-bold mb-4 text-gray-900">Expert Insights</h3>
                    <div className="space-y-4">
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-accent mb-2">How do I improve my {kpi.title}?</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Improving {kpi.title} requires a dual focus on quality and efficiency. For {kpi.category} metrics, 
                                we recommend auditing your top-performing segments and re-allocating budget from underperforming 
                                areas to those with higher baseline {kpi.title} potential.
                            </p>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-accent mb-2">Is {kpi.title} a primary KPI?</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                While {kpi.title} is a critical indicator of regional performance, it should always be viewed 
                                alongside downstream metrics like ROI to ensure volume isn't coming at the expense of profitability.
                            </p>
                        </div>
                    </div>
                </div>
                {/* Related Tools Section — Cross-Linking */}
                <div className="mt-8 pt-10 border-t border-gray-200">
                    <h3 className="text-xl font-bold mb-6 text-gray-900 font-playfair">Tools to Help Measure {kpi.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(await prisma.tool.findMany({
                            where: {
                                category: kpi.category === 'General' ? undefined : kpi.category
                            },
                            take: 3
                        })).map((tool) => (
                            <Link 
                                key={tool.id} 
                                href={`/tools/${tool.slug}`}
                                className="group p-5 rounded-xl border border-gray-200 hover:border-accent/40 hover:bg-gray-50 transition-all"
                            >
                                <div className="text-sm font-bold text-gray-900 group-hover:text-accent mb-2">{tool.title}</div>
                                <div className="text-xs text-gray-500 line-clamp-2">{tool.description}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
