import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Disclaimer | Media City Dubai',
    description: 'Legal disclaimer for Media City Dubai.',
};

export default function DisclaimerPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl pt-32">
            <Link href="/" className="inline-flex items-center gap-2 text-accent mb-8 hover:underline font-medium">
                <ArrowLeft size={20} /> Back to Home
            </Link>

            <article className="prose prose-invert prose-lg max-w-none">
                <h1 className="text-4xl md:text-5xl font-playfair mb-8 text-gradient">Disclaimer</h1>

                <p className="text-gray-300 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-white">General Information</h2>
                    <p className="text-gray-300">
                        The information provided by Media City Dubai on our website is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-white">External Links</h2>
                    <p className="text-gray-300">
                        The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability or completeness by us.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Professional Advice</h2>
                    <p className="text-gray-300">
                        The Site cannot and does not contain professional media or technical advice. The media and technology information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-white">User Generated Content</h2>
                    <p className="text-gray-300">
                        Any views or opinions represented in the community forums belong solely to the original authors and do not necessarily represent those of Media City Dubai. We assume no responsibility or liability for any errors or omissions in the content of the forums.
                    </p>
                </section>
            </article>
        </div>
    );
}
