import './globals.css';

export const metadata = {
  title: 'Akashvani Speaking | ईमानदार सोच - सच्ची खबरें',
  description: 'हरियाणा और भारत की सबसे भरोसेमंद हिंदी न्यूज़ वेबसाइट',
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Yantramanav:wght@400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}