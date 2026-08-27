import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NewsCard from '@/components/NewsCard'
import ScrollToTop from '@/components/ScrollToTop'
import { getNews } from '@/lib/supabase'
import { dummyTrendingNews, dummyLatestNews, dummyCategories } from '@/lib/dummyData'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const category = dummyCategories.find((c) => c.slug === params.slug)
  return {
    title: `${category?.name || 'कैटेगरी'} की खबरें`,
    description: `${category?.name || ''} की ताज़ा खबरें - Akashvani Speaking`,
  }
}

export default async function CategoryPage({ params }) {
  const category = dummyCategories.find((c) => c.slug === params.slug)
  const data = await getNews({ categorySlug: params.slug, limit: 30 })
  const allNews = data?.length
    ? data
    : [...dummyTrendingNews, ...dummyLatestNews].filter(
        (n) => n.categories?.slug === params.slug
      )

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 min-h-[50vh]">
        {/* Back button — no emoji, only ArrowLeft icon */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-brand-primary font-poppins text-sm font-semibold hover:underline mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          वापस जाएं
        </Link>

        <h1 className="section-title mb-6">
          {category?.icon ? `${category.icon} ` : ''}
          {category?.name || params.slug}
        </h1>

        {allNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {allNews.map((news, i) => (
              <NewsCard key={news.id} news={news} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 font-yantramanav text-lg mb-4">
              इस कैटेगरी में अभी कोई खबर नहीं है।
            </p>
            <Link href="/" className="btn-navy">
              होम पेज पर जाएं
            </Link>
          </div>
        )}
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}