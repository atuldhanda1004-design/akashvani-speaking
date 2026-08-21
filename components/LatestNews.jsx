'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return 'अभी-अभी';
  if (diff < 60) return `${diff} मिनट पहले`;
  if (diff < 1440) return `${Math.floor(diff / 60)} घंटे पहले`;
  return `${Math.floor(diff / 1440)} दिन पहले`;
}

export default function LatestNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('news')
        .select('id, slug, headline, points, published_at, featured_image, is_breaking, categories(name)')
        .eq('status', 'approved')
        .order('published_at', { ascending: false })
        .limit(12);
      setNews(data || []);
    };
    load();
  }, []);

  if (!news.length) {
    return (
      <section id="latest" className="max-w-7xl mx-auto px-4 mt-10">
        <h2 className="text-xl font-black text-gray-900 border-l-4 border-red-600 pl-3 mb-6">LATEST NEWS</h2>
        <div className="bg-white rounded-2xl p-8 text-center text-gray-400 border">
          <p className="text-lg font-semibold">📰 ताज़ा खबरें लोड हो रही हैं...</p>
          <p className="text-sm mt-1">Admin Panel → नई खबर जोड़ें → Editor Approve करें</p>
        </div>
      </section>
    );
  }

  return (
    <section id="latest" className="max-w-7xl mx-auto px-4 mt-10">
      <h2 className="text-xl font-black text-gray-900 border-l-4 border-red-600 pl-3 mb-6">LATEST NEWS</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {news.map((item) => (
          <a
            key={item.id}
            href={`/news/${item.slug}`}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition group"
          >
            {/* Photo */}
            <div className="h-48 overflow-hidden bg-gray-200 relative">
              {item.featured_image ? (
                <img src={item.featured_image} alt={item.headline} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">📰</div>
              )}
              {item.is_breaking && (
                <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">BREAKING</span>
              )}
              {item.categories && (
                <span className="absolute bottom-3 left-3 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                  {item.categories.name}
                </span>
              )}
            </div>

            {/* Headline + Time */}
            <div className="p-4">
              <h3 className="font-bold text-base text-gray-900 line-clamp-2 group-hover:text-red-600 transition leading-snug mb-2">
                {item.headline}
              </h3>
              {item.points?.[0] && (
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">• {item.points[0]}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-medium">
                  🕐 {timeAgo(item.published_at)}
                </span>
                <span className="text-[11px] text-red-600 font-bold group-hover:underline">पूरा पढ़ें →</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}