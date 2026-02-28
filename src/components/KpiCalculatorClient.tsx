'use client';

import { useState, useMemo } from 'react';
import nerdamer from 'nerdamer/all.min';

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
    const resultVarName = title.toLowerCase().replace(/[^a-z0-9]/g, '_');

    const allVariables: KpiField[] = [
        ...fields,
        {
            name: resultVarName,
            label: title,
            type: title.toLowerCase().includes('cost') || title.toLowerCase().includes('value') || title.toLowerCase().includes('revenue') || title.toLowerCase().includes('spend') || title.toLowerCase().includes('ltv') || title.toLowerCase().includes('cpa') || title.toLowerCase().includes('cpc') || title.toLowerCase().includes('cpm') ? 'currency' : title.toLowerCase().includes('rate') || title.toLowerCase().includes('margin') || title.toLowerCase().includes('roi') || title.toLowerCase().includes('%') ? 'percentage' : 'number'
        }
    ];

    const [targetVariable, setTargetVariable] = useState<string>(resultVarName);
    const [inputs, setInputs] = useState<Record<string, string>>({});
    const [currencyCode, setCurrencyCode] = useState('USD');

    const fullEquation = `${resultVarName} = ${formula}`;

    const handleInputChange = (name: string, value: string) => {
        setInputs(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculatedValue = useMemo(() => {
        try {
            const requiredVars = allVariables.filter(v => v.name !== targetVariable);
            const hasAllRequired = requiredVars.every(v => inputs[v.name] && inputs[v.name] !== '');

            if (!hasAllRequired) return null;

            const knowns: Record<string, number> = {};
            requiredVars.forEach(v => {
                let val = parseFloat(inputs[v.name] || '0');
                if (v.type === 'percentage') val = val / 100;
                knowns[v.name] = val;
            });

            const solution = nerdamer.solveEquations(fullEquation, targetVariable);

            if (solution && solution.length > 0) {
                const solutionExpression = solution[0].toString();
                let evaluated = nerdamer(solutionExpression).evaluate(knowns).text();
                let finalNum = eval(evaluated);

                if (isNaN(finalNum) || !isFinite(finalNum)) return null;

                const targetFieldInfo = allVariables.find(v => v.name === targetVariable);
                if (targetFieldInfo?.type === 'percentage') {
                    finalNum = finalNum * 100;
                }

                return finalNum;
            }
            return null;

        } catch (error) {
            console.error("Algebraic evaluation failed", error);
            return null;
        }
    }, [inputs, targetVariable, fullEquation, allVariables]);

    const formatCurrencySymbol = () => {
        switch (currencyCode) {
            case 'USD': return '$';
            case 'EUR': return '€';
            case 'GBP': return '£';
            case 'INR': return '₹';
            case 'AED': return 'د.إ';
            default: return '$';
        }
    };

    const targetField = allVariables.find(v => v.name === targetVariable);
    const inputFields = allVariables.filter(v => v.name !== targetVariable);

    const formattedCalculatedValue = () => {
        if (calculatedValue === null) return '--';
        if (targetField?.type === 'currency') {
            return `${formatCurrencySymbol()}${calculatedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        if (targetField?.type === 'percentage') {
            return `${calculatedValue.toFixed(2)}%`;
        }
        return calculatedValue.toLocaleString('en-US', { maximumFractionDigits: 2 });
    };

    return (
        <div className="max-w-4xl mx-auto w-full mb-20 bg-[#0f0f0f] border border-gray-800 rounded-none p-8 md:p-12">

            {/* Header & Description */}
            <div className="mb-12 border-b border-gray-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h3 className="text-3xl font-black text-white tracking-tight mb-3 uppercase">{title}</h3>
                    <p className="text-gray-500 text-sm max-w-xl font-light leading-relaxed">
                        {description}
                    </p>
                </div>

                {allVariables.some(f => f.type === 'currency') && (
                    <select
                        className="bg-transparent border border-gray-700 text-gray-400 text-xs px-3 py-2 uppercase tracking-widest focus:outline-none focus:border-white transition-colors cursor-pointer appearance-none rounded-none"
                        value={currencyCode}
                        onChange={(e) => setCurrencyCode(e.target.value)}
                    >
                        <option value="USD">USD ($)</option>
                        <option value="AED">AED (د.إ)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                    </select>
                )}
            </div>

            {/* Target Variable Selector (Segmented Control) */}
            <div className="mb-10">
                <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4">What do you want to calculate?</span>
                <div className="flex flex-wrap gap-2">
                    {allVariables.map(field => (
                        <button
                            key={field.name}
                            onClick={() => {
                                setTargetVariable(field.name);
                                setInputs(prev => ({ ...prev, [field.name]: '' }));
                            }}
                            className={`px-5 py-3 text-xs uppercase tracking-widest font-bold transition-all border ${targetVariable === field.name
                                    ? 'bg-white text-black border-white'
                                    : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-400'
                                }`}
                        >
                            {field.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* MASSIVE Result Display for the Target Variable */}
            <div className="bg-[#151515] border border-gray-800 p-8 md:p-12 mb-10 flex flex-col items-center justify-center text-center">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">{targetField?.label} (Result)</span>
                <div className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter break-words max-w-full">
                    {formattedCalculatedValue()}
                </div>
            </div>

            {/* Stark Input Variables */}
            <div>
                <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-6 border-b border-gray-800 pb-2">Known Variables</span>
                <div className="space-y-6">
                    {inputFields.map((field) => (
                        <div key={field.name} className="flex flex-col sm:flex-row sm:items-center border-b border-gray-800 pb-4 group">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-wider sm:w-1/3 mb-2 sm:mb-0 transition-colors group-hover:text-gray-300">
                                {field.label}
                            </label>

                            <div className="sm:w-2/3 flex items-center relative">
                                {field.type === 'currency' && (
                                    <span className="text-xl font-medium text-gray-500 mr-2 absolute left-0">
                                        {formatCurrencySymbol()}
                                    </span>
                                )}

                                <input
                                    type="number"
                                    className={`w-full bg-transparent border-none text-2xl md:text-3xl font-bold text-white placeholder-gray-800 focus:outline-none focus:ring-0 ${field.type === 'currency' ? 'pl-8' : ''}`}
                                    placeholder="0"
                                    value={inputs[field.name] || ''}
                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                    style={{ WebkitAppearance: 'none', margin: 0 }}
                                />

                                {field.type === 'percentage' && (
                                    <span className="text-xl font-medium text-gray-500 ml-2 absolute right-0">%</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 text-right">
                    <code className="text-[10px] uppercase font-mono text-gray-600 block">formula: {fullEquation}</code>
                </div>
            </div>

        </div>
    );
}
