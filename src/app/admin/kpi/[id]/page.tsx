import { prisma } from '@/lib/prisma';
import KpiForm from '@/components/admin/KpiForm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { deleteKpi } from '@/app/actions';

export const dynamic = 'force-dynamic';

interface Props {
    params: {
        id: string;
    }
}

export default async function EditKpiPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const kpi = await prisma.kpi.findUnique({
        where: { id }
    });

    if (!kpi) {
        notFound();
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <Link href="/admin" className="inline-flex items-center text-blue-600 hover:underline">
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Dashboard
                </Link>

                <form action={deleteKpi.bind(null, kpi.id)}>
                    <button type="submit" className="text-red-500 hover:text-red-700 flex items-center" onClick={(e) => {
                        if (!confirm('Are you sure you want to delete this KPI calculator?')) e.preventDefault();
                    }}>
                        <Trash2 size={16} className="mr-1" />
                        Delete
                    </button>
                </form>
            </div>

            <h1 className="text-3xl font-bold mb-6">Edit KPI: {kpi.title}</h1>

            <KpiForm kpi={kpi} />
        </div>
    );
}
