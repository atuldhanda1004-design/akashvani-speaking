'use client'
import { useState } from 'react'
import Image from 'next/image'
import { LogoWatermark } from './Logo'

export default function ImageWithWatermark({
  src, alt, location, date, className = '',
  fill = false, width, height, priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const fallbackSrc = 'https://via.placeholder.com/800x450/1a237e/ffffff?text=Akashvani+Speaking'

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {!isLoaded && <div className="absolute inset-0 skeleton-shimmer z-[5]" />}

      {fill ? (
        <Image
          src={hasError ? fallbackSrc : src}
          alt={alt}
          fill
          className={`object-cover transition-all duration-700 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => { setHasError(true); setIsLoaded(true) }}
          priority={priority}
          sizes={sizes}
        />
      ) : (
        <Image
          src={hasError ? fallbackSrc : src}
          alt={alt}
          width={width || 800}
          height={height || 450}
          className={`object-cover transition-all duration-700 w-full h-full ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => { setHasError(true); setIsLoaded(true) }}
          priority={priority}
          sizes={sizes}
        />
      )}

      <LogoWatermark />

      {(location || date) && (
        <div className="location-tag">
          {location && <span>{location}</span>}
          {location && date && <span> / </span>}
          {date && <span>{date}</span>}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  )
}