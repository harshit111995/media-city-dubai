import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <h1 className="text-9xl font-black text-gray-200 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Page Not Found</h2>
            <p className="text-gray-500 max-w-md mb-10 text-lg">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                    href="/"
                    className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                >
                    <Home size={18} /> Back to Home
                </Link>
                <Link 
                    href="/tools"
                    className="flex items-center gap-2 px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft size={18} /> Explore Tools
                </Link>
            </div>
        </div>
    );
}
