import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import styles from '@/styles/admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const [posts, events, tools] = await Promise.all([
        prisma.post.findMany({ orderBy: { createdAt: 'desc' } }),
        prisma.event.findMany({ orderBy: { createdAt: 'desc' } }),
        prisma.tool.findMany({ orderBy: { createdAt: 'desc' } })
    ]);

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">CMS Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Posts Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Posts</h2>
                        <Link href="/admin/posts/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Create Post
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <div key={post.id} className="border-b pb-2 flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium">{post.title}</h3>
                                    <span className="text-sm text-gray-500">{post.category}</span>
                                </div>
                                <div className="space-x-2">
                                    <Link href={`/admin/posts/${post.id}`} className="text-blue-600 hover:underline">
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {posts.length === 0 && <p className="text-gray-500">No posts found.</p>}
                    </div>
                </div>

                {/* Events Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Events</h2>
                        <Link href="/admin/events/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Create Event
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {events.map((event) => (
                            <div key={event.id} className="border-b pb-2 flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium">{event.title}</h3>
                                    <span className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="space-x-2">
                                    <Link href={`/admin/events/${event.id}`} className="text-blue-600 hover:underline">
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {events.length === 0 && <p className="text-gray-500">No events found.</p>}
                    </div>
                </div>

                {/* Tools Section */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Tools</h2>
                        <Link href="/admin/tools/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Create Tool
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {tools.map((tool) => (
                            <div key={tool.id} className="border-b pb-2 flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium">{tool.title}</h3>
                                    <span className="text-sm text-gray-500">{tool.category}</span>
                                </div>
                                <div className="space-x-2">
                                    <Link href={`/admin/tools/${tool.id}`} className="text-blue-600 hover:underline">
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {tools.length === 0 && <p className="text-gray-500">No tools found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
