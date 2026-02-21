import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Terms and Conditions | Media City Dubai',
    description: 'Terms and conditions for using the Media City Dubai platform.',
};

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl pt-32">
            <Link href="/" className="inline-flex items-center gap-2 text-accent mb-8 hover:underline font-medium">
                <ArrowLeft size={20} /> Back to Home
            </Link>

            <article className="prose prose-invert prose-lg max-w-none">
                <h1 className="text-4xl md:text-5xl font-playfair mb-8 text-gradient">Terms & Conditions</h1>

                <p className="text-gray-300 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
                    <p className="text-gray-300">
                        Welcome to Media City Dubai. By accessing our website, you agree to be bound by these Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-white">2. Use License</h2>
                    <p className="text-gray-300">
                        Permission is granted to temporarily download one copy of the materials (information or software) on Media City Dubai's website for personal, non-commercial transitory viewing only.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-white">3. User Content</h2>
                    <p className="text-gray-300">
                        In these Terms and Conditions, "User Content" shall mean any audio, video text, images or other material you choose to display on this Website via the community forum. By displaying User Content, you grant Media City Dubai a non-exclusive, worldwide irrevocable, sub-licensable license to use, reproduce, adapt, publish, translate and distribute it.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-white">4. Disclaimer</h2>
                    <p className="text-gray-300">
                        The materials on Media City Dubai's website are provided on an 'as is' basis. Media City Dubai makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-white">5. Governing Law</h2>
                    <p className="text-gray-300">
                        These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                    </p>
                </section>
            </article>
        </div>
    );
}
