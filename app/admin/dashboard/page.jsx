'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FileText, Users, Plus, TrendingUp, Clock, LogOut, Newspaper } from 'lucide-react'
import Logo from '@/components/Logo'
import { supabase, signOut, getCurrentUser, isSupabaseConfigured } from '@/lib/supabase'
import { dummyTrendingNews, dummyLatestNews } from '@/lib/dummyData'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [recentNews, setRecentNews] = useState([])
  const [stats, setStats] = useState({
    total: 0, today: 0, trending: 0, pending: 0,
  })

  useEffect(() => {
    async function init() {
      if (isSupabaseConfigured()) {
        const u = await getCurrentUser()
        if (!u) {
          router.push('/admin/login')
          return
        }
        setUser(u)

        // Fetch stats
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
          .select('id, headline, status, published_at')
          .order('published_at', { ascending: false })
          .limit(5)
        if (recent) setRecentNews(recent)
      } else {
        // Demo mode
        setUser({ email: 'admin@akashvanispeaking.news' })
        const all = [...dummyTrendingNews, ...dummyLatestNews]
        setStats({
          total: all.length,
          today: 3,
          trending: all.filter((n) => n.is_trending).length,
          pending: 2,
        })
        setRecentNews(all.slice(0, 5).map((n) => ({ ...n, status: 'approved' })))
      }
    }
    init()
  }, [router])

  const handleLogout = async () => {
    await signOut()
    router.push('/admin/login')
  }

  const statCards = [
    { label: 'कुल खबरें', value: stats.total, icon: Newspaper, color: 'bg-blue-500' },
    { label: 'आज की खबरें', value: stats.today, icon: FileText, color: 'bg-green-500' },
    { label: 'ट्रेंडिंग', value: stats.trending, icon: TrendingUp, color: 'bg-orange-500' },
    { label: 'पेंडिंग', value: stats.pending, icon: Clock, color: 'bg-red-500' },
  ]

  return (
    <div className="min-h-screen bg-brand-lightGray">
      <header className="bg-brand-navy text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <h1 className="font-poppins font-bold text-sm">Admin Dashboard</h1>
              <p className="text-white/50 text-[10px] font-poppins">Akashvani Speaking</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white/60 hover:text-white text-xs font-poppins transition-colors">
              साइट देखें ↗
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-1 text-white/60 hover:text-white text-xs font-poppins transition-colors">
              <LogOut className="w-3.5 h-3.5" />लॉगआउट
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold font-yantramanav text-gray-900">डैशबोर्ड</h2>
            <p className="text-sm text-gray-500 font-poppins mt-1">
              {user?.email} • Welcome back!
            </p>
          </div>
          <Link href="/admin/news/new" className="btn-navy">
            <Plus className="w-4 h-4" />नई खबर जोड़ें
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all animate-fade-in-up"
                 style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-3xl font-bold font-poppins text-gray-900">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-500 font-yantramanav">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold font-yantramanav text-gray-900 mb-4">हाल की खबरें</h3>
          <div className="space-y-3">
            {recentNews.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="font-yantramanav font-medium text-gray-900 text-sm truncate">
                    {item.headline}
                  </p>
                  <p className="text-xs text-gray-400 font-poppins mt-1">
                    {new Date(item.published_at).toLocaleString('hi-IN')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-poppins font-medium ml-2 flex-shrink-0 ${
                  item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.status === 'approved' ? 'प्रकाशित' : 'पेंडिंग'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}