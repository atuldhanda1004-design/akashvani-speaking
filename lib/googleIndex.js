/**
 * Ping Google when sitemap updates.
 * After site is live, call this after publishing news.
 */
export async function pingGoogleSitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akashvanispeaking.news'
  const sitemapUrl = `${siteUrl}/sitemap.xml`

  try {
    // Google sitemap ping
    await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      { method: 'GET', cache: 'no-store' }
    ).catch(() => null)

    // Bing sitemap ping
    await fetch(
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      { method: 'GET', cache: 'no-store' }
    ).catch(() => null)

    return true
  } catch {
    return false
  }
}