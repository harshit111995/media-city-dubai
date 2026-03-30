import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import Script from 'next/script';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import '@/styles/globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mediacitydubai.com'),
  title: {
    default: 'Media City Dubai | Premier AdTech Hub & Events Directory',
    template: '%s | Media City Dubai',
  },
  description: 'Explore the leading hub for media, adtech, and marketing in Dubai. Discover 200+ marketing tools, 30+ KPI calculators, and upcoming industry events.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Media City Dubai | AdTech, Tools & Events Hub',
    description: 'The premier digital destination for media professionals in Dubai. Access 200+ marketing tools, 30+ KPI calculators, and the latest industry news.',
    url: 'https://mediacitydubai.com',
    siteName: 'Media City Dubai',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://mediacitydubai.com/images/forum-minimalist.png',
        width: 1200,
        height: 630,
        alt: 'Media City Dubai Hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Media City Dubai | AdTech & Media Hub',
    description: 'Your central resource for marketing tools, events, and performance metrics in Dubai.',
    images: ['https://mediacitydubai.com/images/forum-minimalist.png'],
    site: '@mediacitydubai',
    creator: '@mediacitydubai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <body suppressHydrationWarning>
        <GoogleTagManager gtmId="GTM-NHN56LC7" />
        {/* Organization + WebSite Schema — site-wide structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                '@id': 'https://mediacitydubai.com/#organization',
                name: 'Media City Dubai',
                url: 'https://mediacitydubai.com',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://mediacitydubai.com/images/forum-minimalist.png',
                },
                image: 'https://mediacitydubai.com/images/forum-minimalist.png',
                description: 'The premier digital hub for media, adtech, and events in Dubai — connecting media professionals, creative agencies, and technology providers across the MENA region.',
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: 'Dubai Media City',
                  addressLocality: 'Dubai',
                  addressCountry: 'AE',
                },
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'customer support',
                  email: 'contact@mediacitydubai.com',
                  url: 'https://mediacitydubai.com/contact',
                },
                sameAs: [
                  'https://mediacitydubai.com',
                ],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                '@id': 'https://mediacitydubai.com/#website',
                url: 'https://mediacitydubai.com',
                name: 'Media City Dubai',
                description: 'The premier hub for media, adtech, and events in Dubai.',
                publisher: { '@id': 'https://mediacitydubai.com/#organization' },
                potentialAction: {
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate: 'https://mediacitydubai.com/search?q={search_term_string}',
                  },
                  'query-input': 'required name=search_term_string',
                },
              },
            ]),
          }}
        />

        <Header />
        <main className="min-h-screen" style={{ paddingTop: '100px' }}>
          {/* Force padding-top since Tailwind is missing */}
          {children}
        </main>
        <Footer />
        <CookieConsent />

        {/* Google Tracking Scripts */}
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}

        {/* Google AdSense Script */}
        <Script
          id="google-adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4468459107811853"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Microsoft Clarity Script */}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
                  (function(c,l,a,r,i,t,y){
                      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                  })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
              `}
          </Script>
        )}

        {/* Microsoft PubCenter Script */}
        {process.env.NEXT_PUBLIC_PUBCENTER_ID && (
          <Script
            id="microsoft-pubcenter"
            strategy="afterInteractive"
            src={`https://ads.microsoft.com/pubcenter/js/pubcenter.js?id=${process.env.NEXT_PUBLIC_PUBCENTER_ID}`}
          />
        )}
      </body>
    </html>
  );
}
