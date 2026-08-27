import React from 'react'

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-brand-primary z-[100] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center mx-auto mb-4 animate-pulse bg-white/10 shadow-lg">
          <div className="w-[80%] h-[80%] rounded-full border border-white/50 flex items-center justify-center">
            <span className="font-poppins font-bold text-white text-lg tracking-wider">A&S</span>
          </div>
        </div>
        <h2 className="text-white font-poppins font-bold text-xl md:text-2xl drop-shadow-md">
          Akashvani Speaking
        </h2>
        <p className="text-white/70 text-sm font-yantramanav mt-1">
          ईमानदार सोच - सच्ची खबरें
        </p>
        <div className="mt-6 flex items-center gap-2 justify-center">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 bg-white rounded-full animate-bounce shadow-md"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}