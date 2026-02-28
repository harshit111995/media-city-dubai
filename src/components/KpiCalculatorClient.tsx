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
    fields: KpiField[];
}

export default function KpiCalculatorClient({ title, formula, fields }: KpiCalculatorClientProps) {
    // Store user inputs by field name
    const [inputs, setInputs] = useState<Record<string, number>>({});
    // Preferred currency
    const [currencyCode, setCurrencyCode] = useState('USD');

    // Handle input change
    const handleInputChange = (name: string, value: string) => {
        setInputs(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    // Evaluate formula safely
    const result = useMemo(() => {
        try {
            // Check if all fields have some value
            const hasAllInputs = fields.every(f => typeof inputs[f.name] !== 'undefined');
            if (!hasAllInputs) return null;

            // Create a function with parameters based on field names
            const paramNames = fields.map(f => f.name);
            const paramValues = fields.map(f => inputs[f.name] || 0);

            // Note: In real production systems, consider a mathematical parser (e.g., mathjs) 
            // to avoid Function constructor, but since the formula is strictly controlled by 
            // our CMS and not user input, this is a clean approach.
            const evaluator = new Function(...paramNames, `return (${formula});`);
            const val = evaluator(...paramValues);

            // Check for NaN or Infinity (e.g. divide by zero)
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
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Inputs Section */}
                <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-end mb-4">
                        <h3 className="text-xl font-bold text-white">Enter Metrics</h3>

                        {hasCurrencyField && (
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-400">Currency:</label>
                                <select
                                    className="bg-background border border-white/20 rounded-md p-2 text-sm text-white focus:outline-none focus:border-accent"
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

                    {fields.map(field => (
                        <div key={field.name}>
                            <label className="block text-sm font-medium mb-1 text-gray-300">
                                {field.label} {field.type === 'percentage' ? '(%)' : ''}
                            </label>
                            <div className="relative">
                                {field.type === 'currency' && (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none text-lg">
                                        {currencyCode === 'USD' ? '$' : currencyCode === 'EUR' ? '€' : currencyCode === 'GBP' ? '£' : currencyCode === 'INR' ? '₹' : 'د.إ'}
                                    </span>
                                )}
                                <input
                                    type="number"
                                    className={`w-full bg-background border border-white/20 p-4 rounded-lg text-white font-medium focus:outline-none focus:border-accent transition-colors ${field.type === 'currency' ? 'pl-10' : ''}`}
                                    placeholder="0"
                                    value={inputs[field.name] === undefined ? '' : inputs[field.name]}
                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                />
                                {field.type === 'percentage' && (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 font-medium">%</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Result Section */}
                <div className="flex-1 bg-gradient-to-br from-accent/20 to-transparent border border-accent/30 rounded-xl p-8 flex flex-col justify-center items-center text-center shadow-inner">
                    <span className="text-gray-300 mb-3 font-medium uppercase tracking-widest text-sm">Estimated {title}</span>
                    <div className="text-6xl font-black text-white leading-tight">
                        {result !== null ? (
                            // Determine output formatting heuristically based on formula or default to raw
                            // E.g., Return on Ad spend is a ratio. Cost per lead is currency.
                            title.toLowerCase().includes('cost') || title.toLowerCase().includes('value') || title.toLowerCase().includes('revenue')
                                ? formatValue(result, 'currency')
                                : title.toLowerCase().includes('rate') || title.toLowerCase().includes('margin')
                                    ? formatValue(result * 100, 'percentage')
                                    : formatValue(result, 'number')
                        ) : (
                            <span className="text-white/20">--</span>
                        )}
                    </div>
                    {result !== null && (
                        <span className="text-xs font-semibold text-accent mt-6 bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full">Results Calculated Automatically</span>
                    )}
                </div>
            </div>
        </div>
    );
}
