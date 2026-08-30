import './globals.css'
import Script from 'next/script'
import { SITE_CONFIG } from '@/lib/constants'
import BottomNav from '@/components/BottomNav'

import WelcomePopup from '@/components/WelcomePopup'

export const metadata = {
  metadataBase: new URL(SITE_CONFIG.url || 'https://www.akashvanispeaking.news'),
  title: {
    default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.developer?.name,
  publisher: SITE_CONFIG.name,
  facebook: {
    appId: '966242223397117',
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  other: {
    'google-adsense-account': process.env.NEXT_PUBLIC_ADSENSE_ID || '',
  },
  openGraph: {
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: 'hi_IN',
    type: 'website',
    images: [
      {
        url: `${SITE_CONFIG.url}/logo.png`,
        width: 512,
        height: 512,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [`${SITE_CONFIG.url}/logo.png`],
  },
  robots: { index: true, follow: true },
  // IMPORTANT: your logo, not Vercel default
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.png', type: 'image/png', sizes: '32x32' },
      { url: '/logo.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/logo.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#30567D',
}

export default function RootLayout({ children }) {
  const oneSignalAppId =
    process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '0f47a4cc-753c-49bc-869c-da583a236cfc'
  const safariWebId = 'web.onesignal.auto.6401d2fc-b951-4213-a02c-03159c046b78'
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || ''

  return (
    <html lang="hi">
      <head>
        {/* Explicit icons (extra safety against Vercel default) */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />

        {adsenseId ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}

        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="afterInteractive"
        />
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function (OneSignal) {
              await OneSignal.init({
                appId: "${oneSignalAppId}",
                safari_web_id: "${safariWebId}",
                serviceWorkerPath: "/OneSignalSDKWorker.js",
                serviceWorkerParam: { scope: "/" },
                allowLocalhostAsSecureOrigin: true,
                notifyButton: { enable: false },
                promptOptions: {
                  slidedown: {
                    prompts: [{
                      type: "push",
                      autoPrompt: false
                    }]
                  }
                }
              });
            });
          `}
        </Script>
      </head>

      <body className="min-h-screen flex flex-col bg-brand-background pb-16 md:pb-0">
        {children}
        <WelcomePopup />
        
        <BottomNav />
      </body>
    </html>
  )
}