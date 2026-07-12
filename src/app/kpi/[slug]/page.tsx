import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, FlaskConical, Calculator } from 'lucide-react';
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
        <div className="bg-slate-950 text-slate-100 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <Link href="/kpi" className="inline-flex items-center text-red-400 hover:text-red-300 mb-8 font-medium transition-colors">
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
                <div className="max-w-4xl mx-auto space-y-6 pb-16">

                    {/* What is it? */}
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen size={18} className="text-red-400" />
                            <h2 className="text-xs font-bold tracking-wider uppercase text-red-400 m-0">
                                What is {kpi.title}?
                            </h2>
                        </div>
                        <div 
                            className="cms-content text-sm text-slate-300 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: kpi.description }}
                        />
                    </div>

                    {/* Worked Example */}
                    {(kpi as any).example && (
                        <div className="bg-amber-950/20 border border-amber-900/30 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl">
                            <div className="flex items-center gap-2 mb-3">
                                <FlaskConical size={18} className="text-amber-400" />
                                <h2 className="text-xs font-bold tracking-wider uppercase text-amber-400 m-0">
                                    Worked Example
                                </h2>
                            </div>
                            <p className="text-sm leading-relaxed text-amber-200 m-0">
                                {(kpi as any).example}
                            </p>
                        </div>
                    )}

                    {/* Dynamic Formula Variable Breakdown */}
                    <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <Calculator size={18} className="text-emerald-400" />
                            <h2 className="text-xs font-bold tracking-wider uppercase text-emerald-400 m-0">
                                Formula Variable Breakdown ({kpi.formula})
                            </h2>
                        </div>
                        <div className="space-y-4 mt-4">
                            {parsedFields.map((field: any) => (
                                <div key={field.name} className="flex flex-col sm:flex-row sm:items-start border-b border-emerald-900/20 pb-3 last:border-0 last:pb-0">
                                    <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-900/40 px-2.5 py-0.5 rounded w-fit sm:min-w-[140px] text-center">
                                        {field.name}
                                    </span>
                                    <span className="text-sm text-slate-300 sm:ml-4 mt-1.5 sm:mt-0 leading-relaxed">
                                        <strong>{field.label}</strong>: Input parameter representing the overall value of {field.label.toLowerCase()} in your campaign logs.
                                    </span>
                                </div>
                            ))}
                            <div className="flex flex-col sm:flex-row sm:items-start pt-2">
                                <span className="font-mono text-xs font-bold text-red-300 bg-red-950/60 border border-red-900/40 px-2.5 py-0.5 rounded w-fit sm:min-w-[140px] text-center">
                                    {kpi.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}
                                </span>
                                <span className="text-sm text-red-300 sm:ml-4 mt-1.5 sm:mt-0 leading-relaxed font-semibold">
                                    <strong>{kpi.title}</strong>: The output result representing the solve target calculated directly from the variables.
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tactical Application Guide */}
                    <div className="bg-sky-950/20 border border-sky-900/30 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen size={18} className="text-sky-400" />
                            <h2 className="text-xs font-bold tracking-wider uppercase text-sky-400 m-0">
                                Tactical Application Guide
                            </h2>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-350 m-0">
                            Use this bidirectional solver to run advanced simulation models. For example, if you know your target {kpi.title} and have fixed variables, select the unknown variable as the "Solve" target to reverse-calculate exactly what volume or budget is required to hit your KPIs.
                        </p>
                    </div>

                    {/* Related Metrics Section */}
                    <div className="mt-12 pt-10 border-t border-slate-800">
                        <h3 className="text-xl font-bold mb-6 text-white font-playfair">Related {kpi.category} Metrics</h3>
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
                                    className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-red-900/40 hover:bg-slate-900/80 transition-all group"
                                >
                                    <div className="font-bold text-slate-200 group-hover:text-red-400 transition-colors">{rel.title}</div>
                                    <div className="text-xs text-slate-400 mt-1.5 line-clamp-1">{rel.description}</div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* KPI FAQ Section */}
                    <div className="mt-8 bg-slate-900/60 rounded-2xl p-6 md:p-8 border border-slate-800/80">
                        <h3 className="text-lg font-bold mb-6 text-white">Frequently Asked Questions & Expert Insights</h3>
                        <div className="space-y-4">
                            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 shadow-sm">
                                <h4 className="font-bold text-red-400 mb-2">How do I improve my {kpi.title}?</h4>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    Improving {kpi.title} requires a dual focus on quality and efficiency. For {kpi.category} metrics, 
                                    we recommend auditing your top-performing segments and re-allocating budget from underperforming 
                                    areas to those with higher baseline {kpi.title} potential.
                                </p>
                            </div>
                            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 shadow-sm">
                                <h4 className="font-bold text-red-400 mb-2">Is {kpi.title} a primary KPI?</h4>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    While {kpi.title} is a critical indicator of regional performance, it should always be viewed 
                                    alongside downstream metrics like ROI to ensure volume isn't coming at the expense of profitability.
                                </p>
                            </div>
                            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 shadow-sm">
                                <h4 className="font-bold text-red-400 mb-2">How is the {kpi.title} formula structured?</h4>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    The mathematical relation is represented as: <span className="font-mono bg-slate-900 px-2 py-0.5 rounded text-red-400 font-semibold border border-red-950">{kpi.formula}</span>. This calculates the ratio between primary conversion indicators. You can compute it instantly using the interactive inputs above.
                                </p>
                            </div>
                            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 shadow-sm">
                                <h4 className="font-bold text-red-400 mb-2">What is a good industry benchmark for {kpi.title}?</h4>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    Benchmarks vary widely depending on channels (search, display, social), your specific vertical, and product pricing. For Dubai's AdTech sector, compare your numbers with historical quarterly baselines to determine project growth.
                                </p>
                            </div>
                            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 shadow-sm">
                                <h4 className="font-bold text-red-400 mb-2">How frequently should we monitor {kpi.title}?</h4>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    Daily or weekly checks are highly recommended for operational marketing teams running active digital campaigns. For executive presentations and high-level strategy sessions, monthly reviews are generally sufficient.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Related Tools Section — Cross-Linking */}
                    <div className="mt-8 pt-10 border-t border-slate-800">
                        <h3 className="text-xl font-bold mb-6 text-white font-playfair">Tools to Help Measure {kpi.title}</h3>
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
                                    className="group p-5 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-red-900/40 hover:bg-slate-900/80 transition-all"
                                >
                                    <div className="text-sm font-bold text-slate-200 group-hover:text-red-400 mb-2">{tool.title}</div>
                                    <div className="text-xs text-slate-400 line-clamp-2">{tool.description}</div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
