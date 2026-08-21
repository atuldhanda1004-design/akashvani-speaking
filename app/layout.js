import './globals.css';

export const metadata = {
  title: 'Akashvani Speaking | सच बोलने की आवाज़',
  description: 'Akashvani Speaking - हरियाणा और भारत की ताज़ा खबरें, Live Updates, Breaking News',
  keywords: 'Akashvani Speaking, Hindi News, Haryana News, Breaking News, Live Updates',
  openGraph: {
    title: 'Akashvani Speaking',
    description: 'सच बोलने की आवाज़',
    url: 'https://akashvanispeaking.news',
    siteName: 'Akashvani Speaking',
    locale: 'hi_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NewsMediaOrganization',
  name: 'Akashvani Speaking',
  url: 'https://akashvanispeaking.news',
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#f5f5f5] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}