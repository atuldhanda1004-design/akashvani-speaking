import { dummyTrendingNews, dummyLatestNews, dummyCategories } from '@/lib/dummyData'
import { getNews } from '@/lib/supabase'
import { SITE_CONFIG } from '@/lib/constants'

export async function GET() {
  const baseUrl = SITE_CONFIG.url
  const dbNews = await getNews({ limit: 500 })
  const allNews = dbNews?.length ? dbNews : [...dummyTrendingNews, ...dummyLatestNews]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url><loc>${baseUrl}</loc><changefreq>always</changefreq><priority>1.0</priority></url>
  <url><loc>${baseUrl}/all-news</loc><changefreq>hourly</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/short-news</loc><changefreq>hourly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/about</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>${baseUrl}/contact</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>${baseUrl}/privacy</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>${baseUrl}/terms</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  ${dummyCategories.map((cat) => `<url><loc>${baseUrl}/category/${cat.slug}</loc><changefreq>hourly</changefreq><priority>0.7</priority></url>`).join('')}
  ${allNews.map((n) => `
  <url>
    <loc>${baseUrl}/news/${n.slug}</loc>
    <lastmod>${new Date(n.published_at).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <news:news>
      <news:publication><news:name>Akashvani Speaking</news:name><news:language>hi</news:language></news:publication>
      <news:title><![CDATA[${n.headline}]]></news:title>
      <news:publication_date>${new Date(n.published_at).toISOString()}</news:publication_date>
    </news:news>
  </url>`).join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}