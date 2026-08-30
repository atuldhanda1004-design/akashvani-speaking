'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'

export default function NotificationBell() {
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.OneSignalDeferred = window.OneSignalDeferred || []
      window.OneSignalDeferred.push(async function (OneSignal) {
        try {
          const permission = OneSignal.Notifications.permissionNative
          if (permission === 'granted') {
            setIsSubscribed(true)
          }

          OneSignal.Notifications.addEventListener('change', (event) => {
            if (event.to.permission === 'granted') {
              setIsSubscribed(true)
            } else {
              setIsSubscribed(false)
            }
          })
        } catch (e) {
          console.error('OneSignal NotificationBell Error:', e)
        }
      })
    }
  }, [])

  const handleSubscribe = () => {
    if (typeof window !== 'undefined') {
      window.OneSignalDeferred = window.OneSignalDeferred || []
      window.OneSignalDeferred.push(async function (OneSignal) {
        try {
          await OneSignal.Notifications.requestPermission()
        } catch (e) {
          console.error('Notification request error:', e)
        }
      })
    }
  }

  // अगर यूजर पहले से सब्सक्राइब है तो बटन छिप जाएगा
  if (isSubscribed) return null

  return (
    <div className="fixed bottom-20 left-4 z-40 animate-bounce">
      <button
        type="button"
        onClick={handleSubscribe}
        className="flex items-center gap-2 bg-brand-red text-white px-4 py-2.5 rounded-full shadow-2xl font-poppins font-bold text-xs hover:scale-105 transition-all border-2 border-white cursor-pointer"
      >
        <Bell className="w-4 h-4 animate-pulse" />
        <span>खबरों का नोटिफिकेशन पाएं</span>
      </button>
    </div>
  )
}