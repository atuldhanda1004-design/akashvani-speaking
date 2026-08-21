import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata = { title: 'नियम एवं शर्तें' }

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 animate-fade-in">
          <h1 className="text-3xl font-bold font-yantramanav text-brand-navy mb-6">नियम एवं शर्तें</h1>

          <div className="space-y-6 text-gray-700 font-yantramanav leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">1. स्वीकृति</h2>
              <p>{SITE_CONFIG.name} का उपयोग करके, आप इन नियमों और शर्तों को स्वीकार करते हैं।</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">2. Content का उपयोग</h2>
              <p>हमारी website पर सभी content ({SITE_CONFIG.name}) का copyright है। बिना अनुमति के इसका उपयोग करना मना है।</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">3. सटीकता</h2>
              <p>हम सटीक जानकारी प्रदान करने का प्रयास करते हैं, लेकिन किसी भी errors या omissions के लिए जिम्मेदार नहीं हैं।</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">4. User Conduct</h2>
              <p>आप हमारी website का उपयोग किसी भी illegal या harmful गतिविधि के लिए नहीं करेंगे।</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">5. Disclaimer</h2>
              <p>हमारी website &quot;as is&quot; प्रदान की जाती है। हम किसी भी warranty की गारंटी नहीं देते।</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">6. बदलाव</h2>
              <p>हम इन नियमों को कभी भी बदलने का अधिकार रखते हैं। बदलाव पेज पर तुरंत प्रभावी होंगे।</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-2">7. संपर्क</h2>
              <p>प्रश्नों के लिए: <a href={`mailto:${SITE_CONFIG.email}`} className="text-brand-navy hover:underline">{SITE_CONFIG.email}</a></p>
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