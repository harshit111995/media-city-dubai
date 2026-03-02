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
        {/* Organization Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Media City Dubai',
              url: 'https://mediacitydubai.com',
              logo: 'https://mediacitydubai.com/images/forum-minimalist.png', // Fallback logo representation
              sameAs: [
                'https://mediacitydubai.com'
              ],
            }),
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
        <GoogleTagManager gtmId="GTM-NHN56LC7" />

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
