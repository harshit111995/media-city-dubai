'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Sparkles, MessageSquareCode, Calculator, Terminal, RotateCcw, CheckCircle2 } from 'lucide-react';
import '@/styles/kpi.css';

interface KpiField {
    name: string;
    label: string;
    type: string;
}

interface KpiCalculatorClientProps {
    title: string;
    formula: string;
    description: string;
    fields: KpiField[];
}

// Animated number counter component
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
        const duration = 600;

        const animate = (time: number) => {
            if (!startTimeRef.current) startTimeRef.current = time;
            const progress = Math.min((time - startTimeRef.current) / duration, 1);
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

        return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
    }, [value]);

    return <span>{displayValue === 0 && value === null ? '--' : formatFn(displayValue)}</span>;
};

/**
 * Direct arithmetic solver: substitutes all known variables into the formula
 * and solves for the unknown using eval() on the rearranged expression.
 *
 * Approach:
 *  1. For "target = formula" — just evaluate rhs with known vars
 *  2. For "target is IN formula" — rearrange algebraically via substitution
 *    The trick: substitute ALL known vars into the formula string, then
 *    use numeric iteration (Newton's method or binary search) to find
 *    the value for targetVar that satisfies: targetVar = formula_result
 *    But simpler: since all our formulas are single-expression, we can
 *    evaluate the formula symbolically by setting targetVar to a variable
 *    and solving algebraically using the known = rhs equation.
 *
 * For formulas like: result = a / b * 1000
 *  - Solve for result: eval(a/b*1000)
 *  - Solve for a: a = result * b / 1000
 *  - Solve for b: b = a * 1000 / result
 *
 * We handle this by passing all known values into the formula as JS vars
 * and solving for the single unknown using equation rearrangement.
 */
function solveFormula(
    formula: string,
    targetVar: string,
    allVars: { name: string; type: string }[],
    inputValues: Record<string, number>
): number | null {
    try {
        // Build the known variable map
        const knownVars: Record<string, number> = {};
        for (const v of allVars) {
            if (v.name !== targetVar && inputValues[v.name] !== undefined) {
                knownVars[v.name] = inputValues[v.name];
            }
        }

        // Check we have all required variables
        const requiredVars = allVars.filter(v => v.name !== targetVar);
        const hasAll = requiredVars.every(v => knownVars[v.name] !== undefined);
        if (!hasAll) return null;

        // Strategy 1: If targetVar is the top-level result of the formula,
        // just set targetVar = eval(formula) with all knowns substituted
        // Strategy 2: If targetVar appears inside the formula, we need to solve for it
        // We do this with numeric binary search / Newton's method

        // First check if targetVar appears in the formula
        const targetInFormula = new RegExp(`\\b${targetVar}\\b`).test(formula);

        if (!targetInFormula) {
            // Target is the result — just evaluate the formula with all known vars
            const result = evalWithVars(formula, knownVars);
            return result;
        }

        // Target is INSIDE the formula — need to solve for it
        // We represent the equation as: targetVar = formula(all vars including targetVar)
        // Which means: find X such that X = formula_with_X
        // For all our formulas (linear in targetVar), binary search works perfectly

        // Build the objective function: f(x) = formula(x, other_vars) - x = 0
        // Use bisection over a wide range

        const objFn = (x: number): number => {
            const vars = { ...knownVars, [targetVar]: x };
            const fResult = evalWithVars(formula, vars);
            if (fResult === null) return NaN;
            return fResult - x;
        };

        // For equations like "result = a / b" where we solve for b:
        // We're solving "b = a / b" which gives b^2 = a, b = sqrt(a)
        // But our formulas are structured as "result_var = formula"
        // and targetVar is one of the inputs, so the formula doesn't actually contain targetVar
        // Let me re-examine...

        // Actually: In our formula DB, the formula field is the RHS expression
        // The full equation is: resultVar = formula(inputs)
        // targetVar might be resultVar OR one of the inputs
        // If targetVar is in the inputs (appears in formula), then we need:
        //   resultVar = formula(targetVar, otherKnowns)
        //   BUT we know resultVar from the user inputs
        // So: solve formula(targetVar, otherKnowns) = knownResultVarValue

        // Let's identify the result variable (it's NOT in fields, it's the KPI itself)
        // Actually allVars includes the result var at the end (added in the parent component)
        // If targetVar is in the formula, we need the result var's value to solve
        const resultVar = allVars[allVars.length - 1]; // Last var is the result KPI

        if (resultVar.name !== targetVar) {
            // targetVar is an INPUT that appears in the formula
            // We know resultVar's value from user input
            const knownResultVal = knownVars[resultVar.name];
            if (knownResultVal === undefined) return null;

            // Solve: formula(targetVar, otherKnowns) = knownResultVal
            // i.e., evalWithVars(formula, {targetVar: x, ...otherKnowns}) - knownResultVal = 0
            const obj2 = (x: number): number => {
                const vars = { ...knownVars, [targetVar]: x };
                const fResult = evalWithVars(formula, vars);
                if (fResult === null) return NaN;
                return fResult - knownResultVal;
            };

            return bisect(obj2, 1e-12, 1e15, 200);
        }

        return bisect(objFn, 1e-12, 1e15, 200);

    } catch (e) {
        console.error('solveFormula error:', e);
        return null;
    }
}

function evalWithVars(expr: string, vars: Record<string, number>): number | null {
    try {
        // Replace variable names with their values
        // Sort by length descending to avoid partial replacements (e.g., "total_spend" before "spend")
        const sortedKeys = Object.keys(vars).sort((a, b) => b.length - a.length);
        let substituted = expr;
        for (const key of sortedKeys) {
            const val = vars[key];
            // Use word boundary replacement
            substituted = substituted.replace(
                new RegExp(`\\b${key}\\b`, 'g'),
                `(${val})`
            );
        }
        // eslint-disable-next-line no-eval
        const result = eval(substituted);
        if (typeof result !== 'number' || !isFinite(result) || isNaN(result)) return null;
        return result;
    } catch {
        return null;
    }
}

function bisect(fn: (x: number) => number, lo: number, hi: number, maxIter: number): number | null {
    // Try a few different ranges for better coverage
    const ranges: [number, number][] = [
        [1e-12, 1e12],
        [1e-12, 1e9],
        [0.0001, 999999],
        [-1e9, -1e-12], // For negative solutions
    ];

    for (const [rangeLo, rangeHi] of ranges) {
        const fLo = fn(rangeLo);
        const fHi = fn(rangeHi);

        if (isNaN(fLo) || isNaN(fHi)) continue;
        if (Math.sign(fLo) === Math.sign(fHi)) continue; // No root in this range

        let a = rangeLo;
        let b = rangeHi;

        for (let i = 0; i < maxIter; i++) {
            const mid = (a + b) / 2;
            const fMid = fn(mid);
            if (isNaN(fMid)) break;
            if (Math.abs(fMid) < 1e-9 || (b - a) / 2 < 1e-12) return mid;
            if (Math.sign(fMid) === Math.sign(fn(a))) a = mid;
            else b = mid;
        }
        return (a + b) / 2;
    }
    return null;
}

export default function KpiCalculatorClient({ title, formula, description, fields }: KpiCalculatorClientProps) {
    const resultVarName = title.toLowerCase().replace(/[^a-z0-9]/g, '_');

    const isLikelyPercentage = title.toLowerCase().includes('rate') || title.toLowerCase().includes('margin') || title.toLowerCase().includes('roi') || title.toLowerCase().includes('%') || formula.includes('* 100') || formula.includes('/ 100');

    const allVariables: KpiField[] = [
        ...fields.map(f => {
            if (f.type !== 'currency') {
                const l = f.label.toLowerCase();
                if (l.includes('cost') || l.includes('value') || l.includes('revenue') || l.includes('spend') || l.includes('ltv') || l.includes('cpa') || l.includes('cpc') || l.includes('cpm') || l.includes('cac')) {
                    return { ...f, type: 'currency' };
                }
            }
            return f;
        }),
        {
            name: resultVarName,
            label: title,
            type: title.toLowerCase().includes('cost') || title.toLowerCase().includes('value') || title.toLowerCase().includes('revenue') || title.toLowerCase().includes('spend') || title.toLowerCase().includes('ltv') || title.toLowerCase().includes('cpa') || title.toLowerCase().includes('cpc') || title.toLowerCase().includes('cpm') || title.toLowerCase().includes('cac') ? 'currency' : isLikelyPercentage ? 'percentage' : 'number'
        }
    ];

    const [targetVariable, setTargetVariable] = useState<string>(resultVarName);
    const [inputs, setInputs] = useState<Record<string, string>>({});
    const [currencyCode, setCurrencyCode] = useState('USD');
    const [inputMode, setInputMode] = useState<'standard' | 'nlp'>('standard');
    const [nlpString, setNlpString] = useState('');
    const [activeInput, setActiveInput] = useState<string | null>(null);

    // Natural Language Parser
    useEffect(() => {
        if (inputMode === 'nlp' && nlpString.trim() !== '') {
            const newInputs = { ...inputs };
            let hasChanged = false;
            const text = nlpString.toLowerCase();

            allVariables.forEach(v => {
                if (v.name === targetVariable) return;
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

            if (hasChanged) setInputs(newInputs);
        }
    }, [nlpString, inputMode, targetVariable]);

    const handleInputChange = (name: string, value: string) => {
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    const calculatedValue = useMemo(() => {
        try {
            const inputFields = allVariables.filter(v => v.name !== targetVariable);
            const hasAllRequired = inputFields.every(v => inputs[v.name] && inputs[v.name] !== '');
            if (!hasAllRequired) return null;

            // Build numeric values map (handle percentage types by dividing by 100 if needed)
            const numericInputs: Record<string, number> = {};
            for (const v of inputFields) {
                let val = parseFloat(inputs[v.name] || '0');
                // Percentages stored as e.g. "2.5" for 2.5% — keep as-is for formula evaluation
                // because formulas like ctr = clicks/impressions already expect raw ratios
                // Only divide by 100 if the variable type is percentage AND the formula doesn't do its own * 100
                numericInputs[v.name] = val;
            }

            // The result variable name is the last in allVariables
            const resultVar = allVariables[allVariables.length - 1];

            let result: number | null = null;

            if (targetVariable === resultVar.name) {
                // Solving for the KPI result: just evaluate the formula with all input values
                result = evalWithVars(formula, numericInputs);
            } else {
                // Solving for one of the inputs: we know the KPI result and need to find the input
                // The result var must be provided by the user
                const knownResultVal = parseFloat(inputs[resultVar.name] || '');
                if (isNaN(knownResultVal)) return null;

                // Use direct algebraic rearrangement
                result = solveForInput(formula, targetVariable, numericInputs, knownResultVal);
            }

            if (result === null || isNaN(result) || !isFinite(result)) return null;

            // Apply percentage scaling for display if the result type is percentage
            // and the formula doesn't already multiply by 100
            const targetFieldInfo = allVariables.find(v => v.name === targetVariable);
            if (targetFieldInfo?.type === 'percentage' && !formula.includes('* 100') && !formula.includes('*100')) {
                result = result * 100;
            }

            return result;

        } catch (error) {
            console.error('Calculation failed:', error);
            return null;
        }
    }, [inputs, targetVariable, formula, allVariables]);

    const liveEquationTrace = useMemo(() => {
        try {
            const targetLabel = allVariables.find(v => v.name === targetVariable)?.label || targetVariable;
            const inputFields = allVariables.filter(v => v.name !== targetVariable);
            let trace = `${targetLabel} = ${formula}`;

            inputFields.forEach(v => {
                const val = inputs[v.name];
                if (val && val !== '') {
                    trace = trace.replace(new RegExp(`\\b${v.name}\\b`, 'g'), val);
                }
            });

            return trace;
        } catch {
            return formula;
        }
    }, [inputs, targetVariable, formula, allVariables]);

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
        return val.toLocaleString('en-US', { maximumFractionDigits: 4 });
    };

    const magicSentence = useMemo(() => {
        if (calculatedValue === null) return 'Awaiting sufficient data parameters to solve...';
        const fmtd = formatter(calculatedValue);
        const tvLabel = targetField?.label || 'Value';
        if (tvLabel.toLowerCase().includes('spend') || tvLabel.toLowerCase().includes('cost')) return `You need to allocate ${fmtd} to achieve this target.`;
        if (tvLabel.toLowerCase().includes('revenue') || tvLabel.toLowerCase().includes('value') || tvLabel.toLowerCase().includes('ltv') || tvLabel.toLowerCase().includes('aov')) return `This model projects a return or value of ${fmtd}.`;
        if (tvLabel.toLowerCase().includes('rate') || tvLabel.toLowerCase().includes('%') || tvLabel.toLowerCase().includes('margin')) return `The resulting efficiency or conversion rate is ${fmtd}.`;
        if (tvLabel.toLowerCase().includes('impression') || tvLabel.toLowerCase().includes('click') || tvLabel.toLowerCase().includes('action') || tvLabel.toLowerCase().includes('user')) return `You must generate ${fmtd} volume to hit these metrics.`;
        return `The isolated target variable resolved to ${fmtd}.`;
    }, [calculatedValue, targetField, currencyCode]);

    return (
        <div className="lunar-bg font-sans min-h-screen pt-12 pb-24 relative overflow-hidden text-gray-900">
            <div className="max-w-4xl mx-auto w-full relative z-10 px-4">
                <div className="lunar-shell p-6 md:p-14 relative overflow-hidden">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                            <Terminal className="w-5 h-5 text-red-600" />
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 tracking-widest uppercase">{title} Solver</h3>
                        </div>

                        {allVariables.some(f => f.type === 'currency') && (
                            <select
                                className="bg-white border border-gray-200 text-gray-700 text-xs px-4 py-2 rounded-full uppercase tracking-widest focus:outline-none focus:border-red-500 hover:bg-gray-50 transition-colors cursor-pointer appearance-none shadow-sm active:scale-95"
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
                    <div className="kpi-toggle-container">
                        <button onClick={() => setInputMode('standard')} className={`kpi-toggle-btn ${inputMode === 'standard' ? 'active' : ''}`}>
                            <Calculator className="w-4 h-4" />
                            <span>Structured Matrix</span>
                        </button>
                        <button onClick={() => setInputMode('nlp')} className={`kpi-toggle-btn ${inputMode === 'nlp' ? 'active' : ''}`}>
                            <MessageSquareCode className="w-4 h-4" />
                            <span>Natural Language</span>
                        </button>
                    </div>

                    {/* Result Display */}
                    <div className="mb-14 text-center">
                        {/* Read-only badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 mb-4">
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }}></span>
                            <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">Calculated Result</span>
                        </div>
                        <div className="text-gray-400 font-mono text-xs tracking-widest mb-3 h-5 opacity-60 flex justify-center items-center">
                            {liveEquationTrace}
                        </div>
                        <div className="relative inline-flex items-center justify-center">
                            <div className="lunar-massive-text">
                                <AnimatedNumber value={calculatedValue} formatFn={formatter} />
                            </div>
                            <div className="lunar-caret" />
                        </div>
                        <div className="text-red-500 font-medium tracking-widest uppercase text-xs mt-6 flex justify-center items-center space-x-2">
                            <Sparkles className="w-3 h-3" />
                            <span>Target Logic: {targetField?.label}</span>
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-6 max-w-2xl mx-auto">

                        {/* Instruction hint */}
                        <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-blue-50 border border-blue-100">
                            <span className="text-blue-500 text-sm">👇</span>
                            <span className="text-xs font-semibold text-blue-600 tracking-wide">Select what to solve for, then enter your known values in the fields below</span>
                        </div>

                        {/* Target Variable Pills */}
                        <div className="kpi-pills-container">
                            {allVariables.map(field => {
                                const isActive = targetVariable === field.name;
                                return (
                                    <button
                                        key={`sel-${field.name}`}
                                        onClick={() => {
                                            setTargetVariable(field.name);
                                            const newInputs = { ...inputs };
                                            delete newInputs[field.name];
                                            setInputs(newInputs);
                                        }}
                                        className={`kpi-logic-pill ${isActive ? 'active' : ''}`}
                                    >
                                        {isActive && <CheckCircle2 className="w-4 h-4 text-white/90" />}
                                        <span>Solve: {field.label}</span>
                                    </button>
                                );
                            })}
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
                                            {field.type === 'currency' && <span className="text-gray-400 mr-1 font-medium text-lg">{formatCurrencySymbol()}</span>}
                                            <input
                                                type="number"
                                                className="w-full bg-transparent border-none text-xl md:text-2xl font-bold text-gray-900 placeholder-gray-400 outline-none p-0 focus:ring-0"
                                                placeholder="0"
                                                value={inputs[field.name] || ''}
                                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                onFocus={(e) => { setActiveInput(field.name); e.target.select(); }}
                                                onBlur={() => setActiveInput(null)}
                                            />
                                            {field.type === 'percentage' && <span className="text-gray-400 ml-1 font-medium text-lg">%</span>}
                                        </div>
                                    </div>
                                ))}

                                <div className="col-span-2 md:col-span-3 flex justify-end mt-2">
                                    <button onClick={() => setInputs({})} className="kpi-clear-btn">
                                        <RotateCcw className="w-3 h-3" />
                                        <span>AC (Clear All)</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="lunar-textarea p-6">
                                <textarea
                                    className="w-full bg-transparent text-gray-900 font-medium text-lg lg:text-xl md:leading-relaxed resize-none outline-none placeholder-gray-400 min-h-[120px]"
                                    placeholder="e.g., 'We spent $5,000 on ads and generated 1,000,000 impressions...'"
                                    value={nlpString}
                                    onChange={(e) => setNlpString(e.target.value)}
                                />
                                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-xs font-semibold">
                                    <span className="text-red-500 flex items-center"><Sparkles className="w-3 h-3 mr-1" /> Auto-mapping active</span>
                                    <span className="text-gray-500">Variables detected: {Object.values(inputs).filter(v => v !== '').length}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Magic Bar */}
                    <div className="mt-14 pt-6 text-center">
                        <div className="px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200 inline-block text-sm text-gray-600 font-medium shadow-sm max-w-full">
                            <span className="flex items-center justify-center break-words whitespace-normal leading-relaxed text-center px-2">
                                <Sparkles className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                                <span>{magicSentence}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Solve for a specific input variable given that we know the result.
 * resultVal = formula(targetInput, otherKnowns)
 * => find targetInput
 */
function solveForInput(
    formula: string,
    targetVar: string,
    knownInputs: Record<string, number>,  // excludes targetVar AND the result var
    resultVal: number
): number | null {
    // f(x) = evalWithVars(formula, {...knownInputs, targetVar: x}) - resultVal = 0
    const obj = (x: number): number => {
        const vars = { ...knownInputs, [targetVar]: x };
        const fResult = evalWithVars(formula, vars);
        if (fResult === null) return NaN;
        return fResult - resultVal;
    };

    // Try bisection over multiple ranges
    const ranges: [number, number][] = [
        [1e-10, 1e12],
        [1e-6, 1e9],
        [0.0001, 999999],
        [1, 1000000000],
        [0.01, 100],       // for percentages / ratios
        [0.00001, 100000],
    ];

    for (const [lo, hi] of ranges) {
        const fLo = obj(lo);
        const fHi = obj(hi);
        if (isNaN(fLo) || isNaN(fHi)) continue;
        if (Math.sign(fLo) === Math.sign(fHi)) continue;

        let a = lo, b = hi;
        for (let i = 0; i < 100; i++) {
            const mid = (a + b) / 2;
            const fMid = obj(mid);
            if (isNaN(fMid)) break;
            if (Math.abs(fMid) < 1e-8 || (b - a) < 1e-10) return mid;
            if (Math.sign(fMid) === Math.sign(obj(a))) a = mid;
            else b = mid;
        }
        return (a + b) / 2;
    }

    // Fallback: try algebraic direct solve for simple linear formulas
    // e.g., "spend / clicks" → clicks = spend / result
    return algebraicSolve(formula, targetVar, knownInputs, resultVal);
}

/**
 * Algebraic direct solver for simple formulas.
 * Handles patterns like: a / b → for b: b = a / result; for a: a = result * b
 * a * b → for b: b = result / a; for a: a = result / b
 * (a / b) * 1000 → for a: a = result * b / 1000; for b: b = a * 1000 / result
 */
function algebraicSolve(
    formula: string,
    targetVar: string,
    knownInputs: Record<string, number>,
    resultVal: number
): number | null {
    try {
        // Substitute all known variables leaving targetVar as T
        const sortedKeys = Object.keys(knownInputs).sort((a, b) => b.length - a.length);
        let expr = formula;
        for (const key of sortedKeys) {
            expr = expr.replace(new RegExp(`\\b${key}\\b`, 'g'), `(${knownInputs[key]})`);
        }

        // Now expr contains only targetVar and numbers
        // Replace targetVar with a unique placeholder
        const ph = '__T__';
        expr = expr.replace(new RegExp(`\\b${targetVar}\\b`, 'g'), ph);

        // Try values to find where expr = resultVal
        // For linear: if expr is something like (1000) * __T__ / (2) we can solve directly
        // Let's try: if it's linear in T, f(1) and f(2) give us the slope
        const f1 = evalPlaceholder(expr, ph, 1);
        const f2 = evalPlaceholder(expr, ph, 2);
        if (f1 === null || f2 === null) return null;

        // Assume linear: (f2 - f1) is the slope
        // f(T) = f1 + (f2 - f1) * (T - 1) = resultVal
        // T = 1 + (resultVal - f1) / (f2 - f1)
        const slope = f2 - f1;
        if (Math.abs(slope) < 1e-15) return null;
        const T = 1 + (resultVal - f1) / slope;

        // Verify
        const verify = evalPlaceholder(expr, ph, T);
        if (verify !== null && Math.abs(verify - resultVal) < 0.01) return T;

        // Not linear - try for T^2 pattern (quadratic)
        const f4 = evalPlaceholder(expr, ph, 4);
        if (f4 === null) return null;

        // If quadratic: f(T) = a*T^2 + b*T + c = resultVal
        // f(1) = a + b + c, f(2) = 4a + 2b + c, f(4) = 16a + 4b + c
        // Solve the 3x3 system vs resultVal
        const c_val = f1 - 2 * (f2 - f1) + (f4 - 2 * f2 + f1) / 2;
        const b_val = (f2 - f1) - 3 * (f4 - 2 * f2 + f1) / 6;
        const a_val = (f4 - 2 * f2 + f1) / 6;

        // Quadratic formula: a*T^2 + b*T + (c - resultVal) = 0
        const A = a_val, B = b_val, C = c_val - resultVal;
        const disc = B * B - 4 * A * C;
        if (disc < 0 || Math.abs(A) < 1e-15) return null;

        const root1 = (-B + Math.sqrt(disc)) / (2 * A);
        const root2 = (-B - Math.sqrt(disc)) / (2 * A);

        // Return the positive root
        const validRoot = [root1, root2].find(r => r > 0 && isFinite(r));
        return validRoot ?? null;

    } catch {
        return null;
    }
}

function evalPlaceholder(expr: string, placeholder: string, val: number): number | null {
    try {
        const substituted = expr.replace(new RegExp(placeholder.replace('__', '\\__'), 'g'), `(${val})`);
        // eslint-disable-next-line no-eval
        const result = eval(substituted);
        if (typeof result !== 'number' || !isFinite(result) || isNaN(result)) return null;
        return result;
    } catch {
        return null;
    }
}
