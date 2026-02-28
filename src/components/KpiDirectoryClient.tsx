'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface KpiLite {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: string;
    formula?: string;
}

export default function KpiDirectoryClient({ initialKpis }: { initialKpis: KpiLite[] }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredKpis = initialKpis.filter(kpi => {
        const query = searchQuery.toLowerCase();
        return (
            kpi.title.toLowerCase().includes(query) ||
            kpi.category.toLowerCase().includes(query) ||
            kpi.description.toLowerCase().includes(query)
        );
    });

    return (
        <div className="container mx-auto px-4 py-16 max-w-7xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-inter text-white tracking-tight">Calculators</h1>
            <p className="text-gray-400 text-lg mb-16 max-w-2xl font-light">
                Essential metrics for Marketing, Sales, and E-Commerce.
            </p>

            <div className="mb-16 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-600" />
                </div>
                <input
                    type="text"
                    className="w-full bg-transparent border-b border-gray-800 pl-10 pr-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors text-lg font-light rounded-none"
                    placeholder="Search tools (e.g. ROAS)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredKpis.map((kpi) => (
                    <Link href={`/kpi/${kpi.slug}`} key={kpi.id} className="block p-6 bg-transparent border border-gray-800 hover:border-gray-500 transition-colors h-full flex flex-col group">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 block group-hover:text-gray-400 transition-colors">{kpi.category}</span>
                        <h2 className="text-xl font-bold text-white mb-2">{kpi.title}</h2>
                        <p className="text-sm text-gray-500 flex-grow leading-relaxed line-clamp-2">{kpi.description}</p>
                    </Link>
                ))}
            </div>

            {filteredKpis.length === 0 && (
                <div className="text-gray-500 text-center py-12 border border-gray-800 border-dashed mt-8">
                    <p className="text-lg">No calculators found</p>
                </div>
            )}
        </div>
    );
}
