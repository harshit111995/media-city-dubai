'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
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

function evalWithVars(expr: string, vars: Record<string, number>): number | null {
    try {
        const sortedKeys = Object.keys(vars).sort((a, b) => b.length - a.length);
        let substituted = expr;
        for (const key of sortedKeys) {
            const val = vars[key];
            substituted = substituted.replace(
                new RegExp(`\\b${key}\\b`, 'g'),
                `(${val})`
            );
        }
        const result = eval(substituted);
        if (typeof result !== 'number' || !isFinite(result) || isNaN(result)) return null;
        return result;
    } catch {
        return null;
    }
}

export default function KpiCalculatorClient({ title, formula, fields }: KpiCalculatorClientProps) {
    const resultVarName = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const isLikelyPercentage = title.toLowerCase().includes('rate') || title.toLowerCase().includes('margin') || title.toLowerCase().includes('roi') || title.toLowerCase().includes('%') || formula.includes('* 100') || formula.includes('/ 100');

    const allVariables: KpiField[] = useMemo(() => [
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
    ], [fields, resultVarName, title, isLikelyPercentage]);

    const [inputs, setInputs] = useState<Record<string, string>>({});
    const [inputHistory, setInputHistory] = useState<string[]>([]);
    const [calculatedField, setCalculatedField] = useState<string | null>(null);
    const [currencyCode, setCurrencyCode] = useState('USD');
    const [inputMode, setInputMode] = useState<'standard' | 'nlp'>('standard');
    const [nlpString, setNlpString] = useState('');
    const [activeInput, setActiveInput] = useState<string | null>(null);

    // Solve for a specific input variable
    const solveForVariable = useCallback((targetVarName: string, currentInputs: Record<string, string>): number | null => {
        const otherInputs: Record<string, number> = {};
        allVariables.forEach(v => {
            if (v.name !== targetVarName && currentInputs[v.name] !== undefined && currentInputs[v.name] !== '') {
                let val = parseFloat(currentInputs[v.name]);
                if (v.type === 'percentage' && !formula.includes('* 100') && !formula.includes('*100')) {
                    val = val / 100;
                }
                otherInputs[v.name] = val;
            }
        });

        if (targetVarName === resultVarName) {
            return evalWithVars(formula, otherInputs);
        } else {
            const resultVal = otherInputs[resultVarName];
            if (resultVal === undefined) return null;

            const knownInputs = { ...otherInputs };
            delete knownInputs[resultVarName];

            return solveForInput(formula, targetVarName, knownInputs, resultVal);
        }
    }, [allVariables, formula, resultVarName]);

    const formatSolveValue = useCallback((val: number, targetVar: KpiField): string => {
        if (targetVar.type === 'percentage' && !formula.includes('* 100') && !formula.includes('*100')) {
            val = val * 100;
        }
        if (Number.isInteger(val)) {
            return val.toString();
        }
        return parseFloat(val.toFixed(4)).toString();
    }, [formula]);

    // Handle user parameter entry
    const handleValChange = useCallback((varName: string, valStr: string) => {
        const nextInputs = { ...inputs };
        
        if (valStr === '') {
            delete nextInputs[varName];
            const nextHistory = inputHistory.filter(h => h !== varName);
            setInputHistory(nextHistory);
            
            if (calculatedField) {
                delete nextInputs[calculatedField];
                setCalculatedField(null);
            }
            setInputs(nextInputs);
            return;
        }

        nextInputs[varName] = valStr;
        const nextHistory = inputHistory.filter(h => h !== varName);
        nextHistory.unshift(varName);

        const filledVars = allVariables.filter(v => nextInputs[v.name] !== undefined && nextInputs[v.name] !== '');
        const N = allVariables.length;

        if (filledVars.length < N - 1) {
            setInputs(nextInputs);
            setInputHistory(nextHistory);
            setCalculatedField(null);
            return;
        }

        if (filledVars.length === N - 1) {
            const targetVar = allVariables.find(v => nextInputs[v.name] === undefined || nextInputs[v.name] === '')!;
            const solvedVal = solveForVariable(targetVar.name, nextInputs);
            if (solvedVal !== null) {
                nextInputs[targetVar.name] = formatSolveValue(solvedVal, targetVar);
                setCalculatedField(targetVar.name);
            } else {
                setCalculatedField(null);
            }
            setInputs(nextInputs);
            setInputHistory(nextHistory);
            return;
        }

        if (filledVars.length === N) {
            const targetVarName = nextHistory[nextHistory.length - 1];
            const targetVar = allVariables.find(v => v.name === targetVarName)!;
            const solvedVal = solveForVariable(targetVarName, nextInputs);
            if (solvedVal !== null) {
                nextInputs[targetVarName] = formatSolveValue(solvedVal, targetVar);
                setCalculatedField(targetVarName);
            } else {
                setCalculatedField(null);
            }
            setInputs(nextInputs);
            setInputHistory(nextHistory);
            return;
        }
    }, [inputs, inputHistory, calculatedField, allVariables, solveForVariable, formatSolveValue]);

    // Natural Language Parser
    useEffect(() => {
        if (inputMode === 'nlp' && nlpString.trim() !== '') {
            const nextInputs = { ...inputs };
            let nextHistory = [...inputHistory];
            let hasChanged = false;
            const text = nlpString.toLowerCase();

            allVariables.forEach(v => {
                const regex1 = new RegExp(`${v.name.replace('_', ' ')}\\s*(?:is|was|=|:)?\\s*\\$?\\s*([\\d,.]+)`, 'i');
                const regex2 = new RegExp(`\\$?\\s*([\\d,.]+)\\s*(?:for|in)?\\s*${v.name.replace('_', ' ')}`, 'i');
                const match = text.match(regex1) || text.match(regex2);
                if (match && match[1]) {
                    const parsedVal = match[1].replace(/,/g, '');
                    if (!isNaN(parseFloat(parsedVal)) && nextInputs[v.name] !== parsedVal) {
                        nextInputs[v.name] = parsedVal;
                        nextHistory = nextHistory.filter(h => h !== v.name);
                        nextHistory.unshift(v.name);
                        hasChanged = true;
                    }
                }
            });

            if (hasChanged) {
                const filledVars = allVariables.filter(v => nextInputs[v.name] !== undefined && nextInputs[v.name] !== '');
                const N = allVariables.length;
                if (filledVars.length === N - 1) {
                    const targetVar = allVariables.find(v => nextInputs[v.name] === undefined || nextInputs[v.name] === '')!;
                    const solvedVal = solveForVariable(targetVar.name, nextInputs);
                    if (solvedVal !== null) {
                        nextInputs[targetVar.name] = formatSolveValue(solvedVal, targetVar);
                        setCalculatedField(targetVar.name);
                    }
                }
                setInputs(nextInputs);
                setInputHistory(nextHistory);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nlpString, inputMode]);

    const targetField = allVariables.find(v => v.name === calculatedField);

    const calculatedValue = useMemo(() => {
        if (!calculatedField || !inputs[calculatedField]) return null;
        return parseFloat(inputs[calculatedField]);
    }, [inputs, calculatedField]);

    const liveEquationTrace = useMemo(() => {
        if (!calculatedField) return formula;
        try {
            const targetLabel = targetField?.label || calculatedField;
            const inputFields = allVariables.filter(v => v.name !== calculatedField);
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
    }, [inputs, calculatedField, formula, allVariables, targetField]);

    const formatCurrencySymbol = useCallback(() => {
        switch (currencyCode) {
            case 'USD': return '$';
            case 'EUR': return '€';
            case 'GBP': return '£';
            case 'INR': return '₹';
            case 'AED': return 'د.إ';
            default: return '$';
        }
    }, [currencyCode]);

    const formatter = useCallback((val: number | null) => {
        if (val === null) return '--';
        if (targetField?.type === 'currency') {
            return `${formatCurrencySymbol()}${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
        if (targetField?.type === 'percentage') {
            return `${val.toFixed(2)}%`;
        }
        return val.toLocaleString('en-US', { maximumFractionDigits: 4 });
    }, [targetField, formatCurrencySymbol]);

    const magicSentence = useMemo(() => {
        if (calculatedValue === null || !targetField) return 'Awaiting sufficient data parameters to solve...';
        const fmtd = formatter(calculatedValue);
        const tvLabel = targetField?.label || 'Value';
        if (tvLabel.toLowerCase().includes('spend') || tvLabel.toLowerCase().includes('cost')) return `You need to allocate ${fmtd} to achieve this target.`;
        if (tvLabel.toLowerCase().includes('revenue') || tvLabel.toLowerCase().includes('value') || tvLabel.toLowerCase().includes('ltv') || tvLabel.toLowerCase().includes('aov')) return `This model projects a return or value of ${fmtd}.`;
        if (tvLabel.toLowerCase().includes('rate') || tvLabel.toLowerCase().includes('%') || tvLabel.toLowerCase().includes('margin')) return `The resulting efficiency or conversion rate is ${fmtd}.`;
        if (tvLabel.toLowerCase().includes('impression') || tvLabel.toLowerCase().includes('click') || tvLabel.toLowerCase().includes('action') || tvLabel.toLowerCase().includes('user')) return `You must generate ${fmtd} volume to hit these metrics.`;
        return `The isolated target variable resolved to ${fmtd}.`;
    }, [calculatedValue, targetField, formatter]);

    return (
        <div className="lunar-bg font-sans pt-4 pb-12 text-slate-800">
            <div className="max-w-3xl mx-auto w-full px-4">
                <div className="lunar-shell p-6 md:p-8 relative overflow-hidden border border-slate-100 rounded-2xl bg-white shadow-sm">

                    {/* Title Header */}
                    <div className="mb-6 pb-4 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">{title}</h1>
                            <p className="text-xs text-slate-400 font-mono">Omni-directional dynamic math engine</p>
                        </div>
                        <button onClick={() => { setInputs({}); setInputHistory([]); setCalculatedField(null); }} className="kpi-clear-btn">
                            <span>Reset</span>
                        </button>
                    </div>

                    {/* Mode Toggles */}
                    <div className="kpi-toggle-container mb-6">
                        <button onClick={() => setInputMode('standard')} className={`kpi-toggle-btn ${inputMode === 'standard' ? 'active' : ''}`}>
                            Interactive Fields
                        </button>
                        <button onClick={() => setInputMode('nlp')} className={`kpi-toggle-btn ${inputMode === 'nlp' ? 'active' : ''}`}>
                            Natural Language AI
                        </button>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-6">

                        {inputMode === 'standard' ? (
                            <div className="space-y-4">
                                {allVariables.map((field) => {
                                    const isCalc = calculatedField === field.name;
                                    const isFocused = activeInput === field.name;
                                    return (
                                        <div 
                                            key={`field-${field.name}`}
                                            className={`flex items-center justify-between border rounded-xl px-4 py-3.5 transition-all bg-white relative ${
                                                isCalc 
                                                    ? 'border-emerald-200 bg-emerald-50/10' 
                                                    : isFocused 
                                                        ? 'border-red-500 ring-4 ring-red-50' 
                                                        : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            {/* Label Area */}
                                            <div className="flex flex-col">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isCalc ? 'text-emerald-700' : 'text-slate-400'}`}>
                                                    {field.label}
                                                </span>
                                                {isCalc && (
                                                    <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md mt-0.5 w-fit uppercase">
                                                        Calculated
                                                    </span>
                                                )}
                                            </div>

                                            {/* Input Value & Unit Selector */}
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    className={`bg-transparent border-none text-right text-lg font-bold outline-none p-0 focus:ring-0 w-[140px] ${
                                                        isCalc ? 'text-emerald-700 font-extrabold' : 'text-slate-800'
                                                    }`}
                                                    placeholder="0"
                                                    value={inputs[field.name] || ''}
                                                    onChange={(e) => handleValChange(field.name, e.target.value)}
                                                    onFocus={(e) => { setActiveInput(field.name); e.target.select(); }}
                                                    onBlur={() => setActiveInput(null)}
                                                />
                                                {field.type === 'currency' && (
                                                    <div className="relative flex items-center text-xs text-slate-500 font-bold border-l pl-2.5 ml-1.5 border-slate-200">
                                                        <select
                                                            value={currencyCode}
                                                            onChange={(e) => setCurrencyCode(e.target.value)}
                                                            className="bg-transparent border-none outline-none appearance-none cursor-pointer pr-3.5 text-slate-600 font-bold"
                                                        >
                                                            <option value="AED">AED</option>
                                                            <option value="USD">USD</option>
                                                            <option value="EUR">EUR</option>
                                                            <option value="GBP">GBP</option>
                                                            <option value="INR">INR</option>
                                                        </select>
                                                        <span className="text-[7px] text-slate-400 pointer-events-none absolute right-0">▼</span>
                                                    </div>
                                                )}
                                                {field.type === 'percentage' && (
                                                    <span className="text-slate-400 font-bold text-sm ml-1.5">%</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="lunar-textarea p-4 border border-slate-200 bg-slate-50/50">
                                <textarea
                                    className="w-full bg-transparent text-slate-900 font-normal text-sm md:leading-relaxed resize-none outline-none placeholder-slate-400 min-h-[100px]"
                                    placeholder="Enter campaign logs, e.g. 'We spent $5,000 and got 100,000 impressions...'"
                                    value={nlpString}
                                    onChange={(e) => setNlpString(e.target.value)}
                                />
                                <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] font-medium text-slate-400">
                                    <span>AI Mapping Active</span>
                                    <span>Detected: {Object.values(inputs).filter(v => v !== '').length} / {allVariables.length}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Context Explanation Card */}
                    <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-2xl mt-8 text-xs text-slate-600 leading-relaxed shadow-sm">
                        <div className="flex gap-3 items-start">
                            <span className="text-red-600 text-sm font-bold mt-0.5">ℹ</span>
                            <div>
                                <p className="font-bold text-slate-800 text-sm mb-1">
                                    Equation System Matrix
                                </p>
                                <p className="font-mono text-[9px] text-slate-400 mb-2">
                                    Formula: {resultVarName} = {formula}
                                    {calculatedField && (
                                        <span className="block mt-1.5 text-slate-500 font-semibold bg-white border border-slate-100 rounded px-1.5 py-0.5 w-fit">
                                            Active Trace: {liveEquationTrace}
                                        </span>
                                    )}
                                </p>
                                <p className="font-medium text-slate-600">
                                    {calculatedField && calculatedValue !== null ? magicSentence : 'Fill in any parameters above to solve the equation matrix automatically in real-time.'}
                                </p>
                            </div>
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
    const obj = (x: number): number => {
        const vars = { ...knownInputs, [targetVar]: x };
        const fResult = evalWithVars(formula, vars);
        if (fResult === null) return NaN;
        return fResult - resultVal;
    };

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

    return algebraicSolve(formula, targetVar, knownInputs, resultVal);
}

function algebraicSolve(
    formula: string,
    targetVar: string,
    knownInputs: Record<string, number>,
    resultVal: number
): number | null {
    try {
        const sortedKeys = Object.keys(knownInputs).sort((a, b) => b.length - a.length);
        let expr = formula;
        for (const key of sortedKeys) {
            expr = expr.replace(new RegExp(`\\b${key}\\b`, 'g'), `(${knownInputs[key]})`);
        }

        const ph = '__T__';
        expr = expr.replace(new RegExp(`\\b${targetVar}\\b`, 'g'), ph);

        const f1 = evalPlaceholder(expr, ph, 1);
        const f2 = evalPlaceholder(expr, ph, 2);
        if (f1 === null || f2 === null) return null;

        const slope = f2 - f1;
        if (Math.abs(slope) < 1e-15) return null;
        const T = 1 + (resultVal - f1) / slope;

        const verify = evalPlaceholder(expr, ph, T);
        if (verify !== null && Math.abs(verify - resultVal) < 0.01) return T;

        const f4 = evalPlaceholder(expr, ph, 4);
        if (f4 === null) return null;

        const c_val = f1 - 2 * (f2 - f1) + (f4 - 2 * f2 + f1) / 2;
        const b_val = (f2 - f1) - 3 * (f4 - 2 * f2 + f1) / 6;
        const a_val = (f4 - 2 * f2 + f1) / 6;

        const A = a_val, B = b_val, C = c_val - resultVal;
        const disc = B * B - 4 * A * C;
        if (disc < 0 || Math.abs(A) < 1e-15) return null;

        const root1 = (-B + Math.sqrt(disc)) / (2 * A);
        const root2 = (-B - Math.sqrt(disc)) / (2 * A);

        const validRoot = [root1, root2].find(r => r > 0 && isFinite(r));
        return validRoot ?? null;

    } catch {
        return null;
    }
}

function evalPlaceholder(expr: string, placeholder: string, val: number): number | null {
    try {
        const substituted = expr.replace(new RegExp(placeholder.replace('__', '\\__'), 'g'), `(${val})`);
        const result = eval(substituted);
        if (typeof result !== 'number' || !isFinite(result) || isNaN(result)) return null;
        return result;
    } catch {
        return null;
    }
}
