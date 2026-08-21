import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TrendingNews from '@/components/TrendingNews'
import LatestNews from '@/components/LatestNews'
import LiveUpdatesBar from '@/components/LiveUpdatesBar'
import ScrollToTop from '@/components/ScrollToTop'
import { dummyTrendingNews, dummyLatestNews, dummyLiveUpdates } from '@/lib/dummyData'

// Attempt to fetch from Supabase, fallback to dummy data
async function getTrendingNews() {
  try {
    // const { getNews } = await import('@/lib/supabase')
    // const data = await getNews({ isTrending: true, limit: 5 })
    // if (data && data.length > 0) return data
    return dummyTrendingNews
  } catch {
    return dummyTrendingNews
  }
}

async function getLatestNews() {
  try {
    // const { getNews } = await import('@/lib/supabase')
    // const data = await getNews({ limit: 12 })
    // if (data && data.length > 0) return data
    return dummyLatestNews
  } catch {
    return dummyLatestNews
  }
}

async function fetchLiveUpdates() {
  try {
    return dummyLiveUpdates
  } catch {
    return dummyLiveUpdates
  }
}

export default async function HomePage() {
  const [trendingNews, latestNews, liveUpdates] = await Promise.all([
    getTrendingNews(),
    getLatestNews(),
    fetchLiveUpdates(),
  ])

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Trending News Section */}
        <section id="trending">
          <TrendingNews news={trendingNews} />
        </section>

        {/* Latest News Section */}
        <section id="latest">
          <LatestNews news={latestNews} />
        </section>

        {/* Live Updates & Categories */}
        <section id="live">
          <LiveUpdatesBar updates={liveUpdates} />
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </>
  )
}