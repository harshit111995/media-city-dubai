'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, Lock, Unlock, Plus, MapPin, Trash2 } from 'lucide-react';

type ChannelType = 'DOOH' | 'CTV' | 'Audio' | 'Display' | 'Video' | 'YouTube' | 'Native' | 'In-game' | 'Social' | 'Search';

interface ChannelRow {
    id: string;
    type: ChannelType;
    allocation: number; // percentage
    budget: number; // dollar
    cpm: number;
    impressions: number;
    // Performance Metrics (Optional based on type)
    ctr: number | null; // percentage
    clicks: number | null;
    cpa: number | null;
    conversions: number | null;
    // Brand Metrics (Optional based on type)
    cpv: number | null; // cost per view/listen
    views: number | null; // views/listens
    isLocked: boolean;
}

// Master configurations for what metrics a channel supports and default rates
const CHANNEL_CONFIG: Record<ChannelType, { supportsPerformance: boolean, supportsViews: boolean, defaultCpm: number, defaultCtr: number | null, defaultCpa: number | null, defaultCpv: number | null }> = {
    'DOOH': { supportsPerformance: false, supportsViews: false, defaultCpm: 15.00, defaultCtr: null, defaultCpa: null, defaultCpv: null },
    'CTV': { supportsPerformance: false, supportsViews: true, defaultCpm: 35.00, defaultCtr: null, defaultCpa: null, defaultCpv: 0.05 },
    'Audio': { supportsPerformance: false, supportsViews: true, defaultCpm: 12.00, defaultCtr: null, defaultCpa: null, defaultCpv: 0.02 },
    'Display': { supportsPerformance: true, supportsViews: false, defaultCpm: 3.50, defaultCtr: 0.08, defaultCpa: 50.00, defaultCpv: null },
    'In-game': { supportsPerformance: true, supportsViews: false, defaultCpm: 8.00, defaultCtr: 0.30, defaultCpa: 70.00, defaultCpv: null },
    'Video': { supportsPerformance: true, supportsViews: true, defaultCpm: 18.00, defaultCtr: 0.40, defaultCpa: 90.00, defaultCpv: 0.03 },
    'YouTube': { supportsPerformance: true, supportsViews: true, defaultCpm: 14.00, defaultCtr: 0.50, defaultCpa: 85.00, defaultCpv: 0.04 },
    'Native': { supportsPerformance: true, supportsViews: false, defaultCpm: 6.00, defaultCtr: 0.25, defaultCpa: 60.00, defaultCpv: null },
    'Social': { supportsPerformance: true, supportsViews: false, defaultCpm: 9.00, defaultCtr: 1.20, defaultCpa: 45.00, defaultCpv: null },
    'Search': { supportsPerformance: true, supportsViews: false, defaultCpm: 25.00, defaultCtr: 3.50, defaultCpa: 30.00, defaultCpv: null },
};

export default function MediaPlannerClient() {
    const [totalBudget, setTotalBudget] = useState<number>(100000);
    const [targetLocation, setTargetLocation] = useState<string>('United Arab Emirates');
    const [channels, setChannels] = useState<ChannelRow[]>([]);
    const [channelToAdd, setChannelToAdd] = useState<ChannelType>('Social');

    // Recalculate metrics for a row based on budget and rates
    const calculateRowMetrics = (row: ChannelRow, newBudget: number) => {
        const config = CHANNEL_CONFIG[row.type];

        const impressions = newBudget > 0 && row.cpm > 0 ? (newBudget / row.cpm) * 1000 : 0;

        let clicks = null;
        let conversions = null;
        if (config.supportsPerformance && row.ctr !== null && row.cpa !== null) {
            clicks = impressions * (row.ctr / 100);
            conversions = newBudget > 0 && row.cpa > 0 ? newBudget / row.cpa : 0;
        }

        let views = null;
        if (config.supportsViews && row.cpv !== null) {
            views = newBudget > 0 && row.cpv > 0 ? newBudget / row.cpv : 0;
        }

        return {
            ...row,
            budget: newBudget,
            impressions,
            clicks,
            conversions,
            views
        };
    };

    // Auto-balance budgets when adding a channel or changing the total
    const balanceBudgets = (currentChannels: ChannelRow[], newTotal: number) => {
        const lockedCols = currentChannels.filter(c => c.isLocked);
        const unlockedCols = currentChannels.filter(c => !c.isLocked);

        const lockedBudget = lockedCols.reduce((sum, c) => sum + c.budget, 0);
        const remainingBudget = Math.max(0, newTotal - lockedBudget);

        // If there are no unlocked columns, we can't distribute. 
        if (unlockedCols.length === 0) return currentChannels;

        // If unlocked columns have 0% allocation (e.g. newly added), distribute evenly among them
        const unlockedSum = unlockedCols.reduce((sum, c) => sum + c.allocation, 0);

        return currentChannels.map(ch => {
            if (ch.isLocked) {
                return { ...ch, allocation: newTotal > 0 ? (ch.budget / newTotal) * 100 : 0 };
            } else {
                let relativeWeight = 0;
                if (unlockedSum === 0) {
                    relativeWeight = 1 / unlockedCols.length; // Even split if all 0
                } else {
                    relativeWeight = ch.allocation / unlockedSum;
                }

                const newBudget = remainingBudget * relativeWeight;
                const newAlloc = newTotal > 0 ? (newBudget / newTotal) * 100 : 0;

                return calculateRowMetrics({ ...ch, allocation: newAlloc }, newBudget);
            }
        });
    };

    const handleTotalBudgetChange = (newTotal: number) => {
        setTotalBudget(newTotal);
        setChannels(prev => balanceBudgets(prev, newTotal));
    };

    const addChannel = () => {
        const config = CHANNEL_CONFIG[channelToAdd];
        const newRow: ChannelRow = {
            id: Math.random().toString(36).substring(7),
            type: channelToAdd,
            allocation: 0,
            budget: 0,
            cpm: config.defaultCpm,
            impressions: 0,
            ctr: config.defaultCtr,
            clicks: 0,
            cpa: config.defaultCpa,
            conversions: 0,
            cpv: config.defaultCpv,
            views: 0,
            isLocked: false
        };

        // Add to array, then force a re-balance of the total budget
        setChannels(prev => {
            const added = [...prev, newRow];
            return balanceBudgets(added, totalBudget);
        });
    };

    const removeChannel = (id: string) => {
        setChannels(prev => {
            const remaining = prev.filter(ch => ch.id !== id);
            return remaining.length > 0 ? balanceBudgets(remaining, totalBudget) : [];
        });
    };

    // Handle individual cell changes
    const handleCellChange = (id: string, field: keyof ChannelRow, value: number) => {
        setChannels(prev => {
            return prev.map(ch => {
                if (ch.id !== id) return ch;

                let newRow = { ...ch, [field]: value };

                if (field === 'allocation') {
                    const newBudget = totalBudget * (value / 100);
                    newRow = calculateRowMetrics(newRow, newBudget);
                }
                else if (field === 'budget') {
                    newRow.allocation = totalBudget > 0 ? (value / totalBudget) * 100 : 0;
                    newRow = calculateRowMetrics(newRow, value);
                }
                else if (field === 'cpm' || field === 'ctr' || field === 'cpa' || field === 'cpv') {
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
        if (channels.length === 0) {
            return { tAlloc: 0, tBudget: 0, tImps: 0, tClicks: 0, tConvs: 0, bCpm: 0, bCtr: 0, bCpa: 0, tViews: 0, bCpv: 0 };
        }

        const tAlloc = channels.reduce((s, c) => s + c.allocation, 0);
        const tBudget = channels.reduce((s, c) => s + c.budget, 0);
        const tImps = channels.reduce((s, c) => s + c.impressions, 0);

        // Sum only for channels that support these metrics
        const performanceChannels = channels.filter(c => CHANNEL_CONFIG[c.type].supportsPerformance);
        const tClicks = performanceChannels.reduce((s, c) => s + (c.clicks || 0), 0);
        const tConvs = performanceChannels.reduce((s, c) => s + (c.conversions || 0), 0);
        const perfBudget = performanceChannels.reduce((s, c) => s + c.budget, 0);

        const viewableChannels = channels.filter(c => CHANNEL_CONFIG[c.type].supportsViews);
        const tViews = viewableChannels.reduce((s, c) => s + (c.views || 0), 0);
        const viewBudget = viewableChannels.reduce((s, c) => s + c.budget, 0);

        const bCpm = tImps > 0 ? (tBudget / tImps) * 1000 : 0;

        // Blended CTR/CPA only uses performance budgets/impressions!
        const perfImps = performanceChannels.reduce((s, c) => s + c.impressions, 0);
        const bCtr = perfImps > 0 ? (tClicks / perfImps) * 100 : 0;
        const bCpa = tConvs > 0 ? (perfBudget / tConvs) : 0;

        // Blended CPV only uses view budgets/views
        const bCpv = tViews > 0 ? (viewBudget / tViews) : 0;

        return { tAlloc, tBudget, tImps, tClicks, tConvs, bCpm, bCtr, bCpa, tViews, bCpv };
    }, [channels]);

    const NA_CELL = <td className="text-center text-gray-400 font-mono text-xs bg-gray-50/20 italic">N/A</td>;

    return (
        <div className="space-y-8 pb-20">
            {/* Top Control Bar */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center space-x-5">
                    <div className="p-4 bg-red-400 text-white rounded-2xl shadow-inner shadow-red-500/50">
                        <Calculator className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Total Media Budget</h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">Distribute across selected channels below.</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-[260px]">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <MapPin className="w-5 h-5" />
                        </span>
                        <input
                            type="text"
                            className="pl-11 pr-4 py-4 w-full text-lg font-bold text-gray-900 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-gray-300 focus:bg-white transition-all placeholder-gray-400"
                            placeholder="Target Location"
                            value={targetLocation}
                            onChange={(e) => setTargetLocation(e.target.value)}
                        />
                    </div>
                    <div className="relative flex-1 md:w-[280px]">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-black text-xl">$</span>
                        <input
                            type="number"
                            className="pl-11 pr-5 py-4 w-full text-3xl font-black text-gray-900 bg-red-50/50 border-2 border-red-100 rounded-2xl outline-none focus:border-red-400 focus:bg-white transition-all shadow-sm"
                            value={totalBudget}
                            onChange={(e) => handleTotalBudgetChange(Number(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="planner-container">
                <div className="overflow-x-auto">
                    <table className="planner-table min-w-[1200px]">
                        <thead>
                            <tr>
                                <th className="w-[40px]"></th>
                                <th>Channel</th>
                                <th>Allocation %</th>
                                <th>Budget ($)</th>
                                <th>CPM ($)</th>
                                <th>Impressions</th>
                                <th className="border-l border-gray-200 bg-blue-50/30">Target CPV ($)</th>
                                <th className="bg-blue-50/30">Total Views</th>
                                <th className="border-l border-gray-200 bg-green-50/30">Est. CTR (%)</th>
                                <th className="bg-green-50/30">Est. Clicks</th>
                                <th className="bg-green-50/30">Target CPA ($)</th>
                                <th className="bg-green-50/30 font-bold">Conversions</th>
                                <th className="w-[40px]"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {channels.length === 0 && (
                                <tr>
                                    <td colSpan={13} className="text-center py-24 text-gray-400 bg-gray-50/30">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-2 shadow-inner border border-gray-200/50">
                                                <Plus className="w-10 h-10 text-gray-400" />
                                            </div>
                                            <p className="font-bold text-xl text-gray-600">Your media plan is empty.</p>
                                            <p className="text-base text-gray-500 max-w-md">Use the dropdown below to add the digital channels you intend to run for the {targetLocation} market.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {channels.map(row => {
                                const config = CHANNEL_CONFIG[row.type];
                                return (
                                    <tr key={row.id}>
                                        <td className="text-center">
                                            <button
                                                onClick={() => toggleLock(row.id)}
                                                className={`p-2 flex items-center justify-center rounded-lg transition-colors border mx-auto ${row.isLocked ? 'bg-red-50 text-red-600 border-red-200 shadow-sm' : 'text-gray-400 border-transparent hover:bg-gray-100'}`}
                                                title={row.isLocked ? "Unlock row" : "Lock row to prevent budget redistribution"}
                                            >
                                                {row.isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                                            </button>
                                        </td>
                                        <td className="font-bold tracking-wide text-gray-800 uppercase text-xs">
                                            {row.type}
                                        </td>
                                        <td>
                                            <div className="planner-input-percentage">
                                                <input
                                                    type="number"
                                                    className={`planner-input !font-bold ${row.isLocked ? 'locked' : ''}`}
                                                    value={Number(row.allocation).toFixed(2)}
                                                    onChange={(e) => handleCellChange(row.id, 'allocation', Number(e.target.value))}
                                                    disabled={row.isLocked}
                                                    step="1"
                                                />
                                                <span className="!font-bold">%</span>
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
                                        <td className="text-right font-mono text-gray-600 bg-gray-50/50 border-r border-gray-100">
                                            {fInt(row.impressions)}
                                        </td>

                                        {/* VIEWS SECTON */}
                                        {config.supportsViews ? (
                                            <>
                                                <td className="border-l border-gray-100 bg-blue-50/10">
                                                    <div className="planner-input-currency">
                                                        <span>$</span>
                                                        <input
                                                            type="number"
                                                            className="planner-input !border-blue-200 focus:!border-blue-500"
                                                            value={row.cpv || 0}
                                                            step="0.01"
                                                            onChange={(e) => handleCellChange(row.id, 'cpv', Number(e.target.value))}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="text-right font-mono text-blue-600 bg-blue-50/10 font-bold border-r border-gray-100">
                                                    {fInt(row.views || 0)}
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                {NA_CELL}
                                                {NA_CELL}
                                            </>
                                        )}

                                        {/* PERFORMANCE SECTION */}
                                        {config.supportsPerformance ? (
                                            <>
                                                <td className="border-l border-gray-100 bg-green-50/10">
                                                    <div className="planner-input-percentage">
                                                        <input
                                                            type="number"
                                                            className="planner-input"
                                                            value={row.ctr || 0}
                                                            step="0.05"
                                                            onChange={(e) => handleCellChange(row.id, 'ctr', Number(e.target.value))}
                                                        />
                                                        <span>%</span>
                                                    </div>
                                                </td>
                                                <td className="text-right font-mono text-gray-600 bg-green-50/10">
                                                    {fInt(row.clicks || 0)}
                                                </td>
                                                <td className="bg-green-50/10 flex items-center h-full">
                                                    <div className="planner-input-currency w-full">
                                                        <span>$</span>
                                                        <input
                                                            type="number"
                                                            className="planner-input !border-green-200 focus:!border-green-500"
                                                            value={row.cpa || 0}
                                                            step="5"
                                                            onChange={(e) => handleCellChange(row.id, 'cpa', Number(e.target.value))}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="text-right font-mono text-green-700 bg-green-50/30 font-bold text-base">
                                                    {fInt(row.conversions || 0)}
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                {NA_CELL}
                                                {NA_CELL}
                                                {NA_CELL}
                                                {NA_CELL}
                                            </>
                                        )}

                                        <td className="text-center">
                                            <button
                                                onClick={() => removeChannel(row.id)}
                                                className="p-2 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors mx-auto"
                                                title="Remove Channel"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        {channels.length > 0 && (
                            <tfoot>
                                <tr className="planner-summary-row">
                                    <td colSpan={2} className="text-right uppercase tracking-widest text-xs text-gray-500">Blended Averages</td>
                                    <td className={`text-right font-black ${Math.round(totals.tAlloc) !== 100 ? 'text-red-500' : 'text-green-600'}`}>
                                        {totals.tAlloc.toFixed(1)}%
                                    </td>
                                    <td className="text-right text-gray-900 font-bold text-base bg-gray-100/50">{fCurrency(totals.tBudget)}</td>
                                    <td className="text-right text-gray-500 font-bold">{fCurrency(totals.bCpm)}</td>
                                    <td className="text-right text-gray-700 font-bold bg-gray-100/50">{fInt(totals.tImps)}</td>

                                    <td className="text-right text-blue-600 font-bold border-l border-gray-200 bg-blue-50/20">{fCurrency(totals.bCpv)}</td>
                                    <td className="text-right text-blue-700 font-bold text-base bg-blue-50/40">{fInt(totals.tViews)}</td>

                                    <td className="text-right text-green-600 font-bold border-l border-gray-200 bg-green-50/20">{fPercent(totals.bCtr)}</td>
                                    <td className="text-right text-green-700 font-bold bg-green-50/40">{fInt(totals.tClicks)}</td>
                                    <td className="text-right text-green-800 font-bold bg-green-100/30">{fCurrency(totals.bCpa)}</td>
                                    <td className="text-right text-green-600 font-black text-xl bg-green-100/60">{fInt(totals.tConvs)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>

                {/* Picklist Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-3 w-full md:w-auto">
                        <select
                            className="bg-white border-2 border-gray-200 text-gray-900 font-semibold px-4 py-3 rounded-xl appearance-none pr-10 focus:outline-none focus:border-red-400 cursor-pointer shadow-sm uppercase tracking-wider text-sm flex-1 md:flex-none"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/200.0/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em' }}
                            value={channelToAdd}
                            onChange={(e) => setChannelToAdd(e.target.value as ChannelType)}
                        >
                            {Object.keys(CHANNEL_CONFIG).map(ch => (
                                <option key={ch} value={ch}>{ch}</option>
                            ))}
                        </select>
                        <button
                            onClick={addChannel}
                            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold tracking-wide transition-all active:scale-95 shadow-md shadow-red-500/20 whitespace-nowrap"
                        >
                            <Plus size={18} />
                            <span>ADD CHANNEL</span>
                        </button>
                    </div>
                    {Math.round(totals.tAlloc) !== 100 && channels.length > 0 && (
                        <span className="text-red-500 font-medium text-sm animate-pulse bg-red-50 px-4 py-2 rounded-lg border border-red-100">
                            ⚠️ Total allocation is {totals.tAlloc.toFixed(1)}%. It must equal 100%. Adjust budget inputs to balance.
                        </span>
                    )}
                </div>
            </div>

            {/* Quick Metrics Cards */}
            {channels.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
                    <div className="metric-card bg-gradient-to-br from-white to-gray-50 border-gray-200/60 shadow-sm border rounded-2xl p-5">
                        <span className="text-xs uppercase tracking-wider font-bold text-gray-500 flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-gray-400"></div> Blended CPM</span>
                        <span className="text-3xl font-black text-gray-800">{fCurrency(totals.bCpm)}</span>
                    </div>
                    <div className="metric-card bg-gradient-to-br from-white to-blue-50/50 border-blue-100 shadow-sm border rounded-2xl p-5">
                        <span className="text-xs uppercase tracking-wider font-bold text-blue-600/70 flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Total Views/Listens</span>
                        <span className="text-3xl font-black text-blue-700">{fInt(totals.tViews)}</span>
                    </div>
                    <div className="metric-card bg-gradient-to-br from-white to-green-50/50 border-green-100 shadow-sm border rounded-2xl p-5">
                        <span className="text-xs uppercase tracking-wider font-bold text-green-600/70 flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Blended Target CPA</span>
                        <span className="text-3xl font-black text-green-700">{fCurrency(totals.bCpa)}</span>
                    </div>
                    <div className="metric-card bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm border rounded-2xl p-5 shadow-green-100/50">
                        <span className="text-xs uppercase tracking-wider font-bold text-green-700 flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div> Total Conversions</span>
                        <span className="text-4xl font-black text-green-700">{fInt(totals.tConvs)}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
