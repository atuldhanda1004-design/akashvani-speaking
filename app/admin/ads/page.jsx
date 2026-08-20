'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const POSITIONS = [
  { value: 'top_banner', label: '🔝 Top Banner (Header के नीचे)' },
  { value: 'between_news', label: '📰 Between News (खबरों के बीच)' },
  { value: 'sidebar', label: '📌 Sidebar (दाईं तरफ)' },
  { value: 'footer', label: '🦶 Footer Banner' },
  { value: 'mobile_sticky', label: '📱 Mobile Sticky (नीचे चिपका)' },
  { value: 'pre_video', label: '🎬 Video से पहले' },
];

export default function AdsPage() {
  const [ads, setAds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', ad_type: 'image', image_url: '', link_url: '',
    adsense_code: '', html_code: '', position: 'top_banner',
    is_active: true, start_date: '', end_date: '',
  });
  const router = useRouter();

  useEffect(() => {
    const fetchAds = async () => {
      const { data } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
      setAds(data || []);
    };
    fetchAds();
  }, []);

  const handleAdd = async () => {
    if (!form.title) { alert('Title daalo!'); return; }
    const { error } = await supabase.from('ads').insert(form);
    if (!error) {
      setShowForm(false);
      const { data } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
      setAds(data || []);
      setForm({ title: '', ad_type: 'image', image_url: '', link_url: '', adsense_code: '', html_code: '', position: 'top_banner', is_active: true, start_date: '', end_date: '' });
    }
  };

  const toggleActive = async (id, current) => {
    await supabase.from('ads').update({ is_active: !current }).eq('id', id);
    setAds(ads.map(a => a.id === id ? { ...a, is_active: !current } : a));
  };

  const deleteAd = async (id) => {
    if (!confirm('Delete?')) return;
    await supabase.from('ads').delete().eq('id', id);
    setAds(ads.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.push('/admin/dashboard')} className="hover:bg-gray-700 p-2 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-lg">📢 विज्ञापन प्रबंधन</h1>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold mb-6 flex items-center gap-2"
        >
          <Plus size={18} /> नया विज्ञापन जोड़ें
        </button>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border p-6 mb-6 space-y-4">
            <h3 className="font-bold text-lg">नया Ad</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold">Title</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1" />
              </div>
              <div>
                <label className="text-sm font-bold">Type</label>
                <select value={form.ad_type} onChange={e => setForm({...form, ad_type: e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1">
                  <option value="image">🖼️ Image Banner</option>
                  <option value="adsense">📊 Google AdSense</option>
                  <option value="html">💻 Custom HTML</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold">Position</label>
                <select value={form.position} onChange={e => setForm({...form, position: e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1">
                  {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
            </div>

            {form.ad_type === 'image' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold">Image URL</label>
                  <input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="https://..." className="w-full border rounded-lg px-3 py-2 mt-1" />
                </div>
                <div>
                  <label className="text-sm font-bold">Click Link</label>
                  <input value={form.link_url} onChange={e => setForm({...form, link_url: e.target.value})} placeholder="https://..." className="w-full border rounded-lg px-3 py-2 mt-1" />
                </div>
              </div>
            )}

            {form.ad_type === 'adsense' && (
              <div>
                <label className="text-sm font-bold">AdSense Code</label>
                <textarea value={form.adsense_code} onChange={e => setForm({...form, adsense_code: e.target.value})} rows={4} className="w-full border rounded-lg px-3 py-2 mt-1 font-mono text-xs" placeholder='<script async src="..."></script><ins class="adsbygoogle"...' />
              </div>
            )}

            {form.ad_type === 'html' && (
              <div>
                <label className="text-sm font-bold">Custom HTML</label>
                <textarea value={form.html_code} onChange={e => setForm({...form, html_code: e.target.value})} rows={4} className="w-full border rounded-lg px-3 py-2 mt-1 font-mono text-xs" />
              </div>
            )}

            <button onClick={handleAdd} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold">
              ✅ Ad जोड़ें
            </button>
          </div>
        )}

        {/* Ads List */}
        <div className="space-y-3">
          {ads.map(ad => (
            <div key={ad.id} className={`bg-white rounded-xl border p-4 flex items-center justify-between ${!ad.is_active ? 'opacity-50' : ''}`}>
              <div>
                <h4 className="font-bold">{ad.title}</h4>
                <p className="text-xs text-gray-500">
                  {ad.ad_type.toUpperCase()} • {ad.position} • {ad.is_active ? '✅ Active' : '❌ Inactive'}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleActive(ad.id, ad.is_active)} className="p-2 hover:bg-gray-100 rounded-lg">
                  {ad.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button onClick={() => deleteAd(ad.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {ads.length === 0 && (
            <p className="text-center text-gray-400 py-8">कोई विज्ञापन नहीं है अभी</p>
          )}
        </div>
      </div>
    </div>
  );
}