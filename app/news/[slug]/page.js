import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TextToSpeech from '@/components/TextToSpeech'
import ShareButtons from '@/components/ShareButtons'
import ScrollToTop from '@/components/ScrollToTop'
import RelatedNews from '@/components/RelatedNews'
import ImageSlider from '@/components/ImageSlider'
import { getNewsBySlug } from '@/lib/supabase'
import { formatDate, formatTime } from '@/lib/dummyData'
import { SITE_CONFIG } from '@/lib/constants'
import { SaveButton } from '@/components/TrendingNews'

export const revalidate = 60

async function getNewsData(slug) {
  // DB Fetch Code remains same
  const data = await getNewsBySlug(slug)
  return data || null
}

export async function generateMetadata({ params }) {
  const news = await getNewsData(params.slug)
  if (!news) return { title: 'खबर नहीं मिली' }
  const firstImage = news.featured_image ? news.featured_image.split(',')[0] : ''
  return {
    title: news.headline,
    description: news.subheadline,
    openGraph: {
      title: news.headline,
      description: news.subheadline,
      // FB share image with watermark generated dynamically (Step 7)
      images: [{ url: `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent(news.headline)}&img=${encodeURIComponent(firstImage)}`, width: 1200, height: 630 }],
      type: 'article',
    }
  }
}

export default async function NewsDetailPage({ params }) {
  const news = await getNewsData(params.slug)
  if (!news) notFound()

  const fullText = news.points ? news.points.join('। ').replace(/\[H\]/g, '') : news.subheadline || ''
  const shareUrl = `${SITE_CONFIG.url}/news/${news.slug}`
  const timeStr = `${formatDate(news.published_at)}, ${formatTime(news.published_at)}`

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto bg-white min-h-screen shadow-sm pb-10">
        
        {/* NO EMOJI, ONLY ICON */}
        <div className="px-4 pt-4 pb-2 bg-white border-b border-gray-50">
          <Link href="/" className="inline-flex items-center gap-1.5 text-brand-primary font-poppins text-sm font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> वापस जाएं
          </Link>
        </div>

        <ImageSlider 
          imageString={news.featured_image} 
          headline={news.headline}
          location={news.location}
          date={timeStr}
          reporter={news.users?.full_name}
        />

        <div className="p-4 md:p-8">
          {/* BLUE HEADLINE */}
          <h1 className="text-2xl md:text-3xl font-bold font-yantramanav text-brand-primary leading-tight mb-4">
            {news.headline}
          </h1>

          {news.subheadline && (
             <p className="text-sm md:text-base text-gray-700 font-yantramanav mb-4">{news.subheadline}</p>
          )}

          <div className="mb-6"><TextToSpeech text={fullText} headline={news.headline} /></div>

          {/* DYNAMIC POINTS */}
          <div className="space-y-4 mb-8">
            {news.points?.map((point, idx) => {
              if (point.startsWith('[H]')) {
                return (
                  <h3 key={idx} className="font-bold text-xl text-brand-primary mt-8 border-b border-gray-100 pb-2">
                    {point.replace('[H]', '').trim()}
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

          {/* SHARE & SAVE RIGHT ABOVE CONTACT BUTTON */}
          <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-700">शेयर करें:</span>
            <div className="flex gap-2">
              <ShareButtons url={shareUrl} title={news.headline} compact />
              <SaveButton news={news} />
            </div>
          </div>

          <Link href="/contact" className="block w-full bg-brand-secondary text-white text-sm font-yantramanav py-3.5 rounded-lg text-center hover:bg-brand-primary transition-colors shadow-sm font-bold">
            सूचना सुझाव व जनहित के लिए संपर्क करें
          </Link>
        </div>
        
        <div className="bg-brand-background p-4 md:p-8 border-t border-gray-200">
           <h2 className="text-lg font-bold font-poppins text-brand-secondary mb-4">संबंधित खबरें (Related)</h2>
           <RelatedNews categorySlug={news.categories?.slug} currentId={news.id} />
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </>
  )
}