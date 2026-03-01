'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Sparkles } from 'lucide-react';
import '@/styles/kpi.css';

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
        <div className="lunar-bg min-h-screen relative overflow-hidden font-sans pb-24 pt-16">
            {/* Deep Radial Background is now handled by .lunar-bg */}

            <div className="container mx-auto px-4 relative z-10 max-w-7xl">

                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center space-x-2 bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-medium text-red-600 uppercase tracking-widest">AI-Powered Math Matrix</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 tracking-tight">Business Intelligence</h1>
                    <p className="text-gray-600 text-lg max-w-xl mx-auto font-medium leading-relaxed">
                        Specify inputs with standard fields. Our bi-directional solver maps the exact formula you need.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredKpis.map((kpi) => (
                    <Link href={`/kpi/${kpi.slug}`} key={kpi.id} className="block group">
                        <div className="h-full p-6 lunar-card flex flex-col active:scale-95 cursor-pointer">

                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-3 py-1.5 rounded-md">{kpi.category}</span>
                                <Sparkles className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors tracking-tight">{kpi.title}</h2>
                            <p className="text-sm text-gray-600 flex-grow leading-relaxed font-medium line-clamp-3">{kpi.description}</p>

                            {kpi.formula && (
                                <div className="mt-6 pt-4 border-t border-gray-100 text-[10px] font-mono text-gray-500 truncate opacity-50 group-hover:opacity-100 transition-opacity">
                                    equation: {kpi.formula}
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {filteredKpis.length === 0 && (
                <div className="lunar-text-slate text-center py-16 lunar-card mt-8">
                    <p className="text-xl font-light">No intelligence models matched.</p>
                    <p className="text-sm mt-2 opacity-50">Refine your query parameters.</p>
                </div>
            )}
        </div>
    );
}
