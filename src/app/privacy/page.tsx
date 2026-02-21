import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy | Media City Dubai',
    description: 'Privacy Policy explaining how we collect and use your data.',
};

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl pt-32">
            <Link href="/" className="inline-flex items-center gap-2 text-accent mb-8 hover:underline font-medium">
                <ArrowLeft size={20} /> Back to Home
            </Link>

            <article className="prose prose-invert prose-lg max-w-none">
                <h1 className="text-4xl md:text-5xl font-playfair mb-8 text-gradient">Privacy Policy</h1>

                <p className="text-gray-300 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-white">1. Information We Collect</h2>
                    <p className="text-gray-300">
                        We collect information you provide directly to us. For example, we collect information when you create an account, subscribe to a newsletter, participate in our interactive features (like the forum), or otherwise communicate with us. The types of information we may collect include your name, email address, password, postal address, and other contact or identifying information.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-white">2. How We Use Information</h2>
                    <p className="text-gray-300">
                        We may use the information we collect to provide, maintain, and improve our services, develop new services, and protect Media City Dubai and our users. We may also use the information to communicate with you about products, services, offers, promotions, and events.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-white">3. Information Sharing</h2>
                    <p className="text-gray-300">
                        We do not share your personal information with third parties without your consent, other than with third-party vendors, consultants and other service providers who need access to such information to carry out work on our behalf.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-white">4. Security</h2>
                    <p className="text-gray-300">
                        We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-white">5. Cookies</h2>
                    <p className="text-gray-300">
                        We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                    </p>
                </section>

            </article>
        </div>
    );
}
