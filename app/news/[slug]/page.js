import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TextToSpeech from '@/components/TextToSpeech'
import ShareButtons from '@/components/ShareButtons'
import ScrollToTop from '@/components/ScrollToTop'
import RelatedNews from '@/components/RelatedNews'
import ImageSlider from '@/components/ImageSlider'
import { getNewsBySlug } from '@/lib/supabase'
import { dummyTrendingNews, dummyLatestNews, formatDate, formatTime } from '@/lib/dummyData'
import { SITE_CONFIG } from '@/lib/constants'

export const revalidate = 60

async function getNewsData(slug) {
  try {
    const data = await getNewsBySlug(slug)
    if (data) return data
  } catch (error) {
    console.error("DB Fetch failed, falling back to dummy data")
  }
  
  // STRONG FALLBACK: 404 रोकने के लिए
  const allDummyNews = [...dummyTrendingNews, ...dummyLatestNews]
  return allDummyNews.find((n) => n.slug === slug) || null
}

export async function generateMetadata({ params }) {
  const news = await getNewsData(params.slug)
  if (!news) return { title: 'खबर नहीं मिली' }
  const firstImage = news.featured_image ? news.featured_image.split(',')[0] : ''
  return {
    title: news.headline,
    description: news.subheadline || news.headline,
    openGraph: {
      title: news.headline,
      description: news.subheadline,
      images: [{ url: firstImage, width: 1200, height: 630 }],
      type: 'article',
    }
  }
}

export default async function NewsDetailPage({ params }) {
  const news = await getNewsData(params.slug)
  
  if (!news) {
    return notFound() // सिर्फ तब 404 आएगा जब असली में खबर न हो
  }

  const fullText = news.points ? news.points.join('। ').replace(/\[H\]/g, '') : news.subheadline || ''
  const shareUrl = `${SITE_CONFIG.url}/news/${news.slug}`
  const timeStr = `${formatDate(news.published_at)}, ${formatTime(news.published_at)}`

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto bg-white min-h-screen shadow-sm">
        <div className="px-4 pt-4 pb-2 bg-white">
          <Link href="/" className="inline-flex items-center gap-2 text-brand-primary font-poppins text-sm font-medium hover:underline group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> वापस जाएं
          </Link>
        </div>

        <ImageSlider 
          imageString={news.featured_image} 
          headline={news.headline}
          location={news.location || news.categories?.name}
          date={timeStr}
          reporter={news.users?.full_name}
        />

        <div className="p-4 md:p-8">
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
             <ShareButtons url={shareUrl} title={news.headline} />
          </div>

          <div className="space-y-4 mb-8">
            {news.points?.map((point, idx) => {
              if (point.startsWith('[H]')) {
                const headingText = point.replace('[H]', '').trim()
                return (
                  <h3 key={idx} className="font-bold text-lg md:text-xl font-yantramanav text-brand-primary mt-8 border-b border-gray-100 pb-2">
                    {headingText}
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

          {news.video_url && (
            <div className="mb-8">
              <h2 className="text-xl font-bold font-yantramanav text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-brand-red rounded-full" />वीडियो न्यूज़
              </h2>
              <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-md">
                <iframe
                  src={`https://www.youtube.com/embed/${news.video_url.split('v=')[1]?.split('&')[0] || news.video_url.split('/').pop()}`}
                  className="w-full h-full" allowFullScreen
                />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-8 border-t border-gray-100 pt-6">
            <Link href="/contact" className="flex-1 bg-brand-secondary text-white text-xs md:text-sm font-yantramanav py-3 rounded text-center hover:bg-brand-primary transition-colors shadow-sm">
              सूचना सुझाव व जनहित के लिए संपर्क करें
            </Link>
            <button className="px-4 py-3 border border-gray-200 rounded flex items-center justify-center gap-1.5 text-xs text-gray-600 hover:bg-gray-50 shadow-sm">
              <Bookmark className="w-4 h-4" /> सेव करें
            </button>
          </div>
        </div>
        
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