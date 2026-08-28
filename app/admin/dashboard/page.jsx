'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Plus, Trash2, Edit, Check, XCircle, FileText, Clock, Zap, Video, Calendar,
} from 'lucide-react'
import AdminSidebar from '@/components/AdminSidebar'
import { supabase, getCurrentUser, isSupabaseConfigured } from '@/lib/supabase'

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab') || 'dashboard'

  const [user, setUser] = useState(null)
  const [newsList, setNewsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterDate, setFilterDate] = useState('') // YYYY-MM-DD

  const fetchData = async (currentUser, tab, dateStr) => {
    if (!isSupabaseConfigured() || !supabase) {
      setNewsList([])
      setLoading(false)
      return
    }

    setLoading(true)
    const isAdmin = currentUser?.role === 'admin'

    let query = supabase
      .from('news')
      .select('id, headline, slug, status, published_at, is_trending, is_breaking, video_url, location, users!reporter_id(full_name)')
      .order('published_at', { ascending: false })

    if (!isAdmin && currentUser?.id) {
      query = query.eq('reporter_id', currentUser.id)
    }

    if (tab === 'trending') {
      query = query.or('is_trending.eq.true,is_breaking.eq.true')
    } else if (tab === 'video') {
      query = query.not('video_url', 'is', null)
    } else if (tab === 'pending') {
      query = query.eq('status', 'pending')
    }

    // Date filter: selected day 00:00 → next day 00:00
    if (dateStr) {
      const start = new Date(dateStr + 'T00:00:00')
      const end = new Date(dateStr + 'T00:00:00')
      end.setDate(end.getDate() + 1)
      query = query
        .gte('published_at', start.toISOString())
        .lt('published_at', end.toISOString())
    }

    const { data, error } = await query.limit(200)
    if (error) {
      console.error(error)
      setNewsList([])
    } else {
      setNewsList(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    async function init() {
      const u = await getCurrentUser()
      if (!u) {
        router.push('/admin/login')
        return
      }
      setUser(u)
      await fetchData(u, currentTab, filterDate)
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, router])

  useEffect(() => {
    if (user) fetchData(user, currentTab, filterDate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDate])

  const handleDelete = async (id) => {
    if (!window.confirm('क्या आप इस खबर को डिलीट करना चाहते हैं?')) return
    await supabase.from('news').delete().eq('id', id)
    fetchData(user, currentTab, filterDate)
  }

  const handleApprove = async (id) => {
    await supabase.from('news').update({ status: 'approved' }).eq('id', id)
    alert('✅ खबर Approve हो गई!')
    fetchData(user, currentTab, filterDate)
  }

  const handleReject = async (id) => {
    await supabase.from('news').update({ status: 'rejected' }).eq('id', id)
    fetchData(user, currentTab, filterDate)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-brand-primary font-yantramanav">
        Loading...
      </div>
    )
  }

  const isAdmin = user.role === 'admin'
  const tabTitles = {
    dashboard: 'Dashboard Overview',
    all: 'सारी खबरें',
    trending: 'Trending / Live News',
    video: 'Video News',
    pending: 'Pending Approvals',
    reporters: 'Reporters',
  }

  return (
    <div className="min-h-screen bg-brand-background flex">
      <AdminSidebar isAdmin={isAdmin} userName={user.full_name || user.email} />

      <main className="flex-1 p-4 md:p-8 pt-16 lg:pt-8 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold font-poppins text-brand-primary">
              {tabTitles[currentTab] || 'Dashboard'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              नमस्ते, {user.full_name || 'Admin'}
            </p>
          </div>
          <Link
            href="/admin/news/new"
            className="bg-brand-primary text-white px-4 py-2.5 rounded-lg font-poppins font-bold text-sm inline-flex items-center gap-2 hover:bg-brand-secondary shadow-md"
          >
            <Plus className="w-4 h-4" /> नई खबर लिखें
          </Link>
        </div>

        {/* DATE FILTER */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 text-brand-primary font-poppins font-semibold text-sm">
            <Calendar className="w-4 h-4" />
            तारीख से खोजें
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm font-poppins outline-none focus:border-brand-primary"
          />
          {filterDate ? (
            <button
              type="button"
              onClick={() => setFilterDate('')}
              className="text-xs font-poppins font-semibold text-red-600 hover:underline"
            >
              Filter हटाएँ (सारी खबरें)
            </button>
          ) : (
            <span className="text-xs text-gray-400 font-yantramanav">
              खाली = सभी तारीखें
            </span>
          )}
          <span className="sm:ml-auto text-xs text-gray-500 font-poppins">
            कुल: <b>{newsList.length}</b> खबरें
          </span>
        </div>

        {currentTab === 'dashboard' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <FileText className="w-6 h-6 text-blue-500 mb-2" />
              <p className="text-xs text-gray-500">कुल (list)</p>
              <p className="text-2xl font-bold">{newsList.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <Zap className="w-6 h-6 text-red-500 mb-2" />
              <p className="text-xs text-gray-500">Live / Trending</p>
              <p className="text-2xl font-bold">
                {newsList.filter((n) => n.is_trending || n.is_breaking).length}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <Video className="w-6 h-6 text-purple-500 mb-2" />
              <p className="text-xs text-gray-500">Video</p>
              <p className="text-2xl font-bold">
                {newsList.filter((n) => n.video_url).length}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <Clock className="w-6 h-6 text-yellow-500 mb-2" />
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-2xl font-bold">
                {newsList.filter((n) => n.status === 'pending').length}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
          {loading ? (
            <p className="text-center p-10 text-gray-500">लोड हो रहा है...</p>
          ) : newsList.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">
                {filterDate
                  ? 'इस तारीख की कोई खबर नहीं मिली।'
                  : 'इस सेक्शन में कोई खबर नहीं है।'}
              </p>
              <Link
                href="/admin/news/new"
                className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm"
              >
                नई खबर लिखें
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {newsList.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start sm:items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                >
                  {/* Serial Number */}
                  <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-lg bg-brand-primary/10 text-brand-primary font-poppins font-bold text-xs sm:text-sm flex items-center justify-center">
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1 flex-wrap">
                      {item.is_breaking && (
                        <span className="text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded">
                          LIVE
                        </span>
                      )}
                      {item.is_trending && (
                        <span className="text-[9px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded">
                          TRENDING
                        </span>
                      )}
                      {item.video_url && (
                        <span className="text-[9px] font-bold bg-purple-500 text-white px-1.5 py-0.5 rounded">
                          VIDEO
                        </span>
                      )}
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          item.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : item.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {item.status === 'approved'
                          ? 'LIVE'
                          : item.status === 'pending'
                          ? 'PENDING'
                          : 'REJECTED'}
                      </span>
                    </div>
                    <p className="font-yantramanav font-semibold text-gray-900 text-sm truncate">
                      {item.headline}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-poppins">
                      #{item.id} ·{' '}
                      {item.published_at
                        ? new Date(item.published_at).toLocaleString('hi-IN')
                        : '—'}
                      {item.location ? ` · ${item.location}` : ''}
                      {item.users?.full_name
                        ? ` · ${item.users.full_name}`
                        : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isAdmin && item.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <Link
                      href={`/news/${item.slug}`}
                      target="_blank"
                      className="px-2 py-1.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold hover:bg-blue-200"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/news/edit/${item.id}`}
                      className="p-1.5 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}