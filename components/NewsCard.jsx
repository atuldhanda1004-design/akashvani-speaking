'use client'
import Link from 'next/link'
import { ExternalLink, Bookmark } from 'lucide-react'
import ImageWithWatermark from './ImageWithWatermark'
import ShareButtons from './ShareButtons'
import { formatDate, formatTime } from '@/lib/dummyData'
import { SITE_CONFIG } from '@/lib/constants'

export default function NewsCard({ news, index = 0 }) {
  const timeStr = `${formatDate(news.published_at)}, ${formatTime(news.published_at)}`
  const imageUrl =
    news.featured_image ||
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'

  return (
    <article
      className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 mb-5"
      style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}
    >
      <Link href={`/news/${news.slug}`} className="block relative w-full h-52">
        <ImageWithWatermark
  src={imageUrl}
  alt={news.headline}
  location={news.location || news.categories?.name}
  date={timeStr}
  reporter={news.users?.full_name}
  role={news.users?.role}
  className="h-52 w-full"
  fill
/>
      </Link>

      <div className="p-4">
        <Link href={`/news/${news.slug}`}>
          <h3 className="text-base sm:text-lg font-bold font-yantramanav text-gray-900 leading-snug mb-4 hover:text-brand-primary line-clamp-3">
            {news.headline}
          </h3>
        </Link>

        {/* ONLY 3 BUTTONS */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <Link
            href={`/news/${news.slug}`}
            className="flex-1 bg-brand-primary text-white text-xs font-poppins font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1 hover:bg-brand-secondary transition-colors"
          >
            पूरी खबर <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <ShareButtons
            url={`${SITE_CONFIG.url}/news/${news.slug}`}
            title={news.headline}
            compact
          />

          <button
            type="button"
            className="shrink-0 px-3 py-2.5 border border-gray-200 text-gray-600 rounded-lg flex items-center gap-1 text-xs font-poppins hover:bg-gray-50"
            onClick={() => {
              try {
                const saved = JSON.parse(localStorage.getItem('saved_news') || '[]')
                if (!saved.find((s) => s.id === news.id)) {
                  saved.push({ id: news.id, slug: news.slug, headline: news.headline, featured_image: news.featured_image })
                  localStorage.setItem('saved_news', JSON.stringify(saved))
                  alert('सेव हो गई!')
                } else {
                  alert('पहले से सेव है')
                }
              } catch {
                alert('सेव नहीं हो सकी')
              }
            }}
          >
            <Bookmark className="w-3.5 h-3.5" /> सेव
          </button>
        </div>
      </div>
    </article>
  )
}