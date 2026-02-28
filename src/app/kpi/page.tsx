import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
    title: 'KPI Calculators | Media City Dubai',
    description: 'Calculate and understand essential Marketing, Sales, and Finance KPIs.'
};

export const dynamic = 'force-dynamic';

export default async function KpiDirectoryPage() {
    const kpis = await prisma.kpi.findMany({
        orderBy: { title: 'asc' }
    });

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-4 font-playfair text-white">KPI Calculators</h1>
            <p className="text-gray-300 text-lg mb-12 max-w-2xl">
                Measure what matters. Browse our collection of interactive calculators to easily compute essential metrics for Marketing, Sales, and Finance.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kpis.map((kpi) => (
                    <Link href={`/kpi/${kpi.slug}`} key={kpi.id} className="glass-panel p-6 rounded-xl hover:border-accent/50 transition-colors flex flex-col h-full border border-white/10">
                        <span className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">{kpi.category}</span>
                        <h2 className="text-xl font-bold text-white mb-3">{kpi.title}</h2>
                        <p className="text-sm text-gray-400 flex-grow">{kpi.description.substring(0, 100)}...</p>
                        <div className="mt-4 pt-4 border-t border-white/10 text-accent font-medium text-sm flex items-center justify-between">
                            Calculate Now &rarr;
                        </div>
                    </Link>
                ))}
            </div>

            {kpis.length === 0 && (
                <div className="text-gray-500 italic bg-white/5 p-8 rounded-xl text-center border border-white/10">No KPI calculators available yet. Check back soon!</div>
            )}
        </div>
    );
}
