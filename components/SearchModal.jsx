'use client'
import { useState, useEffect, useRef } from 'react'
import { Search, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { dummyLatestNews, dummyTrendingNews } from '@/lib/dummyData'

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 300)
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setResults([])
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (query.length > 1) {
      const allNews = [...dummyTrendingNews, ...dummyLatestNews]
      const q = query.toLowerCase()
      const filtered = allNews.filter(
        (n) =>
          n.headline.toLowerCase().includes(q) ||
          n.subheadline?.toLowerCase().includes(q)
      )
      setResults(filtered)
    } else {
      setResults([])
    }
  }, [query])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="max-w-2xl mx-auto pt-20 px-4" onClick={(e) => e.stopPropagation()}>
        <div className="relative animate-slide-down">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="खबर खोजें..."
            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white text-gray-900 font-yantramanav text-lg outline-none shadow-2xl"
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {results.length > 0 && (
          <div className="mt-4 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[60vh] overflow-y-auto animate-slide-up">
            {results.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 group"
              >
                <div className="flex-1">
                  <p className="font-yantramanav font-bold text-gray-900 line-clamp-2 group-hover:text-brand-navy transition-colors">
                    {item.headline}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 font-poppins">
                    {item.categories?.name}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-navy group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}

        {query.length > 1 && results.length === 0 && (
          <div className="mt-4 bg-white rounded-2xl shadow-2xl p-8 text-center animate-slide-up">
            <p className="text-gray-400 font-yantramanav text-lg">
              कोई खबर नहीं मिली
            </p>
          </div>
        )}
      </div>
    </div>
  )
}