import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function NewsDetailPage({ params }) {
  const { data: news } = await supabase
    .from('news')
    .select('*, categories(name)')
    .eq('slug', params.slug)
    .single();

  if (!news) return <div className="p-8 text-center text-xl font-bold">404 - खबर नहीं मिली</div>;

  const formattedDate = new Date(news.published_at).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long' });
  const formattedTime = new Date(news.published_at).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto bg-white min-h-screen shadow-sm border-x border-gray-100 pb-16">
        
        {/* Main Image with Location/Time Tag */}
        <div className="relative">
          <img src={news.featured_image || 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1000'} alt={news.headline} className="w-full h-auto object-cover max-h-[400px]" />
          <div className="absolute top-4 left-4 w-9 h-9 rounded-full border-2 border-white/50 bg-black/30 flex items-center justify-center text-white font-bold text-xs backdrop-blur-sm shadow-lg">AS</div>
          <div className="absolute bottom-4 left-4 bg-black/90 text-white text-xs font-semibold px-4 py-1.5 rounded shadow-lg">
            {news.categories?.name} / {formattedDate}, {formattedTime}
          </div>
        </div>

        {/* Article Content */}
        <div className="p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug mb-6 border-b pb-4">
            {news.headline}
          </h1>

          {news.subheadline && (
            <p className="text-slate-600 text-sm md:text-base font-medium mb-6 leading-relaxed">
              {news.subheadline}
            </p>
          )}

          {/* Red LIVE Box (If Breaking/Trending) */}
          {(news.is_breaking || news.is_trending) && (
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-8 shadow-sm">
              <div className="bg-[#cc0000] text-white px-4 py-2.5 flex items-center gap-3">
                <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                <span className="font-bold text-sm tracking-wide">LIVE</span>
                <span className="font-semibold text-sm border-l border-white/30 pl-3 ml-1">लाइव अपडेट</span>
              </div>
              <div className="p-4 bg-red-50/30">
                <div className="flex items-start gap-4">
                  <span className="text-red-700 font-bold text-sm shrink-0 mt-0.5">{formattedTime}</span>
                  <p className="text-slate-800 text-sm font-medium leading-relaxed">{news.points[0]}</p>
                </div>
              </div>
            </div>
          )}

          {/* Details Points */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-gray-200 pb-2">मुख्य बिंदु</h3>
            <ul className="space-y-3">
              {news.points?.map((point, i) => (
                <li key={i} className="flex gap-3 text-slate-700 font-medium text-[15px] leading-relaxed">
                  <span className="text-slate-800 font-black mt-1">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}