'use client'
import Link from 'next/link'
import { ExternalLink, Share2, Bookmark } from 'lucide-react'
import ImageWithWatermark from './ImageWithWatermark'
import { formatDate, formatTime } from '@/lib/dummyData'
import ShareButtons from './ShareButtons'

export default function NewsCard({ news }) {
  const timeStr = `${formatDate(news.published_at)}, ${formatTime(news.published_at)}`
  
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 mb-6">
      <Link href={`/news/${news.slug}`}>
        <ImageWithWatermark
          src={news.featured_image}
          alt={news.headline}
          location={news.location || news.categories?.name}
          date={timeStr}
          className="h-52 w-full"
          fill
        />
      </Link>

      <div className="p-4">
        <Link href={`/news/${news.slug}`}>
          <h3 className="text-lg font-bold font-yantramanav text-gray-900 leading-snug mb-4 hover:text-brand-primary">
            {news.headline}
          </h3>
        </Link>

        {/* Buttons Row */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <Link href={`/news/${news.slug}`} className="flex-1 bg-brand-primary text-white text-xs font-poppins font-medium py-2 rounded flex items-center justify-center gap-1.5 hover:bg-brand-secondary transition-colors">
            पूरी खबर पढ़ें <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          
          <div className="flex-shrink-0">
             <ShareButtons url={`https://akashvanispeaking.news/news/${news.slug}`} title={news.headline} variant="outline" />
          </div>

          <button className="px-3 py-2 border border-gray-200 text-gray-600 rounded flex items-center gap-1.5 text-xs font-poppins hover:bg-gray-50">
            <Bookmark className="w-3.5 h-3.5" /> सेव
          </button>
        </div>
      </div>
    </article>
  )
}