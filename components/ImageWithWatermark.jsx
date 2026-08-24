'use client'
import { useState } from 'react'
import Image from 'next/image'
import { LogoWatermark } from './Logo'

export default function ImageWithWatermark({
  src,
  alt = 'News',
  location,
  date,
  className = '',
  fill = false,
  width,
  height,
  priority = false,
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const fallback =
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'
  const imgSrc = hasError || !src ? fallback : src

  return (
    <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 z-[1] animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
      )}

      {fill ? (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true)
            setIsLoaded(true)
          }}
        />
      ) : (
        <Image
          src={imgSrc}
          alt={alt}
          width={width || 800}
          height={height || 450}
          priority={priority}
          className={`object-cover w-full h-full transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true)
            setIsLoaded(true)
          }}
        />
      )}

      <LogoWatermark />

      {(location || date) && (
        <div className="absolute bottom-2 left-2 z-10 bg-black/80 text-white text-[9px] px-2 py-1 rounded font-poppins backdrop-blur-sm">
          {location && <span>{location}</span>}
          {location && date && <span> / </span>}
          {date && <span>{date}</span>}
        </div>
      )}
    </div>
  )
}