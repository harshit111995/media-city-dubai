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

            <div className="max-w-xl mx-auto mb-12 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                    type="text"
                    className="w-full bg-white/5 border border-white/20 pl-12 pr-4 py-4 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors shadow-lg"
                    placeholder="Search calculators (e.g., ROAS, Conversion, CPC)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredKpis.map((kpi) => (
                    <Link href={`/kpi/${kpi.slug}`} key={kpi.id} className="glass-panel p-6 rounded-xl hover:border-accent/50 transition-colors flex flex-col h-full border border-white/10 group">
                        <span className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3 bg-accent/10 px-2 py-1 rounded inline-block w-fit">{kpi.category}</span>
                        <h2 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">{kpi.title}</h2>

                        {kpi.formula && (
                            <code className="text-xs font-mono text-gray-400 mb-3 block truncate bg-black/20 px-2 py-1 rounded">
                                {kpi.formula}
                            </code>
                        )}

                        <p className="text-sm text-gray-300 flex-grow leading-relaxed">{kpi.description}</p>

                        <div className="mt-6 pt-4 border-t border-white/10 text-accent font-medium text-sm flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity">
                            Calculate Now <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
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
