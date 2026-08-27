'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

export default function ShortNewsPage() {
  const [videoNews, setVideoNews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef(null)

  // YouTube URL से ID निकालने का फंक्शन
  const getYouTubeId = (url) => {
    try {
      const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      return url.match(regex)[1]
    } catch { return null }
  }

  useEffect(() => {
    async function fetchVideos() {
      if (supabase) {
        const { data } = await supabase.from('news').select('*').not('video_url', 'is', null).order('published_at', { ascending: false })
        if (data) {
          const vids = data.filter(n => getYouTubeId(n.video_url))
          setVideoNews(vids)
        }
      }
      setIsLoading(false)
    }
    fetchVideos()
  }, [])

  return (
    <>
      <Header />
      <main className="bg-black min-h-screen">
        <div className="max-w-md mx-auto h-[100dvh] relative overflow-hidden flex flex-col">
          
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between">
            <Link href="/" className="text-white hover:text-gray-300 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h2 className="text-white font-poppins font-bold">शॉर्ट वीडियो न्यूज़</h2>
            <div className="w-6" />
          </div>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center text-white font-yantramanav">लोड हो रहा है...</div>
          ) : videoNews.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-white font-yantramanav">अभी कोई वीडियो उपलब्ध नहीं है।</div>
          ) : (
            /* Scroll Container (Snap Mandatory - Reels Style) */
            <div ref={containerRef} className="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth no-scrollbar relative">
              {videoNews.map((news) => {
                const ytId = getYouTubeId(news.video_url)
                const formattedDate = new Date(news.published_at).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                
                return (
                  <div key={news.id} className="h-[100dvh] w-full snap-start relative bg-black flex flex-col justify-center border-b border-gray-800">
                    
                    {/* YouTube iFrame Embed */}
                    <div className="relative w-full aspect-[9/16] max-h-screen">
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${ytId}?autoplay=0&loop=1&rel=0&modestbranding=1`}
                        title={news.headline}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 pb-20 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
                      <h1 className="text-white font-bold font-yantramanav text-lg sm:text-xl leading-tight mb-2 drop-shadow-md">
                        {news.headline}
                      </h1>
                      <div className="flex items-center gap-2 text-gray-300 text-xs font-poppins">
                        <span>{news.categories?.name || 'Haryana'}</span>
                        <span>•</span>
                        <span>{formattedDate}</span>
                      </div>
                    </div>

                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </>
  )
}