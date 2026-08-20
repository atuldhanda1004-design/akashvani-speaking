import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { getTimeAgo, formatDate, getYouTubeEmbedUrl, getInstagramEmbedUrl } from '@/lib/utils';
import ShareButtons from '@/components/ShareButtons';
import LiveUpdates from '@/components/LiveUpdates';
import AdBanner from '@/components/AdBanner';
import { Clock, User, Eye, Tag } from 'lucide-react';

export async function generateMetadata({ params }) {
  const { data: news } = await supabase
    .from('news')
    .select('*, categories(name)')
    .eq('slug', params.slug)
    .eq('status', 'approved')
    .single();

  if (!news) return { title: 'Not Found' };

  return {
    title: `${news.meta_title || news.headline} | अक्षरवाणी स्पीकिंग`,
    description: news.meta_description || news.points?.slice(0, 2).join(' | '),
    openGraph: {
      title: news.headline,
      description: news.points?.[0],
      images: news.featured_image ? [news.featured_image] : [],
      type: 'article',
      publishedTime: news.published_at,
      authors: ['अक्षरवाणी स्पीकिंग'],
      tags: news.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: news.headline,
      description: news.points?.[0],
      images: news.featured_image ? [news.featured_image] : [],
    },
  };
}

export default async function NewsPage({ params }) {
  const { data: news } = await supabase
    .from('news')
    .select('*, categories(name, slug), users(full_name), news_updates(*)')
    .eq('slug', params.slug)
    .eq('status', 'approved')
    .single();

  if (!news) notFound();

  // Increment view count
  await supabase
    .from('news')
    .update({ view_count: news.view_count + 1 })
    .eq('id', news.id);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  // Article Schema for Google + AI Search
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.headline,
    description: news.points?.join('. '),
    image: news.featured_image,
    datePublished: news.published_at,
    dateModified: news.updated_at,
    author: { '@type': 'Person', name: news.users?.full_name || 'अक्षरवाणी टीम' },
    publisher: {
      '@type': 'Organization',
      name: 'अक्षरवाणी स्पीकिंग',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png` },
    },
    mainEntityOfPage: `${siteUrl}/news/${news.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Category + Time */}
        <div className="flex items-center gap-3 mb-4 text-sm">
          {news.categories && (
            <a href={`/category/${news.categories.slug}`} className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">
              {news.categories.name}
            </a>
          )}
          {news.is_breaking && (
            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
              🔴 ब्रेकिंग
            </span>
          )}
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
          {news.headline}
        </h1>

        {news.subheadline && (
          <p className="text-lg text-gray-600 mb-4">{news.subheadline}</p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b flex-wrap">
          <span className="flex items-center gap-1">
            <User size={14} /> {news.users?.full_name || 'अक्षरवाणी टीम'}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} /> {formatDate(news.published_at)}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={14} /> {news.view_count} views
          </span>
        </div>

        {/* Featured Image */}
        {news.featured_image && (
          <img
            src={news.featured_image}
            alt={news.headline}
            className="w-full rounded-2xl mb-6 shadow-lg"
          />
        )}

        {/* ⭐ POINT-TO-POINT NEWS (Main Content) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-red-600 rounded"></span>
            खबर की मुख्य बातें
          </h2>
          <ul className="space-y-3">
            {news.points?.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-800 leading-relaxed">
                <span className="bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-base">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 🔄 LIVE UPDATES (Trending News ke liye) */}
        {news.is_trending && news.news_updates?.length > 0 && (
          <LiveUpdates updates={news.news_updates} />
        )}

        {/* Gallery Images */}
        {news.gallery_images?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {news.gallery_images.map((img, i) => (
              <img key={i} src={img} alt={`${news.headline} ${i + 1}`} className="rounded-xl w-full h-48 object-cover" />
            ))}
          </div>
        )}

        {/* 🎥 Video Embed */}
        {news.video_url && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">📹 वीडियो देखें</h3>
            {news.video_type === 'youtube' && (
              <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  src={getYouTubeEmbedUrl(news.video_url)}
                  className="w-full h-full"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}
            {news.video_type === 'instagram' && (
              <div className="max-w-md mx-auto">
                <iframe
                  src={getInstagramEmbedUrl(news.video_url)}
                  className="w-full h-[600px] rounded-2xl"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {news.tags?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <Tag size={14} className="text-gray-400" />
            {news.tags.map((tag) => (
              <a key={tag} href={`/search?q=${tag}`} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-red-50 hover:text-red-600">
                #{tag}
              </a>
            ))}
          </div>
        )}

        {/* 📤 SHARE BUTTONS (WhatsApp Prominent!) */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <ShareButtons headline={news.headline} url={`${siteUrl}/news/${news.slug}`} />
        </div>

        {/* Ad */}
        <AdBanner position="between_news" />
      </article>
    </>
  );
}