'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, X, Upload, Trash2, Save } from 'lucide-react'
import { dummyCategories } from '@/lib/dummyData'
import { supabase, uploadImage, getCategories, getCurrentUser, isSupabaseConfigured } from '@/lib/supabase'

export default function EditNewsPage({ params }) {
  const router = useRouter()
  const { id } = params
  
  const [categories, setCategories] = useState(dummyCategories)
  const [formData, setFormData] = useState({
    headline: '', subheadline: '', category_id: '',
    points: [''], location: '', is_trending: false, is_breaking: false,
    video_url: '', video_type: 'youtube',
  })
  
  const [featuredImage, setFeaturedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      if (!isSupabaseConfigured()) {
        alert('डेटाबेस कनेक्ट नहीं है!');
        router.push('/admin/dashboard');
        return;
      }

      const user = await getCurrentUser()
      if (!user) { router.push('/admin/login'); return }

      const cats = await getCategories()
      if (cats?.length) setCategories(cats)

      // Fetch existing news data
      const { data: newsItem, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !newsItem) {
        alert('खबर नहीं मिली!')
        router.push('/admin/dashboard')
        return
      }

      // Populate form
      setFormData({
        headline: newsItem.headline || '',
        subheadline: newsItem.subheadline || '',
        category_id: newsItem.category_id || '',
        points: newsItem.points?.length ? newsItem.points : [''],
        location: newsItem.location || '',
        is_trending: newsItem.is_trending || false,
        is_breaking: newsItem.is_breaking || false,
        video_url: newsItem.video_url || '',
        video_type: newsItem.video_type || 'youtube',
      })
      setImagePreview(newsItem.featured_image)
      setIsLoading(false)
    }

    fetchNews()
  }, [id, router])

  const addPoint = () => setFormData((p) => ({ ...p, points: [...p.points, ''] }))
  const removePoint = (i) => setFormData((p) => ({ ...p, points: p.points.filter((_, idx) => idx !== i) }))
  const updatePoint = (i, v) => setFormData((p) => ({ ...p, points: p.points.map((pt, idx) => idx === i ? v : pt) }))

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFeaturedImage(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const filteredPoints = formData.points.filter((p) => p.trim())
      
      let imageUrl = imagePreview
      // If a new image is selected, upload it
      if (featuredImage) {
        imageUrl = await uploadImage(featuredImage)
      }

      const payload = {
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
      }

      const { error } = await supabase
        .from('news')
        .update(payload)
        .eq('id', id)

      if (error) throw error

      alert('✅ खबर सफलतापूर्वक अपडेट हो गई!')
      router.push('/admin/dashboard')
    } catch (err) {
      console.error(err)
      alert(err.message || 'अपडेट करने में त्रुटि हुई')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <div className="p-10 text-center text-brand-navy">लोड हो रहा है...</div>

  return (
    <div className="min-h-screen bg-brand-lightGray">
      <header className="bg-brand-navy text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-poppins">
            <ArrowLeft className="w-4 h-4" />डैशबोर्ड
          </Link>
          <h1 className="font-poppins font-bold text-sm">खबर एडिट करें</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">हेडलाइन *</label>
                <input
                  type="text" value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl font-yantramanav text-lg outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20"
                />
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">सब-हेडलाइन</label>
                <textarea
                  value={formData.subheadline}
                  onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl font-yantramanav outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 resize-none"
                />
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-3">मुख्य बिंदु (Points)</label>
                <div className="space-y-3">
                  {formData.points.map((point, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-brand-navy/10 text-brand-navy rounded-full flex items-center justify-center text-xs font-poppins font-bold shrink-0">{idx + 1}</span>
                      <input
                        type="text" value={point}
                        onChange={(e) => updatePoint(idx, e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-yantramanav text-sm outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20"
                      />
                      {formData.points.length > 1 && (
                        <button type="button" onClick={() => removePoint(idx)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addPoint} className="mt-3 flex items-center gap-2 text-brand-navy text-sm font-poppins font-medium hover:underline">
                  <Plus className="w-4 h-4" />और बिंदु जोड़ें
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-3">फीचर्ड इमेज (नया चुनेंगे तो पुरानी हट जाएगी)</label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                    <button type="button" onClick={() => { setFeaturedImage(null); setImagePreview(null) }} className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-brand-navy/30 hover:bg-brand-navy/5">
                    <Upload className="w-8 h-8 text-gray-300 mb-2" />
                    <span className="text-sm text-gray-400 font-poppins">नई फोटो चुनें (ऑप्शनल)</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">कैटेगरी *</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-yantramanav text-sm outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 bg-white"
                >
                  <option value="">कैटेगरी चुनें</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                {[
                  { key: 'is_trending', label: 'ट्रेंडिंग न्यूज़', color: 'text-brand-navy' },
                  { key: 'is_breaking', label: 'ब्रेकिंग / लाइव', color: 'text-brand-red' },
                ].map((f) => (
                  <label key={f.key} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={formData[f.key]}
                      onChange={(e) => setFormData({ ...formData, [f.key]: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-brand-navy focus:ring-brand-navy" />
                    <span className={`text-sm font-poppins font-medium text-gray-700 group-hover:${f.color} transition-colors`}>{f.label}</span>
                  </label>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-brand-navy text-white rounded-xl font-poppins font-semibold text-sm flex items-center justify-center gap-2 hover:bg-brand-navyDark transition-all disabled:opacity-50">
                  {isSubmitting ? 'अपडेट हो रहा है...' : <><Save className="w-4 h-4" /><span>सेव करें (Update)</span></>}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}