'use client'

import { useEffect, useState } from 'react'
import { X, Bell, Newspaper } from 'lucide-react'
import Logo from './Logo'

export default function WelcomePopup() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Don't show again for 7 days if dismissed/subscribed
    try {
      const hide = localStorage.getItem('as_welcome_hide')
      if (hide && Date.now() < Number(hide)) return
    } catch {}

    const t = setTimeout(() => setOpen(true), 1800) // ~1.8 sec after load
    return () => clearTimeout(t)
  }, [])

  const close = (days = 7) => {
    setOpen(false)
    try {
      localStorage.setItem('as_welcome_hide', String(Date.now() + days * 24 * 60 * 60 * 1000))
    } catch {}
  }

  const enableNotifications = () => {
    if (typeof window === 'undefined') return
    window.OneSignalDeferred = window.OneSignalDeferred || []
    window.OneSignalDeferred.push(async function (OneSignal) {
      try {
        await OneSignal.Notifications.requestPermission()
        // optional slide down
        try {
          await OneSignal.Slidedown.promptPush()
        } catch {}
      } catch (e) {
        console.log(e)
      }
    })
    close(30) // hide longer after allow attempt
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Top navy bar */}
        <div className="bg-brand-primary px-5 py-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand-secondary border-2 border-white/30 flex items-center justify-center p-1.5 shrink-0">
            <Logo size="sm" className="w-full h-full" />
          </div>
          <div className="min-w-0 text-white">
            <p className="font-poppins font-bold text-base leading-tight">Akashvani Speaking</p>
            <p className="text-white/75 text-[11px] font-yantramanav">ईमानदार सोच - सच्ची खबरें</p>
          </div>
          <button
            type="button"
            onClick={() => close(3)}
            className="ml-auto p-2 rounded-full hover:bg-white/10 text-white/90"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-brand-red flex items-center justify-center shrink-0">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-yantramanav font-bold text-lg text-gray-900 leading-snug">
                हरियाणा की ताज़ा खबरें सबसे पहले पाएँ
              </h3>
              <p className="text-sm text-gray-600 font-yantramanav mt-1 leading-relaxed">
                ब्रेकिंग न्यूज़ और लाइव अपडेट का नोटिफिकेशन चालू करें — बिलकुल मुफ़्त।
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={enableNotifications}
            className="w-full py-3.5 rounded-xl bg-brand-primary text-white font-poppins font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-secondary shadow-md"
          >
            <Bell className="w-4 h-4" />
            नोटिफिकेशन Allow करें
          </button>

          <button
            type="button"
            onClick={() => close(7)}
            className="w-full mt-2 py-2.5 text-sm text-gray-500 font-poppins hover:text-gray-700"
          >
            बाद में
          </button>
        </div>
      </div>
    </div>
  )
}