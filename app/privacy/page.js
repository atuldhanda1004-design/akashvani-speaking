import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata = { title: 'प्राइवेसी पॉलिसी' }

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 animate-fade-in">
          <h1 className="text-3xl font-bold font-yantramanav text-brand-navy mb-6">प्राइवेसी पॉलिसी</h1>

          <div className="space-y-6 text-gray-700 font-yantramanav leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">1. परिचय</h2>
              <p>{SITE_CONFIG.name} ({SITE_CONFIG.url}) आपकी privacy का सम्मान करता है। यह पॉलिसी बताती है कि हम कौन सी जानकारी collect करते हैं और उसका उपयोग कैसे करते हैं।</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">2. जानकारी का संग्रह</h2>
              <p>हम निम्नलिखित प्रकार की जानकारी एकत्र कर सकते हैं:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Browsing data (pages visited, time spent)</li>
                <li>Device information (browser type, OS)</li>
                <li>IP address (analytics के लिए)</li>
                <li>Cookies और similar technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">3. Cookies</h2>
              <p>हम cookies का उपयोग website experience को बेहतर बनाने के लिए करते हैं। आप अपने browser में cookies disable कर सकते हैं।</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">4. Google AdSense</h2>
              <p>हमारी website पर Google AdSense द्वारा विज्ञापन दिखाए जा सकते हैं। Google cookies का उपयोग करके personalized ads दिखाता है।</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">5. Third-Party Links</h2>
              <p>हमारी site में other websites के links हो सकते हैं। हम उन sites की privacy policies के लिए जिम्मेदार नहीं हैं।</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">6. संपर्क</h2>
              <p>Privacy से संबंधित प्रश्नों के लिए: <a href={`mailto:${SITE_CONFIG.email}`} className="text-brand-navy hover:underline">{SITE_CONFIG.email}</a></p>
            </section>

            <p className="text-sm text-gray-500 pt-6 border-t border-gray-100">
              Last updated: {new Date().toLocaleDateString('hi-IN')}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}