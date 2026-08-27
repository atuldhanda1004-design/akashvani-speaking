'use client'
import Link from 'next/link'
import { useState, useCallback, useEffect } from 'react'
import { Bookmark, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'
import ImageWithWatermark from './ImageWithWatermark'
import ShareButtons from './ShareButtons'
import { formatDate, formatTime } from '@/lib/dummyData'
import { SITE_CONFIG } from '@/lib/constants'

// Save Button Helper Component
export function SaveButton({ news }) {
  const [isSaved, setIsSaved] = useState(false)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('saved_news') || '[]')
    setIsSaved(saved.some(s => s.id === news.id))
  }, [news.id])

  const toggleSave = () => {
    let saved = JSON.parse(localStorage.getItem('saved_news') || '[]')
    if (isSaved) {
      saved = saved.filter(s => s.id !== news.id)
      setIsSaved(false)
      alert('सेव्ड लिस्ट से हटा दिया गया!')
    } else {
      saved.push({ id: news.id, slug: news.slug, headline: news.headline, featured_image: news.featured_image })
      setIsSaved(true)
      alert('खबर सेव हो गई!')
    }
    localStorage.setItem('saved_news', JSON.stringify(saved))
  }

  return (
    <button onClick={toggleSave} className={`shrink-0 px-2 py-1.5 sm:px-3 sm:py-2 border rounded flex items-center gap-1 text-[10px] sm:text-xs font-poppins transition-colors ${isSaved ? 'bg-brand-primary text-white border-brand-primary' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
      <Bookmark className="w-3.5 h-3.5" fill={isSaved ? "currentColor" : "none"} /> <span className="hidden sm:inline">{isSaved ? 'सेव्ड' : 'सेव'}</span>
    </button>
  )
}

function LiveUpdateAccordion({ updates }) {
  const [expanded, setExpanded] = useState(false)
  if (!updates || updates.length === 0) return null

  return (
    <div className="relative border border-brand-red rounded-lg p-2 mb-1 mt-2 bg-red-50/30">
      <div className="absolute -top-2 left-2 bg-brand-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded">लाइव अपडेट</div>
      <div className="flex gap-1.5 items-start mt-1.5">
        <span className="bg-blue-50 text-brand-primary text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0">{updates[0].time}</span>
        <p className="text-[10px] sm:text-xs font-yantramanav text-gray-800 leading-tight line-clamp-2">{updates[0].text}</p>
      </div>
      {expanded && updates.slice(1).map((u, i) => (
        <div key={i} className="flex gap-1.5 items-start mt-2 pt-2 border-t border-red-100">
          <span className="bg-blue-50 text-brand-primary text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0">{u.time}</span>
          <p className="text-[10px] sm:text-xs font-yantramanav text-gray-800 leading-tight">{u.text}</p>
        </div>
      ))}
      {updates.length > 1 && (
        <button onClick={() => setExpanded(!expanded)} className="w-full mt-1.5 flex items-center justify-center text-brand-red">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      )}
    </div>
  )
}

function NewsItemContent({ item }) {
  if (!item) return null
  const timeStr = `${formatDate(item.published_at)}, ${formatTime(item.published_at)}`
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-row w-full min-h-[140px] sm:min-h-[180px]">
      {/* LEFT SIDE - PHOTO (Fixed Width Mobile) */}
      <div className="w-[40%] sm:w-[45%] relative shrink-0 bg-gray-100">
        <Link href={`/news/${item.slug}`} className="absolute inset-0 block">
          <ImageWithWatermark src={item.featured_image} alt={item.headline} location={item.location} date={timeStr} reporter={item.users?.full_name} fill />
        </Link>
      </div>

      {/* RIGHT SIDE - CONTENT */}
      <div className="w-[60%] sm:w-[55%] p-2.5 sm:p-4 flex flex-col justify-between min-w-0">
        <div className="min-w-0">
          <Link href={`/news/${item.slug}`}>
            {/* BLUE HEADLINE */}
            <h3 className="text-[13px] sm:text-lg font-bold font-yantramanav text-brand-primary leading-snug hover:text-brand-secondary line-clamp-3">
              {item.headline}
            </h3>
          </Link>
          <LiveUpdateAccordion updates={item.live_updates} />
        </div>

        <div className="flex items-center justify-between gap-1.5 mt-2 pt-2 border-t border-gray-100">
          <Link href={`/news/${item.slug}`} className="flex-1 min-w-0 bg-brand-primary text-white text-[10px] sm:text-xs font-poppins font-semibold py-1.5 sm:py-2 rounded flex items-center justify-center hover:bg-brand-secondary">
            पूरी खबर
          </Link>
          <ShareButtons url={`${SITE_CONFIG.url}/news/${item.slug}`} title={item.headline} image={item.featured_image} compact />
          <SaveButton news={item} />
        </div>
      </div>
    </div>
  )
}

export default function TrendingNews({ news = [], title = 'Trending / Live Updates', layout = 'carousel' }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const goToPrev = useCallback(() => setCurrentSlide(p => (p === 0 ? news.length - 1 : p - 1)), [news.length])
  const goToNext = useCallback(() => setCurrentSlide(p => (p === news.length - 1 ? 0 : p + 1)), [news.length])

  if (!news?.length) return null

  return (
    <section className="mb-6 sm:mb-8">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-base sm:text-xl font-bold font-poppins text-brand-primary">{title}</h2>
        <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse-red" />
      </div>

      {layout === 'carousel' ? (
        <div className="relative">
          <NewsItemContent item={news[currentSlide]} />
          {news.length > 1 && (
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none px-1">
              <button onClick={goToPrev} className="w-8 h-8 bg-white/90 shadow-lg text-brand-primary rounded-full flex items-center justify-center pointer-events-auto border border-gray-100"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={goToNext} className="w-8 h-8 bg-white/90 shadow-lg text-brand-primary rounded-full flex items-center justify-center pointer-events-auto border border-gray-100"><ChevronRight className="w-5 h-5" /></button>
            </div>
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