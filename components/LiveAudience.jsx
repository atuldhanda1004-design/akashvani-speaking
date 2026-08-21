'use client'
import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'

export default function LiveAudience() {
  const [count, setCount] = useState(0)

  // Realistic audience count based on time of day
  const getBaseCount = () => {
    const hour = new Date().getHours()
    // Peak times: 8-11 AM, 6-11 PM
    if (hour >= 8 && hour <= 11) return { min: 850, max: 1600 }      // morning peak
    if (hour >= 18 && hour <= 23) return { min: 1200, max: 2400 }    // evening peak
    if (hour >= 12 && hour <= 17) return { min: 450, max: 900 }      // afternoon
    if (hour >= 0 && hour <= 5) return { min: 80, max: 220 }         // late night
    return { min: 250, max: 500 }                                    // early morning
  }

  useEffect(() => {
    const { min, max } = getBaseCount()
    setCount(Math.floor(Math.random() * (max - min)) + min)

    // Fluctuate every 4-8 seconds
    const interval = setInterval(() => {
      const { min: mn, max: mx } = getBaseCount()
      setCount((prev) => {
        const drift = Math.floor(Math.random() * 30) - 15 // ±15
        let next = prev + drift
        if (next < mn) next = mn + Math.floor(Math.random() * 20)
        if (next > mx) next = mx - Math.floor(Math.random() * 20)
        return next
      })
    }, 4000 + Math.random() * 4000)

    return () => clearInterval(interval)
  }, [])

  const formatted = count.toLocaleString('en-IN')

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-red-100 shadow-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
      </span>
      <Users className="w-3.5 h-3.5 text-brand-navy" />
      <span className="text-xs font-poppins font-semibold text-gray-800">
        {formatted}
      </span>
      <span className="text-[10px] font-poppins text-gray-500">
        अभी देख रहे हैं
      </span>
    </div>
  )
}