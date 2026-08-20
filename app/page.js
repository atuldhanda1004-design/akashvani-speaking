import { supabase } from '@/lib/supabase';
import TrendingSection from '@/components/TrendingSection';
import LatestNews from '@/components/LatestNews';
import VideoSection from '@/components/VideoSection';
import ReelsSection from '@/components/ReelsSection';
import AdBanner from '@/components/AdBanner';
import CategoryGrid from '@/components/CategoryGrid';

export const revalidate = 60; // Auto refresh every 60 seconds

export default async function HomePage() {
  // Fetch Trending News
  const { data: trending } = await supabase
    .from('news')
    .select('*, categories(name, slug)')
    .eq('status', 'approved')
    .eq('is_trending', true)
    .order('published_at', { ascending: false })
    .limit(5);

  // Fetch Latest News
  const { data: latest } = await supabase
    .from('news')
    .select('*, categories(name, slug), users(full_name)')
    .eq('status', 'approved')
    .order('published_at', { ascending: false })
    .limit(15);

  // Fetch Videos
  const { data: videos } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'approved')
    .not('video_url', 'is', null)
    .order('published_at', { ascending: false })
    .limit(8);

  // Fetch Ads
  const { data: ads } = await supabase
    .from('ads')
    .select('*')
    .eq('is_active', true);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Ad */}
      <AdBanner ads={ads} position="top_banner" />

      {/* 🔥 Trending Section */}
      <TrendingSection news={trending} />

      {/* Ad between sections */}
      <AdBanner ads={ads} position="between_news" />

      {/* 📰 Latest News + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <LatestNews news={latest} />
        </div>
        <aside className="space-y-6">
          <AdBanner ads={ads} position="sidebar" />
          <CategoryGrid />
        </aside>
      </div>

      {/* 🎬 Videos Section */}
      <VideoSection videos={videos} />

      {/* 📱 Reels Section */}
      <ReelsSection />

      {/* Footer Ad */}
      <AdBanner ads={ads} position="footer" />
    </div>
  );
}