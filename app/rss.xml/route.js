import { dummyTrendingNews, dummyLatestNews } from '@/lib/dummyData'
import { getNews } from '@/lib/supabase'
import { SITE_CONFIG } from '@/lib/constants'

export async function GET() {
  const baseUrl = SITE_CONFIG.url
  const dbNews = await getNews({ limit: 30 })
  const allNews = dbNews?.length ? dbNews : [...dummyTrendingNews, ...dummyLatestNews]

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_CONFIG.name}</title>
    <link>${baseUrl}</link>
    <description>${SITE_CONFIG.description}</description>
    <language>hi</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${allNews.map((n) => `
    <item>
      <title><![CDATA[${n.headline}]]></title>
      <link>${baseUrl}/news/${n.slug}</link>
      <description><![CDATA[${n.subheadline || n.headline}]]></description>
      <pubDate>${new Date(n.published_at).toUTCString()}</pubDate>
      <guid>${baseUrl}/news/${n.slug}</guid>
      ${n.featured_image ? `<enclosure url="${n.featured_image}" type="image/jpeg"/>` : ''}
    </item>`).join('')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}