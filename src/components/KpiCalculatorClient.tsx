'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import nerdamer from 'nerdamer/all.min';
import { Sparkles, MessageSquareCode, Calculator, Terminal, RotateCcw } from 'lucide-react';
import '@/styles/kpi.css';

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

// Fluid Number Counter Animation Component
const AnimatedNumber = ({ value, formatFn }: { value: number | null, formatFn: (val: number | null) => string }) => {
    const [displayValue, setDisplayValue] = useState<number>(0);
    const animationRef = useRef<number>(0);
    const startValueRef = useRef<number>(0);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (value === null) {
            setDisplayValue(0);
            return;
        }

        const targetValue = value;
        startValueRef.current = displayValue;
        startTimeRef.current = performance.now();
        const duration = 600; // ms

        const animate = (time: number) => {
            if (!startTimeRef.current) startTimeRef.current = time;
            const progress = Math.min((time - startTimeRef.current) / duration, 1);

            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const current = startValueRef.current + (targetValue - startValueRef.current) * easeProgress;
            setDisplayValue(current);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayValue(targetValue);
            }
        };

        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [value]);

    return <span>{displayValue === 0 && value === null ? '--' : formatFn(displayValue)}</span>;
};

export default function KpiCalculatorClient({ title, formula, description, fields }: KpiCalculatorClientProps) {
    const resultVarName = title.toLowerCase().replace(/[^a-z0-9]/g, '_');

    // Auto-detect percentage type broadly based on formula structure if possible, else rely on name
    const isLikelyPercentage = title.toLowerCase().includes('rate') || title.toLowerCase().includes('margin') || title.toLowerCase().includes('roi') || title.toLowerCase().includes('%') || formula.includes('* 100') || formula.includes('/ 100');

    const allVariables: KpiField[] = [
        ...fields,
        {
            name: resultVarName,
            label: title,
            type: title.toLowerCase().includes('cost') || title.toLowerCase().includes('value') || title.toLowerCase().includes('revenue') || title.toLowerCase().includes('spend') || title.toLowerCase().includes('ltv') || title.toLowerCase().includes('cpa') || title.toLowerCase().includes('cpc') || title.toLowerCase().includes('cpm') ? 'currency' : isLikelyPercentage ? 'percentage' : 'number'
        }
    ];

    const [targetVariable, setTargetVariable] = useState<string>(resultVarName);
    const [inputs, setInputs] = useState<Record<string, string>>({});
    const [currencyCode, setCurrencyCode] = useState('USD');
    const [inputMode, setInputMode] = useState<'standard' | 'nlp'>('standard');
    const [nlpString, setNlpString] = useState('');
    const [activeInput, setActiveInput] = useState<string | null>(null);

    const fullEquation = `${resultVarName} = ${formula}`;

    // Natural Language Parser
    useEffect(() => {
        if (inputMode === 'nlp' && nlpString.trim() !== '') {
            // Very naive parser for demonstration: look for numbers near variable names
            const newInputs = { ...inputs };
            let hasChanged = false;

            const text = nlpString.toLowerCase();

            allVariables.forEach(v => {
                if (v.name === targetVariable) return; // Don't parse the target

                // Look for patterns like "spend $500" or "5000 impressions"
                const regex1 = new RegExp(`${v.name.replace('_', ' ')}\\s*(?:is|was|=|:)?\\s*\\$?\\s*([\\d,.]+)`, 'i');
                const regex2 = new RegExp(`\\$?\\s*([\\d,.]+)\\s*(?:for|in)?\\s*${v.name.replace('_', ' ')}`, 'i');

                const match = text.match(regex1) || text.match(regex2);
                if (match && match[1]) {
                    const parsedVal = match[1].replace(/,/g, '');
                    if (!isNaN(parseFloat(parsedVal)) && newInputs[v.name] !== parsedVal) {
                        newInputs[v.name] = parsedVal;
                        hasChanged = true;
                    }
                }
            });

            if (hasChanged) {
                setInputs(newInputs);
            }
        }
    }, [nlpString, inputMode, targetVariable, allVariables]);

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

            // Solve symbolically
            const solution = nerdamer.solveEquations(fullEquation, targetVariable);

            if (solution && solution.length > 0) {
                const solutionExpression = solution[0].toString();
                // Evaluate numerically
                const evaluated = nerdamer(solutionExpression).evaluate(knowns).text();
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

    // Live Equation History Trace
    const liveEquationTrace = useMemo(() => {
        try {
            const requiredVars = allVariables.filter(v => v.name !== targetVariable);
            let trace = fullEquation;

            const solution = nerdamer.solveEquations(fullEquation, targetVariable);
            if (solution && solution.length > 0) {
                trace = `${targetVariable} = ${solution[0].toString()}`;
            }

            requiredVars.forEach(v => {
                const val = inputs[v.name];
                if (val && val !== '') {
                    // Simple string replacement for visualization (not proper algebraic sub)
                    trace = trace.replace(new RegExp(`\\b${v.name}\\b`, 'g'), val);
                }
            });
            return trace;
        } catch (e) {
            return fullEquation;
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

    const formatter = (val: number | null) => {
        if (val === null) return '--';
        if (targetField?.type === 'currency') {
            return `${formatCurrencySymbol()}${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        if (targetField?.type === 'percentage') {
            return `${val.toFixed(2)}%`;
        }
        return val.toLocaleString('en-US', { maximumFractionDigits: 2 });
    };

    // Magic Bar Generator
    const magicSentence = useMemo(() => {
        if (calculatedValue === null) return "Awaiting sufficient data parameters to solve...";

        const fmtd = formatter(calculatedValue);
        const tvLabel = targetField?.label || 'Value';

        // Simple heuristic sentences
        if (tvLabel.toLowerCase().includes('spend') || tvLabel.toLowerCase().includes('cost')) {
            return `You need to allocate ${fmtd} to achieve this target.`;
        }
        if (tvLabel.toLowerCase().includes('revenue') || tvLabel.toLowerCase().includes('value') || tvLabel.toLowerCase().includes('ltv') || tvLabel.toLowerCase().includes('aov')) {
            return `This model projects a return or value of ${fmtd}.`;
        }
        if (tvLabel.toLowerCase().includes('rate') || tvLabel.toLowerCase().includes('%') || tvLabel.toLowerCase().includes('margin')) {
            return `The resulting efficiency or conversion rate is ${fmtd}.`;
        }
        if (tvLabel.toLowerCase().includes('impression') || tvLabel.toLowerCase().includes('click') || tvLabel.toLowerCase().includes('action') || tvLabel.toLowerCase().includes('user')) {
            return `You must generate ${fmtd} volume to hit these metrics.`;
        }

        return `The isolated target variable resolved to ${fmtd}.`;
    }, [calculatedValue, targetField, currencyCode]);


    return (
        <div className="lunar-bg font-sans min-h-screen pt-12 pb-24 relative overflow-hidden text-white">
            {/* Deep Radial Background is now handled by .lunar-bg directly */}

            <div className="max-w-4xl mx-auto w-full relative z-10 px-4">

                {/* The Shell: Glassmorphism Calculator Container */}
                <div className="lunar-shell p-6 md:p-14 relative overflow-hidden">

                    {/* Header line */}
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
                        <div className="flex items-center space-x-3">
                            <Terminal className="w-5 h-5 lunar-text-blue" />
                            <h3 className="text-xl md:text-2xl font-light lunar-text-white tracking-widest uppercase">{title} Solver</h3>
                        </div>

                        {allVariables.some(f => f.type === 'currency') && (
                            <select
                                className="bg-black/40 border border-white/10 text-ghost-white text-xs px-4 py-2 rounded-full uppercase tracking-widest focus:outline-none focus:border-blue-500/50 hover:bg-black/60 transition-colors cursor-pointer appearance-none text-white shadow-inner active:scale-95"
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

                    {/* Mode Toggles */}
                    <div className="flex space-x-2 mb-10 bg-black/40 p-1.5 rounded-2xl w-fit mx-auto border border-white/5 shadow-inner">
                        <button
                            onClick={() => setInputMode('standard')}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-medium transition-all duration-300 active:scale-95 ${inputMode === 'standard'
                                ? 'bg-white/10 text-white shadow-md'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <Calculator className="w-4 h-4" />
                            <span>Structured Matrix</span>
                        </button>
                        <button
                            onClick={() => setInputMode('nlp')}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-medium transition-all duration-300 active:scale-95 ${inputMode === 'nlp'
                                ? 'bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <MessageSquareCode className="w-4 h-4" />
                            <span>Natural Language</span>
                        </button>
                    </div>

                    {/* The Brain: Display */}
                    <div className="mb-14 text-center">
                        <div className="text-slate-500 font-mono text-xs tracking-widest mb-4 h-6 opacity-70 flex justify-center items-center">
                            {liveEquationTrace}
                        </div>

                        <div className="relative inline-flex items-center justify-center">
                            <div className="lunar-massive-text">
                                <AnimatedNumber value={calculatedValue} formatFn={formatter} />
                            </div>
                            {/* Pulsing Caret */}
                            <div className="lunar-caret" />
                        </div>
                        <div className="text-blue-300/60 font-medium tracking-widest uppercase text-xs mt-6 flex justify-center items-center space-x-2">
                            <Sparkles className="w-3 h-3" />
                            <span>Target Logic: {targetField?.label}</span>
                        </div>
                    </div>

                    {/* The Keypad: Inputs */}
                    <div className="space-y-6 max-w-2xl mx-auto">

                        {/* Target Selection Row */}
                        {!targetVariable && (
                            <div className="text-center text-rose-400 text-sm py-4">Please select a target variable below to solve.</div>
                        )}
                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                            {allVariables.map(field => (
                                <button
                                    key={`sel-${field.name}`}
                                    onClick={() => {
                                        setTargetVariable(field.name);
                                        // Clear current input for new target if needed, but keeping others helps reverse flow
                                        const newInputs = { ...inputs };
                                        delete newInputs[field.name];
                                        setInputs(newInputs);
                                    }}
                                    className={`px-4 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all duration-200 active:scale-95 ${targetVariable === field.name
                                        ? 'lunar-pill-active'
                                        : 'lunar-pill-inactive'
                                        }`}
                                >
                                    Solve: {field.label}
                                </button>
                            ))}
                        </div>

                        {/* Input Fields */}
                        {inputMode === 'standard' ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {inputFields.map((field) => (
                                    <div
                                        key={`in-${field.name}`}
                                        className={`lunar-input-container p-4 flex flex-col justify-center relative group overflow-hidden ${activeInput === field.name ? 'lunar-input-active' : ''}`}
                                    >
                                        <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1 whitespace-nowrap overflow-hidden text-ellipsis z-10">
                                            {field.label}
                                        </label>
                                        <div className="flex items-center relative z-10">
                                            {field.type === 'currency' && <span className="text-white/40 mr-1 font-medium text-lg">{formatCurrencySymbol()}</span>}
                                            <input
                                                type="number"
                                                className="w-full bg-transparent border-none text-xl md:text-2xl font-medium lunar-text-white placeholder-slate-700 outline-none p-0 focus:ring-0"
                                                placeholder="0"
                                                value={inputs[field.name] || ''}
                                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                onFocus={() => setActiveInput(field.name)}
                                                onBlur={() => setActiveInput(null)}
                                            />
                                            {field.type === 'percentage' && <span className="text-white/40 ml-1 font-medium text-lg">%</span>}
                                        </div>
                                    </div>
                                ))}

                                <div className="col-span-2 md:col-span-3 flex justify-end mt-2">
                                    <button
                                        onClick={() => setInputs({})}
                                        className="flex items-center space-x-2 lunar-text-rose hover:bg-rose-950/30 px-4 py-2 rounded-lg text-xs font-medium transition-all active:scale-95"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                        <span>AC (Clear All)</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="lunar-textarea p-6">
                                <textarea
                                    className="w-full bg-transparent lunar-text-white font-light text-lg lg:text-xl md:leading-relaxed resize-none outline-none placeholder-slate-600 min-h-[120px]"
                                    placeholder="e.g., 'We spent $5,000 on ads and generated 1,000,000 impressions...'"
                                    value={nlpString}
                                    onChange={(e) => setNlpString(e.target.value)}
                                />
                                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs">
                                    <span className="text-blue-400/80 flex items-center"><Sparkles className="w-3 h-3 mr-1" /> Auto-mapping active</span>
                                    <span className="text-slate-500">Variables detected: {Object.values(inputs).filter(v => v !== '').length}</span>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Smart Suggestions: "Magic Bar" */}
                    <div className="mt-14 pt-6 border-t border-white/10 text-center">
                        <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/5 inline-block text-sm lunar-text-slate font-light shadow-inner max-w-full">
                            <span className="flex items-center justify-center break-words whitespace-normal leading-relaxed text-center px-2">
                                <Sparkles className="w-4 h-4 lunar-text-blue mr-2 flex-shrink-0" />
                                <span>{magicSentence}</span>
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
