'use client'
import { useState } from 'react'
import Image from 'next/image'
import { LogoWatermark } from './Logo'

export default function ImageWithWatermark({
  src, alt, location, date, className = '', fill = false, width, height
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const fallbackSrc = 'https://via.placeholder.com/800x450/30567D/ffffff?text=Akashvani+Speaking'

  return (
    <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
      {!isLoaded && <div className="absolute inset-0 skeleton-shimmer z-[5]" />}
      
      {fill ? (
        <Image src={src || fallbackSrc} alt={alt} fill className={`object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setIsLoaded(true)} />
      ) : (
        <Image src={src || fallbackSrc} alt={alt} width={width || 800} height={height || 450} className={`object-cover w-full h-full transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setIsLoaded(true)} />
      )}

      <LogoWatermark />

      {/* Smaller Dark Tag for Location/Date */}
      {(location || date) && (
        <div className="absolute bottom-2 left-2 z-10 bg-black/80 text-white/90 text-[9px] px-2 py-1 rounded shadow-lg font-poppins backdrop-blur-sm">
          {location && <span>{location}</span>}
          {location && date && <span> / </span>}
          {date && <span>{date}</span>}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
    </div>
  )
}