'use client'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ImageWithWatermark from './ImageWithWatermark'

export default function ImageSlider({ imageString, headline, location, date, reporter }) {
  // Split comma-separated URLs
  const images = imageString ? imageString.split(',') : ['https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80']
  const [index, setIndex] = useState(0)

  const next = () => setIndex(p => p === images.length - 1 ? 0 : p + 1)
  const prev = () => setIndex(p => p === 0 ? images.length - 1 : p - 1)

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-[450px] bg-gray-100">
      <ImageWithWatermark
        src={images[index].trim()}
        alt={headline}
        location={location}
        date={date}
        reporter={reporter}
        className="w-full h-full"
        fill
        priority
      />
      
      {/* Show Arrows if multiple images */}
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white text-brand-primary transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white text-brand-primary transition-all">
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded font-poppins">
             {index + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  )
}