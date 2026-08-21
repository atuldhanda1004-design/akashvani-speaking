'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return 'अभी-अभी';
  if (diff < 60) return `${diff} मिनट पहले`;
  if (diff < 1440) return `${Math.floor(diff / 60)} घंटे पहले`;
  return `${Math.floor(diff / 1440)} दिन पहले`;
}

export default function LiveUpdates() {
  const [news, setNews] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('news')
        .select('id, slug, headline, points, published_at, is_breaking, featured_image, categories(name)')
        .eq('status', 'approved')
        .eq('is_trending', true)
        .order('published_at', { ascending: false })
        .limit(10);
      setNews(data || []);
    };
    load();

    // Auto scroll
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const el = scrollRef.current;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
          el.scrollLeft = 0;
        } else {
          el.scrollLeft += 320;
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (!news.length) {
    return (
      <section className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 bg-red-600 rounded-full pulse-dot"></span>
          <h2 className="text-xl font-black text-gray-900">LIVE UPDATES</h2>
          <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">LIVE</span>
        </div>
        <div className="bg-white rounded-2xl p-8 text-center text-gray-400 border">
          <p className="text-lg font-semibold">🔴 लाइव अपडेट्स जल्द आ रहे हैं...</p>
          <p className="text-sm mt-1">Admin Panel से ट्रेंडिंग न्यूज़ डालें</p>
        </div>
      </section>
    );
  }

  return (
    <section id="live" className="max-w-7xl mx-auto px-4 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2.5 h-2.5 bg-red-600 rounded-full pulse-dot"></span>
        <h2 className="text-xl font-black text-gray-900">LIVE UPDATES</h2>
        <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold animate-pulse">LIVE</span>
      </div>

      {/* Horizontal Scroll Container — Right to Left */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
        dir="rtl"
      >
        {news.map((item) => (
          <a
            key={item.id}
            href={`/news/${item.slug}`}
            className="min-w-[300px] max-w-[320px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group shrink-0"
            dir="ltr"
          >
            {item.featured_image && (
              <div className="h-40 overflow-hidden">
                <img src={item.featured_image} alt={item.headline} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {item.is_breaking && (
                  <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">BREAKING</span>
                )}
                {item.categories && (
                  <span className="text-[10px] text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded">{item.categories.name}</span>
                )}
                <span className="text-[10px] text-gray-400 ml-auto">{timeAgo(item.published_at)}</span>
              </div>
              <h3 className="font-bold text-sm text-gray-900 line-clamp-2 group-hover:text-red-600 transition leading-snug">
                {item.headline}
              </h3>
              {item.points?.[0] && (
                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">• {item.points[0]}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}