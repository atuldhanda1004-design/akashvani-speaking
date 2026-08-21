export default function NewsJsonLd({ news }) {
  if (!news) return null

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akashvanispeaking.news'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/news/${news.slug}`,
    },
    headline: news.headline,
    description: news.subheadline || news.headline,
    image: news.featured_image ? [news.featured_image] : [],
    datePublished: news.published_at,
    dateModified: news.published_at,
    author: {
      '@type': 'Person',
      name: news.users?.full_name || 'Akashvani Speaking',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Akashvani Speaking',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    articleSection: news.categories?.name || 'हरियाणा',
    inLanguage: 'hi',
    isAccessibleForFree: true,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}