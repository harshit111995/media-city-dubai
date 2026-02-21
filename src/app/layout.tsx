import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
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
      <head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NHN56LC7');`}} />
        {/* End Google Tag Manager */}
        {/* Google AdSense Script (Manual Placement in Head) */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4468459107811853" crossOrigin="anonymous"></script>
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NHN56LC7"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`}} />
        {/* End Google Tag Manager (noscript) */}
        <Header />
        <main className="min-h-screen" style={{ paddingTop: '100px' }}>
          {/* Force padding-top since Tailwind is missing */}
          {children}
        </main>
        <Footer />
        <CookieConsent />

        {/* Google Tracking Scripts */}
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}

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
