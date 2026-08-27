'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ImageWithWatermark from '@/components/ImageWithWatermark'

export default function SavedNewsPage() {
  const [savedNews, setSavedNews] = useState([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('saved_news') || '[]')
    setSavedNews(saved)
  }, [])

  const removeSaved = (id) => {
    const newSaved = savedNews.filter(n => n.id !== id)
    setSavedNews(newSaved)
    localStorage.setItem('saved_news', JSON.stringify(newSaved))
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold font-poppins text-brand-primary">सेव की गई ख़बरें</h1>
        </div>

        {savedNews.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-yantramanav">आपने अभी तक कोई खबर सेव नहीं की है।</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedNews.map(news => (
              <div key={news.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3">
                <div className="w-24 h-24 relative shrink-0 rounded-lg overflow-hidden">
                  <ImageWithWatermark src={news.featured_image} fill />
                </div>
                <div className="flex flex-col justify-between">
                  <Link href={`/news/${news.slug}`} className="font-bold text-sm font-yantramanav text-brand-primary line-clamp-3 hover:underline">
                    {news.headline}
                  </Link>
                  <button onClick={() => removeEmoji(news.id)} className="text-xs text-red-500 flex items-center gap-1 mt-2 hover:underline">
                    <Trash2 className="w-3 h-3" /> हटाएँ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}