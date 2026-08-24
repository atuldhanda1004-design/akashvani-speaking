import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, MapPin, Share2, Bookmark, Tag, User } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ImageWithWatermark from '@/components/ImageWithWatermark'
import TextToSpeech from '@/components/TextToSpeech'
import ShareButtons from '@/components/ShareButtons'
import ScrollToTop from '@/components/ScrollToTop'
import RelatedNews from '@/components/RelatedNews'
import { getNewsBySlug } from '@/lib/supabase'
import { dummyTrendingNews, dummyLatestNews, formatDate, formatTime, timeAgo } from '@/lib/dummyData'
import { SITE_CONFIG } from '@/lib/constants'

export const revalidate = 60

// Fetch News Logic
async function getNewsData(slug) {
  const data = await getNewsBySlug(slug)
  if (data) return data
  const all = [...dummyTrendingNews, ...dummyLatestNews]
  return all.find((n) => n.slug === slug) || null
}

// SEO Metadata Logic
export async function generateMetadata({ params }) {
  const news = await getNewsData(params.slug)
  if (!news) return { title: 'खबर नहीं मिली' }
  return {
    title: news.headline,
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
  if (!news) notFound()

  const fullText = news.points ? news.points.join('। ') : news.subheadline || ''
  const shareUrl = `${SITE_CONFIG.url}/news/${news.slug}`

  return (
    <>
      <Header />

      <main className="max-w-3xl mx-auto bg-white min-h-screen shadow-sm">
        {/* Top Back Button */}
        <div className="px-4 pt-4 pb-2 bg-white">
          <Link href="/" className="inline-flex items-center gap-2 text-brand-primary font-poppins text-sm font-medium hover:underline group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            वापस जाएं
          </Link>
        </div>

        {/* Featured Image */}
        <div className="relative">
          <ImageWithWatermark
            src={news.featured_image}
            alt={news.headline}
            location={news.location || news.categories?.name}
            date={`${formatDate(news.published_at)}, ${formatTime(news.published_at)}`}
            className="h-64 sm:h-80 md:h-96 w-full"
            fill
            priority
            sizes="100vw"
          />
        </div>

        <div className="p-4 md:p-8">
          {/* Headline & Subheadline */}
          <h1 className="text-2xl md:text-3xl font-bold font-yantramanav text-gray-900 leading-tight mb-4">
            {news.headline}
          </h1>

          {news.subheadline && (
            <p className="text-sm md:text-base text-gray-700 font-yantramanav mb-6 leading-relaxed">
              {news.subheadline}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
             <TextToSpeech text={fullText} headline={news.headline} />
          </div>

          {/* Live Update Red Box */}
          {news.live_updates?.length > 0 && (
             <div className="border-2 border-brand-red rounded p-4 mb-6 relative mt-4 bg-white">
               <span className="absolute -top-3.5 left-4 bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-sm">
                 लाइव अपडेट
               </span>
               <div className="flex gap-3 mt-2 items-start">
                 <span className="bg-blue-50 text-brand-primary text-xs font-bold px-3 py-1.5 rounded shrink-0">
                   {news.live_updates[0].time}
                 </span>
                 <p className="text-sm md:text-base font-yantramanav text-gray-800 leading-tight mt-0.5">
                   {news.live_updates[0].text}
                 </p>
               </div>
             </div>
          )}

          {/* Points Section (Parsing logic for Headings) */}
          <div className="space-y-4 mb-8">
            {news.points?.map((point, idx) => {
              // If point includes ":" or starts with "[H]", treat it as a bold heading
              const isHeading = point.includes(':') || point.startsWith('[H]')
              
              if (isHeading) {
                const cleanPoint = point.replace('[H]', '')
                return (
                  <h3 key={idx} className="font-bold text-lg md:text-xl font-yantramanav text-gray-900 mt-6 border-b border-gray-100 pb-2">
                    {cleanPoint}
                  </h3>
                )
              }
              
              return (
                <div key={idx} className="flex gap-3 items-start pl-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 shrink-0" />
                  <p className="text-base text-gray-800 font-yantramanav leading-relaxed">{point}</p>
                </div>
              )
            })}
          </div>

          {/* Video Section */}
          {news.video_url && (
            <div className="mb-8">
              <h2 className="text-xl font-bold font-yantramanav text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-brand-red rounded-full" />वीडियो
              </h2>
              <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-md">
                {news.video_type === 'youtube' ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${news.video_url.split('v=')[1]?.split('&')[0] || news.video_url.split('/').pop()}`}
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

          {/* Reporter Name */}
          <p className="text-xs text-gray-400 font-yantramanav mb-6 border-b border-gray-100 pb-4">
            संवाददाता: <span className="font-bold text-gray-600">{news.users?.full_name || 'Super Administrator'}</span>
          </p>

          {/* Bottom Action Bar (Contact, Share, Save) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-8">
            <Link href="/contact" className="flex-1 bg-brand-secondary text-white text-xs md:text-sm font-yantramanav py-3 rounded text-center hover:bg-brand-primary transition-colors shadow-sm">
              सूचना सुझाव व जनहित के लिए संपर्क करें
            </Link>
            <div className="flex gap-2">
               <div className="flex-1 sm:flex-none">
                 <ShareButtons url={shareUrl} title={news.headline} compact />
               </div>
               <button className="flex-1 sm:flex-none px-4 py-3 border border-gray-200 rounded flex items-center justify-center gap-1.5 text-xs text-gray-600 hover:bg-gray-50 shadow-sm">
                 <Bookmark className="w-4 h-4" /> सेव
               </button>
            </div>
          </div>
        </div>
        
        {/* Related News Section */}
        <div className="bg-brand-background p-4 md:p-8 border-t border-gray-200">
           <h2 className="text-lg font-bold font-poppins text-brand-secondary mb-4">Related News</h2>
           <RelatedNews categorySlug={news.categories?.slug} currentId={news.id} />
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </>
  )
}