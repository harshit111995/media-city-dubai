'use client';

import { useState } from 'react';
import { createEvent, updateEvent } from '@/app/actions';
import { Event } from '@prisma/client';

interface EventFormProps {
    event?: Event;
}

export default function EventForm({ event }: EventFormProps) {
    const action = event ? updateEvent.bind(null, event.id) : createEvent;
    const [preview, setPreview] = useState<string | null>(event?.headerImage || null);

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
                        defaultValue={event?.title}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Slug</label>
                    <input
                        name="slug"
                        defaultValue={event?.slug}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Organizer</label>
                    <input
                        name="organizer"
                        defaultValue={event?.organizer}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                        name="category"
                        defaultValue={event?.category || 'Conference'}
                        className="w-full border p-2 rounded"
                    >
                        <option value="Conference">Conference</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Networking">Networking</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                        type="datetime-local"
                        name="date"
                        defaultValue={event?.date ? new Date(event.date).toISOString().slice(0, 16) : ''}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input
                        name="location"
                        defaultValue={event?.location}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Header Image</label>
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
                            name="headerImage"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full border p-2 rounded"
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload an image (JPG, PNG, WebP) or check console for S3 URL after save.</p>
                        {/* Fallback for keeping existing URL if no new file selected */}
                        {event?.headerImage && !preview?.startsWith('blob:') && (
                            <input type="hidden" name="headerImage" value={event.headerImage} />
                        )}
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Short Description</label>
                <textarea
                    name="shortDescription"
                    defaultValue={event?.shortDescription || ''}
                    className="w-full border p-2 rounded"
                    rows={2}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description (Content)</label>
                <textarea
                    name="description"
                    defaultValue={event?.description}
                    required
                    className="w-full border p-2 rounded font-mono"
                    rows={10}
                />
            </div>

            <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">SEO</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Meta Title</label>
                        <input
                            name="metaTitle"
                            defaultValue={event?.metaTitle || ''}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Meta Description</label>
                        <textarea
                            name="metaDescription"
                            defaultValue={event?.metaDescription || ''}
                            className="w-full border p-2 rounded"
                            rows={2}
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full md:w-auto"
            >
                {event ? 'Update Event' : 'Create Event'}
            </button>
        </form>
    );
}
