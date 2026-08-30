import './globals.css'
import Script from 'next/script'
import { SITE_CONFIG } from '@/lib/constants'
import BottomNav from '@/components/BottomNav'

export const metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.developer?.name,
  publisher: SITE_CONFIG.name,
  openGraph: {
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    locale: 'hi_IN',
    type: 'website',
    images: [{ url: SITE_CONFIG.ogImage || '/logo.png', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico', apple: '/logo.png' },
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#30567D',
}

export default function RootLayout({ children }) {
  const oneSignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '0f47a4cc-753c-49bc-869c-da583a236cfc'
  const safariWebId = 'web.onesignal.auto.6401d2fc-b951-4213-a02c-03159c046b78'
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID || ''

  return (
    <html lang="hi">
      <head>
        {adsenseId ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        ) : null}

        {/* ===== OneSignal (same as their paste code, Next.js way) ===== */}
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="afterInteractive"
          defer
        />
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "${oneSignalAppId}",
                safari_web_id: "${safariWebId}",
                notifyButton: {
                  enable: true,
                },
                allowLocalhostAsSecureOrigin: true,
                autoResubscribe: true,
              });
            });
          `}
        </Script>
      </head>

      <body className="min-h-screen flex flex-col bg-brand-background pb-16 md:pb-0">
        {children}
        <BottomNav />
      </body>
    </html>
  )
}