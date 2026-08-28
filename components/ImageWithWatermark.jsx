'use client'
import Image from 'next/image'
import { LogoWatermark } from './Logo'

export default function ImageWithWatermark({
  src, alt = 'News', location, date, reporter, role, className = '', fill = false
}) {
  const fallback = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80'
  const imgSrc = src ? String(src).split(',')[0].trim() : fallback

  // Role Formatting
  const roleLabel = role === 'admin' ? 'संपादक' : 'पत्रकार'

  return (
    <div className={`relative overflow-hidden bg-gray-100 w-full h-full min-h-[120px] ${className}`}>
      {fill ? (
        <Image src={imgSrc} alt={alt} fill sizes="(max-width: 768px) 50vw, 100vw" className="object-cover" priority />
      ) : (
        <Image src={imgSrc} alt={alt} width={800} height={450} className="object-cover w-full h-full" priority />
      )}

      <LogoWatermark />

      {/* Location, Date & Reporter Name Tag */}
      {(location || date || reporter) && (
        <div className="absolute bottom-1.5 left-1.5 z-10 bg-black/80 text-white px-2 py-1 rounded font-poppins backdrop-blur-sm max-w-[95%] shadow-md">
          <div className="flex items-center gap-1 text-[9px] sm:text-[10px] leading-tight">
            {location && <span className="font-semibold truncate">{location}</span>}
            {location && date && <span>/</span>}
            {date && <span className="text-gray-200 truncate">{date}</span>}
          </div>
          {reporter && (
            <div className="text-[8px] sm:text-[9px] text-gray-300 border-t border-white/20 pt-0.5 mt-0.5 truncate">
              {roleLabel}: <span className="font-semibold text-white">{reporter}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}