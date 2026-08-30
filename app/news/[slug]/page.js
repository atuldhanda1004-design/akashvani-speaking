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
import NewsBody, { NewsInline } from '@/components/NewsBody'
import { SaveButton } from '@/components/TrendingNews'
import { getNewsBySlug } from '@/lib/supabase'
import {
  dummyTrendingNews,
  dummyLatestNews,
  formatDate,
  formatTime,
} from '@/lib/dummyData'
import { SITE_CONFIG } from '@/lib/constants'

export const revalidate = 60

async function getNewsData(rawSlug) {
  const slug = decodeURIComponent(rawSlug || '')
  try {
    const data = await getNewsBySlug(slug)
    if (data) return data
  } catch (e) {
    console.error('DB fetch failed', e)
  }
  const allDummy = [...dummyTrendingNews, ...dummyLatestNews]
  return allDummy.find((n) => n.slug === slug) || null
}

export async function generateMetadata({ params }) {
  const news = await getNewsData(params.slug)
  if (!news) return { title: 'खबर नहीं मिली | Akashvani Speaking' }

  const firstImage = news.featured_image
    ? String(news.featured_image).split(',')[0].trim()
    : ''
  const imageUrl = firstImage || SITE_CONFIG.ogImage
  const canonicalUrl = `https://www.akashvanispeaking.news/news/${params.slug}`

  return {
    title: `${news.headline} | Akashvani Speaking`,
    description: news.subheadline || news.headline,
    facebook: { appId: '966242223397117' },
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: news.headline,
      description: news.subheadline || news.headline,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      locale: 'hi_IN',
      type: 'article',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: news.headline }],
    },
    twitter: {
      card: 'summary_large_image',
      title: news.headline,
      description: news.subheadline || news.headline,
      images: [imageUrl],
    },
  }
}

export default async function NewsDetailPage({ params }) {
  const news = await getNewsData(params.slug)
  if (!news) return notFound()

  const fullText = news.points
    ? news.points.join('\n\n').replace(/\[H\]/g, '')
    : news.subheadline || ''

  const shareUrl = `https://www.akashvanispeaking.news/news/${news.slug}`
  const timeStr = `${formatDate(news.published_at)}, ${formatTime(news.published_at)}`

  const sortedLive = [...(news.live_updates || [])].sort((a, b) => {
    const t = (s) => new Date(`1970-01-01 ${s || ''}`).getTime() || 0
    return t(b.time) - t(a.time)
  })

  const showLiveUpdates =
    (news.is_trending || news.is_breaking) && sortedLive.length > 0

  // Normalize points: if someone pasted whole article as ONE point with \n
  const rawPoints = Array.isArray(news.points) ? news.points : []

  return (
    <>
      <Header />

      <main className="max-w-3xl mx-auto bg-white min-h-screen shadow-sm pb-10">
        <div className="px-4 pt-4 pb-2 bg-white border-b border-gray-50">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-brand-primary font-poppins text-sm font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> वापस जाएं
          </Link>
        </div>

        <ImageSlider
          imageString={news.featured_image}
          headline={news.headline}
          location={news.location || news.categories?.name}
          date={timeStr}
          reporter={news.users?.full_name}
          role={news.users?.role}
        />

        <div className="p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold font-yantramanav text-brand-primary leading-tight mb-4">
            {news.headline}
          </h1>

          {/* Subheadline — keep line breaks + links */}
          {news.subheadline ? (
            <div className="mb-4">
              <NewsBody
                text={news.subheadline}
                className="text-gray-700 [&_p]:text-sm md:[&_p]:text-base"
              />
            </div>
          ) : null}

          <div className="mb-6">
            <TextToSpeech text={fullText} headline={news.headline} />
          </div>

          {showLiveUpdates && (
            <div className="relative border-2 border-brand-red rounded-xl p-4 mb-8 mt-2 bg-red-50/40">
              <div className="absolute -top-3 left-4 bg-brand-red text-white text-xs font-bold px-3 py-1 rounded font-yantramanav">
                लाइव अपडेट
              </div>
              <div className="space-y-3 mt-2">
                {sortedLive.map((update, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 items-start ${
                      idx > 0 ? 'pt-3 border-t border-red-100' : ''
                    }`}
                  >
                    <span className="bg-brand-primary text-white text-[10px] sm:text-xs font-poppins font-bold px-2.5 py-1.5 rounded shrink-0 min-w-[70px] text-center">
                      {update.time}
                    </span>
                    <p className="text-sm sm:text-base font-yantramanav text-gray-800 leading-relaxed whitespace-pre-wrap">
                      <NewsInline text={update.text} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BODY: headings + paragraphs + bullets + links */}
          <div className="space-y-5 mb-8">
            {rawPoints.map((point, idx) => {
              const raw = String(point || '')

              // Custom heading
              if (raw.startsWith('[H]')) {
                return (
                  <h3
                    key={idx}
                    className="font-bold text-lg md:text-xl font-yantramanav text-brand-primary mt-8 border-b border-gray-100 pb-2"
                  >
                    {raw.replace('[H]', '').trim()}
                  </h3>
                )
              }

              // Long multi-line block (article paragraphs pasted in one point)
              // → render as paragraphs, NOT single glued line
              if (raw.includes('\n') || raw.length > 220) {
                return <NewsBody key={idx} text={raw} />
              }

              // Short line → bullet
              return (
                <div key={idx} className="flex gap-3 items-start pl-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2.5 shrink-0" />
                  <p className="text-base text-gray-800 font-yantramanav leading-relaxed">
                    <NewsInline text={raw} />
                  </p>
                </div>
              )
            })}
          </div>

          {news.video_url && (
            <div className="mb-8">
              <h2 className="text-xl font-bold font-yantramanav text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-brand-red rounded-full" /> वीडियो न्यूज़
              </h2>
              <div className="aspect-video rounded-xl overflow-hidden bg-black shadow-md">
                <iframe
                  src={`https://www.youtube.com/embed/${
                    news.video_url.split('v=')[1]?.split('&')[0] ||
                    news.video_url.split('/').pop()
                  }`}
                  className="w-full h-full"
                  allowFullScreen
                  title={news.headline}
                />
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100 flex items-center justify-between mt-8">
            <span className="text-sm font-bold text-gray-700 font-yantramanav">
              शेयर करें:
            </span>
            <div className="flex gap-2 items-center">
              <ShareButtons url={shareUrl} title={news.headline} compact />
              <SaveButton news={news} />
            </div>
          </div>

          <Link
            href="/contact"
            className="block w-full bg-brand-secondary text-white text-sm font-yantramanav py-3.5 rounded-lg text-center hover:bg-brand-primary transition-colors shadow-sm font-bold"
          >
            सूचना सुझाव व जनहित के लिए संपर्क करें
          </Link>
        </div>

        <div className="bg-brand-background p-4 md:p-8 border-t border-gray-200">
          <h2 className="text-lg font-bold font-poppins text-brand-secondary mb-4">
            संबंधित खबरें (Related)
          </h2>
          <RelatedNews
            categorySlug={news.categories?.slug}
            currentId={news.id}
          />
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </>
  )
}