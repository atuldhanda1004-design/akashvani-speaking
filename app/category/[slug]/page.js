import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NewsCard from '@/components/NewsCard'
import ScrollToTop from '@/components/ScrollToTop'
import { dummyTrendingNews, dummyLatestNews, dummyCategories } from '@/lib/dummyData'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export async function generateMetadata({ params }) {
  const category = dummyCategories.find((c) => c.slug === params.slug)
  return {
    title: `${category?.name || 'कैटेगरी'} | Akashvani Speaking`,
    description: `${category?.name || 'कैटेगरी'} की ताज़ा खबरें - Akashvani Speaking`,
  }
}

export default function CategoryPage({ params }) {
  const category = dummyCategories.find((c) => c.slug === params.slug)
  const allNews = [...dummyTrendingNews, ...dummyLatestNews]
  const categoryNews = allNews.filter(
    (n) => n.categories?.slug === params.slug
  )

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-brand-navy font-poppins text-sm font-medium hover:underline mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          वापस जाएं
        </Link>

        <h1 className="section-title mb-6">
          {category?.icon} {category?.name || params.slug}
        </h1>

        {categoryNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categoryNews.map((news, index) => (
              <NewsCard key={news.id} news={news} index={index} />
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