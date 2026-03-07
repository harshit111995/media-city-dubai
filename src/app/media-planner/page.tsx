import MediaPlannerClient from '@/components/MediaPlannerClient';
import '@/styles/kpi.css';
import '@/styles/media-planner.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Programmatic Media Planner | Media City Dubai',
    description: 'Dynamically allocate budget across digital channels to project impressions, clicks, and conversions.',
};

export default function MediaPlannerPage() {
    return (
        <div className="lunar-bg min-h-screen pt-12 pb-24">
            <div className="max-w-[1400px] mx-auto w-full px-4">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4 uppercase">
                        Programmatic Media Planner
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto font-medium">
                        Distribute your campaign budget across programmatic channels to instantly forecast impressions, clicks, blended CPA, and total conversions.
                    </p>
                </div>

                <MediaPlannerClient />
            </div>
        </div>
    );
}
