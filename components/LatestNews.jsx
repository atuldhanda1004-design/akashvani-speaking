'use client';
import Link from 'next/link';
import { getTimeAgo } from '@/lib/utils';
import { Clock, ChevronRight } from 'lucide-react';

export default function LatestNews({ news }) {
  if (!news || news.length === 0) {
    return <div className="text-gray-500 py-6">कोई ताज़ा खबर नहीं मिली।</div>;
  }

  return (
    <section>
      <div className="flex items-center justify-between border-b pb-3 mb-6">
        <h2 className="text-2xl font-black text-gray-900 border-l-4 border-red-600 pl-3">
          ताज़ा खबरें (Latest News)
        </h2>
      </div>

      <div className="space-y-4">
        {news.map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.slug}`}
            className="group block bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {item.featured_image && (
                <img
                  src={item.featured_image}
                  alt={item.headline}
                  className="w-full sm:w-44 h-28 object-cover rounded-lg shrink-0"
                />
              )}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {item.categories && (
                      <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-0.5 rounded">
                        {item.categories.name}
                      </span>
                    )}
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} /> {getTimeAgo(item.published_at)}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base group-hover:text-red-600 transition line-clamp-2">
                    {item.headline}
                  </h3>
                  {item.points && item.points.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      • {item.points[0]}
                    </p>
                  )}
                </div>
                <div className="mt-2 text-xs text-red-600 font-bold flex items-center gap-1">
                  पूरा पढ़ें <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}