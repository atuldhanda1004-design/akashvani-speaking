import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TrendingNews from '@/components/TrendingNews'
import LatestNews from '@/components/LatestNews'
import VideoNews from '@/components/VideoNews'
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

async function fetchVideoNews() {
  const data = await getNews({ limit: 30 })
  const all = data?.length ? data : [...dummyTrendingNews, ...dummyLatestNews]
  return all.filter((n) => n.video_url)
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
  const [trending, latest, videoNews, liveList] = await Promise.all([
    fetchTrending(),
    fetchLatest(),
    fetchVideoNews(),
    fetchLiveList(),
  ])

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-4 min-h-[50vh]">
        {tab === 'live' ? (
          <>
            <TrendingNews
              news={trending}
              title="Trending / Live Updates"
              layout="stacked"
            />
            <LiveUpdatesBar updates={liveList} />
          </>
        ) : (
          <>
            <TrendingNews
              news={(trending || []).slice(0, 5)}
              title="Trending / Live Updates"
              layout="carousel"
            />
            <LatestNews news={latest} />
            <VideoNews news={videoNews} />
          </>
        )}
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}