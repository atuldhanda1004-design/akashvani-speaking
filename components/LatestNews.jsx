'use client'
import { useState, useEffect } from 'react'
import NewsCard from './NewsCard'
import { NewsCardSkeleton } from './SkeletonLoader'

export default function LatestNews({ news = [] }) {
  const [isLoading, setIsLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <section className="mb-10">
        <h2 className="section-title mb-6">Latest News</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => <NewsCardSkeleton key={i} />)}
        </div>
      </section>
    )
  }

  if (!news.length) return null

  return (
    <section className="mb-10">
      <h2 className="section-title mb-6">Latest News</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {news.slice(0, visibleCount).map((item, index) => (
          <NewsCard key={item.id} news={item} index={index} />
        ))}
      </div>

      {visibleCount < news.length && (
        <div className="text-center mt-8">
          <button
            onClick={() => setVisibleCount((p) => Math.min(p + 3, news.length))}
            className="btn-outline-navy"
          >
            और खबरें देखें ↓
          </button>
        </div>
      )}
    </section>
  )
}