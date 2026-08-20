import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data: news } = await supabase
    .from('news')
    .select('slug, updated_at')
    .eq('status', 'approved')
    .order('published_at', { ascending: false });

  const baseUrl = 'https://akashvanispeaking.news';

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

  // Static pages
  staticPages.forEach(page => {
    xml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.freq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  });

  // News pages (with news sitemap tags for Google News)
  news?.forEach(n => {
    xml += `
  <url>
    <loc>${baseUrl}/news/${n.slug}</loc>
    <lastmod>${n.updated_at}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
    <news:news>
      <news:publication>
        <news:name>अक्षरवाणी स्पीकिंग</news:name>
        <news:language>hi</news:language>
      </news:publication>
      <news:publication_date>${n.updated_at}</news:publication_date>
    </news:news>
  </url>`;
  });

  xml += '\n</urlset>';

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=3600' },
  });
}