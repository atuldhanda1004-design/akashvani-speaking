'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AlertTriangle } from 'lucide-react';

export default function BreakingTicker() {
  const [breakingNews, setBreakingNews] = useState([]);

  useEffect(() => {
    const fetchBreaking = async () => {
      const { data } = await supabase
        .from('news')
        .select('id, headline, slug')
        .eq('is_breaking', true)
        .eq('status', 'approved')
        .order('published_at', { ascending: false })
        .limit(10);
      setBreakingNews(data || []);
    };
    fetchBreaking();

    // Real-time updates (automated!)
    const channel = supabase
      .channel('breaking-ticker')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, fetchBreaking)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  if (!breakingNews.length) return null;

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="flex items-center max-w-7xl mx-auto px-4">
        <span className="flex items-center gap-1 bg-white text-red-600 px-3 py-1 rounded font-bold text-sm mr-4 shrink-0 animate-pulse">
          <AlertTriangle size={14} /> ब्रेकिंग
        </span>
        <div className="overflow-hidden flex-1">
          <div className="animate-marquee whitespace-nowrap">
            {breakingNews.map((news, i) => (
              <a
                key={news.id}
                href={`/news/${news.slug}`}
                className="inline-block mx-8 hover:underline text-sm"
              >
                🔴 {news.headline}
              </a>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}