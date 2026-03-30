import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import KpiDirectoryClient from '@/components/KpiDirectoryClient';

export const metadata: Metadata = {
    title: 'KPI Calculators | Media City Dubai',
    description: 'Calculate and understand essential Marketing, Sales, and Finance KPIs with our bi-directional performance tools.',
    alternates: {
        canonical: '/kpi',
    },
    openGraph: {
        title: 'KPI Calculators for Media & Marketing | Dubai',
        description: 'Professional calculators for CPA, CTR, CPM, and ROI. Optimize your media performance.',
        url: 'https://mediacitydubai.com/kpi',
        siteName: 'Media City Dubai',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: 'https://mediacitydubai.com/images/forum-minimalist.png',
                width: 1200,
                height: 630,
                alt: 'KPI Calculators Media City Dubai',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'KPI Calculators for Media & Marketing | Dubai',
        description: 'Professional performance tools for digital media experts in Dubai.',
        images: ['https://mediacitydubai.com/images/forum-minimalist.png'],
        site: '@mediacitydubai',
        creator: '@mediacitydubai',
    },
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
