'use client';

import { useState } from 'react';
import { createTool, updateTool } from '@/app/actions';
import { Tool } from '@prisma/client';

interface ToolFormProps {
    tool?: Tool;
}

export default function ToolForm({ tool }: ToolFormProps) {
    const action = tool ? updateTool.bind(null, tool.id) : createTool;
    const [preview, setPreview] = useState<string | null>(tool?.imageUrl || null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <form action={action} className="space-y-4 bg-white p-6 rounded shadow">
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

            <div>
                <label className="block text-sm font-medium mb-1">Image / Logo</label>
                <div className="flex items-center gap-4">
                    {preview && (
                        <div className="w-24 h-24 rounded border overflow-hidden relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="flex-1">
                        <input
                            type="file"
                            name="imageUrl"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full border p-2 rounded"
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload a tool logo or screenshot.</p>
                        {tool?.imageUrl && !preview?.startsWith('blob:') && (
                            <input type="hidden" name="imageUrl" value={tool.imageUrl} />
                        )}
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                    name="description"
                    defaultValue={tool?.description}
                    required
                    className="w-full border p-2 rounded"
                    rows={4}
                />
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full md:w-auto"
            >
                {tool ? 'Update Tool' : 'Create Tool'}
            </button>
        </form>
    );
}
