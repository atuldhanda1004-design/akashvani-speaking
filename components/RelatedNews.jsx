'use client'
import { useEffect, useState } from 'react'
import NewsCard from './NewsCard'
import { supabase } from '@/lib/supabase'
import { dummyLatestNews } from '@/lib/dummyData'

export default function RelatedNews({ categorySlug, currentId }) {
  const [news, setNews] = useState([])

  useEffect(() => {
    async function fetchRelated() {
      if (categorySlug) {
        const { data } = await supabase
          .from('news')
          .select('*, categories(*)')
          .eq('status', 'approved')
          .neq('id', currentId)
          .limit(3)
        
        if (data?.length) setNews(data)
        else setNews(dummyLatestNews.slice(0, 2))
      } else {
        setNews(dummyLatestNews.slice(0, 2))
      }
    }
    fetchRelated()
  }, [categorySlug, currentId])

  if (!news.length) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {news.map(n => <NewsCard key={n.id} news={n} />)}
    </div>
  )
}