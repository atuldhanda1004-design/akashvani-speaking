import './globals.css'

export const metadata = {
  title: 'Akashvani Speaking | ईमानदार सोच - सच्ची खबरें',
  description: 'हरियाणा की सबसे तेज़ और विश्वसनीय हिंदी न्यूज़ पोर्टल। ताज़ा खबरें, लाइव अपडेट, ट्रेंडिंग न्यूज़ - पॉइंट टू पॉइंट।',
  keywords: 'Akashvani Speaking, हरियाणा न्यूज़, Hindi News, Haryana Latest News, Breaking News, Live Updates',
  authors: [{ name: 'Akashvani Speaking' }],
  creator: 'Revonic Private Limited',
  publisher: 'Akashvani Speaking',
  openGraph: {
    title: 'Akashvani Speaking | ईमानदार सोच - सच्ची खबरें',
    description: 'हरियाणा की सबसे तेज़ और विश्वसनीय हिंदी न्यूज़ पोर्टल।',
    url: 'https://akashvanispeaking.news',
    siteName: 'Akashvani Speaking',
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Akashvani Speaking',
    description: 'हरियाणा की सबसे तेज़ और विश्वसनीय हिंदी न्यूज़ पोर्टल।',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://akashvanispeaking.news'),
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1a237e',
}

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Yantramanav:wght@300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX" />
      </head>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}