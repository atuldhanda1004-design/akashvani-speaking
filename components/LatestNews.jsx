'use client';

function timeAgo(dateStr) {
  if (!dateStr) return 'अभी-अभी';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return 'अभी-अभी';
  if (diff < 60) return `${diff} मिनट पहले`;
  if (diff < 1440) return `${Math.floor(diff / 60)} घंटे पहले`;
  return `${Math.floor(diff / 1440)} दिन पहले`;
}

export default function LatestNews({ news = [] }) {
  if (!news || news.length === 0) return null;

  return (
    <section id="latest" className="max-w-7xl mx-auto px-4 mt-10">
      <div className="flex items-center justify-between border-b pb-3 mb-6">
        <h2 className="text-xl font-black text-gray-900 border-l-4 border-red-600 pl-3">
          LATEST NEWS
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <a
            key={item.id}
            href={`/news/${item.slug}`}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition group flex flex-col justify-between"
          >
            <div>
              {/* Photo */}
              <div className="h-48 overflow-hidden bg-gray-100 relative">
                <img
                  src={item.featured_image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'}
                  alt={item.headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                {item.categories && (
                  <span className="absolute bottom-3 left-3 bg-black/80 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    {item.categories.name}
                  </span>
                )}
              </div>

              {/* Text */}
              <div className="p-4">
                <h3 className="font-bold text-base text-gray-900 line-clamp-2 group-hover:text-red-600 transition leading-snug">
                  {item.headline}
                </h3>
                {item.points && item.points[0] && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                    • {item.points[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Time & Action */}
            <div className="px-4 pb-4 pt-2 border-t border-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium">
                🕐 {timeAgo(item.published_at)}
              </span>
              <span className="text-xs text-red-600 font-bold group-hover:translate-x-1 transition">
                पूरा पढ़ें →
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}