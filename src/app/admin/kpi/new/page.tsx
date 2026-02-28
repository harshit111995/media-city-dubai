import KpiForm from '@/components/admin/KpiForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function NewKpiPage() {
    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
            <Link href="/admin" className="inline-flex items-center text-blue-600 hover:underline mb-6">
                <ArrowLeft size={16} className="mr-1" />
                Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold mb-6">Create New KPI Calculator</h1>

            <KpiForm />
        </div>
    );
}
