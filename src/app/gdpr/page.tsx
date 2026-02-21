import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'GDPR Compliance | Media City Dubai',
    description: 'Information regarding Media City Dubai compliance with the General Data Protection Regulation (GDPR).',
};

export default function GDPRPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl pt-32">
            <Link href="/" className="inline-flex items-center gap-2 text-accent mb-8 hover:underline font-medium">
                <ArrowLeft size={20} /> Back to Home
            </Link>

            <article className="prose prose-invert prose-lg max-w-none">
                <h1 className="text-4xl md:text-5xl font-playfair mb-8 text-gradient">GDPR Compliance</h1>

                <p className="text-gray-300 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
                    <p className="text-gray-300">
                        At Media City Dubai, we are committed to protecting your privacy and ensuring that your personal data is handled in a safe and responsible manner. This policy outlines how we comply with the General Data Protection Regulation (GDPR).
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-white">2. Data Collection and Processing</h2>
                    <p className="text-gray-300">
                        We process personal data only when we have a lawful basis to do so. This includes your consent, the necessity of processing for the performance of a contract, compliance with legal obligations, and our legitimate interests.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-white">3. Your Rights Under GDPR</h2>
                    <p className="text-gray-300">
                        Under the GDPR, you have the following rights regarding your personal data:
                    </p>
                    <ul className="text-gray-300 list-disc pl-6 mb-4">
                        <li className="mb-2">The right to be informed about how your data is being used.</li>
                        <li className="mb-2">The right to access the personal data we hold about you.</li>
                        <li className="mb-2">The right to request the correction of inaccurate personal data.</li>
                        <li className="mb-2">The right to request the erasure of your personal data (the "right to be forgotten").</li>
                        <li className="mb-2">The right to restrict processing of your personal data.</li>
                        <li className="mb-2">The right to data portability.</li>
                        <li className="mb-2">The right to object to the processing of your personal data.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Security</h2>
                    <p className="text-gray-300">
                        We have implemented appropriate technical and organizational measures to ensure a level of security appropriate to the risk, protecting your personal data against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-white">5. Contact Us</h2>
                    <p className="text-gray-300">
                        If you have any questions or concerns about our GDPR compliance or wish to exercise your rights, please contact us at <a href="mailto:contact@mediacitydubai.com" className="text-accent hover:underline">contact@mediacitydubai.com</a>.
                    </p>
                </section>
            </article>
        </div>
    );
}
