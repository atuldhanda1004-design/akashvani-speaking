'use client'

import React from 'react'

export default function Logo({ size = 'md', className = '' }) {
  const sizes = {
    sm: { container: 'w-8 h-8', text: 'text-[10px]' },
    md: { container: 'w-11 h-11', text: 'text-xs' },
    lg: { container: 'w-16 h-16', text: 'text-base' },
    xl: { container: 'w-20 h-20', text: 'text-lg' },
  }

  const s = sizes[size] || sizes.md

  return (
    <div className={`relative ${s.container} ${className}`}>
      {/* Outer circle */}
      <div className="absolute inset-0 rounded-full border-2 border-white flex items-center justify-center">
        {/* Inner circle */}
        <div className="w-[85%] h-[85%] rounded-full border-[1.5px] border-white flex items-center justify-center bg-brand-navy/80">
          <span className={`font-poppins font-bold text-white ${s.text} tracking-wider`}>
            A<span className="text-white/80">&</span>S
          </span>
        </div>
      </div>
    </div>
  )
}

export function LogoWatermark({ className = '' }) {
  return (
    <div className={`watermark-overlay ${className}`}>
      <div className="w-9 h-9 rounded-full border-2 border-white/60 flex items-center justify-center bg-brand-navy/40 backdrop-blur-sm">
        <div className="w-[80%] h-[80%] rounded-full border border-white/50 flex items-center justify-center">
          <span className="font-poppins font-bold text-white/70 text-[9px] tracking-wider">
            AS
          </span>
        </div>
      </div>
    </div>
  )
}