'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function BreakingTicker() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('news')
        .select('headline, slug')
        .eq('status', 'approved')
        .or('is_breaking.eq.true,is_trending.eq.true')
        .order('published_at', { ascending: false })
        .limit(8);
      setItems(data || []);
    };
    load();
  }, []);

  if (!items.length) return null;

  const doubled = [...items, ...items];

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="flex items-center max-w-7xl mx-auto px-4">
        <span className="bg-white text-red-600 px-3 py-0.5 rounded text-xs font-black mr-4 shrink-0 pulse-dot">
          ● BREAKING
        </span>
        <div className="overflow-hidden flex-1">
          <div className="animate-scroll-left whitespace-nowrap flex">
            {doubled.map((n, i) => (
              <a key={i} href={`/news/${n.slug}`} className="inline-block mx-6 text-sm font-medium hover:underline">
                {n.headline}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}