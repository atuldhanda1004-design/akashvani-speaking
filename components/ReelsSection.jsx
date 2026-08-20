'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getYouTubeEmbedUrl } from '@/lib/utils';
import { Play, Heart, Share2 } from 'lucide-react';

export default function ReelsSection() {
  const [reels, setReels] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  const loadReels = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const { data } = await supabase
      .from('news')
      .select('*')
      .eq('status', 'approved')
      .not('video_url', 'is', null)
      .order('published_at', { ascending: false })
      .range(page * 10, (page + 1) * 10 - 1);

    if (data?.length < 10) setHasMore(false);
    setReels((prev) => [...prev, ...(data || [])]);
    setPage((p) => p + 1);
    setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadReels();
  }, []);

  // Infinite scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 200) {
        loadReels();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loadReels]);

  if (!reels.length) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-black text-gray-900 mb-4">📱 शॉर्ट न्यूज़ / रील्स</h2>

      {/* Mobile: Full screen swipe | Desktop: Grid */}
      <div
        ref={containerRef}
        className="md:hidden h-[80vh] overflow-y-scroll snap-y snap-mandatory rounded-2xl bg-black"
      >
        {reels.map((reel, i) => (
          <div key={reel.id} className="h-[80vh] snap-start relative flex items-center justify-center">
            {reel.video_type === 'youtube' ? (
              <iframe
                src={`${getYouTubeEmbedUrl(reel.video_url)}?autoplay=${i === activeIndex ? 1 : 0}`}
                className="w-full h-full"
                allowFullScreen
              />
            ) : (
              <video src={reel.uploaded_video_url} className="w-full h-full object-cover" controls loop />
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
              <h3 className="font-bold text-sm mb-1">{reel.headline}</h3>
              <p className="text-xs text-gray-300">{reel.points?.[0]}</p>
            </div>
          </div>
        ))}
        {loading && <div className="text-white text-center py-4">लोड हो रहा है...</div>}
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
        {reels.slice(0, 8).map((reel) => (
          <a key={reel.id} href={`/news/${reel.slug}`} className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-900">
            {reel.featured_image && (
              <img src={reel.featured_image} alt={reel.headline} className="w-full h-full object-cover group-hover:scale-105 transition" />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Play className="text-white" size={48} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <p className="text-xs font-bold line-clamp-2">{reel.headline}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}