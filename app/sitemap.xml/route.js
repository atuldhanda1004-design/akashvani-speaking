import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: news } = await supabase
      .from('news')
      .select('slug, updated_at')
      .eq('status', 'approved')
      .order('published_at', { ascending: false });

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akashvanispeaking.news';

    const staticPages = [
      { url: '/', priority: '1.0', freq: 'always' },
      { url: '/trending', priority: '0.9', freq: 'hourly' },
      { url: '/latest', priority: '0.9', freq: 'hourly' },
      { url: '/videos', priority: '0.8', freq: 'daily' },
      { url: '/reels', priority: '0.8', freq: 'daily' },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;

    staticPages.forEach((page) => {
      xml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.freq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    news?.forEach((n) => {
      xml += `
  <url>
    <loc>${baseUrl}/news/${n.slug}</loc>
    <lastmod>${n.updated_at || new Date().toISOString()}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
    <news:news>
      <news:publication>
        <news:name>आकाशवाणी स्पीकिंग</news:name>
        <news:language>hi</news:language>
      </news:publication>
      <news:publication_date>${n.updated_at || new Date().toISOString()}</news:publication_date>
    </news:news>
  </url>`;
    });

    xml += '\n</urlset>';

    return new Response(xml, {
      headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' },
    });
  } catch (e) {
    return new Response('<urlset></urlset>', {
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}