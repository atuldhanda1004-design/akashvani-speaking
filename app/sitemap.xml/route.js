import { dummyTrendingNews, dummyLatestNews, dummyCategories } from '@/lib/dummyData'

export async function GET() {
  const baseUrl = 'https://akashvanispeaking.news'
  const allNews = [...dummyTrendingNews, ...dummyLatestNews]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/all-news</loc>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/short-news</loc>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  ${dummyCategories.map(cat => `
  <url>
    <loc>${baseUrl}/category/${cat.slug}</loc>
    <changefreq>hourly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
  ${allNews.map(news => `
  <url>
    <loc>${baseUrl}/news/${news.slug}</loc>
    <lastmod>${new Date(news.published_at).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <news:news>
      <news:publication>
        <news:name>Akashvani Speaking</news:name>
        <news:language>hi</news:language>
      </news:publication>
      <news:title>${news.headline}</news:title>
      <news:publication_date>${new Date(news.published_at).toISOString()}</news:publication_date>
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