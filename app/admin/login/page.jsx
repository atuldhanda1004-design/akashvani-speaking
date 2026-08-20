'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Mic, Lock, User } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('गलत ईमेल या पासवर्ड');
      setLoading(false);
      return;
    }

    // Check role
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (!userData || userData.role === 'reporter' && !['admin', 'editor', 'reporter'].includes(userData.role)) {
      setError('एक्सेस नहीं है');
      setLoading(false);
      return;
    }

    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <Mic className="mx-auto text-red-600 mb-2" size={40} />
          <h1 className="text-2xl font-black">आकाशवाणी <span className="text-red-600">Admin</span></h1>
          <p className="text-gray-500 text-sm">लॉगिन करें</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">ईमेल</label>
            <div className="flex items-center border rounded-lg mt-1 px-3">
              <User size={16} className="text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 px-2 outline-none"
                placeholder="admin@akashvanispeaking.news"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">पासवर्ड</label>
            <div className="flex items-center border rounded-lg mt-1 px-3">
              <Lock size={16} className="text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 px-2 outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition disabled:opacity-50"
          >
            {loading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें'}
          </button>
        </form>
      </div>
    </div>
  );
}