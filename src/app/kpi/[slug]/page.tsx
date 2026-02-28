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
            <div className="mb-8">
                <KpiCalculatorClient
                    title={kpi.title}
                    formula={kpi.formula}
                    description={kpi.description}
                    fields={parsedFields}
                />
            </div>
        </div>
    );
}
