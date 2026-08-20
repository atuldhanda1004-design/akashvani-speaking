'use client';
import Link from 'next/link';
import { getTimeAgo } from '@/lib/utils';
import { TrendingUp, Clock, ChevronRight } from 'lucide-react';

export default function TrendingSection({ news }) {
  if (!news?.length) return null;

  const main = news[0];
  const rest = news.slice(1);

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-red-600" size={24} />
        <h2 className="text-2xl font-black text-gray-900">ट्रेंडिंग खबरें</h2>
        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full animate-pulse">
          LIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Trending Card */}
        <Link href={`/news/${main.slug}`} className="group relative rounded-2xl overflow-hidden bg-gray-900 md:row-span-2">
          {main.featured_image && (
            <img
              src={main.featured_image}
              alt={main.headline}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {main.categories && (
              <span className="bg-red-600 text-xs px-2 py-1 rounded mb-2 inline-block">
                {main.categories.name}
              </span>
            )}
            <h3 className="text-2xl font-bold mb-2 group-hover:text-red-300 transition">
              {main.headline}
            </h3>
            <ul className="space-y-1 mb-3">
              {main.points?.slice(0, 3).map((point, i) => (
                <li key={i} className="text-sm text-gray-200 flex items-start gap-1">
                  <span className="text-red-400 mt-1">•</span> {point}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Clock size={12} />
              <span>{getTimeAgo(main.published_at)}</span>
              {main.is_breaking && (
                <span className="bg-red-600 px-1.5 py-0.5 rounded text-white font-bold">
                  ब्रेकिंग
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* Other Trending Cards */}
        {rest.map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.slug}`}
            className="group flex gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border"
          >
            {item.featured_image && (
              <img
                src={item.featured_image}
                alt={item.headline}
                className="w-28 h-20 object-cover rounded-lg shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-sm group-hover:text-red-600 transition line-clamp-2">
                {item.headline}
              </h4>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {item.points?.[0]}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                <Clock size={10} />
                <span>{getTimeAgo(item.published_at)}</span>
                <ChevronRight size={12} className="ml-auto text-red-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}