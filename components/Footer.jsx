import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-black text-white mb-2">
              अक्षरवाणी <span className="text-red-500">स्पीकिंग</span>
            </h3>
            <p className="text-sm text-gray-400">सच बोलने की आवाज़</p>
            <p className="text-sm text-gray-400 mt-2">हरियाणा और भारत की सबसे भरोसेमंद हिंदी न्यूज़ वेबसाइट</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-3">त्वरित लिंक</h4>
            <div className="space-y-2 text-sm">
              <Link href="/trending" className="block hover:text-red-400">ट्रेंडिंग</Link>
              <Link href="/latest" className="block hover:text-red-400">ताज़ा खबरें</Link>
              <Link href="/videos" className="block hover:text-red-400">वीडियो</Link>
              <Link href="/reels" className="block hover:text-red-400">रील्स</Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-white mb-3">श्रेणियां</h4>
            <div className="space-y-2 text-sm">
              <Link href="/category/haryana" className="block hover:text-red-400">हरियाणा</Link>
              <Link href="/category/politics" className="block hover:text-red-400">राजनीति</Link>
              <Link href="/category/sports" className="block hover:text-red-400">खेल</Link>
              <Link href="/category/business" className="block hover:text-red-400">व्यापार</Link>
            </div>
          </div>

          {/* Social Media (Placeholders) */}
          <div>
            <h4 className="font-bold text-white mb-3">हमसे जुड़ें</h4>
            <div className="flex gap-3 flex-wrap">
              <a href="#" className="bg-blue-600 hover:bg-blue-700 w-10 h-10 rounded-full flex items-center justify-center text-white transition" title="Facebook">📘</a>
              <a href="#" className="bg-pink-600 hover:bg-pink-700 w-10 h-10 rounded-full flex items-center justify-center text-white transition" title="Instagram">📸</a>
              <a href="#" className="bg-red-600 hover:bg-red-700 w-10 h-10 rounded-full flex items-center justify-center text-white transition" title="YouTube">📺</a>
              <a href="#" className="bg-black hover:bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center text-white transition" title="X/Twitter">🐦</a>
              <a href="#" className="bg-green-600 hover:bg-green-700 w-10 h-10 rounded-full flex items-center justify-center text-white transition" title="WhatsApp">💬</a>
              <a href="#" className="bg-blue-500 hover:bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-white transition" title="Telegram">✈️</a>
            </div>
            <p className="text-xs text-gray-500 mt-4">info@akashvanispeaking.news</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} अक्षरवाणी स्पीकिंग | akashvanispeaking.news | सर्वाधिकार सुरक्षित
        </div>
      </div>
    </footer>
  );
}