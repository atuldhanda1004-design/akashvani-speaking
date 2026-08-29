'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, LogIn, ArrowLeft, KeyRound, X } from 'lucide-react'
import Logo from '@/components/Logo'
import { signIn, resetPasswordEmail } from '@/lib/supabase'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [isForgotOpen, setIsForgotOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetStatus, setResetStatus] = useState({ loading: false, msg: '', error: false })

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await signIn(email, password)
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'लॉगिन में त्रुटि हुई')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setResetStatus({ loading: true, msg: '', error: false })

    try {
      await resetPasswordEmail(resetEmail)
      setResetStatus({
        loading: false,
        msg: '✅ पासवर्ड रिसेट लिंक आपके ईमेल पर भेज दिया गया है!',
        error: false,
      })
    } catch (err) {
      setResetStatus({
        loading: false,
        msg: err.message || 'त्रुटि हुई!',
        error: true,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-secondary via-brand-primary to-brand-secondary flex items-center justify-center p-4 relative">
      {/* soft pattern overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 80%, white 0, transparent 35%)',
        }}
      />

      {/* Back to Home */}
      <Link
        href="/"
        className="absolute top-6 left-6 md:top-10 md:left-10 z-10 flex items-center gap-2 text-white font-poppins font-bold bg-white/15 hover:bg-white/25 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm transition-all border border-white/20"
      >
        <ArrowLeft className="w-5 h-5" /> होम पेज
      </Link>

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-white/40 mt-10">
        <div className="text-center mb-8">
          {/* Dark circle so white logo is always visible */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-brand-primary shadow-lg border-4 border-brand-primary/20 flex items-center justify-center p-2">
              <Logo size="lg" className="w-full h-full" />
            </div>
          </div>
          <h1 className="text-2xl font-bold font-poppins text-brand-primary">
            Admin / Reporter Login
          </h1>
          <p className="text-gray-500 text-sm font-poppins mt-1">
            Akashvani Speaking
          </p>
          <p className="text-xs text-gray-400 font-yantramanav mt-1">
            संपादक / पत्रकार लॉगिन
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-yantramanav text-center leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-poppins font-semibold text-gray-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-poppins text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-gray-50"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-poppins font-semibold text-gray-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsForgotOpen(true)
                  setResetEmail(email)
                }}
                className="text-xs font-poppins text-brand-primary hover:underline font-semibold"
              >
                पासवर्ड भूल गए?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl font-poppins text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-gray-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-brand-primary text-white rounded-xl font-poppins font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-secondary transition-all disabled:opacity-70 shadow-md cursor-pointer"
          >
            {isLoading ? (
              'लॉगिन हो रहा है...'
            ) : (
              <>
                <LogIn className="w-5 h-5" /> लॉगिन करें
              </>
            )}
          </button>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setIsForgotOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-poppins text-gray-900">
                पासवर्ड रिसेट करें
              </h3>
            </div>

            <p className="text-xs text-gray-500 font-yantramanav mb-4">
              अपना पंजीकृत ईमेल दर्ज करें। हम आपको पासवर्ड बदलने का लिंक भेजेंगे।
            </p>

            {resetStatus.msg && (
              <div
                className={`p-3 rounded-xl text-xs font-yantramanav mb-4 ${
                  resetStatus.error
                    ? 'bg-red-50 text-red-600'
                    : 'bg-green-50 text-green-700'
                }`}
              >
                {resetStatus.msg}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="आपका Email..."
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-brand-primary"
              />
              <button
                type="submit"
                disabled={resetStatus.loading}
                className="w-full py-2.5 bg-brand-primary text-white rounded-xl font-poppins font-semibold text-xs hover:bg-brand-secondary transition-all"
              >
                {resetStatus.loading ? 'भेजा जा रहा है...' : 'रिसेट लिंक भेजें'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}