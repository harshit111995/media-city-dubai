'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '@/styles/tools.module.css';

import { Tool } from '@prisma/client';

interface ToolsListProps {
    tools: Tool[];
}

export default function ToolsList({ tools }: ToolsListProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

    const [selectedLetter, setSelectedLetter] = useState<string>('All');
    const itemsPerPage = 12;

    // Filter Logic
    const filteredTools = tools.filter((tool) => {
        if (selectedLetter === 'All') return true;
        const firstChar = tool.title.charAt(0).toUpperCase();
        if (selectedLetter === '#') return /^\d/.test(firstChar);
        return firstChar === selectedLetter;
    }).sort((a, b) => a.title.localeCompare(b.title));

    // Pagination Logic
    const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTools = filteredTools.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleImageError = (id: string) => {
        setFailedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(id);
            return newSet;
        });
    };

    return (
        <>

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <span className="text-gray-400 text-sm">Showing {filteredTools.length} Tools</span>

                <div className="flex flex-wrap gap-2 justify-center">
                    {['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')].map((char) => (
                        <button
                            key={char}
                            onClick={() => {
                                setSelectedLetter(char);
                                setCurrentPage(1);
                            }}
                            className={`w-8 h-8 flex items-center justify-center text-sm font-medium transition-colors ${selectedLetter === char
                                ? 'text-accent font-bold border-b-2 border-accent'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {char}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.grid}>
                {currentTools.map((tool) => (
                    <Link href={`/tools/${tool.slug}`} key={tool.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center font-bold text-xl text-accent overflow-hidden relative">
                                {tool.imageUrl ? (
                                    <>
                                        {!failedImages.has(tool.id) && (
                                            <Image
                                                src={tool.imageUrl}
                                                alt={tool.title}
                                                fill
                                                className="object-contain p-2 z-10"
                                                onError={() => handleImageError(tool.id)}
                                                sizes="48px"
                                            />
                                        )}
                                        <span className={`absolute inset-0 flex items-center justify-center z-0 ${!failedImages.has(tool.id) ? 'opacity-0' : 'opacity-100'}`}>
                                            {tool.title.substring(0, 2)}
                                        </span>
                                    </>
                                ) : (
                                    tool.title.substring(0, 2)
                                )}
                            </div>
                            <div className="text-right">
                                <span className={styles.categoryTag}>{tool.category}</span>
                            </div>
                        </div>

                        <h2 className={styles.cardTitle}>{tool.title}</h2>
                        <p className={styles.shortDesc}>{tool.description.substring(0, 80)}...</p>

                        <div className={styles.cardFooter}>
                            <span className="text-sm font-medium text-gray-400 group-hover:text-accent transition-colors">View Details</span>
                            <ChevronRight className="text-accent" size={20} />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12 mb-8">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-full border border-gray-200 hover:border-accent hover:text-accent transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <span className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-full border border-gray-200 hover:border-accent hover:text-accent transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            )}
        </>
    );
}
