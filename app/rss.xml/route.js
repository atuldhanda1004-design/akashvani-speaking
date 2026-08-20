import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: news } = await supabase
      .from('news')
      .select('*, categories(name)')
      .eq('status', 'approved')
      .order('published_at', { ascending: false })
      .limit(50);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akashvanispeaking.news';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>अक्षरवाणी स्पीकिंग</title>
  <link>${baseUrl}</link>
  <description>हरियाणा और भारत की ताज़ा खबरें</description>
  <language>hi</language>
  <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>`;

    news?.forEach((n) => {
      xml += `
  <item>
    <title><![CDATA[${n.headline}]]></title>
    <link>${baseUrl}/news/${n.slug}</link>
    <description><![CDATA[${n.points?.join('. ') || ''}]]></description>
    <pubDate>${n.published_at ? new Date(n.published_at).toUTCString() : new Date().toUTCString()}</pubDate>
    <category>${n.categories?.name || 'News'}</category>
    <guid>${baseUrl}/news/${n.slug}</guid>
  </item>`;
    });

    xml += '\n</channel>\n</rss>';

    return new Response(xml, {
      headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' },
    });
  } catch (e) {
    return new Response('<rss version="2.0"><channel><title>Akashvani Speaking</title></channel></rss>', {
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}