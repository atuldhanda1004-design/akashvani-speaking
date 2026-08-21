import Header from '@/components/Header';
import { MessageCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        
        {/* ================= TRENDING NEWS (Horizontal Card) ================= */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            Trending News
          </h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
            {/* Left: Image with 'AS' Watermark */}
            <div className="w-full md:w-[45%] h-64 md:h-auto relative">
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80" 
                alt="Police" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full border-2 border-white/50 bg-black/20 flex items-center justify-center text-white font-bold text-xs backdrop-blur-sm">
                AS
              </div>
            </div>

            {/* Right: Content */}
            <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col justify-between bg-slate-50">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 leading-snug mb-4">
                  हरियाणा में डीजीपी ने पुलिस प्रशासन को दिए सख्त आदेश
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 font-medium">
                  <li className="news-bullet">पुलिस कर्मचारी रिश्वत लेने से पहले 100 बार सोचें!</li>
                  <li className="news-bullet">जांच में ढिलाई हुई तो सस्पेंशन पक्का</li>
                  <li className="news-bullet">पुलिस कर्मचारी 'गोल्डन शब्द' का इस्तेमाल करें</li>
                  <li className="news-bullet">समय पर ड्यूटी ज्वाइन करें</li>
                </ul>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <span className="text-xs font-semibold text-slate-500">हरियाणा / 4 घंटे पहले</span>
                <button className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded font-semibold text-sm transition">
                  पूरी खबर पढ़ें
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= LATEST NEWS (3 Column Grid) ================= */}
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            Latest News
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              {/* Image Box */}
              <div className="h-52 relative">
                <img src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=600&q=80" alt="News" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 w-7 h-7 rounded-full border-2 border-white/50 bg-black/30 flex items-center justify-center text-white font-bold text-[10px] backdrop-blur-sm">AS</div>
                {/* Black Tag at Bottom Left */}
                <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[11px] font-semibold px-3 py-1 rounded">
                  भिवानी / 14 अगस्त
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 leading-snug mb-3">
                  मनीषा मामले में सीबीआई ने अदालत में की जांच रिपोर्ट पेश
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600 font-medium flex-1">
                  <li className="news-bullet">परिवार जांच से खुश नहीं</li>
                  <li className="news-bullet">मनीषा के पिता ने बुलाई अपनी समाज की पंचायत</li>
                </ul>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-[11px] font-semibold text-slate-400">Journalist Sumit Sheoran</span>
                  <div className="flex gap-2">
                    <button className="bg-slate-800 text-white px-3 py-1.5 rounded text-[11px] font-bold hover:bg-slate-700">
                      पूरी खबर पढ़ें
                    </button>
                    <button className="border border-green-500 text-green-600 p-1.5 rounded hover:bg-green-50">
                      <MessageCircle size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className="h-52 relative">
                <img src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=600&q=80" alt="News" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 w-7 h-7 rounded-full border-2 border-white/50 bg-black/30 flex items-center justify-center text-white font-bold text-[10px] backdrop-blur-sm">AS</div>
                <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[11px] font-semibold px-3 py-1 rounded">
                  रोहतक / 14 अगस्त
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 leading-snug mb-3">
                  हरियाणा में सुरक्षा व्यवस्था सख्त, फ्लैग मार्च जारी
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600 font-medium flex-1">
                  <li className="news-bullet">संवेदनशील इलाकों में बढ़ाई गई सुरक्षा</li>
                  <li className="news-bullet">पुलिस बल तैनात, शांति की अपील</li>
                </ul>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-[11px] font-semibold text-slate-400">Journalist Deepak Sharma</span>
                  <div className="flex gap-2">
                    <button className="bg-slate-800 text-white px-3 py-1.5 rounded text-[11px] font-bold hover:bg-slate-700">पूरी खबर पढ़ें</button>
                    <button className="border border-green-500 text-green-600 p-1.5 rounded hover:bg-green-50"><MessageCircle size={16} /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className="h-52 relative">
                <img src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&q=80" alt="News" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 w-7 h-7 rounded-full border-2 border-white/50 bg-black/30 flex items-center justify-center text-white font-bold text-[10px] backdrop-blur-sm">AS</div>
                <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[11px] font-semibold px-3 py-1 rounded">
                  जींद / 14 अगस्त
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-800 leading-snug mb-3">
                  किसानों ने टोल प्लाजा पर लगाया धरना, 3 घंटे टोल बंद
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-600 font-medium flex-1">
                  <li className="news-bullet">हुक्का लेकर बैठे किसान</li>
                  <li className="news-bullet">प्रशासन से बातचीत जारी</li>
                </ul>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-[11px] font-semibold text-slate-400">Journalist Rakesh Poonia</span>
                  <div className="flex gap-2">
                    <button className="bg-slate-800 text-white px-3 py-1.5 rounded text-[11px] font-bold hover:bg-slate-700">पूरी खबर पढ़ें</button>
                    <button className="border border-green-500 text-green-600 p-1.5 rounded hover:bg-green-50"><MessageCircle size={16} /></button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
    </>
  );
}