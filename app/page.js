import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LiveTicker from '@/components/LiveTicker'
import TrendingNews from '@/components/TrendingNews'
import LatestNews from '@/components/LatestNews'
import LiveUpdatesBar from '@/components/LiveUpdatesBar'
import ScrollToTop from '@/components/ScrollToTop'
import { getNews, getLiveUpdates } from '@/lib/supabase'
import { dummyTrendingNews, dummyLatestNews, dummyLiveUpdates } from '@/lib/dummyData'

export const revalidate = 60 // ISR - regenerate every 60 seconds

async function fetchTrending() {
  const data = await getNews({ isTrending: true, limit: 5 })
  return data?.length ? data : dummyTrendingNews
}

async function fetchLatest() {
  const data = await getNews({ limit: 12 })
  return data?.length ? data : dummyLatestNews
}

async function fetchLive() {
  const data = await getLiveUpdates()
  if (data?.length) {
    return data.map((n) => ({
      id: n.id,
      time: new Date(n.published_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      headline: n.headline,
      slug: n.slug,
    }))
  }
  return dummyLiveUpdates
}

export default async function HomePage() {
  const [trending, latest, live] = await Promise.all([
    fetchTrending(),
    fetchLatest(),
    fetchLive(),
  ])

  return (
    <>
      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsMediaOrganization',
      name: 'Akashvani Speaking',
      url: 'https://akashvanispeaking.news',
      logo: 'https://akashvanispeaking.news/logo.png',
      sameAs: [
        'https://www.youtube.com/@akashvanispeaking',
        'https://www.instagram.com/akashvanispeaking',
        'https://www.facebook.com/akashvanispeaking',
        'https://x.com/AkashvaniSpeak',
      ],
      foundingDate: '2024',
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'Haryana',
        addressCountry: 'IN',
      },
    }),
  }}
/>
      <Header />
      <LiveTicker updates={live} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <section id="trending"><TrendingNews news={trending} /></section>
        <section id="latest"><LatestNews news={latest} /></section>
        <section id="live"><LiveUpdatesBar updates={live} /></section>
      </main>

      <Footer />
      <ScrollToTop />
    </>
  )
}