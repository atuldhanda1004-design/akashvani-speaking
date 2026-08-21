import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MessageCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // Fetch News from Database
  const { data: allNews } = await supabase
    .from('news')
    .select('*, categories(name)')
    .eq('status', 'approved')
    .order('published_at', { ascending: false });

  const news = allNews || [];
  
  // Trending News (Top 1)
  const trendingNews = news.find(n => n.is_trending) || news[0];
  
  // Latest News (Next 6)
  const latestNews = news.filter(n => n.id !== trendingNews?.id).slice(0, 6);

  // Live Updates for Bottom Section
  const liveUpdates = news.filter(n => n.is_breaking).slice(0, 5);

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        
        {/* ================= TRENDING NEWS ================= */}
        {trendingNews && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Trending News</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
              <div className="w-full md:w-[45%] h-64 md:h-auto relative">
                <img src={trendingNews.featured_image || 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800'} alt={trendingNews.headline} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 w-8 h-8 rounded-full border-2 border-white/50 bg-black/20 flex items-center justify-center text-white font-bold text-xs backdrop-blur-sm">AS</div>
              </div>
              <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col justify-between bg-slate-50">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 leading-snug mb-4">{trendingNews.headline}</h3>
                  <ul className="space-y-2 text-sm text-slate-600 font-medium">
                    {trendingNews.points?.slice(0,4).map((p, i) => (
                      <li key={i} className="news-bullet line-clamp-1">{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <span className="text-xs font-semibold text-slate-500">
                    {trendingNews.categories?.name} / {new Date(trendingNews.published_at).toLocaleDateString('hi-IN')}
                  </span>
                  <Link href={`/news/${trendingNews.slug}`} className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded font-semibold text-sm transition">
                    पूरी खबर पढ़ें
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= LATEST NEWS ================= */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition">
                <div className="h-52 relative">
                  <img src={item.featured_image || 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=600'} alt={item.headline} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 w-7 h-7 rounded-full border-2 border-white/50 bg-black/30 flex items-center justify-center text-white font-bold text-[10px] backdrop-blur-sm">AS</div>
                  <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[11px] font-semibold px-3 py-1 rounded">
                    {item.categories?.name} / {new Date(item.published_at).toLocaleDateString('hi-IN')}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-800 leading-snug mb-3 line-clamp-2">{item.headline}</h3>
                  <ul className="space-y-1.5 text-xs text-slate-600 font-medium flex-1">
                    {item.points?.slice(0,2).map((p, i) => (
                      <li key={i} className="news-bullet line-clamp-1">{p}</li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-[11px] font-semibold text-slate-400">Akashvani Reporter</span>
                    <div className="flex gap-2">
                      <Link href={`/news/${item.slug}`} className="bg-slate-800 text-white px-3 py-1.5 rounded text-[11px] font-bold hover:bg-slate-700">
                        पूरी खबर पढ़ें
                      </Link>
                      <a href={`https://api.whatsapp.com/send?text=${item.headline}%20https://akashvanispeaking.news/news/${item.slug}`} target="_blank" className="border border-green-500 text-green-600 p-1.5 rounded hover:bg-green-50">
                        <MessageCircle size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= BOTTOM SECTION (Live Updates + Categories) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              Live Updates <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></span>
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
              {liveUpdates.length > 0 ? liveUpdates.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-3 border-b last:border-0 hover:bg-slate-50 transition">
                  <div className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded shrink-0 w-20 text-center">
                    {new Date(item.published_at).toLocaleTimeString('hi-IN', {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 line-clamp-1 flex-1">{item.headline}</h4>
                  <Link href={`/news/${item.slug}`} className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1 rounded text-xs font-bold shrink-0">
                    पढ़ें
                  </Link>
                </div>
              )) : (
                <p className="p-4 text-sm text-gray-500">कोई लाइव अपडेट नहीं है।</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">Popular Categories</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {['हरियाणा', 'देश', 'राजनीति', 'अपराध', 'खेल', 'शिक्षा', 'बिजनेस'].map((cat, i) => (
                <Link key={i} href="#" className="flex items-center justify-between p-3.5 border-b last:border-0 hover:bg-slate-50 transition">
                  <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <span className="text-slate-400">❖</span> {cat}
                  </span>
                  <ChevronRight size={16} className="text-slate-400" />
                </Link>
              ))}
            </div>
          </section>
        </div>

      </main>
      <Footer />
    </>
  );
}