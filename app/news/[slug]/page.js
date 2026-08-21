import { supabase } from '@/lib/supabase';
import { FALLBACK_NEWS } from '@/lib/dummyData';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShareButtons from '@/components/ShareButtons';
import { Clock, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function timeAgo(dateStr) {
  if (!dateStr) return 'अभी-अभी';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return 'अभी-अभी';
  if (diff < 60) return `${diff} मिनट पहले`;
  if (diff < 1440) return `${Math.floor(diff / 60)} घंटे पहले`;
  return `${Math.floor(diff / 1440)} दिन पहले`;
}

export async function generateMetadata({ params }) {
  const slug = params.slug;
  let item = FALLBACK_NEWS.find((n) => n.slug === slug);
  try {
    const { data } = await supabase.from('news').select('*').eq('slug', slug).single();
    if (data) item = data;
  } catch (e) {}

  return {
    title: item ? `${item.headline} | Akashvani Speaking` : 'Akashvani Speaking News',
    description: item?.points?.[0] || 'ताज़ा खबर पढ़ें Akashvani Speaking पर',
  };
}

export default async function NewsDetailPage({ params }) {
  const slug = params.slug;
  let news = null;

  // 1. Check Supabase
  try {
    const { data } = await supabase.from('news').select('*').eq('slug', slug).single();
    if (data) news = data;
  } catch (e) {}

  // 2. Fallback check
  if (!news) {
    news = FALLBACK_NEWS.find((n) => n.slug === slug) || FALLBACK_NEWS[0];
  }

  const categoryName = news.category || (news.categories && news.categories.name) || 'ताज़ा खबर';

  return (
    <>
      <Header />

      <main className="min-h-screen max-w-4xl mx-auto px-4 py-8">
        {/* Back button & Category */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-red-600 transition">
            <ArrowLeft size={16} /> मुख्य पृष्ठ पर लौटें
          </Link>
          <span className="bg-red-50 text-red-600 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            {categoryName}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
          {news.headline}
        </h1>

        {news.subheadline && (
          <p className="text-base md:text-lg text-gray-600 font-medium mb-4 leading-relaxed">
            {news.subheadline}
          </p>
        )}

        {/* Time Stamp */}
        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-6 pb-4 border-b border-gray-200">
          <Clock size={14} />
          <span>प्रकाशित: {timeAgo(news.published_at)}</span>
          {news.is_breaking && (
            <span className="ml-2 bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">
              BREAKING
            </span>
          )}
        </div>

        {/* Featured Image */}
        {news.featured_image && (
          <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
            <img
              src={news.featured_image}
              alt={news.headline}
              className="w-full h-auto max-h-[480px] object-cover"
            />
          </div>
        )}

        {/* ⭐ POINT-TO-POINT NEWS CONTENT */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg md:text-xl font-black text-gray-900 mb-6 flex items-center gap-2 border-b pb-3">
            <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
            खबर के मुख्य बिंदु (Key Highlights)
          </h2>

          <div className="space-y-4">
            {news.points && news.points.map((point, index) => (
              <div key={index} className="flex items-start gap-3.5">
                <span className="bg-red-600 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  {index + 1}
                </span>
                <p className="text-gray-800 text-base md:text-lg leading-relaxed font-normal">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Share Box */}
        <div className="bg-gray-100 rounded-2xl p-6 mb-8 border border-gray-200">
          <p className="text-sm font-bold text-gray-700 mb-3">इस खबर को दोस्तों के साथ साझा करें:</p>
          <ShareButtons headline={news.headline} />
        </div>
      </main>

      <Footer />
    </>
  );
}