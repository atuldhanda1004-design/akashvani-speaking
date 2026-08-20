'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Users, Plus } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({});
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', full_name: '', role: 'reporter' });
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const { data: sData } = await supabase.from('settings').select('*');
      const obj = {};
      sData?.forEach(s => obj[s.key] = s.value);
      setSettings(obj);

      const { data: uData } = await supabase.from('users').select('*').order('created_at');
      setUsers(uData || []);
    };
    init();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from('settings').upsert({ key, value, updated_at: new Date().toISOString() });
    }
    setSaving(false);
    alert('✅ Settings सेव हो गईं!');
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.full_name) {
      alert('सभी fields भरें!'); return;
    }

    // Create auth user
    const { data, error } = await supabase.auth.admin.createUser({
      email: newUser.email,
      password: newUser.password,
      email_confirm: true,
    });

    if (error) { alert('Error: ' + error.message); return; }

    // Create user profile
    await supabase.from('users').insert({
      id: data.user.id,
      full_name: newUser.full_name,
      role: newUser.role,
    });

    alert('✅ User बन गया!');
    setShowAddUser(false);
    const { data: uData } = await supabase.from('users').select('*').order('created_at');
    setUsers(uData || []);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 text-white px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.push('/admin/dashboard')} className="hover:bg-gray-700 p-2 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-lg">⚙️ सेटिंग्स</h1>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">

        {/* Social Media Handles */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-lg mb-4">📱 Social Media Handles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'facebook_url', label: '📘 Facebook URL' },
              { key: 'instagram_url', label: '📸 Instagram URL' },
              { key: 'twitter_url', label: '🐦 Twitter/X URL' },
              { key: 'youtube_url', label: '📺 YouTube URL' },
              { key: 'whatsapp_channel', label: '💬 WhatsApp Channel' },
              { key: 'telegram_url', label: '✈️ Telegram URL' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-sm font-bold">{label}</label>
                <input
                  value={settings[key] || ''}
                  onChange={e => setSettings({ ...settings, [key]: e.target.value })}
                  placeholder="https://..."
                  className="w-full border rounded-lg px-3 py-2 mt-1 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Site Settings */}
        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-lg mb-4">🌐 Site Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold">Tagline</label>
              <input value={settings.site_tagline || ''} onChange={e => setSettings({...settings, site_tagline: e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-sm font-bold">Breaking News Ticker Text</label>
              <input value={settings.breaking_news || ''} onChange={e => setSettings({...settings, breaking_news: e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-sm font-bold">Contact Email</label>
              <input value={settings.contact_email || ''} onChange={e => setSettings({...settings, contact_email: e.target.value})} className="w-full border rounded-lg px-3 py-2 mt-1" />
            </div>
          </div>
        </div>

        {/* Users Management */}
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Users size={20} /> Users / Reporters
            </h2>
            <button onClick={() => setShowAddUser(!showAddUser)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1">
              <Plus size={14} /> नया User
            </button>
          </div>

          {showAddUser && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input value={newUser.full_name} onChange={e => setNewUser({...newUser, full_name: e.target.value})} placeholder="पूरा नाम" className="border rounded-lg px-3 py-2 text-sm" />
                <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="border rounded-lg px-3 py-2 text-sm">
                  <option value="reporter">📝 Reporter</option>
                  <option value="editor">✏️ Editor</option>
                  <option value="admin">👑 Admin</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="Email" className="border rounded-lg px-3 py-2 text-sm" />
                <input type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} placeholder="Password" className="border rounded-lg px-3 py-2 text-sm" />
              </div>
              <button onClick={handleAddUser} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
                ✅ User बनाएं
              </button>
            </div>
          )}

          <div className="space-y-2">
            {users.map(u => (
              <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-bold text-sm">{u.full_name}</span>
                  <span className="text-xs text-gray-400 ml-2">{u.id}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                  u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                  u.role === 'editor' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {u.role.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold">
          {saving ? 'सेव हो रहा है...' : '💾 सभी Settings सेव करें'}
        </button>
      </div>
    </div>
  );
}