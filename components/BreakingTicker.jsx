'use client';

export default function BreakingTicker({ items = [] }) {
  if (!items || items.length === 0) return null;

  const displayList = [...items, ...items];

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden border-b border-red-700">
      <div className="flex items-center max-w-7xl mx-auto px-4">
        <span className="bg-white text-red-600 px-2.5 py-0.5 rounded text-[11px] font-black mr-4 shrink-0 pulse-dot uppercase">
          ● BREAKING
        </span>
        <div className="overflow-hidden flex-1">
          <div className="animate-scroll-left whitespace-nowrap flex">
            {displayList.map((n, i) => (
              <a
                key={i}
                href={`/news/${n.slug}`}
                className="inline-block mx-6 text-sm font-semibold hover:underline"
              >
                🔴 {n.headline}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}