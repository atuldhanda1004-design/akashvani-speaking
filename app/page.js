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

async function fetchLiveNewsCards() {
  // 4-5 latest news that are breaking / live updates style
  const breaking = await getNews({ isBreaking: true, limit: 5 })
  if (breaking?.length) return breaking

  // fallback: trending with live_updates, or first 5 dummy trending
  const trending = await getNews({ isTrending: true, limit: 5 })
  if (trending?.length) return trending

  return dummyTrendingNews.slice(0, 5)
}

async function fetchLiveList() {
  const data = await getLiveUpdates()
  if (data?.length) {
    return data.map((n) => ({
      id: n.id,
      time: new Date(n.published_at).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      headline: n.headline,
      slug: n.slug,
    }))
  }
  return dummyLiveUpdates
}

export default async function HomePage({ searchParams }) {
  const tab = searchParams?.tab || 'latest'

  const [trending, latest, liveCards, liveList] = await Promise.all([
    fetchTrending(),
    fetchLatest(),
    fetchLiveNewsCards(),
    fetchLiveList(),
  ])

  // Latest tab top carousel: live-update style news (4-5)
  // Prefer liveCards; ensure max 5
  const latestTabCarousel = (liveCards?.length ? liveCards : dummyTrendingNews).slice(0, 5)

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-4 min-h-[50vh]">
        {tab === 'live' ? (
          <>
            {/* Live Updates TAB: full trending carousel + live list */}
            <section id="trending">
              <TrendingNews
                news={trending}
                title="Trending / Live Update"
              />
            </section>
            <section id="live" className="mt-6">
              <LiveUpdatesBar updates={liveList} />
            </section>
          </>
        ) : (
          <>
            {/* Haryana Latest News TAB */}
            {/* 1) Top: same scroll/carousel UI as live updates — 4-5 live news */}
            <section id="latest-live-scroll">
              <TrendingNews
                news={latestTabCarousel}
                title="लाइव अपडेट"
              />
            </section>

            {/* 2) Below: Latest news cards */}
            <section id="latest" className="mt-8">
              <LatestNews news={latest} />
            </section>
          </>
        )}
      </main>

      <Footer />
      <ScrollToTop />
    </>
  )
}