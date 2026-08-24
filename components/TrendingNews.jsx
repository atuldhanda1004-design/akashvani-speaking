'use client'
import Link from 'next/link'
import { useState, useCallback } from 'react'
import { ExternalLink, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react'
import ImageWithWatermark from './ImageWithWatermark'
import ShareButtons from './ShareButtons'
import { formatDate, formatTime } from '@/lib/dummyData'

export default function TrendingNews({ news = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? news.length - 1 : prev - 1))
  }, [news.length])

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev === news.length - 1 ? 0 : prev + 1))
  }, [news.length])

  if (!news.length) return null
  const currentNews = news[currentSlide]
  const timeStr = `${formatDate(currentNews.published_at)}, ${formatTime(currentNews.published_at)}`

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold font-poppins text-brand-primary">Trending / Live Update</h2>
        <span className="w-2.5 h-2.5 bg-brand-red rounded-full animate-pulse-red" />
      </div>

      <div className="relative group">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          {/* Left/Top Image */}
          <div className="md:w-1/2 relative h-64 md:h-auto">
             <ImageWithWatermark src={currentNews.featured_image} alt={currentNews.headline} location={currentNews.location} date={timeStr} fill />
          </div>

          {/* Right/Bottom Content */}
          <div className="md:w-1/2 p-4 md:p-6 flex flex-col">
            <Link href={`/news/${currentNews.slug}`}>
              <h3 className="text-xl md:text-2xl font-bold font-yantramanav text-gray-900 leading-snug mb-4 hover:text-brand-primary transition-colors">
                {currentNews.headline}
              </h3>
            </Link>

            {/* Live Update Box */}
            {currentNews.live_updates?.length > 0 && (
              <div className="relative border border-brand-red rounded-lg p-3 mb-5 mt-4">
                <div className="absolute -top-3 left-3 bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  लाइव अपडेट
                </div>
                <div className="flex gap-3 items-start mt-2">
                  <span className="bg-blue-50 text-brand-primary text-[10px] font-bold px-2 py-1 rounded shrink-0">
                    {currentNews.live_updates[0].time}
                  </span>
                  <p className="text-sm font-yantramanav text-gray-700 leading-tight">
                    {currentNews.live_updates[0].text}
                  </p>
                </div>
              </div>
            )}

            {/* Buttons Row */}
            <div className="flex items-center gap-2 mt-auto pt-4">
              <Link href={`/news/${currentNews.slug}`} className="flex-1 bg-brand-primary text-white text-xs font-poppins font-medium py-2 rounded flex items-center justify-center gap-1.5 hover:bg-brand-secondary transition-colors">
                पूरी खबर पढ़ें <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <ShareButtons url={`https://akashvanispeaking.news/news/${currentNews.slug}`} title={currentNews.headline} variant="outline" />
              <button className="px-3 py-2 border border-gray-200 text-gray-600 rounded flex items-center gap-1.5 text-xs font-poppins hover:bg-gray-50">
                <Bookmark className="w-3.5 h-3.5" /> सेव
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Arrows (Shows on hover) */}
        {news.length > 1 && (
          <>
            <button onClick={goToPrev} className="absolute left-2 top-32 md:top-1/2 md:-translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm text-brand-primary rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all active:scale-90 z-10 opacity-0 group-hover:opacity-100">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={goToNext} className="absolute right-2 top-32 md:top-1/2 md:-translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm text-brand-primary rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all active:scale-90 z-10 opacity-0 group-hover:opacity-100">
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {news.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {news.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'bg-brand-primary w-6' : 'bg-gray-300 w-2 hover:bg-gray-400'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}