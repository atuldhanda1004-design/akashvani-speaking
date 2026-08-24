'use client'
import Link from 'next/link'
import { useState, useCallback } from 'react'
import { ExternalLink, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react'
import ImageWithWatermark from './ImageWithWatermark'
import ShareButtons from './ShareButtons'
import { formatDate, formatTime } from '@/lib/dummyData'
import { SITE_CONFIG } from '@/lib/constants'

export default function TrendingNews({ news = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? news.length - 1 : prev - 1))
  }, [news.length])

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev === news.length - 1 ? 0 : prev + 1))
  }, [news.length])

  if (!news?.length) return null

  const currentNews = news[currentSlide] || news[0]
  const timeStr = `${formatDate(currentNews.published_at)}, ${formatTime(currentNews.published_at)}`
  const imageUrl =
    currentNews.featured_image ||
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80'

  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg sm:text-xl font-bold font-poppins text-brand-primary">
          Trending / Live Update
        </h2>
        <span className="w-2.5 h-2.5 bg-brand-red rounded-full animate-pulse-red" />
      </div>

      <div className="relative group">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          {/* Fixed height image box */}
          <div className="relative w-full md:w-1/2 h-56 sm:h-64 md:h-[340px] shrink-0 bg-gray-100">
            <ImageWithWatermark
              src={imageUrl}
              alt={currentNews.headline || 'Trending'}
              location={currentNews.location || currentNews.categories?.name || 'हरियाणा'}
              date={timeStr}
              className="absolute inset-0 w-full h-full"
              fill
              priority
            />
          </div>

          <div className="md:w-1/2 p-4 md:p-6 flex flex-col justify-between">
            <div>
              <Link href={`/news/${currentNews.slug}`}>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-yantramanav text-gray-900 leading-snug mb-3 hover:text-brand-primary">
                  {currentNews.headline}
                </h3>
              </Link>

              {currentNews.live_updates?.length > 0 && (
                <div className="relative border border-brand-red rounded-lg p-3 mb-3 mt-2 bg-red-50/30">
                  <div className="absolute -top-3 left-3 bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    लाइव अपडेट
                  </div>
                  <div className="flex gap-2 items-start mt-2">
                    <span className="bg-blue-50 text-brand-primary text-[10px] font-bold px-2 py-1 rounded shrink-0">
                      {currentNews.live_updates[0].time}
                    </span>
                    <p className="text-sm font-yantramanav text-gray-800 leading-tight">
                      {currentNews.live_updates[0].text}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ONLY 3 BUTTONS */}
            <div className="flex items-center gap-2 mt-3 pt-2">
              <Link
                href={`/news/${currentNews.slug}`}
                className="flex-1 bg-brand-primary text-white text-xs font-poppins font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1 hover:bg-brand-secondary"
              >
                पूरी खबर <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <ShareButtons
                url={`${SITE_CONFIG.url}/news/${currentNews.slug}`}
                title={currentNews.headline}
                compact
              />
              <button
                type="button"
                className="shrink-0 px-3 py-2.5 border border-gray-200 text-gray-600 rounded-lg flex items-center gap-1 text-xs font-poppins hover:bg-gray-50"
              >
                <Bookmark className="w-3.5 h-3.5" /> सेव
              </button>
            </div>
          </div>
        </div>

        {news.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-2 top-28 md:top-1/2 md:-translate-y-1/2 w-9 h-9 bg-white shadow-lg text-brand-primary rounded-full flex items-center justify-center z-20"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-28 md:top-1/2 md:-translate-y-1/2 w-9 h-9 bg-white shadow-lg text-brand-primary rounded-full flex items-center justify-center z-20"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {news.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3">
          {news.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide ? 'bg-brand-primary w-6' : 'bg-gray-300 w-2'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}