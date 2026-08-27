import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Phone, Mail, MapPin, Globe } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'
import SocialIcons from '@/components/SocialIcons'

export const metadata = {
  title: 'संपर्क करें',
  description: 'Akashvani Speaking से संपर्क करें।',
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 animate-fade-in border border-gray-100">
          <h1 className="text-3xl font-bold font-yantramanav text-brand-primary mb-2 text-center">
            संपर्क करें
          </h1>
          <p className="text-gray-500 font-yantramanav text-center mb-10">
            आपकी प्रतिक्रिया हमारे लिए महत्वपूर्ण है
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-5 bg-brand-background rounded-xl">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Globe className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-gray-900 text-sm">Website</h3>
                <a
                  href={SITE_CONFIG.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 font-poppins text-sm mt-1 break-all hover:text-brand-primary"
                >
                  akashvanispeaking.news
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-brand-background rounded-xl">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-gray-900 text-sm">Email</h3>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-gray-600 font-poppins text-sm mt-1 hover:text-brand-primary break-all"
                >
                  {SITE_CONFIG.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-brand-background rounded-xl">
  <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center shrink-0">
    <Globe className="w-6 h-6 text-brand-primary" />
  </div>
  <div>
    <h3 className="font-poppins font-semibold text-gray-900 text-sm">Developer</h3>
    <p className="text-gray-600 font-poppins text-sm mt-1">{SITE_CONFIG.developer.name}</p>
    <a
      href={SITE_CONFIG.developer.link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand-primary font-poppins font-semibold text-sm mt-1 block hover:underline break-all"
    >
      {SITE_CONFIG.developer.link}
    </a>
  </div>
</div>

            <div className="flex items-start gap-4 p-5 bg-brand-background rounded-xl">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-gray-900 text-sm">Location</h3>
                <p className="text-gray-600 font-poppins text-sm mt-1">हरियाणा, भारत</p>
              </div>
            </div>
          </div>

          {/* Social Media Section - Icons + Links */}
          <div className="mt-12 text-center">
            <h3 className="text-lg font-bold font-yantramanav text-gray-900 mb-2">
              सोशल मीडिया पर जुड़ें
            </h3>
            <p className="text-sm text-gray-500 font-yantramanav mb-6">
              YouTube, Instagram, Facebook और X पर हमें फॉलो करें
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* YouTube */}
              <a
                href={SITE_CONFIG.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <span className="text-xs font-poppins font-medium text-gray-600 group-hover:text-red-600">
                  YouTube
                </span>
              </a>

              {/* Instagram */}
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <span className="text-xs font-poppins font-medium text-gray-600 group-hover:text-pink-600">
                  Instagram
                </span>
              </a>

              {/* Facebook */}
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span className="text-xs font-poppins font-medium text-gray-600 group-hover:text-[#1877F2]">
                  Facebook
                </span>
              </a>

              {/* X / Twitter */}
              <a
                href={SITE_CONFIG.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className="text-xs font-poppins font-medium text-gray-600 group-hover:text-black">
                  X (Twitter)
                </span>
              </a>
            </div>

            {/* Direct links text (optional clarity) */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto text-left">
              <a
                href={SITE_CONFIG.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-poppins text-brand-primary hover:underline truncate px-2"
              >
                ▶ youtube.com/@akashvanispeaking
              </a>
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-poppins text-brand-primary hover:underline truncate px-2"
              >
                ▶ instagram.com/akashvanispeaking
              </a>
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-poppins text-brand-primary hover:underline truncate px-2"
              >
                ▶ facebook.com/akashvanispeaking
              </a>
              <a
                href={SITE_CONFIG.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-poppins text-brand-primary hover:underline truncate px-2"
              >
                ▶ x.com/AkashvaniSpeak
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}