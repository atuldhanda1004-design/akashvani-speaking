import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NewsCard from '@/components/NewsCard'
import ScrollToTop from '@/components/ScrollToTop'
import { getNews } from '@/lib/supabase'
import { dummyTrendingNews, dummyLatestNews } from '@/lib/dummyData'

export const revalidate = 60

export const metadata = {
  title: 'सभी खबरें',
  description: 'Akashvani Speaking की सभी ताज़ा खबरें पढ़ें।',
}

export default async function AllNewsPage() {
  const data = await getNews({ limit: 50 })
  const allNews = data?.length ? data : [...dummyTrendingNews, ...dummyLatestNews]

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="section-title mb-6">सभी खबरें</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {allNews.map((news, i) => <NewsCard key={news.id} news={news} index={i} />)}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}