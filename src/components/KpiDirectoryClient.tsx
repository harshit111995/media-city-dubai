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
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair text-white text-center">Marketing & Business Calculators</h1>
            <p className="text-gray-300 text-lg mb-10 text-center max-w-2xl mx-auto">
                Measure what matters. Browse our collection of 30+ interactive calculators to easily compute essential metrics for Marketing, Sales, and E-Commerce.
            </p>

            <div className="max-w-md mx-auto mb-16 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-500" />
                </div>
                <input
                    type="text"
                    className="w-full bg-black/20 backdrop-blur-md border border-white/10 pl-10 pr-4 py-3 rounded-full text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:bg-white/5 transition-all shadow-[0_0_15px_rgba(255,255,255,0.02)]"
                    placeholder="Search calculators (e.g. ROAS, CPC)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredKpis.map((kpi) => (
                    <Link href={`/kpi/${kpi.slug}`} key={kpi.id} className="bg-white/[0.02] p-6 rounded-2xl hover:bg-white/5 border border-white/5 hover:border-accent/30 transition-all flex flex-col h-full group relative overflow-hidden shadow-lg">

                        {/* Subtle background glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <div className="relative z-10 flex flex-col h-full">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">{kpi.category}</span>
                            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">{kpi.title}</h2>

                            {kpi.formula && (
                                <code className="text-[10px] font-mono text-accent/70 bg-accent/5 px-2 py-1 rounded w-fit mb-3 border border-accent/10 whitespace-nowrap overflow-hidden text-ellipsis max-w-full block">
                                    {kpi.title} = {kpi.formula}
                                </code>
                            )}

                            <p className="text-xs text-gray-400 flex-grow leading-relaxed line-clamp-2">{kpi.description}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredKpis.length === 0 && (
                <div className="text-gray-400 italic bg-white/5 p-12 rounded-xl text-center border border-white/10 mt-8">
                    <p className="text-xl mb-2">No calculators found</p>
                    <p className="text-sm">Try adjusting your search terms.</p>
                </div>
            )}
        </div>
    );
}
