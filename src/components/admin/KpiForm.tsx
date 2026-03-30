'use client';

import { useState } from 'react';
import { createKpi, updateKpi } from '@/app/actions';
import { Kpi } from '@prisma/client';
import RichTextEditor from './RichTextEditor';

interface KpiFormProps {
    kpi?: Kpi;
}

export default function KpiForm({ kpi }: KpiFormProps) {
    const action = kpi ? updateKpi.bind(null, kpi.id) : createKpi;
    const [description, setDescription] = useState(kpi?.description || '');

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
                <label className="block text-sm font-medium mb-1">Description (Rich Editor)</label>
                <RichTextEditor 
                    content={description} 
                    onChange={setDescription} 
                    placeholder="Describe the metric, how to improve it, and what it measures..."
                />
                <input type="hidden" name="description" value={description} />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Example Usage (Optional)</label>
                <textarea
                    name="example"
                    defaultValue={kpi?.example || ''}
                    className="w-full border p-2 rounded text-gray-900"
                    rows={3}
                    placeholder="e.g. If your revenue is $1000 and cost is $500, your margin is 50%."
                />
            </div>

            <div className="pt-6 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-accent rounded-full" />
                    SEO & Meta Metadata
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">SEO Title</label>
                        <input
                            name="seoTitle"
                            defaultValue={kpi?.seoTitle || ''}
                            className="w-full border p-2 rounded text-gray-900 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
                            placeholder="Ideal for Google search results"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">SEO Description</label>
                        <input
                            name="seoDescription"
                            defaultValue={kpi?.seoDescription || ''}
                            className="w-full border p-2 rounded text-gray-900 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
                            placeholder="Short summary for search results"
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
