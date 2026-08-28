'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, X, Upload, Trash2, Send, Info, Newspaper, Zap, Video, Grid3X3 } from 'lucide-react'
import AdminSidebar from '@/components/AdminSidebar'
import { dummyCategories } from '@/lib/dummyData'
import { createNews, uploadImage, getCategories, getCurrentUser, isSupabaseConfigured } from '@/lib/supabase'

function slugify(text) {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').substring(0, 80) + '-' + Date.now().toString().slice(-5)
}

// News Type Options (Big Buttons)
const NEWS_TYPES = [
  { id: 'latest', label: 'Latest News', icon: Newspaper, desc: 'सामान्य ताज़ा खबर (Homepage पर Latest section में)', color: 'blue' },
  { id: 'trending', label: 'Trending / Live', icon: Zap, desc: 'बड़ी खबर (Homepage पर ऊपर Scroll में + Live Updates के साथ)', color: 'red' },
  { id: 'video', label: 'Video / Short', icon: Video, desc: 'YouTube वीडियो न्यूज़ (Short News section में भी दिखेगी)', color: 'purple' },
  { id: 'category', label: 'Category Only', icon: Grid3X3, desc: 'सिर्फ कैटेगरी पेज पर दिखे (होमपेज पर नहीं)', color: 'gray' },
]

export default function AddNewsPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [categories, setCategories] = useState(dummyCategories)
  const [newsType, setNewsType] = useState('latest')
  const [formData, setFormData] = useState({
    headline: '', subheadline: '', category_id: '', points: [''], location: '',
    video_url: '', live_updates: [{ time: '', text: '' }],
  })
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function init() {
      const u = await getCurrentUser()
      if (!u) { router.push('/admin/login'); return }
      setUser(u)
      const cats = await getCategories()
      if (cats?.length) setCategories(cats)
    }
    init()
  }, [router])

  // Handlers
  const addPoint = () => setFormData(p => ({ ...p, points: [...p.points, ''] }))
  const addHeading = () => setFormData(p => ({ ...p, points: [...p.points, '[H] '] }))
  const removePoint = (i) => setFormData(p => ({ ...p, points: p.points.filter((_, x) => x !== i) }))
  const updatePoint = (i, v, isH) => setFormData(p => ({ ...p, points: p.points.map((pt, x) => x !== i ? pt : (isH ? (v.startsWith('[H]') ? v : `[H] ${v}`) : v)) }))
  const addLive = () => setFormData(p => ({ ...p, live_updates: [...p.live_updates, { time: '', text: '' }] }))
  const removeLive = (i) => setFormData(p => ({ ...p, live_updates: p.live_updates.filter((_, x) => x !== i) }))
  const updateLive = (i, f, v) => setFormData(p => ({ ...p, live_updates: p.live_updates.map((u, x) => x === i ? { ...u, [f]: v } : u) }))

  const handleImages = (e) => {
    const files = Array.from(e.target.files || [])
    setImageFiles(prev => [...prev, ...files])
    files.forEach(f => {
      const r = new FileReader()
      r.onload = (ev) => setImagePreviews(prev => [...prev, ev.target.result])
      r.readAsDataURL(f)
    })
  }
  const removeImage = (i) => { setImageFiles(prev => prev.filter((_, x) => x !== i)); setImagePreviews(prev => prev.filter((_, x) => x !== i)) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const points = formData.points.map(p => p.trim()).filter(p => p && p !== '[H]')
      if (!formData.headline.trim()) throw new Error('हेडलाइन जरूरी है')
      if (newsType === 'video' && !formData.video_url.trim()) throw new Error('Video News के लिए YouTube URL जरूरी है')
      if (newsType !== 'video' && !imageFiles.length) throw new Error('कम से कम 1 फोटो जरूरी है')

      // Set flags based on News Type
      const isTrending = newsType === 'trending'
      const isBreaking = newsType === 'trending'
      const liveUpdates = isTrending ? formData.live_updates.filter(u => u.time && u.text) : []

      let urls = []
      if (imageFiles.length && isSupabaseConfigured()) {
        for (const f of imageFiles) urls.push(await uploadImage(f))
      }

      const payload = {
        slug: slugify(formData.headline),
        headline: formData.headline.trim(),
        subheadline: formData.subheadline.trim() || null,
        points, category_id: parseInt(formData.category_id) || null,
        featured_image: urls.join(','),
        location: formData.location.trim() || null,
        is_trending: isTrending, is_breaking: isBreaking,
        live_updates: liveUpdates,
        video_url: formData.video_url.trim() || null,
        video_type: formData.video_url ? 'youtube' : null,
        news_type: newsType,
        status: user?.role === 'admin' ? 'approved' : 'pending',
        reporter_id: user?.id,
        published_at: new Date().toISOString(),
      }
      await createNews(payload)
      alert('✅ खबर सबमिट हो गई!')
      router.push('/admin/dashboard')
    } catch (err) { alert(err.message) } finally { setIsSubmitting(false) }
  }

  const isAdmin = user?.role === 'admin'

  return (
    <div className="min-h-screen bg-brand-background flex">
      <AdminSidebar isAdmin={isAdmin} userName={user?.full_name || 'User'} />

      <main className="flex-1 p-4 md:p-6 pt-16 lg:pt-6 min-w-0">
        <h1 className="text-2xl font-bold text-brand-primary mb-2">✏️ नई खबर लिखें</h1>
        <p className="text-sm text-gray-500 mb-6">पहले खबर का टाइप चुनें, फिर डिटेल्स भरें।</p>

        {/* STEP 1: NEWS TYPE SELECTOR */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border-2 border-brand-primary/20">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Info className="w-5 h-5 text-brand-primary" /> Step 1: खबर का Type चुनें *</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {NEWS_TYPES.map(t => (
              <button key={t.id} type="button" onClick={() => setNewsType(t.id)}
                className={`p-4 rounded-xl text-left transition-all border-2 ${newsType === t.id ? 'border-brand-primary bg-brand-primary/10 shadow-md scale-[1.02]' : 'border-gray-200 hover:border-brand-primary/50'}`}>
                <t.icon className={`w-8 h-8 mb-2 ${newsType === t.id ? 'text-brand-primary' : 'text-gray-400'}`} />
                <p className={`font-bold text-sm ${newsType === t.id ? 'text-brand-primary' : 'text-gray-900'}`}>{t.label}</p>
                <p className="text-[10px] text-gray-500 mt-1 leading-tight">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <label className="block text-sm font-bold mb-2">हेडलाइन *</label>
              <input type="text" value={formData.headline} onChange={(e) => setFormData({...formData, headline: e.target.value})} required className="w-full px-4 py-3 border rounded-xl text-lg font-bold" placeholder="मुख्य हेडलाइन..." />
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <label className="block text-sm font-bold mb-2">सब-हेडलाइन (वैकल्पिक)</label>
              <textarea value={formData.subheadline} onChange={(e) => setFormData({...formData, subheadline: e.target.value})} rows={2} className="w-full px-4 py-2 border rounded-xl text-sm" />
            </div>

            {newsType !== 'video' && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border">
                <label className="block text-sm font-bold mb-3">हेडिंग्स + पॉइंट्स *</label>
                {formData.points.map((p, i) => {
                  const isH = p.startsWith('[H]')
                  return (
                    <div key={i} className="flex gap-2 mb-2 items-start">
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-1 ${isH ? 'bg-brand-primary text-white' : 'bg-gray-200'}`}>{isH ? 'H' : i+1}</span>
                      <textarea value={isH ? p.replace('[H] ','') : p} onChange={(e) => updatePoint(i, e.target.value, isH)} rows={isH ? 1 : 2} placeholder={isH ? 'हेडिंग (जैसे: पुलिस कार्यवाही)' : 'पॉइंट...'} className={`flex-1 px-3 py-2 border rounded text-sm ${isH ? 'font-bold text-brand-primary' : ''}`} />
                      {formData.points.length > 1 && <button type="button" onClick={() => removePoint(i)} className="text-red-500 p-1"><X className="w-4 h-4" /></button>}
                    </div>
                  )
                })}
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={addPoint} className="text-xs bg-gray-200 px-3 py-1 rounded">+ Point</button>
                  <button type="button" onClick={addHeading} className="text-xs bg-brand-primary text-white px-3 py-1 rounded">+ Heading</button>
                </div>
              </div>
            )}

            {newsType === 'trending' && (
              <div className="bg-red-50 rounded-2xl p-5 border-2 border-red-300">
                <label className="block text-sm font-bold mb-3 text-brand-red">🔴 Live Updates (Trending news के लिए)</label>
                {formData.live_updates.map((u, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input type="text" value={u.time} onChange={(e) => updateLive(i, 'time', e.target.value)} placeholder="3:25 PM" className="w-24 px-2 py-1 border rounded text-xs" />
                    <textarea value={u.text} onChange={(e) => updateLive(i, 'text', e.target.value)} rows={1} placeholder="Update..." className="flex-1 px-2 py-1 border rounded text-xs" />
                    {formData.live_updates.length > 1 && <button type="button" onClick={() => removeLive(i)}><X className="w-4 h-4 text-red-500" /></button>}
                  </div>
                ))}
                <button type="button" onClick={addLive} className="text-xs text-brand-red font-bold mt-2">+ Live Update</button>
              </div>
            )}

            {(newsType === 'video' || newsType !== 'video') && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border">
                <label className="block text-sm font-bold mb-2">
                  YouTube Video URL {newsType === 'video' && '*'}
                </label>
                <input type="url" value={formData.video_url} onChange={(e) => setFormData({...formData, video_url: e.target.value})} required={newsType === 'video'} placeholder="https://youtube.com/watch?v=xxx" className="w-full px-4 py-2 border rounded-xl text-sm" />
              </div>
            )}

            {newsType !== 'video' && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border">
                <label className="block text-sm font-bold mb-3">फोटो अपलोड करें *</label>
                {imagePreviews.length > 0 && <div className="grid grid-cols-3 gap-2 mb-3">{imagePreviews.map((s, i) => <div key={i} className="relative"><img src={s} className="h-20 w-full object-cover rounded" /><button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><Trash2 className="w-3 h-3" /></button></div>)}</div>}
                <label className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-brand-primary">
                  <Upload className="w-6 h-6 mx-auto text-gray-400" /><p className="text-xs mt-1">फोटो चुनें</p>
                  <input type="file" multiple accept="image/*" onChange={handleImages} className="hidden" />
                </label>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <label className="block text-sm font-bold mb-2">कैटेगरी *</label>
              <select value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})} required className="w-full px-3 py-2 border rounded-xl text-sm bg-white">
                <option value="">चुनें...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <label className="block text-sm font-bold mb-2">लोकेशन</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="जैसे: भिवानी" className="w-full px-3 py-2 border rounded-xl text-sm" />
            </div>

            <div className="bg-brand-primary/10 rounded-2xl p-5 border-2 border-brand-primary/30 sticky top-4">
              <h4 className="font-bold text-brand-primary mb-3">📌 Publish Info</h4>
              <p className="text-xs text-gray-600 mb-3">Type: <span className="font-bold text-brand-primary">{NEWS_TYPES.find(t => t.id === newsType)?.label}</span></p>
              <p className="text-xs text-gray-600 mb-3">Status: {isAdmin ? <span className="text-green-600 font-bold">तुरंत Live होगी</span> : <span className="text-yellow-600 font-bold">Admin Approval के बाद Live</span>}</p>
              <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-brand-primary text-white rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2">
                {isSubmitting ? 'Submit हो रहा...' : <><Send className="w-4 h-4" /> Publish करें</>}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}