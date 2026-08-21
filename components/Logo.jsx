'use client'
import Image from 'next/image'

const SIZES = {
  sm: 32,
  md: 44,
  lg: 64,
  xl: 80,
}

export default function Logo({ size = 'md', className = '' }) {
  const px = SIZES[size] || SIZES.md
  return (
    <div className={`relative flex-shrink-0 ${className}`} style={{ width: px, height: px }}>
      <Image
        src="/logo.png"
        alt="Akashvani Speaking Logo"
        width={px}
        height={px}
        priority
        className="object-contain rounded-full"
      />
    </div>
  )
}

export function LogoWatermark({ className = '' }) {
  return (
    <div className={`watermark-overlay ${className}`}>
      <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md p-1 border border-white/40 shadow-lg">
        <Image
          src="/logo.png"
          alt="AS Watermark"
          width={30}
          height={30}
          className="object-contain w-full h-full rounded-full opacity-90"
        />
      </div>
    </div>
  )
}