'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FileText, Users, Plus, TrendingUp, Clock, LogOut, Newspaper, Trash2, Edit } from 'lucide-react'
import Logo from '@/components/Logo'
import { supabase, signOut, getCurrentUser, isSupabaseConfigured } from '@/lib/supabase'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [recentNews, setRecentNews] = useState([])
  const [stats, setStats] = useState({ total: 0, today: 0, trending: 0, pending: 0 })

  const fetchDashboardData = async () => {
    if (isSupabaseConfigured()) {
      const { data: allNews } = await supabase.from('news').select('id, is_trending, status, published_at')
      if (allNews) {
        const today = new Date().toDateString()
        setStats({
          total: allNews.length,
          today: allNews.filter((n) => new Date(n.published_at).toDateString() === today).length,
          trending: allNews.filter((n) => n.is_trending).length,
          pending: allNews.filter((n) => n.status === 'pending').length,
        })
      }
      const { data: recent } = await supabase
        .from('news')
        .select('id, headline, slug, status, published_at')
        .order('published_at', { ascending: false })
      if (recent) setRecentNews(recent)
    }
  }

  useEffect(() => {
    async function init() {
      const u = await getCurrentUser()
      if (!u) { router.push('/admin/login'); return }
      setUser(u)
      await fetchDashboardData()
    }
    init()
  }, [router])

  const handleLogout = async () => {
    await signOut()
    router.push('/admin/login')
  }

  // Delete News Function
  const handleDelete = async (id) => {
    if (window.confirm('क्या आप सच में इस खबर को डिलीट करना चाहते हैं?')) {
      await supabase.from('news').delete().eq('id', id)
      alert('खबर डिलीट हो गई!')
      fetchDashboardData() // Refresh list
    }
  }

  return (
    <div className="min-h-screen bg-brand-lightGray">
      <header className="bg-brand-navy text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <h1 className="font-poppins font-bold text-sm">Admin Dashboard</h1>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1 text-white/60 hover:text-white text-xs font-poppins">
            <LogOut className="w-4 h-4" /> लॉगआउट
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-yantramanav text-gray-900">डैशबोर्ड</h2>
          <Link href="/admin/news/new" className="btn-navy"><Plus className="w-4 h-4" />नई खबर जोड़ें</Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm"><p className="text-gray-500 text-sm">कुल खबरें</p><h3 className="text-2xl font-bold">{stats.total}</h3></div>
          <div className="bg-white rounded-2xl p-5 shadow-sm"><p className="text-gray-500 text-sm">आज की खबरें</p><h3 className="text-2xl font-bold text-green-600">{stats.today}</h3></div>
          <div className="bg-white rounded-2xl p-5 shadow-sm"><p className="text-gray-500 text-sm">ट्रेंडिंग</p><h3 className="text-2xl font-bold text-orange-500">{stats.trending}</h3></div>
          <div className="bg-white rounded-2xl p-5 shadow-sm"><p className="text-gray-500 text-sm">पेंडिंग</p><h3 className="text-2xl font-bold text-red-500">{stats.pending}</h3></div>
        </div>

        {/* News List with Delete/Edit */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold font-yantramanav text-gray-900 mb-4">सभी खबरें प्रबंधित करें (Manage News)</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {recentNews.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-yantramanav font-medium text-gray-900 text-sm truncate">{item.headline}</p>
                  <p className="text-xs text-gray-400 font-poppins mt-1">
                    {new Date(item.published_at).toLocaleString('hi-IN')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-poppins font-medium ${
                    item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status === 'approved' ? 'Live' : 'Pending'}
                  </span>
                  
                  <Link href={`/admin/news/edit/${item.id}`} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="Edit">
  <Edit className="w-4 h-4" />
</Link>
                  
                  {/* Delete Button */}
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}