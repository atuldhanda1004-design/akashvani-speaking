'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react'
import Logo from '@/components/Logo'
import { signIn, isSupabaseConfigured } from '@/lib/supabase'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const cleanEmail = email.trim()
    const cleanPassword = password.trim()

    // Demo Admin Login Check
    const isDemo = cleanEmail === 'admin@akashvanispeaking.news' && cleanPassword === 'admin123'

    try {
      if (isSupabaseConfigured()) {
        try {
          await signIn(cleanEmail, cleanPassword)
          router.push('/admin/dashboard')
          return
        } catch (supaErr) {
          console.warn('Supabase Auth error:', supaErr.message)
          
          // अगर Supabase में user नहीं है लेकिन Demo डिटेल्स डाली हैं, तो Demo लॉगिन करा दो
          if (isDemo) {
            router.push('/admin/dashboard')
            return
          }

          if (supaErr.message?.includes('Invalid path') || supaErr.message?.includes('fetch failed')) {
            setError('Supabase URL गलत है। कृपया .env.local चेक करें या Demo ID का प्रयोग करें।')
          } else if (supaErr.message?.includes('Invalid login credentials')) {
            setError('गलत ईमेल या पासवर्ड।')
          } else {
            setError(supaErr.message || 'लॉगिन में त्रुटि हुई')
          }
          return
        }
      }

      // If Supabase is not configured, fall back to Demo
      if (isDemo) {
        await new Promise((r) => setTimeout(r, 600))
        router.push('/admin/dashboard')
      } else {
        setError('गलत ईमेल या पासवर्ड। (Demo: admin@akashvanispeaking.news / admin123)')
      }
    } catch (err) {
      setError(err.message || 'लॉगिन में त्रुटि हुई')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center p-4 relative">
      
      {/* Back to Home Button */}
      <Link href="/" className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-brand-primary font-poppins font-bold bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">
        <ArrowLeft className="w-5 h-5" /> होम पेज
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 mt-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold font-poppins text-brand-primary">Admin / Reporter Login</h1>
          <p className="text-gray-400 text-sm font-poppins mt-1">Akashvani Speaking</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-yantramanav text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-poppins font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@akashvanispeaking.news" required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-poppins text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-poppins font-semibold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl font-poppins text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-gray-50"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={isLoading}
            className="w-full py-3.5 bg-brand-primary text-white rounded-xl font-poppins font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-secondary transition-all disabled:opacity-70 shadow-md"
          >
            {isLoading ? 'लॉगिन हो रहा है...' : <><LogIn className="w-5 h-5" /> लॉगिन करें</>}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 font-poppins mt-6">
          Demo Login: admin@akashvanispeaking.news / admin123
        </p>
      </div>
    </div>
  )
}