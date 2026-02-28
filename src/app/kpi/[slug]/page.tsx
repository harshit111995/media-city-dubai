import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link href="/kpi" className="inline-flex items-center text-accent hover:underline mb-8 font-medium">
                <ArrowLeft size={16} className="mr-2" />
                Back to Calculators
            </Link>

            <div className="glass-panel p-8 md:p-12 rounded-2xl mb-8">
                <span className="text-sm font-semibold text-accent uppercase tracking-wider mb-3 block">{kpi.category}</span>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 font-playfair text-white">{kpi.title} Calculator</h1>
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                    {kpi.description}
                </p>

                <div className="bg-background/80 p-5 rounded-xl border border-white/5 shadow-inner inline-block mb-10 w-full md:w-auto">
                    <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 block mb-2">Mathematical Formula</span>
                    <code className="text-xl font-mono text-accent">{kpi.title} = {kpi.formula}</code>
                </div>

                <KpiCalculatorClient
                    title={kpi.title}
                    formula={kpi.formula}
                    fields={parsedFields}
                />
            </div>
        </div>
    );
}
