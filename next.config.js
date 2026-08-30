/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.akashvanispeaking.news' },
      { protocol: 'https', hostname: 'akashvanispeaking.news' },
    ],
  },
}
module.exports = nextConfig