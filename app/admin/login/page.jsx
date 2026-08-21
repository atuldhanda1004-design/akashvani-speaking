'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import Logo from '@/components/Logo'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Supabase auth will go here
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      // if (error) throw error
      // router.push('/admin/dashboard')
      
      // Demo: just simulate
      await new Promise((r) => setTimeout(r, 1500))
      if (email === 'admin@akashvanispeaking.news' && password === 'admin123') {
        window.location.href = '/admin/dashboard'
      } else {
        setError('गलत ईमेल या पासवर्ड')
      }
    } catch (err) {
      setError(err.message || 'लॉगिन में त्रुटि हुई')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy to-brand-navyDark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 animate-scale-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full border-3 border-brand-navy flex items-center justify-center bg-brand-navy">
                <div className="w-[85%] h-[85%] rounded-full border-2 border-white flex items-center justify-center">
                  <span className="font-poppins font-bold text-white text-base tracking-wider">
                    A&S
                  </span>
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold font-poppins text-gray-900">
              Admin Panel
            </h1>
            <p className="text-gray-400 text-sm font-poppins mt-1">
              Akashvani Speaking
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-yantramanav text-center animate-slide-down">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-poppins font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@akashvanispeaking.news"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl font-poppins text-sm outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-poppins font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl font-poppins text-sm outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-brand-navy text-white rounded-xl font-poppins font-semibold text-sm flex items-center justify-center gap-2 hover:bg-brand-navyDark transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>लॉगिन हो रहा है...</span>
                </div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>लॉगिन करें</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 font-poppins mt-6">
            Demo: admin@akashvanispeaking.news / admin123
          </p>
        </div>
      </div>
    </div>
  )
}