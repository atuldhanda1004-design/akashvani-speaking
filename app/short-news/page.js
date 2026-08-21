'use client'
import { useState, useRef, useEffect } from 'react'
import { ChevronUp, ChevronDown, Volume2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { dummyShortNews } from '@/lib/dummyData'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { WhatsAppIcon } from '@/components/SocialIcons'
import { SITE_CONFIG } from '@/lib/constants'

const gradients = [
  'from-brand-navy to-brand-navyLight',
  'from-indigo-600 to-purple-700',
  'from-blue-700 to-cyan-600',
  'from-slate-800 to-slate-600',
  'from-violet-700 to-purple-500',
]

export default function ShortNewsPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)

  const goNext = () => setCurrentIndex((p) => Math.min(p + 1, dummyShortNews.length - 1))
  const goPrev = () => setCurrentIndex((p) => Math.max(p - 1, 0))

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientY)
  const handleTouchEnd = (e) => {
    const diff = touchStart - e.changedTouches[0].clientY
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev()
  }

  const speakNews = (news) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(news.headline + '। ' + news.summary)
    utterance.lang = 'hi-IN'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowDown') goNext()
      if (e.key === 'ArrowUp') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
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

        <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} className="relative">
          <div
            key={currentIndex}
            className={`relative bg-gradient-to-br ${gradient} rounded-3xl overflow-hidden shadow-2xl min-h-[70vh] flex flex-col justify-end animate-fade-in`}
          >
            <div className="p-8 text-white relative z-10">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-poppins font-medium mb-4">
                {currentNews.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold font-yantramanav leading-tight mb-4">
                {currentNews.headline}
              </h1>
              <div className="w-12 h-0.5 bg-white/50 rounded-full mb-4" />
              <p className="text-base font-yantramanav leading-relaxed text-white/90 mb-6">
                {currentNews.summary}
              </p>
              <p className="text-sm text-white/50 font-poppins">{currentNews.time}</p>

              <div className="flex items-center gap-3 mt-6">
                <button onClick={() => speakNews(currentNews)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-poppins hover:bg-white/30 transition-all active:scale-95">
                  <Volume2 className="w-4 h-4" />सुनें
                </button>
                <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `📰 ${currentNews.headline}\n\n${currentNews.summary}\n\n- Akashvani Speaking\n${SITE_CONFIG.url}`
                  )}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#25D366] rounded-full text-sm font-poppins hover:bg-[#1da851] transition-all active:scale-95">
                  <WhatsAppIcon className="w-4 h-4" />शेयर
                </a>
              </div>
            </div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
            <div className="absolute bottom-20 left-10 w-24 h-24 bg-white/5 rounded-full blur-xl" />
          </div>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
            <button onClick={goPrev} disabled={currentIndex === 0}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-brand-navy hover:bg-white transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronUp className="w-5 h-5" />
            </button>
            <button onClick={goNext} disabled={currentIndex === dummyShortNews.length - 1}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-brand-navy hover:bg-white transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-6">
          {dummyShortNews.map((_, idx) => (
            <div key={idx} className={`h-1.5 rounded-full transition-all ${
              idx === currentIndex ? 'w-6 bg-brand-navy' : 'w-1.5 bg-gray-300'
            }`} />
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-3 font-poppins">
          ↑ ↓ स्वाइप या Arrow keys
        </p>
      </main>

      <Footer />
    </>
  )
}