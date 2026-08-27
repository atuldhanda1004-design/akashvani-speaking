import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Logo from '@/components/Logo'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata = {
  title: 'हमारे बारे में',
  description: 'Akashvani Speaking - हरियाणा की सबसे तेज़ हिंदी न्यूज़ पोर्टल।',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-gray-100">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <Logo size="xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-yantramanav text-brand-primary mb-2">
              {SITE_CONFIG.name}
            </h1>
            <p className="text-gray-500 font-yantramanav text-lg">{SITE_CONFIG.tagline}</p>
          </div>

          <div className="space-y-6 text-gray-700 font-yantramanav text-base leading-relaxed">
            <p>
              <strong>{SITE_CONFIG.name}</strong> हरियाणा की एक प्रमुख डिजिटल न्यूज़ पोर्टल है जो
              ताज़ा, सटीक और विश्वसनीय खबरें &quot;पॉइंट टू पॉइंट&quot; फॉर्मेट में पाठकों तक पहुंचाती है।
            </p>
            <p>
              हमारा मिशन है कि हर नागरिक को सच्ची और पारदर्शी खबरें मिलें। हम हरियाणा के हर जिले
              से ताज़ा खबरें, लाइव अपडेट, और ब्रेकिंग न्यूज़ कवर करते हैं।
            </p>
            <p>
              हमारी टीम अनुभवी पत्रकारों से बनी है जो निष्पक्ष और ईमानदार पत्रकारिता में विश्वास
              रखते हैं। हम technology का उपयोग करके खबरें तेज़ी से आप तक पहुंचाते हैं।
            </p>
          </div>

          <div className="mt-10 p-6 bg-brand-background rounded-xl text-center">
            <p className="text-sm text-gray-500 font-poppins">Website Developed by</p>
            <p className="text-lg font-bold text-brand-primary font-poppins mt-1">
              {SITE_CONFIG.developer.name}
            </p>
            <a
              href={SITE_CONFIG.developer.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm font-poppins text-brand-primary hover:underline break-all"
            >
              {SITE_CONFIG.developer.link}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}