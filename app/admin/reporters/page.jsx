'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, IndianRupee } from 'lucide-react'
import AdminSidebar from '@/components/AdminSidebar'
import { getCurrentUser, getReporters, updatePayout, createReporterByAdmin } from '@/lib/supabase'

export default function ReportersManage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [reporters, setReporters] = useState([])
  const [loading, setLoading] = useState(false)

  // New Reporter Form State
  const [newRep, setNewRep] = useState({ name: '', email: '', password: '' })
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    async function load() {
      const u = await getCurrentUser()
      if (!u || u.role !== 'admin') {
        alert('सिर्फ संपादक (Admin) ही इस पेज को खोल सकते हैं!')
        router.push('/admin/dashboard')
        return
      }
      setUser(u)
      fetchReps()
    }
    load()
  }, [router])

  const fetchReps = async () => {
    const reps = await getReporters()
    setReporters(reps)
  }

  const handlePayoutUpdate = async (id, current) => {
    const newAmount = prompt('Payout Amount दर्ज करें (INR):', current)
    if (newAmount !== null && !isNaN(newAmount)) {
      await updatePayout(id, parseFloat(newAmount))
      alert('कमाई अपडेट हो गई!')
      fetchReps()
    }
  }

  const handleCreateReporter = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (!newRep.name || !newRep.email || !newRep.password) throw new Error('सभी फील्ड भरें')
      if (newRep.password.length < 6) throw new Error('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए')
      
      await createReporterByAdmin(newRep.email, newRep.password, newRep.name)
      alert('✅ नया पत्रकार सफलतापूर्वक बन गया!')
      setNewRep({ name: '', email: '', password: '' })
      setFormOpen(false)
      fetchReps()
    } catch (err) {
      alert(err.message || 'रिपोर्टर बनाने में त्रुटि')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-brand-background flex">
      <AdminSidebar isAdmin={true} userName={user.full_name} />
      
      <main className="flex-1 p-4 md:p-8 lg:ml-0 pt-16 lg:pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold font-poppins text-brand-primary">पत्रकार (Reporters)</h1>
            <p className="text-sm text-gray-500">पत्रकारों की कमाई सेट करें और नए पत्रकार जोड़ें।</p>
          </div>
          <button onClick={() => setFormOpen(!formOpen)} className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> नया पत्रकार जोड़ें
          </button>
        </div>

        {/* Create New Reporter Form */}
        {formOpen && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-brand-primary/20 mb-6">
            <h3 className="font-bold text-lg mb-4 text-brand-primary">नया पत्रकार (Reporter) बनाएं</h3>
            <form onSubmit={handleCreateReporter} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" value={newRep.name} onChange={(e)=>setNewRep({...newRep, name: e.target.value})} placeholder="पूरा नाम" required className="px-4 py-2 border rounded-lg text-sm outline-none focus:border-brand-primary" />
              <input type="email" value={newRep.email} onChange={(e)=>setNewRep({...newRep, email: e.target.value})} placeholder="ईमेल (लॉगिन आईडी)" required className="px-4 py-2 border rounded-lg text-sm outline-none focus:border-brand-primary" />
              <input type="text" value={newRep.password} onChange={(e)=>setNewRep({...newRep, password: e.target.value})} placeholder="पासवर्ड (कम से कम 6 अक्षर)" required className="px-4 py-2 border rounded-lg text-sm outline-none focus:border-brand-primary" />
              <button type="submit" disabled={loading} className="md:col-span-3 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50">
                {loading ? 'बन रहा है...' : 'पत्रकार का अकाउंट बनाएं'}
              </button>
            </form>
          </div>
        )}

        {/* Reporter List */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h3 className="font-bold text-lg mb-4">कुल पत्रकार: {reporters.length}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-poppins">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">नाम (Name)</th>
                  <th className="p-3">ईमेल (Login ID)</th>
                  <th className="p-3">कमाई (Payout)</th>
                  <th className="p-3 text-right">एक्शन</th>
                </tr>
              </thead>
              <tbody>
                {reporters.map(rep => (
                  <tr key={rep.id} className="border-b border-gray-100">
                    <td className="p-3 font-bold text-gray-900">{rep.full_name}</td>
                    <td className="p-3 text-xs text-gray-500">{rep.email}</td>
                    <td className="p-3 text-green-600 font-bold flex items-center gap-1"><IndianRupee className="w-3 h-3"/> {rep.payout_balance || 0}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => handlePayoutUpdate(rep.id, rep.payout_balance || 0)} className="bg-brand-primary text-white px-3 py-1.5 rounded text-xs hover:bg-brand-secondary">
                        कमाई अपडेट करें
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}