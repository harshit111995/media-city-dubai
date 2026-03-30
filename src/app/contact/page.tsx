import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contact Us | Media City Dubai - AdTech & Media Hub',
    description: 'Get in touch with Media City Dubai for advertising opportunities, partnerships, or technical support for our AdTech tools and KPI calculators.',
    alternates: {
        canonical: '/contact',
    },
    openGraph: {
        title: 'Contact Media City Dubai | AdTech & Media Support',
        description: 'Connect with the premier hub for media and tech professionals in Dubai. We are here to help your business grow.',
        url: 'https://mediacitydubai.com/contact',
        siteName: 'Media City Dubai',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: 'https://mediacitydubai.com/images/forum-minimalist.png',
                width: 1200,
                height: 630,
                alt: 'Contact Media City Dubai',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact Media City Dubai | AdTech & Media Support',
        description: 'Reach out to the Media City Dubai team for inquiries and support.',
        images: ['https://mediacitydubai.com/images/forum-minimalist.png'],
        site: '@mediacitydubai',
        creator: '@mediacitydubai',
    },
};

export default function ContactPage() {
    return (
        <div className="container py-20 max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Info Column */}
                <div>
                    <h1 className="text-5xl font-bold font-playfair mb-6 text-white leading-tight">
                        Let's Shape the Future of <span className="text-accent underline decoration-red-900/40">Media</span> Together.
                    </h1>
                    <p className="text-xl text-gray-400 mb-12 max-w-md leading-relaxed">
                        Have questions about our tools, upcoming events, or advertising in Dubai? Our team is standing by to assist you.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start gap-5 group">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Email Us</h3>
                                <p className="text-gray-400">General: contact@mediacitydubai.com</p>
                                <p className="text-gray-400">AdTech: tech@mediacitydubai.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5 group">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Our Location</h3>
                                <p className="text-gray-400">Innovation Hub, Building 1</p>
                                <p className="text-gray-400">Dubai Media City, UAE</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-5 group">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                                <Phone size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Call Us</h3>
                                <p className="text-gray-400">Mon-Fri: 9am - 6pm (GST)</p>
                                <p className="text-gray-400">+971 (0) 4 123 4567</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Column */}
                <div className="relative">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 blur-[100px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-900/10 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="glass-panel p-8 md:p-10 rounded-3xl relative z-10 border-white/5 shadow-2xl overflow-hidden group">
                        <div className="flex items-center gap-3 mb-8">
                            <MessageSquare className="text-accent" />
                            <h2 className="text-2xl font-bold">Send a Message</h2>
                        </div>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
