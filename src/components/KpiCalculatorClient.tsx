'use client';

import { useState, useMemo, useEffect } from 'react';
import { Target } from 'lucide-react';
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
    // Determine the "result" variable name. E.g. "cpm = ..." the result is "cpm".
    // Since formulas in our DB are just the right side (e.g. "(spend/impressions)*1000"),
    // we assume the "result" name is the title's acronym/slug. 
    // We will inject a fake field for the Result itself so it becomes part of the equation.

    // Convert formula like "(spend/impressions)*1000" into a full equation: "result_var = (spend/impressions)*1000"
    const resultVarName = title.toLowerCase().replace(/[^a-z0-9]/g, '_');

    // Create an array of ALL variables in the equation (the user inputs + the final result metric)
    const allVariables: KpiField[] = [
        ...fields,
        {
            name: resultVarName,
            label: title,
            type: title.toLowerCase().includes('cost') || title.toLowerCase().includes('value') || title.toLowerCase().includes('revenue') || title.toLowerCase().includes('spend') || title.toLowerCase().includes('ltv') || title.toLowerCase().includes('cpa') || title.toLowerCase().includes('cpc') || title.toLowerCase().includes('cpm') ? 'currency' : title.toLowerCase().includes('rate') || title.toLowerCase().includes('margin') || title.toLowerCase().includes('roi') || title.toLowerCase().includes('%') ? 'percentage' : 'number'
        }
    ];

    // By default, we solve for the main KPI result
    const [targetVariable, setTargetVariable] = useState<string>(resultVarName);

    // Store all raw input strings (allows empty strings while typing)
    const [inputs, setInputs] = useState<Record<string, string>>({});
    const [currencyCode, setCurrencyCode] = useState('USD');

    // Safe full equation string for algebraic parsing
    const fullEquation = `${resultVarName} = ${formula}`;

    const handleInputChange = (name: string, value: string) => {
        setInputs(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // The core bi-directional solver effect
    const calculatedValue = useMemo(() => {
        try {
            // Check if all OTHER variables are filled out
            const requiredVars = allVariables.filter(v => v.name !== targetVariable);
            const hasAllRequired = requiredVars.every(v => inputs[v.name] && inputs[v.name] !== '');

            if (!hasAllRequired) return null;

            // Build the known values map for Nerdamer
            const knowns: Record<string, number> = {};
            requiredVars.forEach(v => {
                let val = parseFloat(inputs[v.name] || '0');
                if (v.type === 'percentage') val = val / 100; // normalize percentages for math
                knowns[v.name] = val;
            });

            // Nerdamer solves the equation algebraically for the target variable
            // E.g. solveEquations("cpm = (spend/impressions)*1000", "spend")
            const solution = nerdamer.solveEquations(fullEquation, targetVariable);

            // If there's a valid solution expression, evaluate it with the known variables
            if (solution && solution.length > 0) {
                const solutionExpression = solution[0].toString();
                let evaluated = nerdamer(solutionExpression).evaluate(knowns).text();

                // Sometimes it returns fractions as strings like "10000/3". Parse it.
                let finalNum = eval(evaluated); // eval is safe here as it's purely numerical output from nerdamer

                if (isNaN(finalNum) || !isFinite(finalNum)) return null;

                // If the target variable we solved for is expected to be a percentage, 
                // multiply by 100 because the user will see it formatted as a %
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


    return (
        <div className="bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-w-3xl mx-auto w-full mb-16 relative">

            {/* Elegant Top Header */}
            <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02]">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight">{title} Calculator</h3>
                    {allVariables.some(f => f.type === 'currency') && (
                        <select
                            className="bg-transparent border border-white/10 rounded-full px-3 py-1 text-xs text-gray-300 focus:outline-none focus:border-accent/50 cursor-pointer hover:bg-white/5 transition-colors"
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
                <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
                    {description}
                </p>
                <code className="mt-4 block text-[11px] uppercase tracking-widest font-mono text-accent/70 bg-accent/5 px-2 py-1 rounded w-fit border border-accent/10">
                    {fullEquation}
                </code>
            </div>

            {/* Bi-Directional Input Section */}
            <div className="p-8 space-y-6">
                <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-6 flex items-center justify-between">
                    <span>Enter Known Metrics</span>
                    <span className="flex items-center text-accent/70 bg-accent/10 px-2 py-1 rounded-full"><Target size={12} className="mr-1" /> Select Target to Solve</span>
                </div>

                {allVariables.map((field) => {
                    const isTarget = targetVariable === field.name;
                    // Format the calculated result nicely if this is the target
                    let displayValue = inputs[field.name] || '';
                    if (isTarget && calculatedValue !== null) {
                        displayValue = calculatedValue.toFixed(2);
                    }

                    return (
                        <div
                            key={field.name}
                            className={`relative flex items-center rounded-xl border transition-all duration-300 overflow-hidden ${isTarget ? 'border-accent bg-accent/5 shadow-[0_0_15px_rgba(var(--accent-rgb),0.2)]' : 'border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-white/20'}`}
                        >
                            {/* Solve-For Radio Toggle Engine */}
                            <button
                                onClick={() => {
                                    setTargetVariable(field.name);
                                    // Clear the input of the newly selected target so it can be overwritten by the calculation
                                    setInputs(prev => ({ ...prev, [field.name]: '' }));
                                }}
                                className={`flex-shrink-0 w-16 h-full absolute left-0 top-0 bottom-0 flex items-center justify-center border-r transition-colors duration-300 z-10 ${isTarget ? 'border-accent/30 bg-accent/10 text-accent' : 'border-white/5 text-gray-600 hover:text-gray-400 hover:bg-white/5'}`}
                                title={`Solve for ${field.label}`}
                            >
                                <Target size={18} className={isTarget ? 'animate-pulse' : ''} />
                            </button>

                            {/* Minimalist Floating Label Input */}
                            <div className="flex-grow pl-20 pr-4 py-3 relative">
                                <label className={`block text-[10px] uppercase tracking-wider font-bold mb-1 transition-colors ${isTarget ? 'text-accent' : 'text-gray-500'}`}>
                                    {field.label} {isTarget ? '(Solving...)' : ''}
                                </label>

                                <div className="flex items-center">
                                    {field.type === 'currency' && (
                                        <span className={`text-lg font-medium mr-1 ${isTarget ? 'text-accent' : 'text-gray-400'}`}>
                                            {currencyCode === 'USD' ? '$' : currencyCode === 'EUR' ? '€' : currencyCode === 'GBP' ? '£' : currencyCode === 'INR' ? '₹' : 'د.إ'}
                                        </span>
                                    )}

                                    <input
                                        type="number"
                                        readOnly={isTarget}
                                        className={`w-full bg-transparent border-none p-0 text-2xl font-semibold outline-none transition-colors ${isTarget ? 'text-white' : 'text-gray-200 placeholder-gray-700'}`}
                                        placeholder={isTarget ? '0.00' : 'Enter value...'}
                                        value={displayValue}
                                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                                        style={{ WebkitAppearance: 'none', margin: 0 }}
                                    />

                                    {field.type === 'percentage' && (
                                        <span className={`text-lg font-medium ml-1 ${isTarget ? 'text-accent' : 'text-gray-400'}`}>%</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}
