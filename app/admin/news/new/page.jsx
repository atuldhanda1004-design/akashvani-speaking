'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { generateSlug } from '@/lib/utils';
import { Plus, X, Upload, Image, Video, Save, Send, ArrowLeft } from 'lucide-react';

export default function AddNews() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const [form, setForm] = useState({
    headline: '',
    subheadline: '',
    points: ['', '', ''],
    category_id: '',
    featured_image: null,
    featured_image_url: '',
    gallery_images: [],
    video_url: '',
    video_type: 'youtube',
    is_trending: false,
    is_breaking: false,
    tags: '',
    meta_title: '',
    meta_description: '',
  });

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/admin/login'); return; }
      setUser(user);

      const { data: uData } = await supabase
        .from('users').select('*').eq('id', user.id).single();
      setUserData(uData);

      const { data: cats } = await supabase
        .from('categories').select('*')
        .eq('is_active', true).order('priority');
      setCategories(cats || []);
    };
    init();
  }, []);

  // Point management
  const addPoint = () => setForm({ ...form, points: [...form.points, ''] });
  const removePoint = (i) => {
    if (form.points.length <= 1) return;
    setForm({ ...form, points: form.points.filter((_, idx) => idx !== i) });
  };
  const updatePoint = (i, val) => {
    const pts = [...form.points];
    pts[i] = val;
    setForm({ ...form, points: pts });
  };

  // Image Upload
  const uploadImage = async (file) => {
    if (!file) return null;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const filename = `news/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filename, file, { cacheControl: '31536000' });

    setUploading(false);
    if (error) { alert('Image upload fail: ' + error.message); return null; }

    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filename);
    return urlData.publicUrl;
  };

  const handleFeaturedImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setForm({ ...form, featured_image_url: url });
  };

  const handleGalleryImages = async (e) => {
    const files = Array.from(e.target.files);
    const urls = [];
    for (const file of files) {
      const url = await uploadImage(file);
      if (url) urls.push(url);
    }
    setForm({ ...form, gallery_images: [...form.gallery_images, ...urls] });
  };

  // Submit
  const handleSubmit = async (status = 'pending') => {
    if (!form.headline.trim()) { alert('Headline zaroori hai!'); return; }
    const validPoints = form.points.filter(p => p.trim());
    if (validPoints.length === 0) { alert('Kam se kam 1 point daalo!'); return; }

    setLoading(true);
    const slug = generateSlug(form.headline);

    const newsData = {
      slug,
      headline: form.headline.trim(),
      subheadline: form.subheadline.trim() || null,
      points: validPoints,
      category_id: form.category_id ? parseInt(form.category_id) : null,
      featured_image: form.featured_image_url || null,
      gallery_images: form.gallery_images.length ? form.gallery_images : null,
      video_url: form.video_url.trim() || null,
      video_type: form.video_url ? form.video_type : null,
      is_trending: form.is_trending,
      is_breaking: form.is_breaking,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      meta_title: form.meta_title.trim() || form.headline.trim(),
      meta_description: form.meta_description.trim() || validPoints.slice(0, 2).join('. '),
      status,
      reporter_id: user.id,
      published_at: status === 'approved' ? new Date().toISOString() : null,
    };

    const { error } = await supabase.from('news').insert(newsData);
    setLoading(false);

    if (error) {
      alert('Error: ' + error.message);
      return;
    }

    setSuccess(status === 'approved' ? '✅ खबर प्रकाशित हो गई!' : '✅ खबर Editor के पास भेज दी गई!');
    setTimeout(() => router.push('/admin/dashboard'), 1500);
  };

  if (!user) return <div className="p-8 text-center">लोड हो रहा है...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="hover:bg-gray-700 p-2 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-lg">📝 नई खबर जोड़ें</h1>
        <span className="ml-auto bg-red-600 text-xs px-2 py-1 rounded-full uppercase">
          {userData?.role}
        </span>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {success && (
          <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-4 font-bold">
            {success}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              📂 श्रेणी (Category) *
            </label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              <option value="">-- श्रेणी चुनें --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Headline */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              📰 हेडलाइन (Headline) *
            </label>
            <input
              type="text"
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
              placeholder="जैसे: दिल्ली में भारी बारिश, 5 इलाके जलमग्न"
              className="w-full border rounded-xl px-4 py-3 text-lg font-bold focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* Subheadline */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              उप-शीर्षक (Subheadline)
            </label>
            <input
              type="text"
              value={form.subheadline}
              onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
              placeholder="थोड़ा विस्तार से (optional)"
              className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* ⭐ Point-to-Point News */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              📌 खबर के मुख्य बिंदु (Points) * — रिपोर्टर तय करेगा कितने points
            </label>
            <p className="text-xs text-gray-400 mb-3">
              कम से कम 1, ज़्यादा से ज़्यादा जितने चाहो। हर point छोटा और clear रखो।
            </p>

            <div className="space-y-3">
              {form.points.map((point, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="bg-red-600 text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-2">
                    {i + 1}
                  </span>
                  <textarea
                    value={point}
                    onChange={(e) => updatePoint(i, e.target.value)}
                    placeholder={`Point ${i + 1} लिखें...`}
                    rows={2}
                    className="flex-1 border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
                  />
                  {form.points.length > 1 && (
                    <button
                      onClick={() => removePoint(i)}
                      className="text-red-400 hover:text-red-600 p-2 mt-1"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addPoint}
              className="mt-3 flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-bold"
            >
              <Plus size={16} /> और Point जोड़ें
            </button>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              📸 मुख्य फोटो (Featured Image)
            </label>
            <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-red-400 transition">
              {form.featured_image_url ? (
                <div className="relative">
                  <img src={form.featured_image_url} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                  <button
                    onClick={() => setForm({ ...form, featured_image_url: '' })}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Image className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-500">क्लिक करें या ड्रैग करें</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImage}
                    className="hidden"
                  />
                </label>
              )}
              {uploading && <p className="text-sm text-blue-600 mt-2">⏳ Upload हो रहा है...</p>}
            </div>
          </div>

          {/* Gallery Images */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              🖼️ और फोटोज़ (Gallery - Multiple)
            </label>
            <label className="block border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-red-400">
              <Upload className="mx-auto text-gray-400 mb-1" size={24} />
              <p className="text-sm text-gray-500">Multiple Photos Upload करें</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryImages}
                className="hidden"
              />
            </label>
            {form.gallery_images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {form.gallery_images.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt="" className="w-full h-20 object-cover rounded-lg" />
                    <button
                      onClick={() => setForm({
                        ...form,
                        gallery_images: form.gallery_images.filter((_, idx) => idx !== i)
                      })}
                      className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Section */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              🎥 वीडियो (YouTube / Instagram / Direct)
            </label>
            <div className="flex gap-2 mb-3">
              {['youtube', 'instagram', 'upload'].map((type) => (
                <button
                  key={type}
                  onClick={() => setForm({ ...form, video_type: type })}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                    form.video_type === type
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type === 'youtube' ? '▶️ YouTube' : type === 'instagram' ? '📸 Instagram' : '📁 Upload'}
                </button>
              ))}
            </div>

            {form.video_type !== 'upload' ? (
              <input
                type="url"
                value={form.video_url}
                onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                placeholder={
                  form.video_type === 'youtube'
                    ? 'https://www.youtube.com/watch?v=...'
                    : 'https://www.instagram.com/reel/...'
                }
                className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            ) : (
              <label className="block border-2 border-dashed rounded-xl p-4 text-center cursor-pointer">
                <Video className="mx-auto text-gray-400 mb-1" size={24} />
                <p className="text-sm text-gray-500">MP4 Video Upload (Max 50MB)</p>
                <input type="file" accept="video/mp4" className="hidden" />
              </label>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              🏷️ Tags (comma से अलग करें)
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="हरियाणा, दिल्ली, बारिश, मोदी, क्रिकेट"
              className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* Trending & Breaking */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_trending}
                onChange={(e) => setForm({ ...form, is_trending: e.target.checked })}
                className="w-5 h-5 text-red-600 rounded"
              />
              <span className="font-bold text-sm">🔥 ट्रेंडिंग में डालें</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_breaking}
                onChange={(e) => setForm({ ...form, is_breaking: e.target.checked })}
                className="w-5 h-5 text-red-600 rounded"
              />
              <span className="font-bold text-sm">🔴 ब्रेकिंग न्यूज़</span>
            </label>
          </div>

          {/* SEO Fields (Collapsible) */}
          <details className="border rounded-xl p-4">
            <summary className="font-bold text-sm text-gray-600 cursor-pointer">
              ⚙️ SEO Settings (Advanced - Optional)
            </summary>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500">Meta Title</label>
                <input
                  type="text"
                  value={form.meta_title}
                  onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                  placeholder="Google में दिखने वाला title"
                  className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">Meta Description</label>
                <textarea
                  value={form.meta_description}
                  onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                  placeholder="Google में दिखने वाला description"
                  rows={2}
                  className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
                />
              </div>
            </div>
          </details>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {userData?.role === 'reporter' ? (
              <button
                onClick={() => handleSubmit('pending')}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send size={18} />
                {loading ? 'भेजा जा रहा है...' : 'Editor को भेजें (Approval)'}
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleSubmit('pending')}
                  disabled={loading}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Clock size={18} /> Draft में रखें
                </button>
                <button
                  onClick={() => handleSubmit('approved')}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={18} />
                  {loading ? 'प्रकाशित हो रहा है...' : '✅ सीधे प्रकाशित करें'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}