'use client';

import { useEffect } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle size={40} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-500 max-w-md mb-10 text-lg">
                We encountered an unexpected error. Our team has been notified and we are working to fix it.
            </p>
            
            <button
                onClick={() => reset()}
                className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-colors shadow-lg"
            >
                <RotateCcw size={18} /> Try Again
            </button>
        </div>
    );
}
