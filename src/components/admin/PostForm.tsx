'use client';

import { useState } from 'react';
import { createPost, updatePost } from '@/app/actions';
import { Post } from '@prisma/client';

interface PostFormProps {
    post?: Post;
}

export default function PostForm({ post }: PostFormProps) {
    const action = post ? updatePost.bind(null, post.id) : createPost;
    const [preview, setPreview] = useState<string | null>(post?.headerImage || null);
    const [title, setTitle] = useState(post?.title || '');
    const [slug, setSlug] = useState(post?.slug || '');
    const [isAutoSlug, setIsAutoSlug] = useState(!post);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);

        if (isAutoSlug) {
            setSlug(
                newTitle
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '')
            );
        }
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlug(e.target.value);
        setIsAutoSlug(false);
    };

    return (
        <form action={action} className="space-y-4 bg-white p-6 rounded shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        name="title"
                        value={title}
                        onChange={handleTitleChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Slug</label>
                    <input
                        name="slug"
                        value={slug}
                        onChange={handleSlugChange}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Author</label>
                    <input
                        name="author"
                        defaultValue={post?.author}
                        required
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                        name="category"
                        defaultValue={post?.category || 'Industry News'}
                        className="w-full border p-2 rounded"
                    >
                        <option value="Industry News">Industry News</option>
                        <option value="Career Advice">Career Advice</option>
                        <option value="Tech Support">Tech Support</option>
                        <option value="General Discussion">General Discussion</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Tags</label>
                    <input
                        name="tags"
                        defaultValue={post?.tags || ''}
                        placeholder="Comma separated tags (e.g. AI, Future, Startup)"
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Published Date & Time</label>
                    <input
                        type="datetime-local"
                        name="publishedAt"
                        defaultValue={post?.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)}
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
                        {post?.headerImage && !preview?.startsWith('blob:') && (
                            <input type="hidden" name="headerImage" value={post.headerImage} />
                        )}
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Short Description</label>
                <textarea
                    name="shortDescription"
                    defaultValue={post?.shortDescription || ''}
                    className="w-full border p-2 rounded"
                    rows={2}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                    name="content"
                    defaultValue={post?.content}
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
                            defaultValue={post?.metaTitle || ''}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Meta Description</label>
                        <textarea
                            name="metaDescription"
                            defaultValue={post?.metaDescription || ''}
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
                {post ? 'Update Post' : 'Create Post'}
            </button>
        </form>
    );
}
