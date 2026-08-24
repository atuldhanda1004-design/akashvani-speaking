'use client'
import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'

export default function LiveAudience() {
  const [count, setCount] = useState(1200)

  const getBaseCount = () => {
    const hour = new Date().getHours()
    if (hour >= 8 && hour <= 11) return { min: 850, max: 1600 }
    if (hour >= 18 && hour <= 23) return { min: 1200, max: 2400 }
    if (hour >= 12 && hour <= 17) return { min: 450, max: 900 }
    if (hour >= 0 && hour <= 5) return { min: 80, max: 220 }
    return { min: 250, max: 500 }
  }

  useEffect(() => {
    const { min, max } = getBaseCount()
    setCount(Math.floor(Math.random() * (max - min)) + min)

    const interval = setInterval(() => {
      const { min: mn, max: mx } = getBaseCount()
      setCount((prev) => {
        const drift = Math.floor(Math.random() * 30) - 15
        let next = prev + drift
        if (next < mn) next = mn + Math.floor(Math.random() * 20)
        if (next > mx) next = mx - Math.floor(Math.random() * 20)
        return next
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded-full border border-red-100 shadow-sm shrink-0 max-w-[130px]">
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
      </span>
      <Users className="w-3 h-3 text-brand-primary shrink-0" />
      <span className="text-[10px] font-poppins font-bold text-gray-800 tabular-nums">
        {count.toLocaleString('en-IN')}
      </span>
      <span className="text-[8px] font-poppins text-gray-500 whitespace-nowrap hidden xs:inline sm:inline">
        लाइव
      </span>
    </div>
  )
}