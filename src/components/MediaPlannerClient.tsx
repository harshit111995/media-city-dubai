'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, Lock, Unlock, Plus, MapPin, Trash2, Sparkles, Building2, Calendar, Target, TrendingUp, BarChart4 } from 'lucide-react';

type ChannelType = 'DOOH' | 'CTV' | 'Audio' | 'Display' | 'Video' | 'YouTube' | 'Native' | 'In-game' | 'Social' | 'Search';
type StrategyType = 'Brand Awareness' | 'Traffic & Engagement' | 'Direct ROI & Sales';

interface ChannelRow {
    id: string;
    type: ChannelType;
    allocation: number; // percentage of NET budget
    budget: number; // dollar
    cpm: number;
    duration: number; // months for this specific channel
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

// AI Allocation Weights based on Strategy
const STRATEGY_WEIGHTS: Record<StrategyType, Record<ChannelType, number>> = {
    'Brand Awareness': { 'DOOH': 25, 'CTV': 30, 'YouTube': 20, 'Audio': 10, 'Video': 10, 'Social': 5, 'Display': 0, 'In-game': 0, 'Native': 0, 'Search': 0 },
    'Traffic & Engagement': { 'Social': 35, 'YouTube': 15, 'Native': 15, 'Video': 10, 'Display': 10, 'Search': 10, 'In-game': 5, 'DOOH': 0, 'CTV': 0, 'Audio': 0 },
    'Direct ROI & Sales': { 'Search': 40, 'Social': 30, 'Native': 15, 'YouTube': 10, 'Display': 5, 'DOOH': 0, 'CTV': 0, 'Audio': 0, 'Video': 0, 'In-game': 0 }
};

export default function MediaPlannerClient() {
    // Top Level Brief State
    const [grossBudget, setGrossBudget] = useState<number>(1000000);
    const [agencyFee, setAgencyFee] = useState<number>(15); // Percentage
    const [campaignDuration, setCampaignDuration] = useState<number>(6); // Months
    const [targetLocation, setTargetLocation] = useState<string>('United Arab Emirates');
    const [strategy, setStrategy] = useState<StrategyType>('Brand Awareness');

    // Grid State
    const [channels, setChannels] = useState<ChannelRow[]>([]);
    const [channelToAdd, setChannelToAdd] = useState<ChannelType>('Social');

    const netMediaBudget = grossBudget * (1 - (agencyFee / 100));
    const agencyFeeAmount = grossBudget - netMediaBudget;

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
    const balanceBudgets = (currentChannels: ChannelRow[], newNetBudget: number) => {
        const lockedCols = currentChannels.filter(c => c.isLocked);
        const unlockedCols = currentChannels.filter(c => !c.isLocked);

        const lockedBudget = lockedCols.reduce((sum, c) => sum + c.budget, 0);
        const remainingBudget = Math.max(0, newNetBudget - lockedBudget);

        if (unlockedCols.length === 0) return currentChannels;

        const unlockedSum = unlockedCols.reduce((sum, c) => sum + c.allocation, 0);

        return currentChannels.map(ch => {
            if (ch.isLocked) {
                return { ...ch, allocation: newNetBudget > 0 ? (ch.budget / newNetBudget) * 100 : 0 };
            } else {
                let relativeWeight = 0;
                if (unlockedSum === 0) {
                    relativeWeight = 1 / unlockedCols.length;
                } else {
                    relativeWeight = ch.allocation / unlockedSum;
                }

                const newBudget = remainingBudget * relativeWeight;
                const newAlloc = newNetBudget > 0 ? (newBudget / newNetBudget) * 100 : 0;

                return calculateRowMetrics({ ...ch, allocation: newAlloc }, newBudget);
            }
        });
    };

    // Effect: Rebalance when Net Budget changes
    useEffect(() => {
        if (channels.length > 0) {
            setChannels(prev => balanceBudgets(prev, netMediaBudget));
        }
    }, [netMediaBudget]);

    // AI Assist: Auto-Allocate
    const handleAIAllocate = () => {
        const weights = STRATEGY_WEIGHTS[strategy];

        // Filter out channels with 0 weight for this strategy
        const relevantChannels = Object.entries(weights)
            .filter(([_, weight]) => weight > 0)
            .map(([type, weight]) => ({ type: type as ChannelType, weight }));

        // Build new rows
        const newRows: ChannelRow[] = relevantChannels.map((ch, index) => {
            const config = CHANNEL_CONFIG[ch.type];
            // Normalize weights if they don't exactly add to 100
            const totalWeight = relevantChannels.reduce((sum, c) => sum + c.weight, 0);
            const allocation = (ch.weight / totalWeight) * 100;
            const newBudget = netMediaBudget * (allocation / 100);

            return calculateRowMetrics({
                id: `ai-${Date.now()}-${index}`,
                type: ch.type,
                allocation: allocation,
                budget: newBudget,
                cpm: config.defaultCpm,
                duration: campaignDuration, // default to full campaign
                impressions: 0,
                ctr: config.defaultCtr,
                clicks: 0,
                cpa: config.defaultCpa,
                conversions: 0,
                cpv: config.defaultCpv,
                views: 0,
                isLocked: false
            }, newBudget);
        });

        setChannels(newRows);
    };

    const addChannel = () => {
        const config = CHANNEL_CONFIG[channelToAdd];
        // Don't add if it already exists
        if (channels.some(c => c.type === channelToAdd)) {
            alert("This channel is already in the plan.");
            return;
        }

        const newRow: ChannelRow = {
            id: Math.random().toString(36).substring(7),
            type: channelToAdd,
            allocation: 0,
            budget: 0,
            cpm: config.defaultCpm,
            duration: campaignDuration,
            impressions: 0,
            ctr: config.defaultCtr,
            clicks: 0,
            cpa: config.defaultCpa,
            conversions: 0,
            cpv: config.defaultCpv,
            views: 0,
            isLocked: false
        };

        setChannels(prev => {
            const added = [...prev, newRow];
            return balanceBudgets(added, netMediaBudget);
        });
    };

    const removeChannel = (id: string) => {
        setChannels(prev => {
            const remaining = prev.filter(ch => ch.id !== id);
            return remaining.length > 0 ? balanceBudgets(remaining, netMediaBudget) : [];
        });
    };

    const handleCellChange = (id: string, field: keyof ChannelRow, value: number) => {
        setChannels(prev => {
            return prev.map(ch => {
                if (ch.id !== id) return ch;

                let newRow = { ...ch, [field]: value };

                if (field === 'allocation') {
                    const newBudget = netMediaBudget * (value / 100);
                    newRow = calculateRowMetrics(newRow, newBudget);
                }
                else if (field === 'budget') {
                    newRow.allocation = netMediaBudget > 0 ? (value / netMediaBudget) * 100 : 0;
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
    const fCurrency = (num: number) => '$' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    const fCurrencyDec = (num: number) => '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const fInt = (num: number) => Math.round(num).toLocaleString('en-US');
    const fPercent = (num: number) => num.toFixed(1) + '%';

    // Totals
    const totals = useMemo(() => {
        if (channels.length === 0) {
            return { tAlloc: 0, tBudget: 0, tImps: 0, tClicks: 0, tConvs: 0, bCpm: 0, bCtr: 0, bCpa: 0, tViews: 0, bCpv: 0 };
        }

        const tAlloc = channels.reduce((s, c) => s + c.allocation, 0);
        const tBudget = channels.reduce((s, c) => s + c.budget, 0);
        const tImps = channels.reduce((s, c) => s + c.impressions, 0);

        const performanceChannels = channels.filter(c => CHANNEL_CONFIG[c.type].supportsPerformance);
        const tClicks = performanceChannels.reduce((s, c) => s + (c.clicks || 0), 0);
        const tConvs = performanceChannels.reduce((s, c) => s + (c.conversions || 0), 0);
        const perfBudget = performanceChannels.reduce((s, c) => s + c.budget, 0);

        const viewableChannels = channels.filter(c => CHANNEL_CONFIG[c.type].supportsViews);
        const tViews = viewableChannels.reduce((s, c) => s + (c.views || 0), 0);
        const viewBudget = viewableChannels.reduce((s, c) => s + c.budget, 0);

        const bCpm = tImps > 0 ? (tBudget / tImps) * 1000 : 0;

        const perfImps = performanceChannels.reduce((s, c) => s + c.impressions, 0);
        const bCtr = perfImps > 0 ? (tClicks / perfImps) * 100 : 0;
        const bCpa = tConvs > 0 ? (perfBudget / tConvs) : 0;

        const bCpv = tViews > 0 ? (viewBudget / tViews) : 0;

        return { tAlloc, tBudget, tImps, tClicks, tConvs, bCpm, bCtr, bCpa, tViews, bCpv };
    }, [channels]);

    const NA_CELL = <td className="text-center text-gray-300 font-mono text-xs italic">N/A</td>;

    const getChannelColor = (type: ChannelType) => {
        const colors: Record<string, string> = {
            'DOOH': 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
            'CTV': 'bg-indigo-100 text-indigo-700 border-indigo-200',
            'Audio': 'bg-amber-100 text-amber-700 border-amber-200',
            'Display': 'bg-blue-100 text-blue-700 border-blue-200',
            'In-game': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'Video': 'bg-pink-100 text-pink-700 border-pink-200',
            'YouTube': 'bg-red-100 text-red-700 border-red-200',
            'Native': 'bg-teal-100 text-teal-700 border-teal-200',
            'Social': 'bg-sky-100 text-sky-700 border-sky-200',
            'Search': 'bg-orange-100 text-orange-700 border-orange-200',
        };
        return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    return (
        <div className="space-y-8 pb-32 max-w-[1600px] mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-red-500" />
                        AI Media Planner
                    </h1>
                    <p className="text-lg text-gray-500 mt-2 font-medium">Configure your campaign brief to auto-generate the optimal plan.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button
                        onClick={() => { setChannels([]); setGrossBudget(1000000); setAgencyFee(15); setCampaignDuration(6); setStrategy('Brand Awareness'); }}
                        className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        Reset Brief
                    </button>
                    <button
                        onClick={handleAIAllocate}
                        className="btn-ai px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black hover:from-red-500 hover:to-rose-500 transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 w-full md:w-auto justify-center"
                    >
                        <Sparkles className="w-5 h-5" />
                        AI Auto-Allocate
                    </button>
                </div>
            </div>

            {/* Top Control Bar - The Brief */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                {/* Strategy */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Target className="w-4 h-4" /> Primary Strategy</label>
                    <select
                        className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 font-bold px-4 py-3 rounded-xl appearance-none focus:outline-none focus:border-red-400 cursor-pointer shadow-sm text-base transition-colors"
                        value={strategy}
                        onChange={(e) => setStrategy(e.target.value as StrategyType)}
                    >
                        <option value="Brand Awareness">Brand Awareness</option>
                        <option value="Traffic & Engagement">Traffic & Engagement</option>
                        <option value="Direct ROI & Sales">Direct ROI & Sales</option>
                    </select>
                </div>
                {/* Location */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><MapPin className="w-4 h-4" /> Target Location</label>
                    <input
                        type="text"
                        className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 font-bold px-4 py-3 rounded-xl outline-none focus:border-red-400 transition-colors text-base"
                        value={targetLocation}
                        onChange={(e) => setTargetLocation(e.target.value)}
                    />
                </div>
                {/* Campaign Duration */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Calendar className="w-4 h-4" /> Campaign Duration</label>
                    <div className="planner-input-duration">
                        <input
                            type="number"
                            className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 font-bold px-4 py-3 rounded-xl outline-none focus:border-red-400 transition-colors text-base text-left"
                            value={campaignDuration}
                            min="1"
                            onChange={(e) => setCampaignDuration(Number(e.target.value))}
                        />
                        <span>Months</span>
                    </div>
                </div>
                {/* Agency Fee */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Building2 className="w-4 h-4" /> Agency Fee</label>
                    <div className="planner-input-percentage">
                        <input
                            type="number"
                            className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 font-bold px-4 py-3 rounded-xl outline-none focus:border-red-400 transition-colors text-base text-left"
                            value={agencyFee}
                            min="0"
                            max="50"
                            step="0.5"
                            onChange={(e) => setAgencyFee(Number(e.target.value))}
                        />
                        <span>%</span>
                    </div>
                </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-6 rounded-3xl border-2 border-gray-100 flex flex-col justify-center">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Gross Budget (Total Spend)</span>
                    <div className="planner-input-currency text-4xl font-black text-gray-900">
                        <span className="!text-3xl text-gray-400 !left-0 !top-2">$</span>
                        <input
                            type="number"
                            className="w-full bg-transparent border-none outline-none !pl-8 text-4xl"
                            value={grossBudget}
                            onChange={(e) => setGrossBudget(Number(e.target.value))}
                        />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-200 flex flex-col justify-center">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                        Agency Retainer ({agencyFee}%)
                    </span>
                    <span className="text-3xl font-black text-gray-400">{fCurrency(agencyFeeAmount)}</span>
                </div>
                <div className="bg-red-50 p-6 rounded-3xl border-2 border-red-200 flex flex-col justify-center shadow-inner">
                    <span className="text-sm font-bold text-red-600 uppercase tracking-wider mb-2 flex flex-col md:flex-row md:items-center justify-between gap-1">
                        Net Working Media Budget
                        <span className="text-xs text-red-400 font-medium normal-case bg-red-100 px-2 py-0.5 rounded-md self-start">To be distributed below</span>
                    </span>
                    <span className="text-4xl font-black text-red-700">{fCurrency(netMediaBudget)}</span>
                </div>
            </div>

            {/* Main Table Container */}
            <div className="planner-container pb-4 border-b-2 border-gray-100 mb-8">
                <div className="overflow-x-auto pb-4">
                    <table className="planner-table">
                        <thead>
                            <tr>
                                <th className="w-[40px]"></th>
                                <th>Channel</th>
                                <th>Duration</th>
                                <th>Allocation %</th>
                                <th>Net Budget ($)</th>
                                <th>CPM ($)</th>
                                <th>Est. Impressions</th>
                                <th className="border-l border-gray-200">Target CPV ($)</th>
                                <th>Total Views</th>
                                <th className="border-l border-gray-200">Est. CTR (%)</th>
                                <th>Est. Clicks</th>
                                <th>Target CPA ($)</th>
                                <th>Conversions</th>
                                <th className="w-[40px]"></th>
                            </tr>
                        </thead>
                        <tbody className="space-y-4">
                            {channels.length === 0 && (
                                <tr>
                                    <td colSpan={14} className="text-center py-20 px-4">
                                        <div className="bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 p-12 max-w-2xl mx-auto flex flex-col items-center justify-center space-y-6">
                                            <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-gray-100">
                                                <BarChart4 className="w-10 h-10 text-red-400" />
                                            </div>
                                            <div className="text-center space-y-2">
                                                <h3 className="text-2xl font-black text-gray-800 tracking-tight">Your Media Plan is Empty</h3>
                                                <p className="text-gray-500 font-medium text-lg leading-relaxed">
                                                    Click the <strong className="text-red-500">AI Auto-Allocate</strong> button above to instantly generate a strategy, or add channels manually below.
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {channels.map(row => {
                                const config = CHANNEL_CONFIG[row.type];
                                return (
                                    <tr key={row.id} className="planner-row">
                                        <td className="text-center">
                                            <button
                                                onClick={() => toggleLock(row.id)}
                                                className={`p-2 flex items-center justify-center rounded-xl transition-all ${row.isLocked ? 'bg-red-50 text-red-600 border border-red-200 shadow-sm' : 'text-gray-300 border border-transparent hover:bg-gray-100'}`}
                                                title={row.isLocked ? "Unlock row" : "Lock row to prevent budget redistribution"}
                                            >
                                                {row.isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                                            </button>
                                        </td>
                                        <td>
                                            <span className={`channel-pill border ${getChannelColor(row.type)}`}>
                                                {row.type}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="planner-input-duration !w-[90px]">
                                                <input
                                                    type="number"
                                                    className="planner-input"
                                                    value={row.duration}
                                                    onChange={(e) => handleCellChange(row.id, 'duration', Number(e.target.value))}
                                                    step="1"
                                                />
                                                <span>MO</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="planner-input-percentage !w-[100px]">
                                                <input
                                                    type="number"
                                                    className={`planner-input !font-bold !bg-gray-50 ${row.isLocked ? 'locked' : ''}`}
                                                    value={Number(row.allocation).toFixed(1)}
                                                    onChange={(e) => handleCellChange(row.id, 'allocation', Number(e.target.value))}
                                                    disabled={row.isLocked}
                                                    step="1"
                                                />
                                                <span className="!font-bold">%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="planner-input-currency !w-[140px]">
                                                <span className="!text-gray-800 !font-bold">$</span>
                                                <input
                                                    type="number"
                                                    className={`planner-input !font-black !text-gray-900 ${row.isLocked ? 'locked' : ''}`}
                                                    value={Math.round(row.budget)}
                                                    onChange={(e) => handleCellChange(row.id, 'budget', Number(e.target.value))}
                                                    disabled={row.isLocked}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="planner-input-currency !w-[110px]">
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
                                        <td className="text-right font-mono text-gray-700 bg-gray-50/50 rounded-lg px-4 border border-gray-100 font-medium">
                                            {fInt(row.impressions)}
                                        </td>

                                        {/* VIEWS SECTION */}
                                        {config.supportsViews ? (
                                            <>
                                                <td className="border-l border-gray-100 pl-4">
                                                    <div className="planner-input-currency !w-[100px]">
                                                        <span>$</span>
                                                        <input
                                                            type="number"
                                                            className="planner-input"
                                                            value={row.cpv || 0}
                                                            step="0.01"
                                                            onChange={(e) => handleCellChange(row.id, 'cpv', Number(e.target.value))}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="text-right font-mono text-blue-700 bg-blue-50/50 rounded-lg px-4 border border-blue-100 font-bold">
                                                    {fInt(row.views || 0)}
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="border-l border-gray-100"></td>
                                                {NA_CELL}
                                            </>
                                        )}

                                        {/* PERFORMANCE SECTION */}
                                        {config.supportsPerformance ? (
                                            <>
                                                <td className="border-l border-gray-100 pl-4">
                                                    <div className="planner-input-percentage !w-[90px]">
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
                                                <td className="text-right font-mono text-gray-600 bg-gray-50/50 rounded-lg px-4 border border-gray-100">
                                                    {fInt(row.clicks || 0)}
                                                </td>
                                                <td>
                                                    <div className="planner-input-currency !w-[120px]">
                                                        <span>$</span>
                                                        <input
                                                            type="number"
                                                            className="planner-input"
                                                            value={row.cpa || 0}
                                                            step="5"
                                                            onChange={(e) => handleCellChange(row.id, 'cpa', Number(e.target.value))}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="text-right font-mono text-green-700 bg-green-50/60 rounded-lg px-4 border border-green-200 font-black text-lg">
                                                    {fInt(row.conversions || 0)}
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="border-l border-gray-100"></td>
                                                {NA_CELL}
                                                <td></td>
                                                {NA_CELL}
                                            </>
                                        )}

                                        <td className="text-center">
                                            <button
                                                onClick={() => removeChannel(row.id)}
                                                className="p-2 flex items-center justify-center rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors mx-auto"
                                                title="Remove Channel"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                        {/* Summary Footer Inline */}
                        {channels.length > 0 && (
                            <tfoot>
                                <tr className="planner-summary-row">
                                    <td colSpan={3} className="text-right text-xs uppercase tracking-widest text-gray-400 font-bold">Total / Blended</td>
                                    <td className={`text-right ${Math.round(totals.tAlloc) !== 100 ? 'text-red-500' : 'text-green-600'} flex items-center justify-end gap-1`}>
                                        {Math.round(totals.tAlloc) !== 100 && <span className="text-lg">⚠️</span>}
                                        {totals.tAlloc.toFixed(1)}%
                                    </td>
                                    <td className="text-right text-gray-900 border-none bg-transparent">{fCurrency(totals.tBudget)}</td>
                                    <td className="text-right text-gray-500">{fCurrencyDec(totals.bCpm)}</td>
                                    <td className="text-right text-gray-700">{fInt(totals.tImps)}</td>

                                    <td className="text-right text-blue-600 border-none bg-transparent">{fCurrencyDec(totals.bCpv)}</td>
                                    <td className="text-right text-blue-700">{fInt(totals.tViews)}</td>

                                    <td className="text-right text-green-600 border-none bg-transparent">{fPercent(totals.bCtr)}</td>
                                    <td className="text-right text-green-700">{fInt(totals.tClicks)}</td>
                                    <td className="text-right text-green-800">{fCurrencyDec(totals.bCpa)}</td>
                                    <td className="text-right text-green-600 text-xl">{fInt(totals.tConvs)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>

            {/* Manual Picklist (Bottom) */}
            <div className="flex items-center gap-3">
                <select
                    className="bg-white border-2 border-gray-200 text-gray-600 font-bold px-4 py-3 rounded-xl appearance-none pr-10 focus:outline-none focus:border-red-400 cursor-pointer shadow-sm uppercase tracking-wider text-sm"
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
                    className="flex items-center space-x-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold tracking-wide transition-all active:scale-95 shadow-md shadow-black/20"
                >
                    <Plus size={18} />
                    <span>MANUALLY ADD MEDIA</span>
                </button>
            </div>

            {/* Quick Metrics Cards */}
            {channels.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12 pt-8 border-t border-gray-100">
                    <div className="metric-card bg-gradient-to-br from-white to-gray-50 border-gray-200/60 shadow-sm border rounded-2xl p-5">
                        <span className="text-xs uppercase tracking-wider font-bold text-gray-500 flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-gray-400" /> Blended CPM</span>
                        <span className="text-3xl font-black text-gray-800">{fCurrencyDec(totals.bCpm)}</span>
                    </div>
                    <div className="metric-card bg-gradient-to-br from-white to-blue-50/50 border-blue-100 shadow-sm border rounded-2xl p-5">
                        <span className="text-xs uppercase tracking-wider font-bold text-blue-600/70 flex items-center gap-2 mb-2"><BarChart4 className="w-4 h-4 text-blue-500" /> Total Views/Listens</span>
                        <span className="text-3xl font-black text-blue-700">{fInt(totals.tViews)}</span>
                    </div>
                    <div className="metric-card bg-gradient-to-br from-white to-green-50/50 border-green-100 shadow-sm border rounded-2xl p-5">
                        <span className="text-xs uppercase tracking-wider font-bold text-green-600/70 flex items-center gap-2 mb-2"><Target className="w-4 h-4 text-green-500" /> Blended Target CPA</span>
                        <span className="text-3xl font-black text-green-700">{fCurrencyDec(totals.bCpa)}</span>
                    </div>
                    <div className="metric-card bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm border rounded-2xl p-5 shadow-green-100/50">
                        <span className="text-xs uppercase tracking-wider font-bold text-green-700 flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-green-600 animate-pulse" /> Total Conversions</span>
                        <span className="text-4xl font-black text-green-700">{fInt(totals.tConvs)}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
