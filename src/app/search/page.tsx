import { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import { events } from '@/data/events';
import { tools } from '@/data/tools';
import { forumTopics } from '@/data/forum';
import styles from '@/styles/search.module.css';

interface Props {
    searchParams: {
        q?: string;
    };
}

export const metadata: Metadata = {
    title: 'Search Results | Media City Dubai',
    description: 'Search across events, tools, and forum discussions.',
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;
    const query = q?.toLowerCase() || '';

    if (!query) {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-3xl font-playfair mb-4">Search Media City Dubai</h1>
                <form action="/search" className="max-w-md mx-auto flex gap-2">
                    <input
                        type="text"
                        name="q"
                        placeholder="Search keywords..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent outline-none"
                    />
                    <button type="submit" className="btn-primary">Search</button>
                </form>
            </div>
        );
    }

    // Perform search across all data sources
    const matchedEvents = events.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query)
    );

    const matchedTools = tools.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
    );

    const matchedTopics = forumTopics.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.content.toLowerCase().includes(query)
    );

    const totalResults = matchedEvents.length + matchedTools.length + matchedTopics.length;

    return (
        <div className={styles.container}>
            <header className="mb-12">
                <h1 className="text-4xl font-playfair font-bold mb-2">
                    Search Results: <span className="text-accent">"{q}"</span>
                </h1>
                <p className="text-gray-400">Found {totalResults} results</p>
            </header>

            {totalResults === 0 && (
                <div className="text-center py-12 glass-panel rounded-xl">
                    <SearchIcon size={48} className="mx-auto text-gray-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2">No results found</h2>
                    <p className="text-gray-400">Try adjusting your search terms or browse our categories.</p>
                </div>
            )}

            {matchedTools.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-2xl font-playfair font-bold mb-6 flex items-center gap-2">
                        <span className="text-accent">Tools</span>
                        <span className="text-sm bg-white/10 px-2 py-0.5 rounded-full text-white">{matchedTools.length}</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matchedTools.map(tool => (
                            <Link href={`/tools/${tool.slug}`} key={tool.id} className="glass-panel p-6 rounded-xl hover:border-accent transition-colors block">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">{tool.name}</h3>
                                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">{tool.category}</span>
                                </div>
                                <p className="text-sm text-gray-400 line-clamp-2">{tool.shortDescription}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {matchedEvents.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-2xl font-playfair font-bold mb-6 flex items-center gap-2">
                        <span className="text-accent">Events</span>
                        <span className="text-sm bg-white/10 px-2 py-0.5 rounded-full text-white">{matchedEvents.length}</span>
                    </h2>
                    <div className="space-y-4">
                        {matchedEvents.map(event => (
                            <Link href={`/events/${event.slug}`} key={event.id} className="glass-panel p-6 rounded-xl hover:border-accent transition-colors block flex items-center justify-between group">
                                <div>
                                    <h3 className="font-bold text-lg group-hover:text-accent transition-colors">{event.title}</h3>
                                    <p className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
                                </div>
                                <ArrowRight className="text-gray-500 group-hover:text-accent opacity-0 group-hover:opacity-100 transition-all" />
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {matchedTopics.length > 0 && (
                <section className="mb-12">
                    <h2 className="text-2xl font-playfair font-bold mb-6 flex items-center gap-2">
                        <span className="text-accent">Forum Discussions</span>
                        <span className="text-sm bg-white/10 px-2 py-0.5 rounded-full text-white">{matchedTopics.length}</span>
                    </h2>
                    <div className="space-y-3">
                        {matchedTopics.map(topic => (
                            <Link href={`/forum/topic/${topic.slug}`} key={topic.id} className="block glass-panel p-4 rounded-lg hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs text-accent uppercase font-bold">{topic.category}</span>
                                    <span className="text-xs text-gray-500">• {new Date(topic.date).toLocaleDateString()}</span>
                                </div>
                                <h3 className="font-medium text-lg">{topic.title}</h3>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
