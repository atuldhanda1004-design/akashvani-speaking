export default function manifest() {
  return {
    name: 'Akashvani Speaking',
    short_name: 'Akashvani',
    description: 'हरियाणा की सबसे तेज़ और विश्वसनीय हिंदी न्यूज़ पोर्टल',
    start_url: '/',
    display: 'standalone',
    background_color: '#30567D',
    theme_color: '#30567D',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
}