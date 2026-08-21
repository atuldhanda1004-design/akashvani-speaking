'use client';
import { useRef, useEffect } from 'react';

function timeAgo(dateStr) {
  if (!dateStr) return 'अभी-अभी';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return 'अभी-अभी';
  if (diff < 60) return `${diff} मिनट पहले`;
  if (diff < 1440) return `${Math.floor(diff / 60)} घंटे पहले`;
  return `${Math.floor(diff / 1440)} दिन पहले`;
}

export default function LiveUpdates({ news = [] }) {
  const scrollRef = useRef(null);

  // Auto scroll effect
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      if (el.scrollLeft <= -(el.scrollWidth - el.clientWidth)) {
        el.scrollLeft = 0;
      } else {
        el.scrollLeft -= 320;
      }
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  if (!news || news.length === 0) return null;

  return (
    <section id="live" className="max-w-7xl mx-auto px-4 mt-6">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2.5 h-2.5 bg-red-600 rounded-full pulse-dot"></span>
        <h2 className="text-xl font-black text-gray-900 tracking-tight">LIVE UPDATES</h2>
        <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-black tracking-wider animate-pulse">
          LIVE
        </span>
      </div>

      {/* RTL Swipe Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3"
        dir="rtl"
      >
        {news.map((item) => (
          <a
            key={item.id}
            href={`/news/${item.slug}`}
            className="min-w-[280px] sm:min-w-[320px] max-w-[320px] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition group shrink-0"
            dir="ltr"
          >
            {/* Image */}
            <div className="h-44 overflow-hidden bg-gray-100 relative">
              <img
                src={item.featured_image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600'}
                alt={item.headline}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              {item.is_breaking && (
                <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold shadow">
                  BREAKING
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  {item.categories?.name || 'ताज़ा खबर'}
                </span>
                <span className="text-[11px] text-gray-400 font-medium">
                  {timeAgo(item.published_at)}
                </span>
              </div>

              <h3 className="font-bold text-sm text-gray-900 line-clamp-2 group-hover:text-red-600 transition leading-snug">
                {item.headline}
              </h3>

              {item.points && item.points[0] && (
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                  • {item.points[0]}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}