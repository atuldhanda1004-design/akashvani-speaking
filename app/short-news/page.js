'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronUp, ChevronDown, Share2, Volume2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { dummyShortNews } from '@/lib/dummyData'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ShareButtons from '@/components/ShareButtons'

const gradients = [
  'from-brand-navy to-brand-navyLight',
  'from-indigo-600 to-purple-700',
  'from-blue-700 to-cyan-600',
  'from-slate-800 to-slate-600',
  'from-violet-700 to-purple-500',
]

export default function ShortNewsPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)
  const [touchStart, setTouchStart] = useState(0)

  const goNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, dummyShortNews.length - 1))
  }

  const goPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientY)
  }

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientY
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext()
      else goPrev()
    }
  }

  const speakNews = (news) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const text = news.headline + '। ' + news.summary
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'hi-IN'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') goNext()
      if (e.key === 'ArrowUp') goPrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const currentNews = dummyShortNews[currentIndex]
  const gradient = gradients[currentIndex % gradients.length]

  return (
    <>
      <Header />

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center gap-2 text-brand-navy font-poppins text-sm font-medium hover:underline group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            वापस
          </Link>
          <h2 className="text-lg font-bold font-poppins text-brand-navy">शॉर्ट न्यूज़</h2>
          <span className="text-xs text-gray-400 font-poppins">
            {currentIndex + 1}/{dummyShortNews.length}
          </span>
        </div>

        {/* Card */}
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative"
        >
          <div
            key={currentIndex}
            className={`relative bg-gradient-to-br ${gradient} rounded-3xl overflow-hidden shadow-2xl min-h-[70vh] flex flex-col justify-end animate-fade-in`}
          >
            {/* Content */}
            <div className="p-8 text-white relative z-10">
              {/* Category */}
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-poppins font-medium mb-4">
                {currentNews.category}
              </span>

              {/* Headline */}
              <h1 className="text-2xl md:text-3xl font-bold font-yantramanav leading-tight mb-4">
                {currentNews.headline}
              </h1>

              <div className="w-12 h-0.5 bg-white/50 rounded-full mb-4" />

              {/* Summary */}
              <p className="text-base font-yantramanav leading-relaxed text-white/90 mb-6">
                {currentNews.summary}
              </p>

              {/* Time */}
              <p className="text-sm text-white/50 font-poppins">
                {currentNews.time}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => speakNews(currentNews)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-poppins hover:bg-white/30 transition-all active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  सुनें
                </button>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    currentNews.headline + '\n\n' + currentNews.summary + '\n\n- Akashvani Speaking\nhttps://akashvanispeaking.news'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#25D366] rounded-full text-sm font-poppins hover:bg-[#1da851] transition-all active:scale-95"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  शेयर
                </a>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
            <div className="absolute bottom-20 left-10 w-24 h-24 bg-white/5 rounded-full blur-xl" />
          </div>

          {/* Navigation Buttons */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-brand-navy hover:bg-white transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              disabled={currentIndex === dummyShortNews.length - 1}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-brand-navy hover:bg-white transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {dummyShortNews.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 bg-brand-navy'
                  : idx < currentIndex
                  ? 'w-1.5 bg-brand-navy/40'
                  : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-3 font-poppins">
          ↑ ↓ स्वाइप करें या कीबोर्ड एरो कीज़ दबाएं
        </p>
      </main>

      <Footer />
    </>
  )
}