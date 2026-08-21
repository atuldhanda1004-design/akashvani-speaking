'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, X, Upload, Trash2, Send } from 'lucide-react'
import { dummyCategories } from '@/lib/dummyData'
import { createNews, uploadImage, getCategories, getCurrentUser, isSupabaseConfigured } from '@/lib/supabase'

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .substring(0, 100)
    + '-' + Date.now().toString().slice(-6)
}

export default function AddNewsPage() {
  const router = useRouter()
  const [categories, setCategories] = useState(dummyCategories)
  const [formData, setFormData] = useState({
    headline: '', subheadline: '', category_id: '',
    points: [''], location: '', is_trending: false, is_breaking: false,
    video_url: '', video_type: 'youtube',
  })
  const [featuredImage, setFeaturedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    async function init() {
      if (isSupabaseConfigured()) {
        const user = await getCurrentUser()
        if (!user) { router.push('/admin/login'); return }
        const cats = await getCategories()
        if (cats?.length) setCategories(cats)
      }
    }
    init()
  }, [router])

  const addPoint = () => setFormData((p) => ({ ...p, points: [...p.points, ''] }))
  const removePoint = (i) => setFormData((p) => ({ ...p, points: p.points.filter((_, idx) => idx !== i) }))
  const updatePoint = (i, v) => setFormData((p) => ({ ...p, points: p.points.map((pt, idx) => idx === i ? v : pt) }))

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size 5MB से कम होनी चाहिए')
      return
    }
    setFeaturedImage(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus(null)

    try {
      const filteredPoints = formData.points.filter((p) => p.trim())
      if (!filteredPoints.length) throw new Error('कम से कम 1 point जरूरी है')
      if (!featuredImage) throw new Error('Featured image जरूरी है')

      if (isSupabaseConfigured()) {
        const imageUrl = await uploadImage(featuredImage)
        const user = await getCurrentUser()

        const payload = {
          slug: slugify(formData.headline),
          headline: formData.headline,
          subheadline: formData.subheadline || null,
          points: filteredPoints,
          category_id: parseInt(formData.category_id) || null,
          featured_image: imageUrl,
          location: formData.location || null,
          is_trending: formData.is_trending,
          is_breaking: formData.is_breaking,
          video_url: formData.video_url || null,
          video_type: formData.video_url ? formData.video_type : null,
          status: 'pending',
          reporter_id: user?.id,
          published_at: new Date().toISOString(),
        }

        await createNews(payload)
      } else {
        // Demo
        await new Promise((r) => setTimeout(r, 1500))
      }

      setStatus('success')
      setTimeout(() => router.push('/admin/dashboard'), 2000)
    } catch (err) {
      console.error(err)
      setStatus('error')
      alert(err.message || 'खबर submit करने में त्रुटि हुई')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-lightGray">
      <header className="bg-brand-navy text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-poppins">
            <ArrowLeft className="w-4 h-4" />डैशबोर्ड
          </Link>
          <h1 className="font-poppins font-bold text-sm">नई खबर जोड़ें</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {status === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-yantramanav text-center animate-slide-down">
            ✅ खबर सफलतापूर्वक submit हो गई! रिव्यू के बाद प्रकाशित होगी।
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">
                  हेडलाइन *
                </label>
                <input
                  type="text" value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="खबर की हेडलाइन..." required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl font-yantramanav text-lg outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-all"
                />
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">
                  सब-हेडलाइन
                </label>
                <textarea
                  value={formData.subheadline}
                  onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                  placeholder="खबर का संक्षिप्त विवरण..." rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl font-yantramanav outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-all resize-none"
                />
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-3">
                  मुख्य बिंदु (Points) *
                </label>
                <div className="space-y-3">
                  {formData.points.map((point, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-brand-navy/10 text-brand-navy rounded-full flex items-center justify-center text-xs font-poppins font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text" value={point}
                        onChange={(e) => updatePoint(idx, e.target.value)}
                        placeholder={`बिंदु ${idx + 1}...`}
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-yantramanav text-sm outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-all"
                      />
                      {formData.points.length > 1 && (
                        <button type="button" onClick={() => removePoint(idx)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addPoint}
                  className="mt-3 flex items-center gap-2 text-brand-navy text-sm font-poppins font-medium hover:underline">
                  <Plus className="w-4 h-4" />और बिंदु जोड़ें
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-3">
                  फीचर्ड इमेज *
                </label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                    <button type="button"
                      onClick={() => { setFeaturedImage(null); setImagePreview(null) }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-brand-navy/30 hover:bg-brand-navy/5 transition-all">
                    <Upload className="w-8 h-8 text-gray-300 mb-2" />
                    <span className="text-sm text-gray-400 font-poppins">क्लिक करें या ड्रैग करें</span>
                    <span className="text-xs text-gray-300 font-poppins mt-1">JPG, PNG, WebP (Max 5MB)</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">
                  वीडियो (वैकल्पिक)
                </label>
                <div className="flex gap-3 mb-3">
                  {['youtube', 'upload'].map((t) => (
                    <button key={t} type="button"
                      onClick={() => setFormData({ ...formData, video_type: t })}
                      className={`px-4 py-2 rounded-lg text-sm font-poppins transition-all ${
                        formData.video_type === t ? 'bg-brand-navy text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                      {t === 'youtube' ? 'YouTube' : 'अपलोड'}
                    </button>
                  ))}
                </div>
                <input
                  type="text" value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder={formData.video_type === 'youtube' ? 'YouTube URL...' : 'Video URL...'}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-poppins text-sm outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">
                  कैटेगरी *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-yantramanav text-sm outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-all bg-white"
                >
                  <option value="">कैटेगरी चुनें</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">
                  लोकेशन
                </label>
                <input
                  type="text" value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="जैसे: भिवानी, रोहतक..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-yantramanav text-sm outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-all"
                />
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                {[
                  { key: 'is_trending', label: 'ट्रेंडिंग न्यूज़', desc: 'होम पेज पर बड़ा कार्ड', color: 'text-brand-navy' },
                  { key: 'is_breaking', label: 'ब्रेकिंग / लाइव', desc: 'लाल LIVE बैज', color: 'text-brand-red' },
                ].map((f) => (
                  <label key={f.key} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={formData[f.key]}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-brand-navy focus:ring-brand-navy" />
                    <div>
                      <span className={`text-sm font-poppins font-medium text-gray-700 group-hover:${f.color} transition-colors`}>
                        {f.label}
                      </span>
                      <p className="text-[11px] text-gray-400 font-poppins">{f.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <button type="submit" disabled={isSubmitting}
                  className="w-full py-3 bg-brand-navy text-white rounded-xl font-poppins font-semibold text-sm flex items-center justify-center gap-2 hover:bg-brand-navyDark transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submit हो रहा है...</span>
                    </>
                  ) : (
                    <><Send className="w-4 h-4" /><span>खबर Submit करें</span></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}