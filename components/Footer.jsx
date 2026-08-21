import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-bold text-lg text-white">AS</div>
            <div className="leading-tight text-white">
              <h1 className="text-xl font-bold tracking-wide">Akashvani Speaking</h1>
              <p className="text-[11px] text-gray-400 font-medium">ईमानदार सोच - सच्ची खबरें</p>
            </div>
          </Link>
          <p className="text-xs text-gray-400 leading-relaxed">सच बोलने की आवाज़ — हरियाणा और भारत की सबसे भरोसेमंद हिंदी न्यूज़ वेबसाइट</p>
        </div>

        {/* Links */}
        <div className="text-center md:text-left">
          <h4 className="font-bold text-white mb-4">महत्वपूर्ण लिंक</h4>
          <div className="space-y-2 text-sm font-medium">
            <p className="hover:text-white cursor-pointer transition">हमारे बारे में</p>
            <p className="hover:text-white cursor-pointer transition">संपर्क करें</p>
            <p className="hover:text-white cursor-pointer transition">प्राइवेसी पॉलिसी</p>
            <p className="hover:text-white cursor-pointer transition">नियम एवं शर्तें</p>
          </div>
        </div>

        {/* Social */}
        <div className="text-center md:text-right">
          <h4 className="font-bold text-white mb-4">हमसे जुड़ें</h4>
          <div className="flex items-center justify-center md:justify-end gap-3">
            <span className="w-9 h-9 border border-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:text-slate-900 cursor-pointer transition">▶</span>
            <span className="w-9 h-9 border border-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:text-slate-900 cursor-pointer transition">f</span>
            <span className="w-9 h-9 border border-gray-600 rounded-full flex items-center justify-center hover:bg-white hover:text-slate-900 cursor-pointer transition">𝕏</span>
          </div>
        </div>
      </div>
      <div className="bg-[#0b1120] text-center py-4 text-xs font-medium text-gray-500">
        © {new Date().getFullYear()} Akashvani Speaking. सभी अधिकार सुरक्षित.
      </div>
    </footer>
  );
}