'use client'
import Link from 'next/link'
import { useState, useCallback } from 'react'
import { ExternalLink, Bookmark, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'
import ImageWithWatermark from './ImageWithWatermark'
import ShareButtons from './ShareButtons'
import { formatDate, formatTime } from '@/lib/dummyData'
import { SITE_CONFIG } from '@/lib/constants'

function LiveUpdateAccordion({ updates }) {
  const [expanded, setExpanded] = useState(false)
  if (!updates || updates.length === 0) return null

  return (
    <div className="relative border border-brand-red rounded-lg p-2.5 mb-2 mt-3 bg-red-50/30 transition-all">
      <div className="absolute -top-2.5 left-2 bg-brand-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
        लाइव अपडेट
      </div>
      
      <div className="flex gap-2 items-start mt-1.5">
        <span className="bg-blue-50 text-brand-primary text-[9px] font-bold px-1.5 py-1 rounded shrink-0">{updates[0].time}</span>
        <p className="text-xs font-yantramanav text-gray-800 leading-tight">{updates[0].text}</p>
      </div>

      {expanded && updates.slice(1).map((u, i) => (
        <div key={i} className="flex gap-2 items-start mt-2 pt-2 border-t border-red-100">
          <span className="bg-blue-50 text-brand-primary text-[9px] font-bold px-1.5 py-1 rounded shrink-0">{u.time}</span>
          <p className="text-xs font-yantramanav text-gray-800 leading-tight">{u.text}</p>
        </div>
      ))}

      {/* ONLY Arrow key for expansion (No Text) */}
      {updates.length > 1 && (
        <button onClick={() => setExpanded(!expanded)} className="w-full mt-2 pt-1 flex items-center justify-center text-brand-red hover:bg-red-50 border-t border-red-100 pb-0.5 rounded-b transition-colors" title="और अपडेट देखें">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      )}
    </div>
  )
}

function NewsItemContent({ item }) {
  const timeStr = `${formatDate(item.published_at)}, ${formatTime(item.published_at)}`
  const imageUrl = item.featured_image?.split(',')[0] || 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80'

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-row h-auto min-h-[170px] w-full">
      <Link href={`/news/${item.slug}`} className="w-[40%] sm:w-[45%] relative shrink-0 bg-gray-100 block">
        <ImageWithWatermark src={imageUrl} alt={item.headline} location={item.location || item.categories?.name} date={timeStr} reporter={item.users?.full_name} fill />
      </Link>
      <div className="w-[60%] sm:w-[55%] p-3 flex flex-col justify-between">
        <div>
          <Link href={`/news/${item.slug}`}>
            <h3 className="text-sm sm:text-lg font-bold font-yantramanav text-gray-900 leading-snug hover:text-brand-primary line-clamp-3">{item.headline}</h3>
          </Link>
          <LiveUpdateAccordion updates={item.live_updates} />
        </div>
        <div className="flex items-center justify-between gap-1 mt-2 pt-2 border-t border-gray-100">
          <Link href={`/news/${item.slug}`} className="flex-1 bg-brand-primary text-white text-[10px] sm:text-xs font-poppins font-medium py-1.5 sm:py-2 rounded flex items-center justify-center gap-1 hover:bg-brand-secondary">
            पूरी खबर <ExternalLink className="w-3 h-3" />
          </Link>
          <ShareButtons url={`${SITE_CONFIG.url}/news/${item.slug}`} title={item.headline} compact />
          <button className="shrink-0 px-2 py-1.5 sm:py-2 border border-gray-200 text-gray-600 rounded flex items-center gap-1 text-[10px] sm:text-xs hover:bg-gray-50">
            <Bookmark className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TrendingNews({ news = [], title = 'Trending / Live Updates', layout = 'carousel' }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const goToPrev = useCallback(() => setCurrentSlide((p) => (p === 0 ? news.length - 1 : p - 1)), [news.length])
  const goToNext = useCallback(() => setCurrentSlide((p) => (p === news.length - 1 ? 0 : p + 1)), [news.length])

  if (!news?.length) return null

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg sm:text-xl font-bold font-poppins text-brand-primary">{title}</h2>
        <span className="w-2.5 h-2.5 bg-brand-red rounded-full animate-pulse-red" />
      </div>

      {layout === 'carousel' ? (
        <div className="relative group">
          <NewsItemContent item={news[currentSlide]} />
          
          {news.length > 1 && (
            <>
              <button onClick={goToPrev} className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 shadow-lg text-brand-primary rounded-full flex items-center justify-center z-20">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={goToNext} className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 shadow-lg text-brand-primary rounded-full flex items-center justify-center z-20">
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="flex items-center justify-center gap-2 mt-3">
                {news.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1.5 rounded-full transition-all ${idx === currentSlide ? 'bg-brand-primary w-5' : 'bg-gray-300 w-1.5'}`} />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((item) => <NewsItemContent key={item.id} item={item} />)}
        </div>
      )}
    </section>
  )
}