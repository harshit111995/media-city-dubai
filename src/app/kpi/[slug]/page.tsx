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

    return {
        title: kpi.seoTitle || `${kpi.title} Calculator | Media City Dubai`,
        description: kpi.seoDescription || kpi.description.substring(0, 160),
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
                    <p style={{
                        fontSize: '15px',
                        lineHeight: '1.75',
                        color: '#374151',
                        margin: 0,
                    }}>
                        {kpi.description}
                    </p>
                </div>

                {/* Worked Example */}
                {kpi.example && (
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
                            {kpi.example}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
