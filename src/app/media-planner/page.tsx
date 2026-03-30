import MediaPlannerClient from '@/components/MediaPlannerClient';
import '@/styles/kpi.css';
import '@/styles/media-planner.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Programmatic Media Planner | Media City Dubai',
    description: 'Dynamically allocate budget across digital channels to project impressions, clicks, and conversions in Dubai.',
    alternates: {
        canonical: '/media-planner',
    },
    openGraph: {
        title: 'Programmatic Media Planner | Media City Dubai',
        description: 'Forecast your campaign performance across 9+ digital channels with our free planning tool.',
        url: 'https://mediacitydubai.com/media-planner',
        siteName: 'Media City Dubai',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: 'https://mediacitydubai.com/images/forum-minimalist.png',
                width: 1200,
                height: 630,
                alt: 'Programmatic Media Planner',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Programmatic Media Planner | Media City Dubai',
        description: 'Interactive budgeting and forecasting for media professionals.',
        images: ['https://mediacitydubai.com/images/forum-minimalist.png'],
        site: '@mediacitydubai',
        creator: '@mediacitydubai',
    },
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
