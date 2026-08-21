'use client'

import React from 'react'
import Link from 'next/link'
import { Volume2 } from 'lucide-react'
import ImageWithWatermark from './ImageWithWatermark'
import ShareButtons from './ShareButtons'
import { formatDate, timeAgo } from '@/lib/dummyData'

export default function NewsCard({ news, index = 0, style = 'default' }) {
  const speakNews = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const text = news.headline + '। ' + (news.points ? news.points.join('। ') : news.subheadline || '')
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'hi-IN'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <article
      className="bg-white rounded-2xl overflow-hidden shadow-sm news-card-hover animate-fade-in-up group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative">
        <Link href={`/news/${news.slug}`}>
          <ImageWithWatermark
            src={news.featured_image}
            alt={news.headline}
            location={news.location || news.categories?.name}
            date={formatDate(news.published_at)}
            className="h-48 sm:h-52"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>

        {/* Listen Button on Image */}
        <button
          onClick={speakNews}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-brand-navy hover:bg-white hover:scale-110 transition-all active:scale-90 shadow-lg"
          title="सुनें"
        >
          <Volume2 className="w-4 h-4" />
        </button>

        {news.is_breaking && (
          <div className="absolute top-3 right-14 z-10 flex items-center gap-1 bg-brand-red text-white px-2 py-0.5 rounded-full text-[10px] font-poppins font-bold">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse-red" />
            LIVE
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <Link href={`/news/${news.slug}`}>
          <h3 className="text-base md:text-lg font-bold font-yantramanav text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-navy transition-colors cursor-pointer">
            {news.headline}
          </h3>
        </Link>

        <div className="w-12 h-0.5 bg-brand-navy rounded-full mt-2 mb-3" />

        {/* Bullet Points */}
        {news.points && news.points.length > 0 && (
          <ul className="space-y-1.5 mb-3">
            {news.points.slice(0, 3).map((point, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-[13px] text-gray-600 font-yantramanav"
              >
                <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
                <span className="line-clamp-2">{point}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-poppins">
            <span className="text-gray-600 font-medium">
              {news.users?.full_name || 'Reporter'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/news/${news.slug}`}
              className="px-3 py-1.5 bg-brand-navy text-white text-xs rounded-lg font-poppins font-semibold hover:bg-brand-navyDark transition-all active:scale-95"
            >
              पूरी खबर पढ़ें
            </Link>
            <ShareButtons
              url={`https://akashvanispeaking.news/news/${news.slug}`}
              title={news.headline}
              compact
            />
          </div>
        </div>
      </div>
    </article>
  )
}