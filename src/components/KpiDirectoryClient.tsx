'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Sparkles } from 'lucide-react';

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
        <div className="min-h-screen relative overflow-hidden bg-slate-950 font-sans pb-24 pt-16">
            {/* Deep Radial Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 z-0 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 max-w-7xl">

                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-medium text-blue-300 uppercase tracking-widest">AI-Powered Math Matrix</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-light mb-6 text-white tracking-tight">Business Intelligence</h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto font-light leading-relaxed">
                        Specify inputs with natural language or standard fields. Our bi-directional solver maps the exact formula you need.
                    </p>
                </div>

                {/* Glassmorphism Search */}
                <div className="mb-16 relative max-w-2xl mx-auto group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="w-full bg-white/5 backdrop-blur-xl border border-white/10 pl-14 pr-6 py-5 rounded-3xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] focus:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300 text-lg font-light"
                        placeholder="Ask the matrix (e.g. ROAS)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredKpis.map((kpi) => (
                        <Link href={`/kpi/${kpi.slug}`} key={kpi.id} className="block group">
                            <div className="h-full p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 hover:border-blue-500/30 hover:bg-white/10 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300 flex flex-col active:scale-95 cursor-pointer">

                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest bg-black/30 px-3 py-1.5 rounded-full">{kpi.category}</span>
                                    <Sparkles className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                                </div>

                                <h2 className="text-xl font-light text-white mb-3 group-hover:text-blue-50 transition-colors tracking-tight">{kpi.title}</h2>
                                <p className="text-sm text-slate-500 flex-grow leading-relaxed font-light line-clamp-3">{kpi.description}</p>

                                {kpi.formula && (
                                    <div className="mt-6 pt-4 border-t border-white/5 text-[10px] font-mono text-slate-600 truncate opacity-50 group-hover:opacity-100 transition-opacity">
                                        equation: {kpi.formula}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredKpis.length === 0 && (
                    <div className="text-slate-500 text-center py-16 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 mt-8">
                        <p className="text-xl font-light">No intelligence models matched.</p>
                        <p className="text-sm mt-2 opacity-50">Refine your query parameters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
