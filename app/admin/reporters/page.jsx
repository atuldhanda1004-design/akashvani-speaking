'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, UserPlus, Info } from 'lucide-react'
import AdminSidebar from '@/components/AdminSidebar'
import { getCurrentUser, getReporters, updatePayout } from '@/lib/supabase'

export default function ReportersManage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [reporters, setReporters] = useState([])

  useEffect(() => {
    async function load() {
      const u = await getCurrentUser()
      if (!u || u.role !== 'admin') {
        alert('सिर्फ Admin ही इस पेज को खोल सकते हैं!')
        router.push('/admin/dashboard')
        return
      }
      setUser(u)
      const reps = await getReporters()
      setReporters(reps)
    }
    load()
  }, [router])

  const handlePayoutUpdate = async (id, current) => {
    const newAmount = prompt('Payout Amount दर्ज करें (INR):', current)
    if (newAmount !== null && !isNaN(newAmount)) {
      await updatePayout(id, parseFloat(newAmount))
      alert('अपडेट हो गया')
      const reps = await getReporters()
      setReporters(reps)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-brand-background flex">
      <AdminSidebar isAdmin={true} userName={user.full_name} />
      
      <main className="flex-1 p-4 md:p-8 lg:ml-0 pt-16 lg:pt-8">
        <h1 className="text-2xl font-bold font-poppins text-brand-primary mb-2">Reporters & Payouts</h1>
        <p className="text-sm text-gray-500 mb-6">रिपोर्टर्स की कमाई सेट करें और नए रिपोर्टर बनाएं।</p>

        {/* Info Box for Creating New Reporter */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-blue-800 font-poppins mb-1">नया रिपोर्टर कैसे बनाएं?</h3>
            <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside font-yantramanav">
              <li>Supabase Dashboard खोलें → Authentication → Users → Add User</li>
              <li>Reporter का Email और Password डालें।</li>
              <li>वापस Supabase → Table Editor → `users` टेबल में उस user की row में `role` = `reporter` और `full_name` डालें।</li>
              <li>अब वो रिपोर्टर उसी Email/Password से लॉगिन कर सकता है।</li>
            </ol>
            <a href="https://supabase.com/dashboard" target="_blank" className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline mt-2">
              <UserPlus className="w-3 h-3" /> Supabase खोलें
            </a>
          </div>
        </div>

        {/* Reporter List */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-bold text-lg mb-4">कुल रिपोर्टर्स: {reporters.length}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-poppins">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">Name</th><th className="p-3">Email/ID</th><th className="p-3">Payout</th><th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {reporters.map(rep => (
                  <tr key={rep.id} className="border-b border-gray-100">
                    <td className="p-3 font-bold">{rep.full_name || 'Unnamed'}</td>
                    <td className="p-3 text-xs text-gray-500">{rep.email || rep.id}</td>
                    <td className="p-3 text-green-600 font-bold">₹ {rep.payout_balance || 0}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => handlePayoutUpdate(rep.id, rep.payout_balance || 0)} className="bg-brand-primary text-white px-3 py-1.5 rounded text-xs hover:bg-brand-secondary">Payout Update</button>
                    </td>
                  </tr>
                ))}
                {reporters.length === 0 && <tr><td colSpan="4" className="p-6 text-center text-gray-400">कोई रिपोर्टर नहीं है। Supabase से बनाएं।</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}