'use client'

import { useEffect, useState } from 'react'
import NewsCard from './NewsCard'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { dummyLatestNews, dummyTrendingNews } from '@/lib/dummyData'

export default function RelatedNews({ categorySlug, currentId }) {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRelated() {
      try {
        if (isSupabaseConfigured() && supabase) {
          let query = supabase
            .from('news')
            .select('*, categories(id, name, slug, icon), users!reporter_id(id, full_name)')
            .eq('status', 'approved')
            .order('published_at', { ascending: false })
            .limit(6)

          const { data, error } = await query
          if (!error && data?.length) {
            const filtered = data.filter((n) => {
              if (currentId && String(n.id) === String(currentId)) return false
              if (categorySlug && n.categories?.slug) {
                return n.categories.slug === categorySlug
              }
              return true
            })
            setNews(filtered.slice(0, 4))
            setLoading(false)
            return
          }
        }

        // Dummy fallback
        const all = [...dummyTrendingNews, ...dummyLatestNews]
        const filtered = all.filter((n) => {
          if (currentId && String(n.id) === String(currentId)) return false
          if (categorySlug && n.categories?.slug) {
            return n.categories.slug === categorySlug
          }
          return true
        })
        setNews(filtered.slice(0, 4))
      } catch {
        setNews(dummyLatestNews.slice(0, 2))
      } finally {
        setLoading(false)
      }
    }

    fetchRelated()
  }, [categorySlug, currentId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-40 bg-white/60 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (!news.length) {
    return (
      <p className="text-sm text-gray-500 font-yantramanav">
        अभी कोई संबंधित खबर उपलब्ध नहीं है।
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {news.map((n, i) => (
        <NewsCard key={n.id || n.slug || i} news={n} index={i} />
      ))}
    </div>
  )
}