'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { LiveUpdateSkeleton } from './SkeletonLoader'
import { dummyCategories } from '@/lib/dummyData'

export default function LiveUpdatesBar({ updates = [] }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const visibleUpdates = isExpanded ? updates : updates.slice(0, 3)

  if (isLoading) {
    return (
      <section className="mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="section-title">Live Updates</h2>
              <span className="live-dot" />
            </div>
            <LiveUpdateSkeleton />
          </div>
          <div>
            <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Updates */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="section-title">Live Updates</h2>
            <span className="live-dot" />
          </div>

          <div className="space-y-2.5">
            {visibleUpdates.map((update, idx) => (
              <Link
                key={update.id}
                href={`/news/${update.slug}`}
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-brand-navy/20 hover:shadow-md transition-all duration-300 group animate-fade-in-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <span className="bg-brand-navy text-white text-xs font-poppins font-bold px-3 py-2 rounded-lg flex-shrink-0 min-w-[80px] text-center">
                  {update.time}
                </span>
                <p className="flex-1 text-sm font-yantramanav text-gray-800 leading-relaxed line-clamp-2 group-hover:text-brand-navy transition-colors">
                  {update.headline}
                </p>
                <span className="text-brand-navy text-xs font-poppins font-semibold flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  पढ़ें
                </span>
              </Link>
            ))}
          </div>

          {updates.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 mx-auto mt-4 text-sm text-brand-navy font-poppins font-semibold hover:underline transition-all"
            >
              {isExpanded ? 'कम दिखाएं' : 'और लाइव अपडेट देखें'}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
        </div>

        {/* Popular Categories */}
        <div>
          <h2 className="section-title mb-5">Popular Categories</h2>
          <div className="space-y-2">
            {dummyCategories.map((cat, idx) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-brand-navy/20 hover:shadow-md transition-all duration-300 group animate-fade-in-up"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="flex-1 font-yantramanav font-medium text-gray-700 group-hover:text-brand-navy transition-colors text-[15px]">
                  {cat.name}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-navy group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}