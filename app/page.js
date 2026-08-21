import { supabase } from '@/lib/supabase';
import { FALLBACK_NEWS } from '@/lib/dummyData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreakingTicker from '@/components/BreakingTicker';
import LiveUpdates from '@/components/LiveUpdates';
import LatestNews from '@/components/LatestNews';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  let allNews = [];

  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('status', 'approved')
      .order('published_at', { ascending: false });

    if (!error && data && data.length > 0) {
      allNews = data;
    } else {
      allNews = FALLBACK_NEWS;
    }
  } catch (err) {
    allNews = FALLBACK_NEWS;
  }

  // Ticker items
  const tickerItems = allNews.filter((n) => n.is_breaking || n.is_trending);

  // Live Updates items (Trending / Breaking)
  const liveItems = allNews.filter((n) => n.is_trending);
  const finalLive = liveItems.length > 0 ? liveItems : allNews.slice(0, 4);

  // Latest News items
  const latestItems = allNews;

  return (
    <>
      <BreakingTicker items={tickerItems.length > 0 ? tickerItems : allNews.slice(0, 3)} />
      <Header />

      <main className="min-h-screen pb-16 max-w-7xl mx-auto px-4">
        {/* Section 1: LIVE UPDATES (Right to Left Horizontal Swipe) */}
        <LiveUpdates news={finalLive} />

        {/* Section 2: LATEST NEWS (Grid Section) */}
        <LatestNews news={latestItems} />
      </main>

      <Footer />
    </>
  );
}