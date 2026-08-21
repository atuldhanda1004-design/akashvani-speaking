import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, User, Tag } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ImageWithWatermark from '@/components/ImageWithWatermark'
import TextToSpeech from '@/components/TextToSpeech'
import ShareButtons from '@/components/ShareButtons'
import ScrollToTop from '@/components/ScrollToTop'
import { dummyTrendingNews, dummyLatestNews, formatDate, formatTime, timeAgo } from '@/lib/dummyData'

async function getNewsData(slug) {
  try {
    // Try Supabase first
    // const { getNewsBySlug } = await import('@/lib/supabase')
    // const data = await getNewsBySlug(slug)
    // if (data) return data

    // Fallback to dummy data
    const allNews = [...dummyTrendingNews, ...dummyLatestNews]
    return allNews.find((n) => n.slug === slug) || null
  } catch {
    const allNews = [...dummyTrendingNews, ...dummyLatestNews]
    return allNews.find((n) => n.slug === slug) || null
  }
}

export async function generateMetadata({ params }) {
  const news = await getNewsData(params.slug)
  if (!news) {
    return {
      title: 'खबर नहीं मिली | Akashvani Speaking',
    }
  }
  return {
    title: `${news.headline} | Akashvani Speaking`,
    description: news.subheadline || news.headline,
    openGraph: {
      title: news.headline,
      description: news.subheadline || news.headline,
      images: [{ url: news.featured_image, width: 1200, height: 630, alt: news.headline }],
      type: 'article',
      publishedTime: news.published_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: news.headline,
      description: news.subheadline || news.headline,
      images: [news.featured_image],
    },
  }
}

export default async function NewsDetailPage({ params }) {
  const news = await getNewsData(params.slug)

  if (!news) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold font-yantramanav text-gray-900 mb-4">
            खबर नहीं मिली
          </h1>
          <p className="text-gray-500 font-yantramanav mb-6">
            यह खबर उपलब्ध नहीं है या हटा दी गई है।
          </p>
          <Link href="/" className="btn-navy">
            होम पेज पर जाएं
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  const fullText = news.points ? news.points.join('। ') : news.subheadline || ''

  return (
    <>
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-brand-navy font-poppins text-sm font-medium hover:underline mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          वापस जाएं
        </Link>

        <article className="bg-white rounded-2xl overflow-hidden shadow-sm animate-fade-in">
          {/* Featured Image */}
          <div className="relative">
            <ImageWithWatermark
              src={news.featured_image}
              alt={news.headline}
              location={news.location || news.categories?.name}
              date={formatDate(news.published_at) + ', ' + formatTime(news.published_at)}
              className="h-64 sm:h-80 md:h-96"
              fill
              priority
              sizes="100vw"
            />
            {news.is_breaking && (
              <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-brand-red text-white px-4 py-1.5 rounded-full text-sm font-poppins font-bold shadow-lg animate-pulse-red">
                <span className="w-2.5 h-2.5 bg-white rounded-full" />
                LIVE
              </div>
            )}
          </div>

          <div className="p-5 md:p-8">
            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {news.categories && (
                <Link
                  href={`/category/${news.categories.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-navy/10 text-brand-navy rounded-full text-xs font-poppins font-semibold hover:bg-brand-navy/20 transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  {news.categories.name}
                </Link>
              )}
              <span className="flex items-center gap-1 text-gray-400 text-xs font-poppins">
                <Calendar className="w-3 h-3" />
                {timeAgo(news.published_at)}
              </span>
              {news.location && (
                <span className="flex items-center gap-1 text-gray-400 text-xs font-poppins">
                  <MapPin className="w-3 h-3" />
                  {news.location}
                </span>
              )}
            </div>

            {/* Headline */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-yantramanav text-gray-900 leading-tight mb-4">
              {news.headline}
            </h1>

            <div className="w-20 h-1 bg-brand-navy rounded-full mb-5" />

            {/* Text to Speech & Share */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
              <TextToSpeech text={fullText} headline={news.headline} />
              <ShareButtons
                url={`https://akashvanispeaking.news/news/${news.slug}`}
                title={news.headline}
                image={news.featured_image}
              />
            </div>

            {/* Subheadline */}
            {news.subheadline && (
              <p className="text-base md:text-lg text-gray-700 font-yantramanav leading-relaxed mb-6">
                {news.subheadline}
              </p>
            )}

            {/* Live Updates */}
            {news.live_updates && news.live_updates.length > 0 && (
              <div className="mb-8 rounded-xl overflow-hidden border border-gray-100">
                <div className="bg-brand-red text-white px-5 py-3 flex items-center gap-2">
                  <span className="w-3 h-3 bg-white rounded-full animate-pulse-red" />
                  <span className="font-yantramanav font-bold">LIVE</span>
                  <span className="font-yantramanav font-bold ml-1">लाइव अपडेट</span>
                </div>
                <div className="p-4 space-y-3 bg-gray-50">
                  {news.live_updates.map((update, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 animate-fade-in-up"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <span className="bg-brand-navy text-white text-xs font-poppins font-bold px-3 py-1.5 rounded-lg flex-shrink-0 min-w-[85px] text-center">
                        {update.time}
                      </span>
                      <span className="text-brand-red text-lg leading-none mt-0.5">•</span>
                      <p className="text-sm font-yantramanav text-gray-800 leading-relaxed">
                        {update.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bullet Points */}
            {news.points && news.points.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold font-yantramanav text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-brand-navy rounded-full" />
                  मुख्य बिंदु
                </h2>
                <ul className="space-y-3">
                  {news.points.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl animate-fade-in-up"
                      style={{ animationDelay: `${idx * 80}ms` }}
                    >
                      <span className="w-2 h-2 bg-brand-navy rounded-full mt-2 flex-shrink-0" />
                      <p className="text-base font-yantramanav text-gray-800 leading-relaxed">
                        {point}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Video */}
            {news.video_url && (
              <div className="mb-8">
                <h2 className="text-xl font-bold font-yantramanav text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-brand-red rounded-full" />
                  वीडियो
                </h2>
                <div className="aspect-video rounded-xl overflow-hidden bg-black">
                  {news.video_type === 'youtube' ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${news.video_url.split('v=')[1]?.split('&')[0] || news.video_url}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={news.video_url} controls className="w-full h-full" />
                  )}
                </div>
              </div>
            )}

            {/* Reporter Info */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-navy/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-brand-navy" />
                </div>
                <div>
                  <p className="text-sm font-poppins font-medium text-gray-900">
                    {news.users?.full_name || 'Reporter'}
                  </p>
                  <p className="text-xs text-gray-400 font-poppins">
                    Journalist, Akashvani Speaking
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Bottom Share */}
        <div className="mt-6 p-5 bg-white rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 font-yantramanav text-sm">
            यह खबर अपने दोस्तों के साथ शेयर करें
          </p>
          <ShareButtons
            url={`https://akashvanispeaking.news/news/${news.slug}`}
            title={news.headline}
            image={news.featured_image}
          />
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </>
  )
}