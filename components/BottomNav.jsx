'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Zap, Bookmark, Menu } from 'lucide-react'
import { useState } from 'react'
import SideMenu from './SideMenu'

export default function BottomNav() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { icon: Home, label: 'होम', href: '/' },
    { icon: Zap, label: 'शॉर्ट्स', href: '/short-news' },
    { icon: Bookmark, label: 'सेव्ड', href: '/saved' },
  ]

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-secondary text-white z-50 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] pb-safe">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1 w-16">
                <item.icon className={`w-5 h-5 transition-all ${isActive ? 'text-white' : 'text-white/60'}`} />
                <span className={`text-[10px] font-yantramanav ${isActive ? 'font-bold text-white' : 'text-white/60'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
          
          <button onClick={() => setIsMenuOpen(true)} className="flex flex-col items-center gap-1 w-16">
            <Menu className="w-5 h-5 text-white/60" />
            <span className="text-[10px] font-yantramanav text-white/60">मेनू</span>
          </button>
        </div>
      </div>

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}