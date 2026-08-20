import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreakingTicker from '@/components/BreakingTicker';

export const metadata = {
  title: 'आकाशवाणी स्पीकिंग | Akashvani Speaking - सच बोलने की आवाज़',
  description: 'हरियाणा और भारत की ताज़ा खबरें, ट्रेंडिंग न्यूज़, वीडियो और रील्स - आकाशवाणी स्पीकिंग पर पढ़ें सबसे पहले',
  keywords: 'Hindi News, Haryana News, Breaking News, Trending News, Akashvani Speaking, आकाशवाणी',
  openGraph: {
    title: 'आकाशवाणी स्पीकिंग',
    description: 'सच बोलने की आवाज़ - हरियाणा और भारत की ताज़ा खबरें',
    url: 'https://akashvanispeaking.news',
    siteName: 'Akashvani Speaking',
    locale: 'hi_IN',
    type: 'website',
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
  alternates: {
    canonical: 'https://akashvanispeaking.news',
  },
};

// Structured Data for AI Search + Google
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NewsMediaOrganization',
  name: 'आकाशवाणी स्पीकिंग',
  alternateName: 'Akashvani Speaking',
  url: 'https://akashvanispeaking.news',
  logo: 'https://akashvanispeaking.news/logo.png',
  sameAs: [
    'https://facebook.com/akashvanispeaking',
    'https://instagram.com/akashvanispeaking',
    'https://youtube.com/@akashvanispeaking',
    'https://twitter.com/akashvanispeak',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'info@akashvanispeaking.news',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi" dir="ltr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX" />
      </head>
      <body className="bg-gray-50 font-sans antialiased">
        <BreakingTicker />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}