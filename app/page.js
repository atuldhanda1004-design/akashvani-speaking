import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TrendingNews from '@/components/TrendingNews'
import LatestNews from '@/components/LatestNews'
import LiveUpdatesBar from '@/components/LiveUpdatesBar'
import ScrollToTop from '@/components/ScrollToTop'
import { getNews, getLiveUpdates } from '@/lib/supabase'
import { dummyTrendingNews, dummyLatestNews, dummyLiveUpdates } from '@/lib/dummyData'

export const revalidate = 60 

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
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6 min-h-[50vh]">
        {/* Trending / Live Section */}
        <section id="trending">
          <TrendingNews news={trending} />
        </section>

        {/* Latest News Section */}
        <section id="latest" className="mt-8">
          <LatestNews news={latest} />
        </section>

        {/* Live Updates Section */}
        <section id="live" className="mt-8">
          <LiveUpdatesBar updates={live} />
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </>
  )
}