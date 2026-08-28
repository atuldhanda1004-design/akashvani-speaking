'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Newspaper, Plus, Zap, Video, CheckCircle, Users, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import Logo from './Logo'
import { signOut } from '@/lib/supabase'

export default function AdminSidebar({ isAdmin = false, userName = 'Admin' }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    router.push('/admin/login')
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Plus, label: 'नई खबर लिखें', href: '/admin/news/new', highlight: true },
    { icon: Newspaper, label: 'सारी खबरें', href: '/admin/dashboard?tab=all' },
    { icon: Zap, label: 'Trending / Live', href: '/admin/dashboard?tab=trending' },
    { icon: Video, label: 'Video News', href: '/admin/dashboard?tab=video' },
  ]

  const adminOnlyItems = [
    { icon: CheckCircle, label: 'Pending Approvals', href: '/admin/dashboard?tab=pending' },
    { icon: Users, label: 'Reporters / Payout', href: '/admin/reporters' }, // Fixed route
  ]

  const isActive = (href) => {
    if (href === '/admin/reporters' && pathname === '/admin/reporters') return true
    if (href.includes('?tab=')) {
      const tab = href.split('=')[1]
      if (typeof window !== 'undefined' && window.location.search.includes(`tab=${tab}`)) return true
      return false
    }
    return pathname === href && (!typeof window !== 'undefined' || !window.location.search)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 bg-brand-primary text-white p-2 rounded-lg shadow-md"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-brand-secondary text-white w-72 flex-shrink-0 z-50 transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <h2 className="font-poppins font-bold text-sm">Admin Panel</h2>
              <p className="text-[10px] text-white/60">{userName}</p>
            </div>
          </div>
          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-white/70">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-160px)]">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-poppins transition-all ${
                isActive(item.href)
                  ? 'bg-white text-brand-primary font-bold shadow'
                  : item.highlight
                  ? 'bg-brand-primary/80 text-white font-semibold hover:bg-brand-primary'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <item.icon className="w-4 h-4" /> {item.label}
            </Link>
          ))}

          {isAdmin && (
            <>
              <div className="pt-4 pb-2">
                <p className="text-[10px] text-white/40 uppercase tracking-wider px-3 font-poppins font-semibold">
                  ADMIN ONLY
                </p>
              </div>
              {adminOnlyItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-poppins transition-all ${
                    isActive(item.href)
                      ? 'bg-white text-brand-primary font-bold shadow'
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-4 h-4" /> {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10 bg-brand-secondary">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-300 hover:bg-red-500/20 font-poppins font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" /> लॉगआउट करें
          </button>
        </div>
      </aside>
    </>
  )
}