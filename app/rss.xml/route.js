import { dummyTrendingNews, dummyLatestNews } from '@/lib/dummyData'

export async function GET() {
  const baseUrl = 'https://akashvanispeaking.news'
  const allNews = [...dummyTrendingNews, ...dummyLatestNews]

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Akashvani Speaking</title>
    <link>${baseUrl}</link>
    <description>हरियाणा की सबसे तेज़ और विश्वसनीय हिंदी न्यूज़ पोर्टल</description>
    <language>hi</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${allNews.map(news => `
    <item>
      <title><![CDATA[${news.headline}]]></title>
      <link>${baseUrl}/news/${news.slug}</link>
      <description><![CDATA[${news.subheadline || news.headline}]]></description>
      <pubDate>${new Date(news.published_at).toUTCString()}</pubDate>
      <guid>${baseUrl}/news/${news.slug}</guid>
      ${news.featured_image ? `<enclosure url="${news.featured_image}" type="image/jpeg"/>` : ''}
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