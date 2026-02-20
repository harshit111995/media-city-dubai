import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'About Us | Media City Dubai',
    description: 'Learn about the mission of Media City Dubai to connect and empower the region\'s media, tech, and creative professionals.',
};

export default function AboutPage() {
    return (
        <div className="container py-20 max-w-4xl text-center">
            <h1 className="text-5xl font-playfair font-bold text-gradient mb-8">
                Empowering Dubai's Media Ecosystem
            </h1>

            <div className="glass-panel p-8 md:p-12 rounded-2xl mb-12 text-left">
                <p className="text-lg leading-relaxed text-gray-300 mb-6">
                    Media City Dubai is a digital platform designed to bridge the gap between creative professionals,
                    technology providers, and industry events in the region.
                </p>
                <p className="text-lg leading-relaxed text-gray-300">
                    Our mission is to foster innovation and collaboration by providing a centralized hub for:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-300">
                    <li>Discovering cutting-edge <strong>AdTech & MarTech tools</strong>.</li>
                    <li>Connecting through a vibrant <strong>Community Forum</strong>.</li>
                    <li>Staying updated with the comprehensive <strong>Events Calendar</strong>.</li>
                </ul>
            </div>

            <Link href="/contact" className="btn-primary">
                Contact Us
            </Link>
        </div>
    );
}
