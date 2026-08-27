'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, X, Upload, Trash2, Send } from 'lucide-react'
import { dummyCategories } from '@/lib/dummyData'
import {
  createNews,
  uploadImage,
  getCategories,
  getCurrentUser,
  isSupabaseConfigured,
} from '@/lib/supabase'

function slugify(text) {
  return (
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .substring(0, 100) +
    '-' +
    Date.now().toString().slice(-6)
  )
}

export default function AddNewsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [categories, setCategories] = useState(dummyCategories)
  
  const [formData, setFormData] = useState({
    headline: '',
    subheadline: '',
    category_id: '',
    points: [''],
    location: '',
    is_trending: false,
    is_breaking: false,
    video_url: '',
    video_type: 'youtube',
    live_updates: [{ time: '', text: '' }], // Live update state added here
  })
  
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    async function init() {
      if (!isSupabaseConfigured()) return
      const u = await getCurrentUser()
      if (!u) {
        router.push('/admin/login')
        return
      }
      setUser(u)
      const cats = await getCategories()
      if (cats?.length) setCategories(cats)
    }
    init()
  }, [router])

  // Headings & Points Handlers
  const addPoint = () => setFormData((p) => ({ ...p, points: [...p.points, ''] }))
  const addHeading = () => setFormData((p) => ({ ...p, points: [...p.points, '[H] '] }))
  const removePoint = (i) => setFormData((p) => ({ ...p, points: p.points.filter((_, idx) => idx !== i) }))
  
  const updatePoint = (i, value, isHeading) => {
    setFormData((p) => ({
      ...p,
      points: p.points.map((pt, idx) => {
        if (idx !== i) return pt
        if (isHeading) return value.startsWith('[H]') ? value : `[H] ${value}`
        return value
      }),
    }))
  }

  // Live Updates Handlers (ये मिसिंग थे)
  const addLiveUpdate = () => setFormData((p) => ({ ...p, live_updates: [...(p.live_updates || []), { time: '', text: '' }] }))
  const removeLiveUpdate = (i) => setFormData((p) => ({ ...p, live_updates: p.live_updates.filter((_, idx) => idx !== i) }))
  const updateLiveUpdate = (i, field, value) => setFormData((p) => ({
    ...p,
    live_updates: p.live_updates.map((u, idx) => idx === i ? { ...u, [field]: value } : u)
  }))

  // Image Handlers
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const tooBig = files.find((f) => f.size > 5 * 1024 * 1024)
    if (tooBig) {
      alert('हर फोटो 5MB से छोटी होनी चाहिए')
      return
    }

    setImageFiles((prev) => [...prev, ...files])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImageAt = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus(null)

    try {
      const filteredPoints = formData.points.map((p) => p.trim()).filter((p) => p && p !== '[H]')
      if (!formData.headline.trim()) throw new Error('हेडलाइन जरूरी है')
      if (!filteredPoints.length) throw new Error('कम से कम 1 point/heading जरूरी है')
      if (!imageFiles.length) throw new Error('कम से कम 1 फोटो जरूरी है')

      // Live updates filter
      const cleanedLive = (formData.is_trending || formData.is_breaking) 
        ? (formData.live_updates || []).map((u) => ({ time: (u.time || '').trim(), text: (u.text || '').trim() })).filter((u) => u.time && u.text) 
        : []

      if (!isSupabaseConfigured()) {
        await new Promise((r) => setTimeout(r, 1000))
        setStatus('success')
        setTimeout(() => router.push('/admin/dashboard'), 1200)
        return
      }

      const urls = []
      for (const file of imageFiles) {
        urls.push(await uploadImage(file))
      }

      const currentUser = user || (await getCurrentUser())
      const isAdmin = currentUser?.role === 'admin'

      const payload = {
        slug: slugify(formData.headline),
        headline: formData.headline.trim(),
        subheadline: formData.subheadline.trim() || null,
        points: filteredPoints,
        category_id: formData.category_id ? parseInt(formData.category_id, 10) : null,
        featured_image: urls.join(','),
        location: formData.location.trim() || null,
        is_trending: formData.is_trending,
        is_breaking: formData.is_breaking,
        live_updates: cleanedLive,
        video_url: formData.video_url.trim() || null,
        video_type: formData.video_url.trim() ? formData.video_type : null,
        status: isAdmin ? 'approved' : 'pending',
        reporter_id: currentUser?.id || null,
        published_at: new Date().toISOString(),
      }

      await createNews(payload)
      setStatus('success')
      setTimeout(() => router.push('/admin/dashboard'), 1500)
    } catch (err) {
      console.error(err)
      setStatus('error')
      alert(err.message || 'खबर submit करने में त्रुटि')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-background pb-10">
      <header className="bg-brand-primary text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-poppins">
            <ArrowLeft className="w-4 h-4" /> डैशबोर्ड
          </Link>
          <h1 className="font-poppins font-bold text-sm">नई खबर जोड़ें</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {status === 'success' ? (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center font-yantramanav">
            ✅ खबर submit हो गई! {user?.role === 'admin' ? 'Live हो गई।' : 'Review के बाद publish होगी।'}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {/* HEADLINE */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">हेडलाइन *</label>
                <input type="text" value={formData.headline} onChange={(e) => setFormData({ ...formData, headline: e.target.value })} placeholder="मुख्य हेडलाइन..." required className="w-full px-4 py-3 border border-gray-200 rounded-xl font-yantramanav text-lg outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20" />
              </div>

              {/* SUBHEADLINE */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">सब-हेडलाइन</label>
                <textarea value={formData.subheadline} onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })} placeholder="संक्षिप्त विवरण..." rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl font-yantramanav outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 resize-none" />
              </div>

              {/* POINTS & HEADINGS */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-3">हेडिंग्स + बुलेट पॉइंट्स *</label>
                <p className="text-xs text-gray-500 mb-3 font-poppins">[H] वाली लाइन = बीच की हेडिंग (जैसे पुलिस कार्यवाही). बाकी = bullet points.</p>

                <div className="space-y-3">
                  {formData.points.map((point, idx) => {
                    const isHeading = point.startsWith('[H]')
                    const display = isHeading ? point.replace(/^\[H\]\s?/, '') : point
                    return (
                      <div key={idx} className="flex items-start gap-2">
                        <span className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-1 ${isHeading ? 'bg-brand-primary text-white' : 'bg-brand-primary/10 text-brand-primary'}`}>
                          {isHeading ? 'H' : idx + 1}
                        </span>
                        <textarea value={display} onChange={(e) => updatePoint(idx, e.target.value, isHeading)} rows={isHeading ? 1 : 2} placeholder={isHeading ? 'हेडिंग लिखें...' : 'पॉइंट लिखें...'} className={`flex-1 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/20 ${isHeading ? 'font-bold border-brand-primary/40 text-brand-primary' : 'border-gray-200 text-sm font-yantramanav'}`} />
                        {formData.points.length > 1 ? (
                          <button type="button" onClick={() => removePoint(idx)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg mt-1"><X className="w-4 h-4" /></button>
                        ) : null}
                      </div>
                    )
                  })}
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <button type="button" onClick={addPoint} className="inline-flex items-center gap-2 px-3 py-2 border-2 border-brand-primary text-brand-primary rounded-lg text-sm font-poppins font-semibold hover:bg-brand-primary hover:text-white">
                    <Plus className="w-4 h-4" /> बुलेट पॉइंट
                  </button>
                  <button type="button" onClick={addHeading} className="inline-flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-lg text-sm font-poppins font-semibold hover:bg-black">
                    <Plus className="w-4 h-4" /> कस्टम हेडिंग
                  </button>
                </div>
              </div>

              {/* LIVE UPDATES SECTION (Only visible if Trending or Breaking is checked) */}
              {(formData.is_trending || formData.is_breaking) && (
                <div className="bg-red-50/50 rounded-2xl shadow-sm p-6 border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse" />
                    <label className="text-sm font-poppins font-semibold text-brand-red">लाइव अपडेट्स (Trending / Live News)</label>
                  </div>
                  <p className="text-xs text-gray-500 mb-4 font-yantramanav">ये अपडेट सिर्फ इस खबर के “पूरी खबर” पेज पर दिखेंगे। समय + टेक्स्ट भरें।</p>
                  
                  <div className="space-y-3">
                    {(formData.live_updates || []).map((u, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-2 items-start border border-gray-100 rounded-xl p-3 bg-white">
                        <input type="text" value={u.time} onChange={(e) => updateLiveUpdate(idx, 'time', e.target.value)} placeholder="जैसे 3:25 PM" className="w-full sm:w-28 px-3 py-2 border border-gray-200 rounded-lg text-xs font-poppins outline-none focus:border-brand-primary" />
                        <textarea value={u.text} onChange={(e) => updateLiveUpdate(idx, 'text', e.target.value)} placeholder="अपडेट लिखें..." rows={2} className="flex-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-yantramanav outline-none focus:border-brand-primary resize-none" />
                        {(formData.live_updates || []).length > 1 && (
                          <button type="button" onClick={() => removeLiveUpdate(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg text-xs shrink-0"><X className="w-4 h-4" /></button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addLiveUpdate} className="mt-3 text-sm font-poppins font-semibold text-brand-red hover:underline">
                    + और लाइव अपडेट जोड़ें
                  </button>
                </div>
              )}

              {/* PHOTOS */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-3">फोटो (एक या ज्यादा) *</label>
                {imagePreviews.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden h-28 bg-gray-100">
                        <img src={src} alt={`preview-${i}`} className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImageAt(i)} className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                ) : null}

                <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-brand-primary/40 hover:bg-brand-primary/5">
                  <Upload className="w-8 h-8 text-gray-300 mb-2" />
                  <span className="text-sm text-gray-400 font-poppins">फोटो चुनें (multiple OK)</span>
                  <span className="text-xs text-gray-300 mt-1">JPG, PNG, WebP — Max 5MB each</span>
                  <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="hidden" />
                </label>
                {imageFiles.length > 0 ? <p className="text-xs text-green-600 mt-2 font-poppins">{imageFiles.length} फोटो selected</p> : null}
              </div>

              {/* YOUTUBE */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">YouTube वीडियो URL (optional)</label>
                <div className="flex gap-2 mb-3">
                  <button type="button" onClick={() => setFormData({ ...formData, video_type: 'youtube' })} className={`px-4 py-2 rounded-lg text-sm font-poppins ${formData.video_type === 'youtube' ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600'}`}>YouTube</button>
                </div>
                <input type="url" value={formData.video_url} onChange={(e) => setFormData({ ...formData, video_url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-poppins text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20" />
              </div>
            </div>

            {/* SIDEBAR OPTIONS */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">कैटेगरी *</label>
                <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-yantramanav text-sm outline-none focus:border-brand-primary bg-white">
                  <option value="">कैटेगरी चुनें</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.icon ? `${cat.icon} ` : ''}{cat.name}</option>)}
                </select>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">लोकेशन</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="भिवानी, रोहतक..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-yantramanav text-sm outline-none focus:border-brand-primary" />
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.is_trending} onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-brand-primary" />
                  <div><span className="text-sm font-poppins font-medium text-gray-700">ट्रेंडिंग / Live carousel</span><p className="text-[11px] text-gray-400">ऊपर वाले scroll सेक्शन में</p></div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.is_breaking} onChange={(e) => setFormData({ ...formData, is_breaking: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-red-600" />
                  <div><span className="text-sm font-poppins font-medium text-gray-700">ब्रेकिंग / LIVE</span><p className="text-[11px] text-gray-400">लाल LIVE बैज</p></div>
                </label>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-brand-primary text-white rounded-xl font-poppins font-semibold text-sm flex items-center justify-center gap-2 hover:bg-brand-secondary disabled:opacity-50">
                  {isSubmitting ? 'Submit हो रहा है...' : <><Send className="w-4 h-4" /> खबर Submit करें</>}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}