'use client';

import { useState } from 'react';
import { createKpi, updateKpi } from '@/app/actions';
import { Kpi } from '@prisma/client';

interface KpiFormProps {
    kpi?: Kpi;
}

export default function KpiForm({ kpi }: KpiFormProps) {
    const action = kpi ? updateKpi.bind(null, kpi.id) : createKpi;

    // We store the dynamic fields config as a string in the DB.
    // E.g., [{"name": "revenue", "label": "Total Revenue", "type": "currency"}]
    const defaultFields = kpi?.fields || '[\n  {"name": "revenue", "label": "Total Revenue", "type": "currency"}\n]';

    return (
        <form action={action} className="space-y-4 bg-white p-6 rounded shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        name="title"
                        defaultValue={kpi?.title}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Slug</label>
                    <input
                        name="slug"
                        defaultValue={kpi?.slug}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                        name="category"
                        defaultValue={kpi?.category || 'Marketing'}
                        className="w-full border p-2 rounded"
                    >
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="Finance">Finance</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Formula String</label>
                    <input
                        name="formula"
                        defaultValue={kpi?.formula}
                        required
                        className="w-full border p-2 rounded"
                        placeholder="e.g. (revenue - cost) / revenue"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Input Fields (JSON Array)</label>
                <textarea
                    name="fields"
                    defaultValue={defaultFields}
                    required
                    className="w-full border p-2 rounded font-mono text-sm leading-tight"
                    rows={6}
                    placeholder='[{"name": "revenue", "label": "Revenue", "type": "currency"}]'
                />
                <p className="text-xs text-gray-500 mt-1">
                    Define the inputs needed for the formula. Must be valid JSON. Supported types: <code>number</code>, <code>currency</code>, <code>percentage</code>.
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Short Description</label>
                <textarea
                    name="description"
                    defaultValue={kpi?.description}
                    required
                    className="w-full border p-2 rounded"
                    rows={4}
                />
            </div>

            <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">SEO Elements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">SEO Title</label>
                        <input
                            name="seoTitle"
                            defaultValue={kpi?.seoTitle || ''}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">SEO Description</label>
                        <input
                            name="seoDescription"
                            defaultValue={kpi?.seoDescription || ''}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full md:w-auto"
            >
                {kpi ? 'Update KPI Calculator' : 'Create KPI Calculator'}
            </button>
        </form>
    );
}
