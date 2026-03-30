'use client';

import { useState } from 'react';
import { createTool, updateTool } from '@/app/actions';
import { Tool } from '@prisma/client';
import RichTextEditor from './RichTextEditor';

interface ToolFormProps {
    tool?: Tool;
}

export default function ToolForm({ tool }: ToolFormProps) {
    const action = tool ? updateTool.bind(null, tool.id) : createTool;
    const [preview, setPreview] = useState<string | null>(tool?.imageUrl || null);
    const [description, setDescription] = useState(tool?.description || '');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <form action={action} encType="multipart/form-data" className="space-y-4 bg-white p-6 rounded shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        name="title"
                        defaultValue={tool?.title}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Slug</label>
                    <input
                        name="slug"
                        defaultValue={tool?.slug}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">URL (Link to Tool)</label>
                    <input
                        name="url"
                        defaultValue={tool?.url}
                        required
                        type="url"
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                        name="category"
                        defaultValue={tool?.category || 'AI Tools'}
                        className="w-full border p-2 rounded"
                    >
                        <option value="AI Tools">AI Tools</option>
                        <option value="AdTech">AdTech</option>
                        <option value="MarTech">MarTech</option>
                        <option value="Content Creation">Content Creation</option>
                        <option value="Analytics">Analytics</option>
                    </select>
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
                <label className="block text-sm font-medium mb-2 text-gray-700">Image / Logo</label>
                <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    {preview && (
                        <div className="w-24 h-24 rounded-lg border border-white/10 overflow-hidden relative shadow-md">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="flex-1">
                        <input
                            type="file"
                            name="imageUrlFile"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer"
                        />
                        <p className="text-xs text-gray-400 mt-2 italic">PNG or JPG recommended. Square aspect ratio works best.</p>
                        {preview && !preview.startsWith('blob:') && (
                            <input type="hidden" name="imageUrl" value={preview} />
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
                <label className="block text-sm font-medium mb-3 text-gray-700">Detailed Description (Rich Text)</label>
                <RichTextEditor 
                    content={description} 
                    onChange={setDescription} 
                    placeholder="Describe the tool, its benefits, and how to use it..."
                />
                <input type="hidden" name="description" value={description} />
            </div>

            <div className="pt-6 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-accent rounded-full" />
                    Tool Breakdown & Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Pricing / Business Model</label>
                        <input
                            name="pricing"
                            defaultValue={tool?.pricing || ''}
                            className="w-full border p-2 rounded text-gray-900 placeholder:text-gray-400"
                            placeholder="e.g. Free, $10/mo, Freemium"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Key Features</label>
                        <input
                            name="features"
                            defaultValue={tool?.features?.join(', ') || ''}
                            className="w-full border p-2 rounded text-gray-900 placeholder:text-gray-400"
                            placeholder="Comma separated: Analytics, AI Video, 4K Export"
                        />
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tight">Separated by comma ( , )</p>
                    </div>
                </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
                <button
                    type="submit"
                    className="btn-primary w-full md:w-auto px-10 py-3 rounded-xl shadow-lg transition-transform active:scale-95"
                >
                    {tool ? 'Update Tool Details' : 'Publish New Tool'}
                </button>
            </div>
        </form>
    );
}
