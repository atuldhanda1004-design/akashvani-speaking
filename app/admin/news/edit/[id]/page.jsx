'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Plus, X } from 'lucide-react';

export default function EditNews() {
  const [news, setNews] = useState(null);
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/admin/login'); return; }
      setUser(user);

      const { data: uData } = await supabase
        .from('users').select('role').eq('id', user.id).single();

      const { data: newsData } = await supabase
        .from('news').select('*').eq('id', params.id).single();

      // Reporter sirf apni news edit kar sakta hai
      if (uData?.role === 'reporter' && newsData?.reporter_id !== user.id) {
        alert('आप सिर्फ अपनी खबरें edit कर सकते हैं');
        router.push('/admin/dashboard');
        return;
      }

      setNews(newsData);

      const { data: cats } = await supabase
        .from('categories').select('*').eq('is_active', true).order('priority');
      setCategories(cats || []);
    };
    init();
  }, [params.id]);

  const handleSave = async () => {
    if (!news) return;
    setSaving(true);

    const validPoints = news.points.filter(p => p.trim());
    const { error } = await supabase
      .from('news')
      .update({
        headline: news.headline,
        subheadline: news.subheadline,
        points: validPoints,
        category_id: news.category_id,
        is_trending: news.is_trending,
        is_breaking: news.is_breaking,
        tags: news.tags,
        meta_title: news.meta_title,
        meta_description: news.meta_description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id);

    setSaving(false);
    if (error) alert('Error: ' + error.message);
    else {
      alert('✅ खबर अपडेट हो गई!');
      router.push('/admin/dashboard');
    }
  };

  const handleDelete = async () => {
    if (!confirm('क्या आप सच में ये खबर डिलीट करना चाहते हैं?')) return;
    await supabase.from('news').delete().eq('id', params.id);
    alert('🗑️ खबर डिलीट हो गई!');
    router.push('/admin/dashboard');
  };

  const addPoint = () => setNews({ ...news, points: [...news.points, ''] });
  const removePoint = (i) => setNews({ ...news, points: news.points.filter((_, idx) => idx !== i) });
  const updatePoint = (i, val) => {
    const pts = [...news.points];
    pts[i] = val;
    setNews({ ...news, points: pts });
  };

  if (!news) return <div className="p-8 text-center">लोड हो रहा है...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="hover:bg-gray-700 p-2 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-lg">✏️ खबर Edit करें</h1>
        <span className={`ml-auto text-xs px-2 py-1 rounded-full font-bold ${
          news.status === 'approved' ? 'bg-green-600' :
          news.status === 'pending' ? 'bg-yellow-600' : 'bg-red-600'
        }`}>
          {news.status === 'approved' ? '✅ प्रकाशित' :
           news.status === 'pending' ? '⏳ पेंडिंग' : '❌ Rejected'}
        </span>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">

          {/* Category */}
          <div>
            <label className="block text-sm font-bold mb-2">📂 श्रेणी</label>
            <select
              value={news.category_id || ''}
              onChange={(e) => setNews({ ...news, category_id: parseInt(e.target.value) })}
              className="w-full border rounded-xl px-4 py-3 text-sm"
            >
              <option value="">-- चुनें --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>

          {/* Headline */}
          <div>
            <label className="block text-sm font-bold mb-2">📰 हेडलाइन</label>
            <input
              type="text"
              value={news.headline}
              onChange={(e) => setNews({ ...news, headline: e.target.value })}
              className="w-full border rounded-xl px-4 py-3 text-lg font-bold"
            />
          </div>

          {/* Points */}
          <div>
            <label className="block text-sm font-bold mb-2">📌 बिंदु (Points)</label>
            <div className="space-y-3">
              {news.points.map((point, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="bg-red-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-2">
                    {i + 1}
                  </span>
                  <textarea
                    value={point}
                    onChange={(e) => updatePoint(i, e.target.value)}
                    rows={2}
                    className="flex-1 border rounded-xl px-4 py-2 text-sm resize-none"
                  />
                  <button onClick={() => removePoint(i)} className="text-red-400 p-2 mt-1">
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addPoint} className="mt-3 text-red-600 text-sm font-bold flex items-center gap-1">
              <Plus size={16} /> Point जोड़ें
            </button>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={news.is_trending}
                onChange={(e) => setNews({ ...news, is_trending: e.target.checked })}
                className="w-5 h-5 text-red-600 rounded"
              />
              <span className="font-bold text-sm">🔥 ट्रेंडिंग</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={news.is_breaking}
                onChange={(e) => setNews({ ...news, is_breaking: e.target.checked })}
                className="w-5 h-5 text-red-600 rounded"
              />
              <span className="font-bold text-sm">🔴 ब्रेकिंग</span>
            </label>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-bold mb-2">🏷️ Tags</label>
            <input
              type="text"
              value={news.tags?.join(', ') || ''}
              onChange={(e) => setNews({ ...news, tags: e.target.value.split(',').map(t => t.trim()) })}
              className="w-full border rounded-xl px-4 py-3 text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Save size={18} /> {saving ? 'सेव हो रहा है...' : '💾 सेव करें'}
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-100 hover:bg-red-200 text-red-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2"
            >
              <Trash2 size={18} /> डिलीट
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}