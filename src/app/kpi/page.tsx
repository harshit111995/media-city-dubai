import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import KpiDirectoryClient from '@/components/KpiDirectoryClient';

export const metadata: Metadata = {
    title: 'KPI Calculators | Media City Dubai',
    description: 'Calculate and understand essential Marketing, Sales, and Finance KPIs.'
};

export const dynamic = 'force-dynamic';

export default async function KpiDirectoryPage() {
    const kpis = await prisma.kpi.findMany({
        orderBy: { title: 'asc' },
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            category: true,
            formula: true
        }
    });

    return <KpiDirectoryClient initialKpis={kpis} />;
}
