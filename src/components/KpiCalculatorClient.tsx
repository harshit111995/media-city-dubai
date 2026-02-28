'use client';

import { useState, useMemo } from 'react';

interface KpiField {
    name: string;
    label: string;
    type: string; // 'number', 'currency', 'percentage'
}

interface KpiCalculatorClientProps {
    title: string;
    formula: string;
    description: string;
    fields: KpiField[];
}

export default function KpiCalculatorClient({ title, formula, description, fields }: KpiCalculatorClientProps) {
    const [inputs, setInputs] = useState<Record<string, number>>({});
    const [currencyCode, setCurrencyCode] = useState('USD');

    const handleInputChange = (name: string, value: string) => {
        setInputs(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const result = useMemo(() => {
        try {
            const hasAllInputs = fields.every(f => typeof inputs[f.name] !== 'undefined');
            if (!hasAllInputs) return null;

            const paramNames = fields.map(f => f.name);
            const paramValues = fields.map(f => inputs[f.name] || 0);

            const evaluator = new Function(...paramNames, `return (${formula});`);
            const val = evaluator(...paramValues);

            if (isNaN(val) || !isFinite(val)) return 0;
            return val;
        } catch (error) {
            console.error("Formula evaluation failed", error);
            return null;
        }
    }, [inputs, formula, fields]);

    const formatValue = (val: number, type: string) => {
        if (type === 'currency') {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(val);
        } else if (type === 'percentage') {
            return `${val.toFixed(2)}%`;
        }
        return val.toLocaleString('en-US', { maximumFractionDigits: 2 });
    };

    const hasCurrencyField = fields.some(f => f.type === 'currency');

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row">

            {/* Left Column: Context & Formula */}
            <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{title} Calculator</h3>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                        {description}
                    </p>
                </div>

                <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 block mb-1">Mathematical Formula</span>
                    <code className="text-sm font-mono text-accent break-all">{title} = {formula}</code>
                </div>
            </div>

            {/* Middle Column: Interactive Inputs */}
            <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-white/10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Metrics</h3>

                    {hasCurrencyField && (
                        <div className="flex items-center gap-2">
                            <select
                                className="bg-background border border-white/20 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-accent"
                                value={currencyCode}
                                onChange={(e) => setCurrencyCode(e.target.value)}
                            >
                                <option value="USD">USD ($)</option>
                                <option value="AED">AED (د.إ)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="INR">INR (₹)</option>
                            </select>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    {fields.map(field => (
                        <div key={field.name}>
                            <label className="block text-xs font-medium mb-1 text-gray-400">
                                {field.label} {field.type === 'percentage' ? '(%)' : ''}
                            </label>
                            <div className="relative">
                                {field.type === 'currency' && (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none text-sm">
                                        {currencyCode === 'USD' ? '$' : currencyCode === 'EUR' ? '€' : currencyCode === 'GBP' ? '£' : currencyCode === 'INR' ? '₹' : 'د.إ'}
                                    </span>
                                )}
                                <input
                                    type="number"
                                    className={`w-full bg-background border border-white/20 py-2 px-3 rounded text-white text-sm font-medium focus:outline-none focus:border-accent transition-colors ${field.type === 'currency' ? 'pl-8' : ''}`}
                                    placeholder="0"
                                    value={inputs[field.name] === undefined ? '' : inputs[field.name]}
                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                />
                                {field.type === 'percentage' && (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm font-medium">%</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column: Result */}
            <div className="flex-1 bg-gradient-to-br from-accent/20 to-transparent p-6 md:p-8 flex flex-col justify-center items-center text-center">
                <span className="text-gray-300 mb-2 font-medium uppercase tracking-widest text-xs">Estimated Result</span>
                <div className="text-4xl md:text-5xl font-black text-white leading-tight break-words max-w-full">
                    {result !== null ? (
                        title.toLowerCase().includes('cost') || title.toLowerCase().includes('value') || title.toLowerCase().includes('revenue') || title.toLowerCase().includes('spend') || title.toLowerCase().includes('ltv') || title.toLowerCase().includes('cpa') || title.toLowerCase().includes('cpc') || title.toLowerCase().includes('cpm')
                            ? formatValue(result, 'currency')
                            : title.toLowerCase().includes('rate') || title.toLowerCase().includes('margin') || title.toLowerCase().includes('roi') || title.toLowerCase().includes('%')
                                ? formatValue(result * 100, 'percentage')
                                : formatValue(result, 'number')
                    ) : (
                        <span className="text-white/20">--</span>
                    )}
                </div>
            </div>
        </div>
    );
}
