import React from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NewsCard from '@/components/NewsCard'
import ScrollToTop from '@/components/ScrollToTop'
import { dummyTrendingNews, dummyLatestNews } from '@/lib/dummyData'

export const metadata = {
  title: 'सभी खबरें | Akashvani Speaking',
  description: 'Akashvani Speaking की सभी ताज़ा खबरें पढ़ें।',
}

export default function AllNewsPage() {
  const allNews = [...dummyTrendingNews, ...dummyLatestNews]

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="section-title mb-6">सभी खबरें</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {allNews.map((news, index) => (
            <NewsCard key={news.id} news={news} index={index} />
          ))}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}