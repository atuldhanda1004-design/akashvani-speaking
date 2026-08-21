'use client'
import Link from 'next/link'
import { Radio } from 'lucide-react'

export default function LiveTicker({ updates = [] }) {
  if (!updates.length) return null

  // Double the array for seamless loop
  const items = [...updates, ...updates]

  return (
    <div className="relative bg-gradient-to-r from-brand-red via-red-600 to-brand-red text-white overflow-hidden shadow-md">
      <div className="max-w-7xl mx-auto flex items-stretch">
        {/* LIVE Label */}
        <div className="flex items-center gap-2 bg-white text-brand-red px-4 py-2 font-poppins font-bold text-sm flex-shrink-0 z-10 shadow-lg">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>LIVE</span>
        </div>

        {/* Ticker Content */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex animate-ticker whitespace-nowrap py-2">
            {items.map((item, idx) => (
              <Link
                key={`${item.id}-${idx}`}
                href={`/news/${item.slug}`}
                className="inline-flex items-center gap-2 mx-6 hover:underline"
              >
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                <span className="text-xs font-poppins font-medium opacity-80">
                  {item.time}
                </span>
                <span className="text-sm font-yantramanav">
                  {item.headline}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}