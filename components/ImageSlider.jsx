'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ImageWithWatermark from './ImageWithWatermark'

export default function ImageSlider({ imageString, headline, location, date, reporter, role }) {
  const images = imageString ? String(imageString).split(',').map(s => s.trim()).filter(Boolean) : []
  const fallback = 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80'
  const displayImages = images.length > 0 ? images : [fallback]
  
  const [index, setIndex] = useState(0)

  const next = () => setIndex(p => (p === displayImages.length - 1 ? 0 : p + 1))
  const prev = () => setIndex(p => (p === 0 ? displayImages.length - 1 : p - 1))

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-[450px] bg-gray-100">
      <ImageWithWatermark
  src={displayImages[index]}
  alt={headline}
  location={location}
  date={date}
  reporter={reporter}
  role={role}
  className="w-full h-full"
  fill
  priority
/>
      
      {/* Show Arrows only if there are multiple images */}
      {displayImages.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white text-brand-primary transition-all z-20">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white text-brand-primary transition-all z-20">
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded font-poppins z-20">
             {index + 1} / {displayImages.length}
          </div>
        </>
      )}
    </div>
  )
}