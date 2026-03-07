'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, Lock, Unlock, RefreshCw, BarChart } from 'lucide-react';

interface ChannelRow {
    id: string;
    name: string;
    allocation: number; // percentage
    budget: number; // dollar
    cpm: number;
    impressions: number;
    ctr: number; // percentage
    clicks: number;
    cpa: number;
    conversions: number;
    isLocked: boolean;
}

const DEFAULT_CHANNELS = [
    { id: '1', name: 'DOOH', cpm: 15.00, ctr: 0.10, cpa: 150.00 },
    { id: '2', name: 'CTV', cpm: 25.00, ctr: 0.20, cpa: 120.00 },
    { id: '3', name: 'Audio', cpm: 12.00, ctr: 0.15, cpa: 80.00 },
    { id: '4', name: 'Display', cpm: 3.50, ctr: 0.08, cpa: 50.00 },
    { id: '5', name: 'Video', cpm: 18.00, ctr: 0.40, cpa: 90.00 },
    { id: '6', name: 'YouTube', cpm: 14.00, ctr: 0.50, cpa: 85.00 },
    { id: '7', name: 'Native', cpm: 6.00, ctr: 0.25, cpa: 60.00 },
    { id: '8', name: 'In-game', cpm: 8.00, ctr: 0.30, cpa: 70.00 },
    { id: '9', name: 'Social', cpm: 9.00, ctr: 1.20, cpa: 45.00 },
];

export default function MediaPlannerClient() {
    const [totalBudget, setTotalBudget] = useState<number>(100000);
    const [channels, setChannels] = useState<ChannelRow[]>([]);

    // Initialize channels
    useEffect(() => {
        const initialCount = DEFAULT_CHANNELS.length;
        const baseAlloc = 100 / initialCount;

        const initialRows = DEFAULT_CHANNELS.map(ch => {
            const budget = 100000 * (baseAlloc / 100);
            const impressions = (budget / ch.cpm) * 1000;
            const clicks = impressions * (ch.ctr / 100);
            const conversions = budget / ch.cpa;

            return {
                ...ch,
                allocation: baseAlloc,
                budget,
                impressions,
                clicks,
                conversions,
                isLocked: false
            };
        });
        setChannels(initialRows);
    }, []);

    // Recalculate metrics for a row based on budget and rates
    const calculateRowMetrics = (row: ChannelRow, newBudget: number) => {
        const impressions = newBudget > 0 && row.cpm > 0 ? (newBudget / row.cpm) * 1000 : 0;
        const clicks = impressions * (row.ctr / 100);
        const conversions = newBudget > 0 && row.cpa > 0 ? newBudget / row.cpa : 0;

        return {
            ...row,
            budget: newBudget,
            impressions,
            clicks,
            conversions
        };
    };

    // Handle Total Budget Change
    const handleTotalBudgetChange = (newTotal: number) => {
        setTotalBudget(newTotal);

        const lockedCols = channels.filter(c => c.isLocked);
        const unlockedCols = channels.filter(c => !c.isLocked);

        const lockedBudget = lockedCols.reduce((sum, c) => sum + c.budget, 0);
        const remainingBudget = Math.max(0, newTotal - lockedBudget);

        let newChannels = channels.map(ch => {
            if (ch.isLocked) {
                // Keep budget same, update allocation % based on new total
                return { ...ch, allocation: newTotal > 0 ? (ch.budget / newTotal) * 100 : 0 };
            } else {
                // Distribute remaining budget proportionally to active unlocked columns
                const originalUnlockedSum = unlockedCols.reduce((sum, c) => sum + c.allocation, 0) || 1; // avoid / 0
                const relativeWeight = ch.allocation / originalUnlockedSum;
                const newBudget = remainingBudget * relativeWeight;
                const newAlloc = newTotal > 0 ? (newBudget / newTotal) * 100 : 0;

                return calculateRowMetrics({ ...ch, allocation: newAlloc }, newBudget);
            }
        });

        setChannels(newChannels);
    };

    // Handle individual cell changes
    const handleCellChange = (id: string, field: keyof ChannelRow, value: number) => {
        setChannels(prev => {
            return prev.map(ch => {
                if (ch.id !== id) return ch;

                let newRow = { ...ch, [field]: value };

                if (field === 'allocation') {
                    // Update budget based on new allocation %
                    const newBudget = totalBudget * (value / 100);
                    newRow = calculateRowMetrics(newRow, newBudget);
                }
                else if (field === 'budget') {
                    // Update allocation based on new budget
                    newRow.allocation = totalBudget > 0 ? (value / totalBudget) * 100 : 0;
                    newRow = calculateRowMetrics(newRow, value);
                }
                else if (field === 'cpm' || field === 'ctr' || field === 'cpa') {
                    // Recalculate output metrics
                    newRow = calculateRowMetrics(newRow, newRow.budget);
                }

                return newRow;
            });
        });
    };

    const toggleLock = (id: string) => {
        setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, isLocked: !ch.isLocked } : ch));
    };

    // formatting helpers
    const fCurrency = (num: number) => '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const fInt = (num: number) => Math.round(num).toLocaleString('en-US');
    const fPercent = (num: number) => num.toFixed(2) + '%';

    // Totals
    const totals = useMemo(() => {
        const tAlloc = channels.reduce((s, c) => s + c.allocation, 0);
        const tBudget = channels.reduce((s, c) => s + c.budget, 0);
        const tImps = channels.reduce((s, c) => s + c.impressions, 0);
        const tClicks = channels.reduce((s, c) => s + c.clicks, 0);
        const tConvs = channels.reduce((s, c) => s + c.conversions, 0);

        const bCpm = tImps > 0 ? (tBudget / tImps) * 1000 : 0;
        const bCtr = tImps > 0 ? (tClicks / tImps) * 100 : 0;
        const bCpa = tConvs > 0 ? (tBudget / tConvs) : 0;

        return { tAlloc, tBudget, tImps, tClicks, tConvs, bCpm, bCtr, bCpa };
    }, [channels]);

    return (
        <div className="space-y-8 pb-20">
            {/* Top Control Bar */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                        <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Total Campaign Budget</h2>
                        <p className="text-xs text-gray-500">Edit this to instantly re-allocate across channels</p>
                    </div>
                </div>

                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                    <input
                        type="number"
                        className="pl-8 pr-4 py-3 text-2xl font-bold text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-red-500 focus:bg-white transition-all w-[250px]"
                        value={totalBudget}
                        onChange={(e) => handleTotalBudgetChange(Number(e.target.value))}
                    />
                </div>
            </div>

            {/* Main Table */}
            <div className="planner-container">
                <table className="planner-table">
                    <thead>
                        <tr>
                            <th className="w-[10px]"></th>
                            <th>Channel</th>
                            <th>Allocation %</th>
                            <th>Budget ($)</th>
                            <th>CPM ($)</th>
                            <th>Est. Impressions</th>
                            <th>Est. CTR (%)</th>
                            <th>Est. Clicks</th>
                            <th>Target CPA ($)</th>
                            <th>Est. Conversions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {channels.map(row => (
                            <tr key={row.id}>
                                <td>
                                    <button
                                        onClick={() => toggleLock(row.id)}
                                        className={`p-1.5 rounded-md transition-colors ${row.isLocked ? 'bg-red-50 text-red-600' : 'text-gray-400 hover:bg-gray-100'}`}
                                        title={row.isLocked ? "Unlock row" : "Lock row to prevent budget redistribution"}
                                    >
                                        {row.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                                    </button>
                                </td>
                                <td className="font-semibold">{row.name}</td>
                                <td>
                                    <div className="planner-input-percentage">
                                        <input
                                            type="number"
                                            className={`planner-input ${row.isLocked ? 'locked' : ''}`}
                                            value={Number(row.allocation).toFixed(2)}
                                            onChange={(e) => handleCellChange(row.id, 'allocation', Number(e.target.value))}
                                            disabled={row.isLocked}
                                            step="0.1"
                                        />
                                        <span>%</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="planner-input-currency">
                                        <span>$</span>
                                        <input
                                            type="number"
                                            className={`planner-input ${row.isLocked ? 'locked' : ''}`}
                                            value={Math.round(row.budget)}
                                            onChange={(e) => handleCellChange(row.id, 'budget', Number(e.target.value))}
                                            disabled={row.isLocked}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className="planner-input-currency">
                                        <span>$</span>
                                        <input
                                            type="number"
                                            className="planner-input"
                                            value={row.cpm}
                                            step="0.5"
                                            onChange={(e) => handleCellChange(row.id, 'cpm', Number(e.target.value))}
                                        />
                                    </div>
                                </td>
                                <td className="text-right font-mono text-gray-600 bg-gray-50/50">
                                    {fInt(row.impressions)}
                                </td>
                                <td>
                                    <div className="planner-input-percentage">
                                        <input
                                            type="number"
                                            className="planner-input"
                                            value={row.ctr}
                                            step="0.05"
                                            onChange={(e) => handleCellChange(row.id, 'ctr', Number(e.target.value))}
                                        />
                                        <span>%</span>
                                    </div>
                                </td>
                                <td className="text-right font-mono text-gray-600 bg-gray-50/50">
                                    {fInt(row.clicks)}
                                </td>
                                <td>
                                    <div className="planner-input-currency">
                                        <span>$</span>
                                        <input
                                            type="number"
                                            className="planner-input"
                                            value={row.cpa}
                                            step="5"
                                            onChange={(e) => handleCellChange(row.id, 'cpa', Number(e.target.value))}
                                        />
                                    </div>
                                </td>
                                <td className="text-right font-mono text-gray-900 font-bold bg-green-50/30">
                                    {fInt(row.conversions)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="planner-summary-row">
                            <td colSpan={2} className="text-right uppercase tracking-widest text-xs text-gray-500">Totals & Blended Averages</td>
                            <td className={`text-right ${Math.round(totals.tAlloc) !== 100 ? 'text-red-500' : 'text-green-600'}`}>
                                {totals.tAlloc.toFixed(1)}%
                            </td>
                            <td className="text-right text-gray-900">{fCurrency(totals.tBudget)}</td>
                            <td className="text-right text-gray-500">{fCurrency(totals.bCpm)}</td>
                            <td className="text-right text-blue-600">{fInt(totals.tImps)}</td>
                            <td className="text-right text-gray-500">{fPercent(totals.bCtr)}</td>
                            <td className="text-right text-purple-600">{fInt(totals.tClicks)}</td>
                            <td className="text-right text-gray-500">{fCurrency(totals.bCpa)}</td>
                            <td className="text-right text-green-600 text-lg">{fInt(totals.tConvs)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="metric-card">
                    <span className="metric-card-title">Blended CPM</span>
                    <span className="metric-card-value text-gray-700">{fCurrency(totals.bCpm)}</span>
                </div>
                <div className="metric-card">
                    <span className="metric-card-title">Total Impressions</span>
                    <span className="metric-card-value text-blue-600">{fInt(totals.tImps)}</span>
                </div>
                <div className="metric-card">
                    <span className="metric-card-title">Blended CPA</span>
                    <span className="metric-card-value text-gray-700">{fCurrency(totals.bCpa)}</span>
                </div>
                <div className="metric-card">
                    <span className="metric-card-title">Net Conversions</span>
                    <span className="metric-card-value text-green-600">{fInt(totals.tConvs)}</span>
                </div>
            </div>
        </div>
    );
}
