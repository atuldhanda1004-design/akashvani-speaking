'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FileText, Plus, LogOut, Trash2, Edit, IndianRupee, Users } from 'lucide-react'
import Logo from '@/components/Logo'
import { supabase, signOut, getCurrentUser, isSupabaseConfigured, getReporters, updatePayout } from '@/lib/supabase'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [newsList, setNewsList] = useState([])
  const [reporters, setReporters] = useState([])
  const [stats, setStats] = useState({ total: 0, pending: 0 })

  const fetchDashboardData = async (currentUser) => {
    if (!isSupabaseConfigured()) return
    
    const isAdmin = currentUser.role === 'admin'

    // Fetch News
    let query = supabase.from('news').select('id, headline, slug, status, published_at').order('published_at', { ascending: false })
    
    // Reporter sees ONLY their news, Admin sees all
    if (!isAdmin) {
      query = query.eq('reporter_id', currentUser.id)
    }

    const { data: recent } = await query
    if (recent) {
      setNewsList(recent)
      setStats({
        total: recent.length,
        pending: recent.filter(n => n.status === 'pending').length
      })
    }

    // If Admin, fetch all reporters for payout management
    if (isAdmin) {
      const reps = await getReporters()
      setReporters(reps)
    }
  }

  useEffect(() => {
    async function init() {
      const u = await getCurrentUser()
      if (!u) { router.push('/admin/login'); return }
      setUser(u)
      await fetchDashboardData(u)
    }
    init()
  }, [router])

  const handleLogout = async () => {
    await signOut()
    router.push('/admin/login')
  }

  const handleDelete = async (id) => {
    if (window.confirm('क्या आप सच में इस खबर को डिलीट करना चाहते हैं?')) {
      await supabase.from('news').delete().eq('id', id)
      fetchDashboardData(user)
    }
  }

  const handlePayoutUpdate = async (repId, currentAmount) => {
    const newAmount = window.prompt('नई कमाई (Payout Amount in INR) दर्ज करें:', currentAmount)
    if (newAmount !== null && !isNaN(newAmount)) {
      const success = await updatePayout(repId, parseFloat(newAmount))
      if (success) {
        alert('Payout अपडेट हो गया!')
        fetchDashboardData(user)
      } else {
        alert('एरर!')
      }
    }
  }

  if (!user) return <div className="p-10 text-center">Loading...</div>

  const isAdmin = user.role === 'admin'

  return (
    <div className="min-h-screen bg-brand-background pb-10">
      <header className="bg-brand-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <h1 className="font-poppins font-bold text-sm">Dashboard</h1>
              <p className="text-[10px]">{isAdmin ? 'Admin Panel' : 'Reporter Panel'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1 text-white/80 hover:text-white text-xs font-poppins">
            <LogOut className="w-4 h-4" /> लॉगआउट
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* Welcome & Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h2 className="text-xl font-bold font-yantramanav text-gray-900">
              नमस्ते, {user.full_name || user.email?.split('@')[0]}
            </h2>
            <p className="text-sm text-gray-500 font-poppins mt-1">
              Role: <span className="font-semibold text-brand-primary uppercase">{user.role}</span>
            </p>
          </div>
          <Link href="/admin/news/new" className="bg-brand-primary text-white px-5 py-2.5 rounded-lg font-poppins font-semibold text-sm flex items-center gap-2 hover:bg-brand-secondary transition-all shadow-md">
            <Plus className="w-4 h-4" /> नई खबर लिखें
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><FileText /></div>
            <div><p className="text-gray-500 text-sm">कुल खबरें</p><h3 className="text-2xl font-bold">{stats.total}</h3></div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center"><Clock /></div>
            <div><p className="text-gray-500 text-sm">पेंडिंग खबरें</p><h3 className="text-2xl font-bold">{stats.pending}</h3></div>
          </div>

          {/* PAYOUT SECTION */}
          {!isAdmin && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-200 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><IndianRupee /></div>
              <div>
                <p className="text-gray-500 text-sm">आपकी कुल कमाई</p>
                <h3 className="text-2xl font-bold text-green-700">₹ {user.payout_balance || '0'}</h3>
              </div>
            </div>
          )}
        </div>

        {/* FOR ADMIN ONLY: Manage Reporters Payout */}
        {isAdmin && reporters.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold font-poppins text-gray-900 mb-4 flex items-center gap-2">
              <Users className="text-brand-primary" /> रिपोर्टर्स की कमाई (Payouts) सेट करें
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-poppins">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th className="p-3 rounded-l-lg">Reporter Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Current Payout</th>
                    <th className="p-3 rounded-r-lg text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reporters.map(rep => (
                    <tr key={rep.id} className="border-b border-gray-50">
                      <td className="p-3 font-semibold text-gray-900">{rep.full_name || 'No Name'}</td>
                      <td className="p-3 text-gray-500">{rep.email}</td>
                      <td className="p-3 text-green-600 font-bold">₹ {rep.payout_balance || '0'}</td>
                      <td className="p-3 text-right">
                        <button onClick={() => handlePayoutUpdate(rep.id, rep.payout_balance || 0)} className="text-xs bg-brand-primary text-white px-3 py-1.5 rounded hover:bg-brand-secondary">
                          Update ₹
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* News List */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold font-yantramanav text-gray-900 mb-4">
            {isAdmin ? 'सभी रिपोर्टर्स की खबरें' : 'आपकी डाली गई खबरें'}
          </h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {newsList.length === 0 && <p className="text-sm text-gray-500">कोई खबर नहीं मिली।</p>}
            {newsList.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-yantramanav font-semibold text-gray-900 text-sm md:text-base truncate">{item.headline}</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 font-poppins mt-1">
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