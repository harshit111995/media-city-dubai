'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Calculator, Lock, Unlock, Plus, MapPin, Trash2, Sparkles, Building2, Calendar, Target, TrendingUp, BarChart4, FileSpreadsheet, ChevronRight, ArrowDownRight, Wallet, Terminal, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { Cell, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { Country, City } from 'country-state-city';

// Dynamically import Recharts to prevent Next.js SSR hydration errors
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });

type ChannelType = 'DOOH' | 'CTV' | 'Audio' | 'Display' | 'Video' | 'YouTube' | 'Native' | 'In-game' | 'Social' | 'Search';
type StrategyType = 'Brand Awareness' | 'Traffic & Engagement' | 'Direct ROI & Sales';

interface ChannelRow {
    id: string;
    type: ChannelType;
    allocation: number; // percentage of NET budget
    budget: number; // dollar
    cpm: number;
    startDate: string;
    endDate: string;
    impressions: number;

    // Performance Metrics (Optional based on type)
    ctr: number | null; // percentage
    cpc: number | null; // cost per click
    clicks: number | null;
    cr: number | null; // conversion rate percentage
    cpa: number | null;
    conversions: number | null;

    // Brand Metrics (Optional based on type)
    cpv: number | null; // cost per view/listen
    views: number | null; // views/listens
    frequency: number; // custom frequency for reach
    isLocked: boolean;
}

// Master configurations for what metrics a channel supports and default rates
const CHANNEL_CONFIG: Record<ChannelType, { supportsPerformance: boolean, supportsViews: boolean, defaultCpm: number, defaultCtr: number | null, defaultCpc: number | null, defaultCr: number | null, defaultCpa: number | null, defaultCpv: number | null, defaultFreq: number }> = {
    'Display': { supportsPerformance: true, supportsViews: false, defaultCpm: 5, defaultCtr: 0.15, defaultCpc: 3.33, defaultCr: 1.0, defaultCpa: 50, defaultCpv: null, defaultFreq: 2.2 },
    'Social': { supportsPerformance: true, supportsViews: false, defaultCpm: 8, defaultCtr: 0.9, defaultCpc: 0.89, defaultCr: 2.5, defaultCpa: 35, defaultCpv: null, defaultFreq: 3.5 },
    'Video': { supportsPerformance: true, supportsViews: true, defaultCpm: 12, defaultCtr: 0.5, defaultCpc: 2.40, defaultCr: 1.2, defaultCpa: 90, defaultCpv: 0.05, defaultFreq: 2.0 },
    'YouTube': { supportsPerformance: true, supportsViews: true, defaultCpm: 10, defaultCtr: 0.6, defaultCpc: 1.67, defaultCr: 1.5, defaultCpa: 85, defaultCpv: 0.03, defaultFreq: 2.5 },
    'Search': { supportsPerformance: true, supportsViews: false, defaultCpm: 20, defaultCtr: 3.5, defaultCpc: 0.57, defaultCr: 5.0, defaultCpa: 30, defaultCpv: null, defaultFreq: 1.0 },
    'Audio': { supportsPerformance: false, supportsViews: true, defaultCpm: 15, defaultCtr: 0.1, defaultCpc: null, defaultCr: 0.5, defaultCpa: null, defaultCpv: null, defaultFreq: 4.0 },
    'DOOH': { supportsPerformance: false, supportsViews: false, defaultCpm: 25, defaultCtr: 0.0, defaultCpc: null, defaultCr: 0.0, defaultCpa: null, defaultCpv: null, defaultFreq: 1.5 },
    'Native': { supportsPerformance: true, supportsViews: false, defaultCpm: 6, defaultCtr: 0.25, defaultCpc: 2.40, defaultCr: 1.0, defaultCpa: 60, defaultCpv: null, defaultFreq: 1.8 },
    'In-game': { supportsPerformance: true, supportsViews: false, defaultCpm: 18, defaultCtr: 0.2, defaultCpc: 9.00, defaultCr: 0.8, defaultCpa: 112, defaultCpv: null, defaultFreq: 1.2 },
    'CTV': { supportsPerformance: false, supportsViews: true, defaultCpm: 30, defaultCtr: 0.0, defaultCpc: null, defaultCr: 0.0, defaultCpa: null, defaultCpv: 0.04, defaultFreq: 2.5 }
};

// AI Allocation Weights based on Strategy
const STRATEGY_WEIGHTS: Record<StrategyType, Record<ChannelType, number>> = {
    'Brand Awareness': { 'DOOH': 25, 'CTV': 30, 'YouTube': 20, 'Audio': 10, 'Video': 10, 'Social': 5, 'Display': 0, 'In-game': 0, 'Native': 0, 'Search': 0 },
    'Traffic & Engagement': { 'Social': 35, 'YouTube': 15, 'Native': 15, 'Video': 10, 'Display': 10, 'Search': 10, 'In-game': 5, 'DOOH': 0, 'CTV': 0, 'Audio': 0 },
    'Direct ROI & Sales': { 'Search': 40, 'Social': 30, 'Native': 15, 'YouTube': 10, 'Display': 5, 'DOOH': 0, 'CTV': 0, 'Audio': 0, 'Video': 0, 'In-game': 0 }
};

const STRATEGY_BRIEFS: Record<StrategyType, string> = {
    'Brand Awareness': "Focuses on maximizing reach and ad recall by heavily allocating budget to high-impact visual formats like CTV, DOOH, and YouTube.",
    'Traffic & Engagement': "Prioritizes driving active clicks and site visits by shifting emphasis toward Social, Native content, and interactive Video.",
    'Direct ROI & Sales': "Engineered to maximize conversions and lower CPA by dominating lower-funnel intent channels like Search and Social performance campaigns."
};

const AI_SUGGESTIONS: Record<StrategyType, { title: string, why: string, suggestion: string }> = {
    'Brand Awareness': {
        title: "AI Analysis: Brand Awareness Focus",
        why: "This allocation places the vast majority of the budget into non-skippable, high-impact video formats (CTV and YouTube) and high-visibility Out-of-Home displays. These channels mathematically yield the lowest Cost Per View (CPV), ensuring maximum unique reach per dollar spent.",
        suggestion: "To enhance this strategy, consider pairing your CTV buys with retargeting on mobile devices. Ensure your creative messaging is clear within the first 3 seconds, as brand recall drops significantly after the initial impression."
    },
    'Traffic & Engagement': {
        title: "AI Analysis: Traffic & Engagement Focus",
        why: "The model heavily weights Social, Native, and Video channels because they historically deliver the highest Click-Through Rates (CTR) on mid-funnel content. Native advertising seamlessly blends with editorial content, driving higher quality site visits.",
        suggestion: "Ensure your landing pages are mobile-optimized, as over 80% of native and social traffic will originate from mobile devices. Implement strong UTM tracking to monitor post-click engagement metrics like bounce rate and time on site."
    },
    'Direct ROI & Sales': {
        title: "AI Analysis: Direct Response & ROI Focus",
        why: "This aggressive performance allocation strips budget away from broad awareness channels and concentrates it entirely on high-intent environments: Search and Social. These platforms utilize advanced machine learning algorithms to map conversions back to individual CPA bids.",
        suggestion: "Implement a strict ROAS (Return on Ad Spend) bidding model. You must have robust conversion tracking (e.g., Pixel or Server-Side API) installed. Review underperforming keywords or audiences every 72 hours to reallocate wasted spend."
    }
};

const getChannelColorHex = (type: ChannelType) => {
    const colors: Record<string, string> = {
        'DOOH': '#d946ef', 'CTV': '#6366f1', 'Audio': '#f59e0b', 'Display': '#3b82f6',
        'In-game': '#10b981', 'Video': '#ec4899', 'YouTube': '#ef4444', 'Native': '#14b8a6',
        'Social': '#0ea5e9', 'Search': '#f97316'
    };
    return colors[type] || '#cbd5e1';
};

export default function MediaPlannerClient() {
    // Top Level Brief State
    const [grossBudget, setGrossBudget] = useState<number>(1000000);
    const [agencyFee, setAgencyFee] = useState<number>(15); // Percentage

    // Default to today and 3 months from now
    const [campaignStart, setCampaignStart] = useState<string>('');
    const [campaignEnd, setCampaignEnd] = useState<string>('');
    const [targetCountryCode, setTargetCountryCode] = useState<string>('AE');
    const [targetCity, setTargetCity] = useState<string>('Dubai');
    const [strategy, setStrategy] = useState<StrategyType>('Brand Awareness');

    // Local string states for inputs to avoid "zero" bug
    const [grossInput, setGrossInput] = useState<string>('1000000');
    const [feeInput, setFeeInput] = useState<string>('15');

    // Grid State
    const [channels, setChannels] = useState<ChannelRow[]>([]);
    const [channelToAdd, setChannelToAdd] = useState<ChannelType>('Social');

    // Recharts Hydration Fix
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
        // Set dates on client-side to prevent hydration mismatch
        const defaultStart = new Date().toISOString().split('T')[0];
        const defaultEnd = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        setCampaignStart(defaultStart);
        setCampaignEnd(defaultEnd);
    }, []);

    const netMediaBudget = grossBudget * (1 - (agencyFee / 100));
    const agencyFeeAmount = grossBudget - netMediaBudget;

    // Recalculate metrics for a row based on budget and rates
    const calculateRowMetrics = (row: ChannelRow, newBudget: number) => {
        const config = CHANNEL_CONFIG[row.type];

        const impressions = newBudget > 0 && row.cpm > 0 ? (newBudget / row.cpm) * 1000 : 0;

        let clicks = null;
        let conversions = null;
        let cpc = row.cpc;
        let cr = row.cr;

        if (config.supportsPerformance) {
            // CTR -> Clicks
            clicks = impressions * ((row.ctr || 0) / 100);

            // Derive CPC if it's null or we want it to be reactive
            cpc = clicks > 0 ? newBudget / clicks : 0;

            // CR -> Conversions
            conversions = clicks > 0 ? clicks * ((row.cr || 0) / 100) : 0;

            // ROAS (Placeholder for now, could be added later with AOV)
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
            cpc,
            conversions,
            views,
            frequency: row.frequency || config.defaultFreq
        };
    };

    // Auto-balance budgets when adding a channel or changing the total
    const balanceBudgets = (currentChannels: ChannelRow[], newNetBudget: number) => {
        // If the total budget changed, we maintain the "Intent"
        // Intent check: Did the User mean "I want $10k in Social" (Locked) 
        // or "I want 10% in Social" (Unlocked)?

        const lockedBudget = currentChannels.filter(c => c.isLocked).reduce((sum, c) => sum + c.budget, 0);
        const remainingBudget = Math.max(0, newNetBudget - lockedBudget);

        return currentChannels.map(ch => {
            if (ch.isLocked) {
                // If Locked: Dollar budget is fixed. Recalculate % relative to NEW net.
                const newAlloc = newNetBudget > 0 ? (ch.budget / newNetBudget) * 100 : 0;
                return { ...ch, allocation: newAlloc };
            } else {
                // If Unlocked: % Allocation is fixed. Recalculate Dollars relative to NEW remaining/total.
                // Actually, simplest is just: Budget = NetBudget * (Allocation / 100)
                const newBudget = newNetBudget * (ch.allocation / 100);
                return calculateRowMetrics(ch, newBudget);
            }
        });
    };

    // Effect: Rebalance when Net Budget changes
    useEffect(() => {
        if (channels.length > 0) {
            setChannels(prev => balanceBudgets(prev, netMediaBudget));
        }
    }, [netMediaBudget]);
    const handleGrossChange = (val: string) => {
        // Allow empty state for clearing input without "snapping to 0"
        if (val === '') {
            setGrossInput('');
            return;
        }
        
        // Remove commas if the user pasted formatted text
        const cleanVal = val.replace(/,/g, '');
        setGrossInput(cleanVal);
        
        const num = parseFloat(cleanVal);
        if (!isNaN(num)) {
            setGrossBudget(num);
        }
    };

    const handleFeeChange = (val: string) => {
        if (val === '') {
            setFeeInput('');
            return;
        }

        const cleanVal = val.replace(/,/g, '');
        setFeeInput(cleanVal);
        
        const num = parseFloat(cleanVal);
        if (!isNaN(num)) {
            setAgencyFee(num);
        }
    };

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
                startDate: campaignStart,
                endDate: campaignEnd,
                impressions: 0,
                ctr: config.defaultCtr,
                cpc: config.defaultCpc,
                clicks: 0,
                cr: config.defaultCr,
                cpa: config.defaultCpa,
                conversions: 0,
                cpv: config.defaultCpv,
                views: 0,
                frequency: config.defaultFreq,
                isLocked: false
            }, newBudget);
        });

        console.log("handleAIAllocate Fired. Input Budget:", netMediaBudget, "Rows:", newRows);
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
            startDate: campaignStart,
            endDate: campaignEnd,
            impressions: 0,
            ctr: config.defaultCtr,
            cpc: config.defaultCpc,
            clicks: 0,
            cr: config.defaultCr,
            cpa: config.defaultCpa,
            conversions: 0,
            cpv: config.defaultCpv,
            views: 0,
            frequency: config.defaultFreq,
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
                else if (field === 'cpm' || field === 'ctr' || field === 'cpa' || field === 'cpv' || field === 'cr' || field === 'cpc' || field === 'frequency') {
                    newRow = calculateRowMetrics(newRow, newRow.budget);
                }

                return newRow;
            });
        });
    };

    const handleDateChange = (id: string, field: 'startDate' | 'endDate', value: string) => {
        setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, [field]: value } : ch));
    };

    const handleReset = () => {
        if (confirm('Are you sure you want to clear the matrix and reset to default?')) {
            setChannels([]);
            setGrossInput('1000000');
            setGrossBudget(1000000);
            setFeeInput('15');
            setAgencyFee(15);
        }
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
            return { tAlloc: 0, tBudget: 0, tImps: 0, tClicks: 0, tConvs: 0, bCpm: 0, bCtr: 0, bCpa: 0, tViews: 0, bCpv: 0, tReach: 0, bCr: 0, bCpc: 0 };
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
        const bCr = tClicks > 0 ? (tConvs / tClicks) * 100 : 0;
        const bCpc = tClicks > 0 ? (perfBudget / tClicks) : 0;

        const bCpv = tViews > 0 ? (viewBudget / tViews) : 0;

        // Reach is the sum of (Impressions / Frequency)
        const tReach = channels.reduce((s, c) => s + (c.impressions / (c.frequency || 1.8)), 0);

        return { tAlloc, tBudget, tImps, tClicks, tConvs, bCpm, bCtr, bCpa, tViews, bCpv, tReach, bCr, bCpc };
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

    // Prepare Chart Data
    const pieData = channels
        .filter(c => c.budget > 0)
        .map(c => ({ name: c.type, value: c.budget, fill: getChannelColorHex(c.type) }))
        .sort((a, b) => b.value - a.value); // Sort biggest first

    // Helper for Timeline
    const getGlobalDateRange = () => {
        const start = new Date(campaignStart).getTime();
        const end = new Date(campaignEnd).getTime();
        const totalDuration = end - start;
        return { start, end, totalDuration };
    };
    const globalDates = getGlobalDateRange();

    const countries = Country.getAllCountries();
    const rawCities = City.getCitiesOfCountry(targetCountryCode) || [];

    // Deduplicate cities by name to prevent React key warnings and duplicate dropdown entries
    const uniqueCityNames = new Set();
    const cities = rawCities.filter(city => {
        if (uniqueCityNames.has(city.name)) return false;
        uniqueCityNames.add(city.name);
        return true;
    });


    return (
        <div className="lunar-bg font-sans min-h-screen pt-12 pb-24 relative text-gray-900">
            <div id="media-planner-capture" className="max-w-[1700px] mx-auto w-full relative z-10 px-4 space-y-12 h-full bg-white/50 backdrop-blur-sm rounded-3xl pb-16 pt-8">
                {/* Header Area */}


                {/* V9 Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

                    {/* LEFT COLUMN: Brief, Dashboard, Matrix, Charts */}
                    <div className="space-y-8 min-w-0">

                        {/* Top Control Bar - The Brief (Modified for dates and 4 cols) */}
                        <div className="lunar-shell p-8 lg:p-12 mb-8">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                {/* Location */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <label style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <MapPin style={{ width: '14px', height: '14px', color: '#dc2626' }} /> Target Location
                                    </label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                        <div className="lunar-input-container" style={{ borderRadius: '9999px', padding: '0.25rem', display: 'flex', alignItems: 'center', minHeight: '56px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                                            <select
                                                style={{ width: '100%', backgroundColor: 'transparent', color: '#0f172a', fontWeight: 800, padding: '0 1rem', outline: 'none', appearance: 'none', cursor: 'pointer', fontSize: '0.875rem', border: 'none', fontFamily: 'inherit' }}
                                                value={targetCountryCode}
                                                onChange={(e) => {
                                                    const code = e.target.value;
                                                    setTargetCountryCode(code);
                                                    const countryCities = City.getCitiesOfCountry(code);
                                                    if (countryCities && countryCities.length > 0) {
                                                        setTargetCity(countryCities[0].name);
                                                    } else {
                                                        setTargetCity('');
                                                    }
                                                }}
                                            >
                                                {countries.map(c => (
                                                    <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="lunar-input-container" style={{ borderRadius: '9999px', padding: '0.25rem', display: 'flex', alignItems: 'center', minHeight: '56px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', opacity: cities.length <= 1 ? 0.5 : 1 }}>
                                            <select
                                                style={{ width: '100%', backgroundColor: 'transparent', color: '#0f172a', fontWeight: 800, padding: '0 1rem', outline: 'none', appearance: 'none', cursor: 'pointer', fontSize: '0.875rem', border: 'none', fontFamily: 'inherit' }}
                                                value={targetCity}
                                                onChange={(e) => setTargetCity(e.target.value)}
                                                disabled={cities.length <= 1}
                                            >
                                                {cities.length > 0 ? cities.map(city => (
                                                    <option key={city.name} value={city.name}>{city.name}</option>
                                                )) : <option value="">N/A</option>}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Campaign Dates */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <label style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar style={{ width: '14px', height: '14px', color: '#dc2626' }} /> Flight dates
                                    </label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                        <div className="lunar-input-container" style={{ borderRadius: '9999px', padding: '0.25rem', display: 'flex', alignItems: 'center', minHeight: '56px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                                            <input
                                                type="date"
                                                style={{ width: '100%', backgroundColor: 'transparent', color: '#0f172a', fontWeight: 800, padding: '0 1rem', outline: 'none', cursor: 'pointer', fontSize: '0.875rem', border: 'none', fontFamily: 'inherit' }}
                                                value={campaignStart}
                                                onChange={e => setCampaignStart(e.target.value)}
                                                onClick={(e) => { try { if ('showPicker' in e.currentTarget) (e.currentTarget as HTMLInputElement).showPicker(); } catch (err) { } }}
                                            />
                                        </div>
                                        <div className="lunar-input-container" style={{ borderRadius: '9999px', padding: '0.25rem', display: 'flex', alignItems: 'center', minHeight: '56px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                                            <input
                                                type="date"
                                                style={{ width: '100%', backgroundColor: 'transparent', color: '#0f172a', fontWeight: 800, padding: '0 1rem', outline: 'none', cursor: 'pointer', fontSize: '0.875rem', border: 'none', fontFamily: 'inherit' }}
                                                value={campaignEnd}
                                                onChange={e => setCampaignEnd(e.target.value)}
                                                onClick={(e) => { try { if ('showPicker' in e.currentTarget) (e.currentTarget as HTMLInputElement).showPicker(); } catch (err) { } }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Manual Picklist / Add Channel */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <label style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Plus style={{ width: '14px', height: '14px', color: '#dc2626' }} /> Add media channel
                                    </label>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <div className="lunar-input-container" style={{ borderRadius: '9999px', padding: '0.25rem', display: 'flex', alignItems: 'center', minHeight: '56px', flexGrow: 1, border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                                            <select
                                                style={{ width: '100%', backgroundColor: 'transparent', color: '#0f172a', fontWeight: 800, padding: '0 1rem', outline: 'none', appearance: 'none', cursor: 'pointer', fontSize: '0.875rem', border: 'none', fontFamily: 'inherit' }}
                                                value={channelToAdd}
                                                onChange={(e) => setChannelToAdd(e.target.value as ChannelType)}
                                            >
                                                {Object.keys(CHANNEL_CONFIG).map(ch => (
                                                    <option key={ch} value={ch}>{ch}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            onClick={addChannel}
                                            style={{ padding: '0 2rem', backgroundColor: '#0f172a', color: 'white', fontWeight: 900, borderRadius: '9999px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                            className="hover:bg-zinc-800 transition-all active:scale-95"
                                        >
                                            ADD
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Financial Overview Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                            <div className="lunar-card p-8 flex flex-col justify-center relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Gross Budget</span>
                                    <Wallet className="w-4 h-4 text-slate-300" />
                                </div>
                                <div className="lunar-input-container rounded-xl p-3 flex items-center focus-within:lunar-input-active min-h-[64px]">
                                    <span className="text-xl font-black text-zinc-300 mr-2">$</span>
                                    <input
                                        type="number"
                                        className="w-full bg-transparent border-none outline-none text-3xl font-black text-zinc-950"
                                        value={grossInput}
                                        onChange={(e) => handleGrossChange(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="lunar-card p-8 flex flex-col justify-center relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Agency Fee</span>
                                    <Building2 className="w-4 h-4 text-slate-300" />
                                </div>
                                <div className="lunar-input-container rounded-xl p-3 flex items-center focus-within:lunar-input-active min-h-[64px]">
                                    <input
                                        type="number"
                                        className="w-full bg-transparent border-none outline-none text-3xl font-black text-zinc-950"
                                        value={feeInput}
                                        onChange={(e) => handleFeeChange(e.target.value)}
                                    />
                                    <span className="text-xl font-black text-zinc-300 ml-2">%</span>
                                </div>
                            </div>
                            <div className="lunar-card p-10 flex flex-col justify-center bg-red-50/10 border-red-100/30">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Agency Retainer ({agencyFee}%)</span>
                                    <ArrowDownRight className="w-4 h-4 text-red-400" />
                                </div>
                                <span className="text-4xl font-black text-red-600 drop-shadow-sm">{fCurrency(agencyFeeAmount)}</span>
                            </div>
                            <div className="lunar-card p-10 flex flex-col justify-center bg-zinc-950 border-zinc-800">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Net Media Budget</span>
                                    <Wallet className="w-4 h-4 text-zinc-500" />
                                </div>
                                <span className="text-4xl font-black text-white">{fCurrency(netMediaBudget)}</span>
                            </div>
                        </div>

                        {/* Gross vs Net Visual Breakdown Bar */}
                        <div className="lunar-shell p-8 mb-8 flex flex-col gap-6" style={{ backgroundColor: '#f8fafc' }}>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-2" style={{ color: '#94a3b8' }}>
                                        <Wallet className="w-3 h-3 text-red-600" /> Budget Breakdown
                                    </h4>
                                    <p className="text-xs font-bold text-gray-800">
                                        Working Media: <span className="text-red-600">{fCurrency(netMediaBudget)}</span>
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', backgroundColor: 'white', padding: '0.5rem 1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '9999px', backgroundColor: '#dc2626' }}></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#64748b' }}>Agency Fee</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '9999px', backgroundColor: '#18181b' }}></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#64748b' }}>Working Media</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', width: '100%', height: '16px', minHeight: '16px', backgroundColor: '#e4e4e7', borderRadius: '9999px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)' }}>
                                <div
                                    style={{ width: `${agencyFee}%`, minHeight: '16px', backgroundColor: '#dc2626', transition: 'all 1s ease-out' }}
                                />
                                <div
                                    style={{ width: `${100 - agencyFee}%`, minHeight: '16px', backgroundColor: '#18181b', transition: 'all 1s ease-out' }}
                                />
                            </div>
                        </div>

                        {/* Main Table Container */}
                        <div className="lunar-shell bg-white overflow-hidden mb-8 shadow-sm border border-gray-100/50">
                            <div className="lunar-table-scroll w-full pb-4">
                                <table className="planner-table w-full min-w-[1500px]">
                                    <thead>
                                        <tr>
                                            <th className="w-[40px]"></th>
                                            <th>Channel</th>
                                            <th className="min-w-[280px]">Flight Dates</th>
                                            <th>Allocation %</th>
                                            <th>Net Budget ($)</th>
                                            <th>CPM ($)</th>
                                            <th className="group relative whitespace-nowrap">
                                                Est. Impressions
                                                <div className="tooltip-custom">Total ad loads served.</div>
                                            </th>
                                            <th className="group relative border-r border-gray-100 pr-4 whitespace-nowrap">
                                                Frequency
                                                <div className="tooltip-custom">Avg. target reach frequency.</div>
                                            </th>
                                            <th className="group relative bg-red-50/30 whitespace-nowrap">
                                                Est. Reach
                                                <div className="tooltip-custom">Unique audience (Imps / Freq).</div>
                                            </th>
                                            <th className="border-l border-gray-100 pl-4">Target CPV ($)</th>
                                            <th>Total Views</th>
                                            <th className="border-l border-gray-200 pl-4">Est. CTR (%)</th>
                                            <th>Est. Clicks</th>
                                            <th>Est. CPC ($)</th>
                                            <th className="border-l border-gray-100 pl-4">Est. CR (%)</th>
                                            <th>Conversons</th>
                                            <th>Target CPA ($)</th>
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
                                                                Click the <strong className="text-red-500">Auto-Allocate Math</strong> button in the AI Strategist sidebar to instantly generate a strategy, or add channels manually below.
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
                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                                            <input
                                                                type="date"
                                                                className="bg-transparent border border-gray-200 rounded-md px-2 py-1 text-xs font-medium text-gray-600 focus:border-red-400 outline-none w-[130px] min-w-[130px] cursor-pointer"
                                                                value={row.startDate}
                                                                onChange={(e) => handleDateChange(row.id, 'startDate', e.target.value)}
                                                                onClick={(e) => { try { if ('showPicker' in e.currentTarget) (e.currentTarget as HTMLInputElement).showPicker(); } catch (err) { } }}
                                                            />
                                                            <span className="text-gray-300 hidden sm:inline">-</span>
                                                            <input
                                                                type="date"
                                                                className="bg-transparent border border-gray-200 rounded-md px-2 py-1 text-xs font-medium text-gray-600 focus:border-red-400 outline-none w-[130px] min-w-[130px] cursor-pointer"
                                                                value={row.endDate}
                                                                onChange={(e) => handleDateChange(row.id, 'endDate', e.target.value)}
                                                                onClick={(e) => { try { if ('showPicker' in e.currentTarget) (e.currentTarget as HTMLInputElement).showPicker(); } catch (err) { } }}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="planner-input-percentage !w-[100px]">
                                                            <input
                                                                type="number"
                                                                className={`planner-input !font-bold !bg-gray-50 ${row.isLocked ? 'locked' : ''}`}
                                                                value={row.allocation}
                                                                onChange={(e) => handleCellChange(row.id, 'allocation', Number(e.target.value))}
                                                                onFocus={(e) => e.target.select()}
                                                                disabled={row.isLocked}
                                                                step="0.1"
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
                                                    <td className="text-right font-mono text-gray-700 bg-gray-50/10 rounded-lg px-4 border border-gray-100/50 font-medium whitespace-nowrap">
                                                        {fInt(row.impressions)}
                                                    </td>
                                                    <td>
                                                        <div className="planner-input-percentage !w-[80px]">
                                                            <input
                                                                type="number"
                                                                className="planner-input font-bold"
                                                                value={row.frequency || 1}
                                                                step="0.1"
                                                                onChange={(e) => handleCellChange(row.id, 'frequency', Number(e.target.value))}
                                                            />
                                                            <span className="text-gray-400">x</span>
                                                        </div>
                                                    </td>
                                                    <td className="text-right font-mono text-red-600 bg-red-50/10 rounded-lg px-4 border border-red-100/50 font-bold whitespace-nowrap">
                                                        {fInt(row.impressions / (row.frequency || 1))}
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
                                                            <td className="border-l border-gray-100 pl-4">{NA_CELL}</td>
                                                            <td>{NA_CELL}</td>
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
                                                            <td className="text-right font-mono text-gray-600 bg-gray-50/50 rounded-lg px-4 border border-gray-100 whitespace-nowrap">
                                                                {fInt(row.clicks || 0)}
                                                            </td>
                                                            <td className="text-right font-mono text-gray-900 font-bold whitespace-nowrap">
                                                                {fCurrencyDec(row.cpc || 0)}
                                                            </td>
                                                            <td className="border-l border-gray-100 pl-4">
                                                                <div className="planner-input-percentage !w-[90px]">
                                                                    <input
                                                                        type="number"
                                                                        className="planner-input"
                                                                        value={row.cr || 0}
                                                                        step="0.1"
                                                                        onChange={(e) => handleCellChange(row.id, 'cr', Number(e.target.value))}
                                                                    />
                                                                    <span>%</span>
                                                                </div>
                                                            </td>
                                                            <td className="text-right font-mono text-green-700 bg-green-50/60 rounded-lg px-4 border border-green-200 font-black text-lg whitespace-nowrap">
                                                                {fInt(row.conversions || 0)}
                                                            </td>
                                                            <td>
                                                                <div className="planner-input-currency !w-[120px]">
                                                                    <span>$</span>
                                                                    <input
                                                                        type="number"
                                                                        className="planner-input"
                                                                        value={row.cpa || 0}
                                                                        step="1"
                                                                        onChange={(e) => handleCellChange(row.id, 'cpa', Number(e.target.value))}
                                                                    />
                                                                </div>
                                                            </td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td className="border-l border-gray-100 pl-4">{NA_CELL}</td>
                                                            <td>{NA_CELL}</td>
                                                            <td>{NA_CELL}</td>
                                                            <td className="border-l border-gray-100 pl-4">{NA_CELL}</td>
                                                            <td>{NA_CELL}</td>
                                                            <td>{NA_CELL}</td>
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
                                                <td className="text-right text-gray-400">{fCurrencyDec(totals.bCpm)}</td>
                                                <td className="text-right text-gray-700 font-black">{fInt(totals.tImps)}</td>
                                                <td className="text-right text-zinc-500">Avg.</td>
                                                <td className="text-right text-red-600 font-black">{fInt(totals.tReach)}</td>
                                                <td className="text-right text-blue-600">{fCurrencyDec(totals.bCpv)}</td>
                                                <td className="text-right text-blue-700 font-bold">{fInt(totals.tViews)}</td>
                                                <td className="text-right text-green-600">{fPercent(totals.bCtr)}</td>
                                                <td className="text-right text-green-700 font-bold">{fInt(totals.tClicks)}</td>
                                                <td className="text-right text-zinc-950 font-bold">{fCurrencyDec(totals.tBudget / (totals.tClicks || 1))}</td>
                                                <td className="text-right text-green-600">{fPercent(totals.bCr)}</td>
                                                <td className="text-right text-green-600 text-xl font-black">{fInt(totals.tConvs)}</td>
                                                <td className="text-right text-green-800 font-bold">{fCurrencyDec(totals.bCpa)}</td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>
                        </div>
                        {/* --- AI Analysis / Suggestions (NOW IN LUNAR STYLE) --- */}
                        {channels.length > 0 && (
                            <div className="mt-12 lunar-shell p-8 bg-slate-50 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Sparkles className="w-24 h-24 text-red-600" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-full bg-red-600/10 flex items-center justify-center border border-red-600/20">
                                            <Terminal className="w-5 h-5 text-red-600" />
                                        </div>
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">{AI_SUGGESTIONS[strategy].title}</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Model Rationale</span>
                                            <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                                {AI_SUGGESTIONS[strategy].why}
                                            </p>
                                        </div>
                                        <div className="bg-white/60 p-5 rounded-2xl border border-white shadow-sm">
                                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block mb-3 flex items-center gap-2">
                                                <Sparkles className="w-3 h-3" /> AI Optimization Suggestion
                                            </span>
                                            <p className="text-sm font-bold text-gray-800 leading-relaxed italic">
                                                "{AI_SUGGESTIONS[strategy].suggestion}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quick Metrics Cards */}
                        {channels.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-12 pt-8 border-t border-gray-100">
                                <div className="lunar-card p-6 flex flex-col justify-center">
                                    <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2 flex items-center gap-2">
                                        <BarChart4 className="w-4 h-4 text-red-500" /> Estimated Impressions
                                    </span>
                                    <span className="text-3xl font-black text-gray-900">{fInt(totals.tImps)}</span>
                                </div>

                                <div className="lunar-card p-6 flex flex-col justify-center">
                                    <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-red-500" /> Estimated Reach
                                    </span>
                                    <span className="text-3xl font-black text-gray-900">{fInt(totals.tReach)}</span>
                                    <span className="text-[9px] text-gray-400 font-bold mt-1 uppercase">Avg. Frequency: 1.8x</span>
                                </div>

                                <div className="lunar-card p-6 flex flex-col justify-center border-red-100 bg-red-50/10">
                                    <span className="text-[10px] uppercase tracking-widest font-black text-red-500 mb-2 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 animate-pulse" /> Estimated Conversions
                                    </span>
                                    <span className="text-3xl font-black text-gray-900">{fInt(totals.tConvs)}</span>
                                </div>

                                <div className="lunar-card p-6 flex flex-col justify-center bg-gray-50/30">
                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400 block mb-1">Blended CPM</span>
                                            <span className="text-xl font-black text-gray-800">{fCurrencyDec(totals.bCpm)}</span>
                                        </div>
                                        <div className="pt-2 border-t border-gray-100">
                                            <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400 block mb-1">Blended CPA</span>
                                            <span className="text-xl font-black text-gray-800">{fCurrencyDec(totals.bCpa)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- VISUALIZATIONS --- */}
                        {channels.length > 0 && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                                {/* Pie Chart */}
                                <div className="lunar-card flex flex-col pt-8 px-6 min-h-[450px]">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-red-500" /> Budget Allocation
                                    </h3>
                                    <div className="flex-grow w-full relative min-h-[300px]">
                                        {isMounted && typeof window !== 'undefined' && pieData.length > 0 && (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                                                    <Pie
                                                        data={pieData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={70}
                                                        outerRadius={110}
                                                        paddingAngle={2}
                                                        dataKey="value"
                                                        stroke="none"
                                                        isAnimationActive={true}
                                                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }: any) => {
                                                            const RADIAN = Math.PI / 180;
                                                            const radius = outerRadius * 1.25;
                                                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                            const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                                            return percent >= 0.05 ? (
                                                                <text x={x} y={y} fill="#64748b" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="0.75rem" fontWeight="600">
                                                                    {`${(percent * 100).toFixed(0)}% (${fCurrency(value)})`}
                                                                </text>
                                                            ) : null;
                                                        }}
                                                        labelLine={true}
                                                    >
                                                        {pieData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                                        ))}
                                                    </Pie>
                                                    <RechartsTooltip
                                                        formatter={(value: any) => fCurrency(Number(value))}
                                                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '10px' }}
                                                    />
                                                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        )}
                                    </div>
                                </div>

                                {/* Gantt Timeline */}
                                <div className="lunar-card p-8 min-h-[450px] overflow-hidden">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-red-500" /> Flight Timelines
                                    </h3>
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 w-full">
                                        {isMounted && channels.map(ch => {
                                            const chStart = new Date(ch.startDate).getTime();
                                            const chEnd = new Date(ch.endDate).getTime();

                                            // Calculate percentages for CSS
                                            // Prevent div-by-zero or negative duration issues
                                            const dur = globalDates.totalDuration > 0 ? globalDates.totalDuration : 1;

                                            // Guard against NaN
                                            if (isNaN(chStart) || isNaN(chEnd) || isNaN(globalDates.start)) return null;

                                            let leftPos = Math.max(0, ((chStart - globalDates.start) / dur) * 100);
                                            let widthPct = Math.max(1, ((chEnd - chStart) / dur) * 100);

                                            // Cap it
                                            if (leftPos > 100) leftPos = 100;
                                            if (leftPos + widthPct > 100) widthPct = 100 - leftPos;

                                            return (
                                                <div key={`tl-${ch.id}`} className="flex items-center gap-4 w-full">
                                                    <div className="w-24 shrink-0 text-right">
                                                        <span className="text-xs font-bold text-gray-700">{ch.type}</span>
                                                    </div>
                                                    <div
                                                        style={{ flex: '1 1 auto', width: '100%', minWidth: '150px', height: '24px', backgroundColor: '#f3f4f6', borderRadius: '9999px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}
                                                    >
                                                        <div
                                                            style={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                bottom: 0,
                                                                left: `${leftPos}%`,
                                                                width: `${widthPct}%`,
                                                                backgroundColor: getChannelColorHex(ch.type),
                                                                borderRadius: '9999px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                minWidth: '30px',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                        >
                                                            {widthPct > 15 && (
                                                                <span className="text-[10px] font-bold text-white px-2 truncate mix-blend-overlay">
                                                                    {Math.round((ch.budget / (totals.tBudget || 1)) * 100)}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div> {/* END LEFT COLUMN */}

                    {/* RIGHT COLUMN: Sidebar (AI Strategist) */}
                    <div className="space-y-8 sticky top-12 self-start h-fit">
                        <div className="lunar-shell p-8 bg-zinc-900 border-zinc-800 shadow-2xl relative overflow-hidden group min-h-[500px]">
                            {/* Decorative background element moved behind text and faded */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none scale-150">
                                <Sparkles className="w-64 h-64 text-white" strokeWidth={0.5} />
                            </div>
                            <div className="relative z-10 space-y-8">
                                <div>
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                                        <Target className="w-3 h-3 text-red-500" /> Strategic Analytics
                                    </h3>
                                    <div className="lunar-input-container p-1 group flex items-center focus-within:lunar-input-active min-h-[56px] bg-white/5 border-white/10">
                                        <select
                                            className="w-full bg-transparent text-white font-black px-4 py-2 outline-none appearance-none cursor-pointer text-sm"
                                            value={strategy}
                                            onChange={(e) => setStrategy(e.target.value as StrategyType)}
                                        >
                                            <option value="Brand Awareness" className="bg-zinc-900">Brand Awareness</option>
                                            <option value="Traffic & Engagement" className="bg-zinc-900">Traffic & Engagement</option>
                                            <option value="Direct ROI & Sales" className="bg-zinc-900">Direct ROI & Sales</option>
                                        </select>
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-4 italic">
                                        {STRATEGY_BRIEFS[strategy]}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={handleAIAllocate}
                                        className="w-full py-6 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 group/btn text-xs uppercase tracking-widest"
                                    >
                                        <TrendingUp className="w-4 h-4 transition-transform group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1" />
                                        AI Auto-Allocate
                                    </button>
                                    <div className="pt-8 border-t border-white/10 space-y-3">
                                        {/* Reset Matrix Button only */}


                                        <button
                                            onClick={() => {
                                                setChannels([]);
                                                setGrossInput('1000000');
                                                setGrossBudget(1000000);
                                                setFeeInput('15');
                                                setAgencyFee(15);
                                                const defaultStart = new Date().toISOString().split('T')[0];
                                                const defaultEnd = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                                                setCampaignStart(defaultStart);
                                                setCampaignEnd(defaultEnd);
                                                setStrategy('Brand Awareness');
                                            }}
                                            className="w-full py-4 rounded-xl border border-zinc-800 text-zinc-500 font-bold hover:bg-zinc-800 hover:text-white transition-all flex items-center justify-center text-[10px] uppercase tracking-widest active:scale-[0.98]"
                                        >
                                            <RotateCcw className="w-3 h-3 mr-2" /> Reset Matrix
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div> {/* END V9 GRID */}
            </div>
        </div>
    );
}

