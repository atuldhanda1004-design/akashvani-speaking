import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreakingTicker from '@/components/BreakingTicker';
import LiveUpdates from '@/components/LiveUpdates';
import LatestNews from '@/components/LatestNews';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <BreakingTicker />
      <Header />

      <main className="min-h-screen pb-12">
        {/* Section 1: LIVE UPDATES (Top — Horizontal Swipe) */}
        <LiveUpdates />

        {/* Section 2: LATEST NEWS (Below — Photo + Headline + Time) */}
        <LatestNews />
      </main>

      <Footer />
    </>
  );
}