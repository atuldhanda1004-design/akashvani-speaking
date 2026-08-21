'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ImageWithWatermark from './ImageWithWatermark'
import { TrendingCardSkeleton } from './SkeletonLoader'
import { formatDate, timeAgo } from '@/lib/dummyData'

export default function TrendingNews({ news = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (news.length <= 1) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % news.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [news.length])

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + news.length) % news.length)
  }, [news.length])

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % news.length)
  }, [news.length])

  if (isLoading) {
    return (
      <section className="mb-8">
        <h2 className="section-title mb-6">Trending News</h2>
        <TrendingCardSkeleton />
      </section>
    )
  }

  if (!news.length) return null
  const currentNews = news[currentSlide]

  return (
    <section className="mb-10">
      <h2 className="section-title mb-6">Trending News</h2>

      <div className="relative">
        <div
          key={currentSlide}
          className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 animate-fade-in"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-[45%] relative">
              <ImageWithWatermark
                src={currentNews.featured_image}
                alt={currentNews.headline}
                location={currentNews.location}
                date={formatDate(currentNews.published_at)}
                className="h-64 md:h-96"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
              />
              {currentNews.is_breaking && (
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-brand-red text-white px-3 py-1 rounded-full text-xs font-poppins font-bold shadow-lg animate-pulse-red">
                  <span className="w-2 h-2 bg-white rounded-full" />
                  LIVE
                </div>
              )}
            </div>

            <div className="md:w-[55%] p-5 md:p-8 flex flex-col justify-between">
              <div>
                <Link href={`/news/${currentNews.slug}`}>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold font-yantramanav text-gray-900 leading-tight hover:text-brand-navy transition-colors cursor-pointer line-clamp-3">
                    {currentNews.headline}
                  </h3>
                </Link>

                <div className="w-16 h-1 bg-brand-navy rounded-full mt-3 mb-4" />

                {currentNews.points?.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {currentNews.points.slice(0, 6).map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm md:text-base text-gray-700 font-yantramanav animate-fade-in-up"
                          style={{ animationDelay: `${idx * 80}ms` }}>
                        <span className="w-1.5 h-1.5 bg-brand-navy rounded-full mt-2 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-brand-navy font-yantramanav font-medium">
                    {currentNews.categories?.name || 'हरियाणा'}
                  </span>
                  <span className="text-gray-300">/</span>
                  <span className="text-sm text-gray-500 font-yantramanav">
                    {timeAgo(currentNews.published_at)}
                  </span>
                </div>
                <Link href={`/news/${currentNews.slug}`} className="btn-navy text-xs md:text-sm">
                  पूरी खबर पढ़ें
                </Link>
              </div>
            </div>
          </div>

          {currentNews.live_updates?.length > 0 && (
            <div className="border-t border-gray-100">
              <div className="bg-brand-red text-white px-5 py-2.5 flex items-center gap-2">
                <span className="w-3 h-3 bg-white rounded-full animate-pulse-red" />
                <span className="font-yantramanav font-bold text-sm">LIVE</span>
                <span className="font-yantramanav font-bold text-sm ml-1">लाइव अपडेट</span>
              </div>
              <div className="p-4 space-y-2">
                {currentNews.live_updates.slice(0, 2).map((update, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="bg-brand-navy text-white text-xs font-poppins font-bold px-3 py-1.5 rounded-lg flex-shrink-0 min-w-[80px] text-center">
                      {update.time}
                    </span>
                    <span className="text-brand-red text-lg leading-none mt-0.5">•</span>
                    <p className="text-sm font-yantramanav text-gray-800 leading-relaxed">
                      {update.text}
                    </p>
                  </div>
                ))}
                <Link href={`/news/${currentNews.slug}`} className="text-brand-navy text-sm font-poppins font-semibold hover:underline flex items-center justify-end gap-1 mt-2">
                  Read More <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {news.length > 1 && (
          <>
            <button onClick={goToPrev}
              className="absolute left-2 top-32 md:top-44 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm text-brand-navy rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all active:scale-90 z-10"
              aria-label="Previous">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={goToNext}
              className="absolute right-2 top-32 md:top-44 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm text-brand-navy rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all active:scale-90 z-10"
              aria-label="Next">
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {news.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          {news.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'bg-brand-navy w-6' : 'bg-gray-300 w-2.5 hover:bg-gray-400'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}