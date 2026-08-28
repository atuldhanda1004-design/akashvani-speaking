'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus, Trash2, Edit, Check, XCircle, IndianRupee, Video, Zap, Newspaper, FileText, Clock } from 'lucide-react'
import AdminSidebar from '@/components/AdminSidebar'
import { supabase, getCurrentUser, isSupabaseConfigured } from '@/lib/supabase'
import { Suspense } from 'react'

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab') || 'dashboard'
  
  const [user, setUser] = useState(null)
  const [newsList, setNewsList] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async (currentUser, tab) => {
    if (!isSupabaseConfigured()) { setLoading(false); return }
    
    const isAdmin = currentUser?.role === 'admin'
    let query = supabase.from('news').select('*, users!reporter_id(full_name)').order('published_at', { ascending: false })
    
    // Non-admin sees only their news
    if (!isAdmin) {
      query = query.eq('reporter_id', currentUser.id)
    }

    // Filter by tab
    if (tab === 'trending') query = query.or('is_trending.eq.true,is_breaking.eq.true')
    else if (tab === 'video') query = query.not('video_url', 'is', null)
    else if (tab === 'pending') query = query.eq('status', 'pending')
    
    const { data } = await query.limit(100)
    setNewsList(data || [])
    setLoading(false)
  }

  useEffect(() => {
    async function init() {
      const u = await getCurrentUser()
      if (!u) { router.push('/admin/login'); return }
      setUser(u)
      await fetchData(u, currentTab)
    }
    init()
  }, [currentTab, router])

  const handleDelete = async (id) => {
    if (window.confirm('क्या आप इस खबर को डिलीट करना चाहते हैं?')) {
      await supabase.from('news').delete().eq('id', id)
      fetchData(user, currentTab)
    }
  }

  const handleApprove = async (id) => {
    await supabase.from('news').update({ status: 'approved' }).eq('id', id)
    alert('✅ खबर Approve हो गई और अब Live है!')
    fetchData(user, currentTab)
  }

  const handleReject = async (id) => {
    await supabase.from('news').update({ status: 'rejected' }).eq('id', id)
    fetchData(user, currentTab)
  }

  if (!user) return <div className="p-10 text-center">Loading...</div>

  const isAdmin = user.role === 'admin'
  
  // Tab Titles
  const tabTitles = { dashboard: '📊 Dashboard Overview', all: '📰 सारी खबरें', trending: '🔥 Trending / Live News', video: '📺 Video News', pending: '⏳ Pending Approvals', reporters: '👥 Reporters' }
  const currentTitle = tabTitles[currentTab] || 'Dashboard'

  return (
    <div className="min-h-screen bg-brand-background flex">
      <AdminSidebar isAdmin={isAdmin} userName={user.full_name || user.email} />
      
      <main className="flex-1 p-4 md:p-8 pt-16 lg:pt-8 min-w-0">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold font-poppins text-brand-primary">{currentTitle}</h1>
            <p className="text-sm text-gray-500 mt-1">नमस्ते, {user.full_name || 'Admin'} 👋</p>
          </div>
          <Link href="/admin/news/new" className="bg-brand-primary text-white px-4 py-2.5 rounded-lg font-poppins font-bold text-sm flex items-center gap-2 hover:bg-brand-secondary shadow-md">
            <Plus className="w-4 h-4" /> नई खबर लिखें
          </Link>
        </div>

        {/* Dashboard Stats (Overview Tab) */}
        {currentTab === 'dashboard' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <FileText className="w-6 h-6 text-blue-500 mb-2" />
              <p className="text-xs text-gray-500">कुल खबरें</p>
              <p className="text-2xl font-bold">{newsList.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <Zap className="w-6 h-6 text-red-500 mb-2" />
              <p className="text-xs text-gray-500">Live / Trending</p>
              <p className="text-2xl font-bold">{newsList.filter(n => n.is_trending || n.is_breaking).length}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <Video className="w-6 h-6 text-purple-500 mb-2" />
              <p className="text-xs text-gray-500">Video News</p>
              <p className="text-2xl font-bold">{newsList.filter(n => n.video_url).length}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <Clock className="w-6 h-6 text-yellow-500 mb-2" />
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-2xl font-bold">{newsList.filter(n => n.status === 'pending').length}</p>
            </div>
          </div>
        )}

        {/* News List */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          {loading ? <p className="text-center p-10">लोड हो रहा है...</p> :
            newsList.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 mb-4">इस सेक्शन में कोई खबर नहीं है।</p>
                <Link href="/admin/news/new" className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm">पहली खबर लिखें</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {newsList.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-1 mb-1 flex-wrap">
                        {item.is_breaking && <span className="text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded">LIVE</span>}
                        {item.is_trending && <span className="text-[9px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded">TRENDING</span>}
                        {item.video_url && <span className="text-[9px] font-bold bg-purple-500 text-white px-1.5 py-0.5 rounded">VIDEO</span>}
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.status === 'approved' ? 'bg-green-100 text-green-700' : item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {item.status === 'approved' ? 'LIVE ✓' : item.status === 'pending' ? 'PENDING ⏳' : 'REJECTED ✗'}
                        </span>
                      </div>
                      <p className="font-yantramanav font-semibold text-gray-900 text-sm truncate">{item.headline}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(item.published_at).toLocaleDateString('hi-IN')} · Reporter: {item.users?.full_name || 'Admin'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {isAdmin && item.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(item.id)} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200" title="Approve"><Check className="w-4 h-4" /></button>
                          <button onClick={() => handleReject(item.id)} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200" title="Reject"><XCircle className="w-4 h-4" /></button>
                        </>
                      )}
                      <Link href={`/news/${item.slug}`} target="_blank" className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200" title="View">👁</Link>
                      <Link href={`/admin/news/edit/${item.id}`} className="p-1.5 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200" title="Edit"><Edit className="w-4 h-4" /></Link>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </main>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}