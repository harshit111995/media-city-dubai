import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import '@/styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Media City Dubai',
  description: 'The premier hub for media, adtech, and events in Dubai.',
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <body>
        <Header />
        <main className="min-h-screen" style={{ paddingTop: '120px' }}>
          {/* Force padding-top since Tailwind is missing */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
