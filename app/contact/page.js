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
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 animate-fade-in">
          <h1 className="text-3xl font-bold font-yantramanav text-brand-navy mb-2 text-center">
            संपर्क करें
          </h1>
          <p className="text-gray-500 font-yantramanav text-center mb-10">
            आपकी प्रतिक्रिया हमारे लिए महत्वपूर्ण है
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-5 bg-brand-lightGray rounded-xl">
              <div className="w-12 h-12 bg-brand-navy/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-brand-navy" />
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-gray-900 text-sm">Website</h3>
                <p className="text-gray-600 font-poppins text-sm mt-1 break-all">akashvanispeaking.news</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-brand-lightGray rounded-xl">
              <div className="w-12 h-12 bg-brand-navy/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-brand-navy" />
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-gray-900 text-sm">Email</h3>
                <a href={`mailto:${SITE_CONFIG.email}`} className="text-gray-600 font-poppins text-sm mt-1 hover:text-brand-navy break-all">
                  {SITE_CONFIG.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-brand-lightGray rounded-xl">
              <div className="w-12 h-12 bg-brand-navy/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-brand-navy" />
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-gray-900 text-sm">Developer</h3>
                <p className="text-gray-600 font-poppins text-sm mt-1">{SITE_CONFIG.developer.name}</p>
                <a href={`tel:${SITE_CONFIG.developer.phone}`}
                  className="text-brand-navy font-poppins font-bold text-sm mt-1 block hover:underline">
                  📞 {SITE_CONFIG.developer.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-brand-lightGray rounded-xl">
              <div className="w-12 h-12 bg-brand-navy/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-brand-navy" />
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-gray-900 text-sm">Location</h3>
                <p className="text-gray-600 font-poppins text-sm mt-1">हरियाणा, भारत</p>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <h3 className="text-lg font-bold font-yantramanav text-gray-900 mb-4">
              सोशल मीडिया पर जुड़ें
            </h3>
            <div className="flex justify-center">
              <div className="bg-brand-navy p-4 rounded-2xl">
                <SocialIcons variant="footer" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}