import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreakingTicker from '@/components/BreakingTicker';
import LiveUpdates from '@/components/LiveUpdates';
import LatestNews from '@/components/LatestNews';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // 1. Fetch Breaking News for Ticker
  const { data: breakingData } = await supabase
    .from('news')
    .select('headline, slug')
    .eq('status', 'approved')
    .order('published_at', { ascending: false })
    .limit(10);

  // 2. Fetch Live Trending Updates (RTL Swipe Section)
  const { data: liveData } = await supabase
    .from('news')
    .select('id, slug, headline, points, published_at, is_breaking, featured_image, categories(name)')
    .eq('status', 'approved')
    .eq('is_trending', true)
    .order('published_at', { ascending: false })
    .limit(8);

  // 3. Fetch Latest News (Grid Section)
  const { data: latestData } = await supabase
    .from('news')
    .select('id, slug, headline, points, published_at, featured_image, is_breaking, categories(name)')
    .eq('status', 'approved')
    .order('published_at', { ascending: false })
    .limit(12);

  return (
    <>
      <BreakingTicker items={breakingData || []} />
      <Header />

      <main className="min-h-screen pb-16">
        {/* SECTION 1: LIVE UPDATES (Right to Left Horizontal Swipe) */}
        <LiveUpdates news={liveData || []} />

        {/* SECTION 2: LATEST NEWS (Photo + Headline + Time Grid) */}
        <LatestNews news={latestData || []} />
      </main>

      <Footer />
    </>
  );
}