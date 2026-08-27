'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, X, Upload, Trash2, Save } from 'lucide-react'
import { dummyCategories } from '@/lib/dummyData'
import {
  supabase,
  uploadImage,
  getCategories,
  getCurrentUser,
  isSupabaseConfigured,
} from '@/lib/supabase'

export default function EditNewsPage({ params }) {
  const router = useRouter()
  const { id } = params

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
    status: 'pending',
    live_updates: [{ time: '', text: '' }], // Live update state added here
  })
  
  const [existingImageString, setExistingImageString] = useState('')
  const [newImageFiles, setNewImageFiles] = useState([])
  const [newPreviews, setNewPreviews] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      if (!isSupabaseConfigured()) {
        alert('Database connect नहीं है')
        router.push('/admin/dashboard')
        return
      }

      const user = await getCurrentUser()
      if (!user) {
        router.push('/admin/login')
        return
      }

      const cats = await getCategories()
      if (cats?.length) setCategories(cats)

      const { data: newsItem, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !newsItem) {
        alert('खबर नहीं मिली')
        router.push('/admin/dashboard')
        return
      }

      if (user.role !== 'admin' && newsItem.reporter_id !== user.id) {
        alert('आप इस खबर को एडिट नहीं कर सकते')
        router.push('/admin/dashboard')
        return
      }

      setFormData({
        headline: newsItem.headline || '',
        subheadline: newsItem.subheadline || '',
        category_id: newsItem.category_id ? String(newsItem.category_id) : '',
        points: newsItem.points?.length ? newsItem.points : [''],
        location: newsItem.location || '',
        is_trending: !!newsItem.is_trending,
        is_breaking: !!newsItem.is_breaking,
        video_url: newsItem.video_url || '',
        video_type: newsItem.video_type || 'youtube',
        status: newsItem.status || 'pending',
        // Fetch existing live updates safely
        live_updates: Array.isArray(newsItem.live_updates) && newsItem.live_updates.length > 0 ? newsItem.live_updates : [{ time: '', text: '' }],
      })
      setExistingImageString(newsItem.featured_image || '')
      setIsLoading(false)
    }

    fetchNews()
  }, [id, router])

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

  // Live Updates Handlers
  const addLiveUpdate = () => setFormData((p) => ({ ...p, live_updates: [...(p.live_updates || []), { time: '', text: '' }] }))
  const removeLiveUpdate = (i) => setFormData((p) => ({ ...p, live_updates: p.live_updates.filter((_, idx) => idx !== i) }))
  const updateLiveUpdate = (i, field, value) => setFormData((p) => ({
    ...p,
    live_updates: p.live_updates.map((u, idx) => idx === i ? { ...u, [field]: value } : u)
  }))

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setNewImageFiles((prev) => [...prev, ...files])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => setNewPreviews((prev) => [...prev, ev.target.result])
      reader.readAsDataURL(file)
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const filteredPoints = formData.points.map((p) => p.trim()).filter((p) => p && p !== '[H]')
      if (!filteredPoints.length) throw new Error('Points जरूरी हैं')

      // Live updates filter
      const cleanedLive = (formData.is_trending || formData.is_breaking) 
        ? (formData.live_updates || []).map((u) => ({ time: (u.time || '').trim(), text: (u.text || '').trim() })).filter((u) => u.time && u.text) 
        : []

      let imageString = existingImageString
      if (newImageFiles.length > 0) {
        const urls = []
        for (const file of newImageFiles) {
          urls.push(await uploadImage(file))
        }
        const old = existingImageString ? existingImageString.split(',').map((s) => s.trim()).filter(Boolean) : []
        imageString = [...old, ...urls].join(',')
      }

      if (!imageString) throw new Error('कम से कम 1 फोटो जरूरी है')

      const user = await getCurrentUser()
      const payload = {
        headline: formData.headline.trim(),
        subheadline: formData.subheadline.trim() || null,
        points: filteredPoints,
        category_id: formData.category_id ? parseInt(formData.category_id, 10) : null,
        featured_image: imageString,
        location: formData.location.trim() || null,
        is_trending: formData.is_trending,
        is_breaking: formData.is_breaking,
        live_updates: cleanedLive,
        video_url: formData.video_url.trim() || null,
        video_type: formData.video_url.trim() ? formData.video_type : null,
      }

      if (user?.role === 'admin') {
        payload.status = formData.status
      }

      const { error } = await supabase.from('news').update(payload).eq('id', id)
      if (error) throw error

      alert('✅ खबर अपडेट हो गई')
      router.push('/admin/dashboard')
    } catch (err) {
      alert(err.message || 'Update error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="p-10 text-center text-brand-primary font-yantramanav">लोड हो रहा है...</div>
  }

  const existingImages = existingImageString
    ? existingImageString.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  return (
    <div className="min-h-screen bg-brand-background pb-10">
      <header className="bg-brand-primary text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-poppins"><ArrowLeft className="w-4 h-4" /> डैशबोर्ड</Link>
          <h1 className="font-poppins font-bold text-sm">खबर एडिट करें</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">हेडलाइन *</label>
                <input type="text" value={formData.headline} onChange={(e) => setFormData({ ...formData, headline: e.target.value })} required className="w-full px-4 py-3 border border-gray-200 rounded-xl font-yantramanav text-lg outline-none focus:border-brand-primary" />
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">सब-हेडलाइन</label>
                <textarea value={formData.subheadline} onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })} rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl font-yantramanav outline-none focus:border-brand-primary resize-none" />
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-3">हेडिंग्स + पॉइंट्स</label>
                <div className="space-y-3">
                  {formData.points.map((point, idx) => {
                    const isHeading = point.startsWith('[H]')
                    const display = isHeading ? point.replace(/^\[H\]\s?/, '') : point
                    return (
                      <div key={idx} className="flex items-start gap-2">
                        <span className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-1 ${isHeading ? 'bg-brand-primary text-white' : 'bg-brand-primary/10 text-brand-primary'}`}>{isHeading ? 'H' : idx + 1}</span>
                        <textarea value={display} onChange={(e) => updatePoint(idx, e.target.value, isHeading)} rows={isHeading ? 1 : 2} className={`flex-1 px-4 py-2 border rounded-xl outline-none ${isHeading ? 'font-bold border-brand-primary/40 text-brand-primary' : 'border-gray-200 text-sm'}`} />
                        {formData.points.length > 1 ? <button type="button" onClick={() => removePoint(idx)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg mt-1"><X className="w-4 h-4" /></button> : null}
                      </div>
                    )
                  })}
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  <button type="button" onClick={addPoint} className="px-3 py-2 border-2 border-brand-primary text-brand-primary rounded-lg text-sm font-semibold inline-flex items-center gap-2"><Plus className="w-4 h-4" /> बुलेट</button>
                  <button type="button" onClick={addHeading} className="px-3 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold inline-flex items-center gap-2"><Plus className="w-4 h-4" /> हेडिंग</button>
                </div>
              </div>

              {/* LIVE UPDATES SECTION */}
              {(formData.is_trending || formData.is_breaking) && (
                <div className="bg-red-50/50 rounded-2xl shadow-sm p-6 border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse" />
                    <label className="text-sm font-poppins font-semibold text-brand-red">लाइव अपडेट्स</label>
                  </div>
                  <div className="space-y-3">
                    {(formData.live_updates || []).map((u, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-2 items-start border border-gray-100 rounded-xl p-3 bg-white">
                        <input type="text" value={u.time} onChange={(e) => updateLiveUpdate(idx, 'time', e.target.value)} placeholder="3:25 PM" className="w-full sm:w-28 px-3 py-2 border rounded-lg text-xs" />
                        <textarea value={u.text} onChange={(e) => updateLiveUpdate(idx, 'text', e.target.value)} rows={2} className="flex-1 w-full px-3 py-2 border rounded-lg text-sm resize-none" />
                        {(formData.live_updates || []).length > 1 && <button type="button" onClick={() => removeLiveUpdate(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg text-xs shrink-0"><X className="w-4 h-4" /></button>}
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addLiveUpdate} className="mt-3 text-sm text-brand-red">+ और जोड़ें</button>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-3">मौजूदा फोटो</label>
                {existingImages.length ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {existingImages.map((src, i) => (
                      <div key={i} className="h-24 rounded-xl overflow-hidden bg-gray-100"><img src={src} alt="" className="w-full h-full object-cover" /></div>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-400 mb-3">कोई पुरानी फोटो नहीं</p>}
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">नई फोटो जोड़ें (optional)</label>
                <input type="file" accept="image/*" multiple onChange={handleNewImages} className="w-full border p-2 rounded-xl" />
                {newPreviews.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {newPreviews.map((src, i) => <img key={i} src={src} alt="" className="h-20 w-full object-cover rounded-lg" />)}
                  </div>
                ) : null}
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">YouTube URL</label>
                <input type="url" value={formData.video_url} onChange={(e) => setFormData({ ...formData, video_url: e.target.value })} placeholder="https://youtube.com/watch?v=..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">कैटेगरी</label>
                <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
                  <option value="">चुनें</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">लोकेशन</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 space-y-4">
                <label className="flex items-center gap-3"><input type="checkbox" checked={formData.is_trending} onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })} className="w-5 h-5" /> <span className="text-sm font-medium">Trending News</span></label>
                <label className="flex items-center gap-3"><input type="checkbox" checked={formData.is_breaking} onChange={(e) => setFormData({ ...formData, is_breaking: e.target.checked })} className="w-5 h-5" /> <span className="text-sm font-medium">Breaking / Live</span></label>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">Status (Admin)</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
                  <option value="pending">Pending</option>
                  <option value="approved">Approved (Live)</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-brand-primary text-white rounded-xl font-bold">{isSubmitting ? 'सेव हो रहा है...' : <><Save className="w-4 h-4 inline" /> सेव / Update</>}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}