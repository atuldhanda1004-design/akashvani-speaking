export async function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /admin/

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: https://akashvanispeaking.news/sitemap.xml
`;

  return new Response(robots, {
    headers: { 'Content-Type': 'text/plain' },
  });
}