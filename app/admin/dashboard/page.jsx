'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText, Clock, TrendingUp, Users,
  Image, Video, BarChart3, Settings,
  Plus, CheckCircle, XCircle, LogOut
} from 'lucide-react';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [pendingNews, setPendingNews] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/admin/login'); return; }

      const { data: userData } = await supabase
        .from('users').select('*').eq('id', user.id).single();

      setUser(userData);

      // Fetch stats
      const { count: totalNews } = await supabase.from('news').select('*', { count: 'exact' });
      const { count: pending } = await supabase.from('news').select('*', { count: 'exact' }).eq('status', 'pending');
      const { count: approved } = await supabase.from('news').select('*', { count: 'exact' }).eq('status', 'approved');
      const { count: trending } = await supabase.from('news').select('*', { count: 'exact' }).eq('is_trending', true);

      setStats({ total: totalNews, pending, approved, trending });

      // Pending news for editor
      if (userData?.role === 'editor' || userData?.role === 'admin') {
        const { data } = await supabase
          .from('news')
          .select('*, users(full_name)')
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(10);
        setPendingNews(data || []);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (!user) return <div className="p-8 text-center">लोड हो रहा है...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-lg">🎙️ आकाशवाणी Admin</h1>
          <span className="bg-red-600 text-xs px-2 py-1 rounded-full uppercase">{user.role}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">👤 {user.full_name}</span>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <FileText className="text-blue-600 mb-2" size={24} />
            <p className="text-2xl font-black">{stats.total || 0}</p>
            <p className="text-sm text-gray-500">कुल खबरें</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <Clock className="text-yellow-600 mb-2" size={24} />
            <p className="text-2xl font-black text-yellow-600">{stats.pending || 0}</p>
            <p className="text-sm text-gray-500">पेंडिंग (Approval)</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <CheckCircle className="text-green-600 mb-2" size={24} />
            <p className="text-2xl font-black text-green-600">{stats.approved || 0}</p>
            <p className="text-sm text-gray-500">प्रकाशित</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border">
            <TrendingUp className="text-red-600 mb-2" size={24} />
            <p className="text-2xl font-black text-red-600">{stats.trending || 0}</p>
            <p className="text-sm text-gray-500">ट्रेंडिंग</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/news/new" className="bg-red-600 hover:bg-red-700 text-white rounded-xl p-5 text-center font-bold transition">
            <Plus className="mx-auto mb-2" size={24} /> नई खबर जोड़ें
          </Link>
          <Link href="/admin/news/pending" className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl p-5 text-center font-bold transition">
            <Clock className="mx-auto mb-2" size={24} /> पेंडिंग खबरें
          </Link>
          <Link href="/admin/ads" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-5 text-center font-bold transition">
            <BarChart3 className="mx-auto mb-2" size={24} /> विज्ञापन
          </Link>
          <Link href="/admin/settings" className="bg-gray-700 hover:bg-gray-800 text-white rounded-xl p-5 text-center font-bold transition">
            <Settings className="mx-auto mb-2" size={24} /> सेटिंग्स
          </Link>
        </div>

        {/* Pending News for Approval (Editor/Admin) */}
        {(user.role === 'editor' || user.role === 'admin') && pendingNews.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock className="text-yellow-500" size={20} />
              Approval के लिए पेंडिंग खबरें ({pendingNews.length})
            </h2>
            <div className="space-y-3">
              {pendingNews.map((news) => (
                <div key={news.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm">{news.headline}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Reporter: {news.users?.full_name} | Points: {news.points?.length} | {new Date(news.created_at).toLocaleString('hi-IN')}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={async () => {
                        await supabase.from('news').update({
                          status: 'approved',
                          approved_by: user.id,
                          approved_at: new Date().toISOString(),
                          published_at: new Date().toISOString()
                        }).eq('id', news.id);
                        setPendingNews((p) => p.filter((n) => n.id !== news.id));
                      }}
                      className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-green-700"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={async () => {
                        await supabase.from('news').update({ status: 'rejected' }).eq('id', news.id);
                        setPendingNews((p) => p.filter((n) => n.id !== news.id));
                      }}
                      className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-red-700"
                    >
                      ❌ Reject
                    </button>
                    <Link href={`/admin/news/edit/${news.id}`} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700">
                      ✏️ Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}