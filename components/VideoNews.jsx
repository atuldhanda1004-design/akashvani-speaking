'use client'
import { useState } from 'react'
import { PlayCircle } from 'lucide-react'
import { timeAgo } from '@/lib/dummyData'

export default function VideoNews({ news = [] }) {
  const [playingVideo, setPlayingVideo] = useState(null)

  // Filter only news that have a valid youtube video_url
  const videoNewsList = news.filter(n => n.video_url && n.video_url.includes('youtu'))

  if (!videoNewsList.length) return null

  // Helper to extract YouTube ID
  const getYouTubeId = (url) => {
    try {
      const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      return url.match(regex)[1]
    } catch { return null }
  }

  return (
    <section className="mt-8 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold font-poppins text-brand-primary">वीडियो न्यूज़</h2>
        <PlayCircle className="w-5 h-5 text-brand-red" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videoNewsList.slice(0, 4).map((item) => {
          const ytId = getYouTubeId(item.video_url)
          if (!ytId) return null

          return (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              {playingVideo === item.id ? (
                // Video Player directly embedded
                <div className="relative w-full pt-[56.25%] bg-black">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                    title={item.headline}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                // Thumbnail with Play Button
                <div 
                  className="relative w-full pt-[56.25%] bg-gray-200 cursor-pointer group"
                  onClick={() => setPlayingVideo(item.id)}
                >
                  <img 
                    src={`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`} 
                    alt={item.headline}
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                    <PlayCircle className="w-12 h-12 text-white opacity-90 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              )}
              <div className="p-3">
                <h3 className="text-sm md:text-base font-bold font-yantramanav text-gray-900 leading-tight">
                  {item.headline}
                </h3>
                <p className="text-[10px] text-gray-400 mt-1">{timeAgo(item.published_at)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}