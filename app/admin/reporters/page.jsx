'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, IndianRupee, Info, Plus, Shield, ShieldOff } from 'lucide-react'
import AdminSidebar from '@/components/AdminSidebar'
import {
  getCurrentUser,
  getReporters,
  updatePayout,
  createReporterByAdmin,
  toggleReporterActive,
} from '@/lib/supabase'

export default function ReportersManage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [reporters, setReporters] = useState([])
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  // New Reporter Form
  const [newRep, setNewRep] = useState({ name: '', email: '', password: '' })
  const [formOpen, setFormOpen] = useState(false)

  const fetchReps = async () => {
    const reps = await getReporters()
    setReporters(reps || [])
    setPageLoading(false)
  }

  useEffect(() => {
    async function load() {
      const u = await getCurrentUser()
      if (!u || u.role !== 'admin') {
        alert('सिर्फ संपादक (Admin) ही इस पेज को खोल सकते हैं!')
        router.push('/admin/dashboard')
        return
      }
      setUser(u)
      await fetchReps()
    }
    load()
  }, [router])

  const handlePayoutUpdate = async (id, currentAmount) => {
    const newAmount = prompt(
      'पत्रकार की कुल कमाई (Payout in INR) दर्ज करें:',
      currentAmount
    )
    if (newAmount !== null && !isNaN(newAmount)) {
      const ok = await updatePayout(id, parseFloat(newAmount))
      if (ok) {
        alert('✅ कमाई अपडेट हो गई!')
        fetchReps()
      } else {
        alert('अपडेट करने में एरर!')
      }
    }
  }

  const handleCreateReporter = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (
        !newRep.name.trim() ||
        !newRep.email.trim() ||
        !newRep.password.trim()
      ) {
        throw new Error('कृपया सभी डिटेल्स भरें')
      }
      if (newRep.password.length < 6) {
        throw new Error('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए')
      }

      await createReporterByAdmin(newRep.email, newRep.password, newRep.name)
      alert('✅ नया पत्रकार (Reporter) सफलतापूर्वक बन गया!')
      setNewRep({ name: '', email: '', password: '' })
      setFormOpen(false)
      fetchReps()
    } catch (err) {
      alert(err.message || 'रिपोर्टर बनाने में त्रुटि हुई')
    } finally {
      setLoading(false)
    }
  }

  const handleBlockToggle = async (rep) => {
    // is_active undefined ya true = active; false = blocked
    const currentlyActive = rep.is_active !== false
    const newState = !currentlyActive
    const message = newState
      ? 'क्या आप इस पत्रकार को Unblock करना चाहते हैं?'
      : 'क्या आप इस पत्रकार का अकाउंट Block करना चाहते हैं?'
    if (!confirm(message)) return
    const ok = await toggleReporterActive(rep.id, newState)
    if (ok) {
      alert(newState ? '✅ Unblock हो गया!' : '⛔ Block हो गया!')
      fetchReps()
    } else {
      alert('एरर!')
    }
  }

  if (pageLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center font-yantramanav text-brand-primary">
        लोड हो रहा है...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-background flex">
      <AdminSidebar isAdmin={true} userName={user.full_name || 'Admin'} />

      <main className="flex-1 p-4 md:p-8 pt-16 lg:pt-8 min-w-0">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold font-poppins text-brand-primary">
              पत्रकार प्रबंधन एवं कमाई (Reporters & Payouts)
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              नए पत्रकार बनाएं, Block/Unblock करें, और कमाई सेट करें।
            </p>
          </div>

          <button
            onClick={() => setFormOpen(!formOpen)}
            className="bg-brand-primary text-white px-4 py-2.5 rounded-xl text-sm font-poppins font-bold flex items-center gap-2 hover:bg-brand-secondary transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            {formOpen ? 'फॉर्म बंद करें' : 'नया पत्रकार जोड़ें'}
          </button>
        </div>

        {formOpen && (
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-brand-primary/20 mb-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="w-5 h-5 text-brand-primary" />
              <h3 className="font-bold text-lg text-brand-primary font-poppins">
                नया पत्रकार (Reporter Account) बनाएं
              </h3>
            </div>

            <form onSubmit={handleCreateReporter} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    पत्रकार का पूरा नाम *
                  </label>
                  <input
                    type="text"
                    value={newRep.name}
                    onChange={(e) =>
                      setNewRep({ ...newRep, name: e.target.value })
                    }
                    placeholder="जैसे: सुमित शेओराण"
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    ईमेल (Login ID) *
                  </label>
                  <input
                    type="email"
                    value={newRep.email}
                    onChange={(e) =>
                      setNewRep({ ...newRep, email: e.target.value })
                    }
                    placeholder="reporter@akashvani.com"
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    पासवर्ड *
                  </label>
                  <input
                    type="text"
                    value={newRep.password}
                    onChange={(e) =>
                      setNewRep({ ...newRep, password: e.target.value })
                    }
                    placeholder="कम से कम 6 अक्षर"
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-poppins font-bold text-sm hover:bg-green-700 disabled:opacity-50 shadow-md transition-all"
                >
                  {loading ? 'अकाउंट बन रहा है...' : '✓ पत्रकार अकाउंट बनाएं'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg font-poppins text-gray-900">
              कुल पंजीकृत पत्रकार: {reporters.length}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-poppins">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b border-gray-100">
                  <th className="p-3 rounded-l-lg">पत्रकार का नाम</th>
                  <th className="p-3">ईमेल ID</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">कमाई (Payout)</th>
                  <th className="p-3 rounded-r-lg text-right">एक्शन</th>
                </tr>
              </thead>
              <tbody>
                {reporters.map((rep) => {
                  const isBlocked = rep.is_active === false
                  return (
                    <tr
                      key={rep.id}
                      className={`border-b border-gray-50 hover:bg-gray-50/50 ${
                        isBlocked ? 'bg-red-50/30' : ''
                      }`}
                    >
                      <td className="p-3 font-semibold text-gray-900">
                        {rep.full_name || 'No Name'}
                      </td>
                      <td className="p-3 text-xs text-gray-500 font-mono">
                        {rep.email || rep.id}
                      </td>
                      <td className="p-3">
                        {isBlocked ? (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">
                            BLOCKED
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                            ACTIVE
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-green-600 font-bold flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {rep.payout_balance || 0}
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() =>
                            handlePayoutUpdate(rep.id, rep.payout_balance || 0)
                          }
                          className="bg-brand-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-brand-secondary transition-colors"
                        >
                          Payout ₹
                        </button>
                        <button
                          onClick={() => handleBlockToggle(rep)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 ${
                            isBlocked
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                        >
                          {isBlocked ? (
                            <>
                              <Shield className="w-3 h-3" /> Unblock
                            </>
                          ) : (
                            <>
                              <ShieldOff className="w-3 h-3" /> Block
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  )
                })}

                {reporters.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-8 text-center text-gray-400 font-yantramanav"
                    >
                      अभी कोई पत्रकार पंजीकृत नहीं है। ऊपर बटन से नया पत्रकार जोड़ें।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}