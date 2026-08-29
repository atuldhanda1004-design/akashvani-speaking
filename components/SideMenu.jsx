'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import {
  X, Home, Newspaper, TrendingUp, Zap, Info, Phone,
  FileText, ChevronRight, Shield, UserCircle,
} from 'lucide-react'
import Logo from './Logo'
import { dummyCategories } from '@/lib/dummyData'
import { SITE_CONFIG } from '@/lib/constants'

export default function SideMenu({ isOpen, onClose }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const menuItems = [
    { icon: Home, label: 'होम', href: '/' },
    { icon: Newspaper, label: 'सभी खबरें', href: '/all-news' },
    { icon: TrendingUp, label: 'ट्रेंडिंग', href: '/?tab=live' },
    { icon: Zap, label: 'शॉर्ट न्यूज़', href: '/short-news' },
  ]

  const bottomLinks = [
    { icon: Info, label: 'हमारे बारे में', href: '/about' },
    { icon: Phone, label: 'संपर्क करें', href: '/contact' },
    { icon: Shield, label: 'प्राइवेसी पॉलिसी', href: '/privacy' },
    { icon: FileText, label: 'नियम एवं शर्तें', href: '/terms' },
    { icon: UserCircle, label: 'रिपोर्टर / एडमिन लॉगिन', href: '/admin/login' },
  ]

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[300px] max-w-[85vw] bg-white z-[70] transform transition-transform duration-300 ease-out shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header — navy bg + dark circle for white logo */}
        <div className="bg-brand-primary p-5 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-full bg-brand-secondary border-2 border-white/30 shadow-md flex items-center justify-center p-1.5 shrink-0">
              <Logo size="sm" className="w-full h-full" />
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-poppins font-bold text-sm truncate">
                Akashvani Speaking
              </h2>
              <p className="text-white/70 text-[10px] font-yantramanav truncate">
                ईमानदार सोच - सच्ची खबरें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all shrink-0"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-88px)] pb-20">
          <nav className="p-3">
            {menuItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-brand-primary/5 hover:text-brand-primary transition-all group"
              >
                <item.icon className="w-5 h-5 text-gray-400 group-hover:text-brand-primary transition-colors" />
                <span className="font-yantramanav font-medium text-[15px]">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}

            <div className="mt-4 mb-2 px-3">
              <h3 className="text-xs font-poppins font-semibold text-gray-400 uppercase tracking-wider">
                कैटेगरी
              </h3>
            </div>

            <div className="space-y-0.5">
              {dummyCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-brand-primary/5 hover:text-brand-primary transition-all group"
                >
                  <span className="text-lg w-6 text-center">{cat.icon || '•'}</span>
                  <span className="font-yantramanav text-[14px]">{cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </nav>

          <div className="mx-6 my-3 border-t border-gray-100" />

          <nav className="p-3">
            {bottomLinks.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all text-[13px]"
              >
                <item.icon className="w-4 h-4" />
                <span className="font-yantramanav">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mx-6 mt-4 p-4 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 rounded-xl">
            <p className="text-[11px] text-gray-400 font-poppins text-center">
              Developed by
            </p>
            <p className="text-[13px] text-brand-primary font-poppins font-semibold text-center mt-0.5">
              {SITE_CONFIG.developer.name}
            </p>
            <a
              href={SITE_CONFIG.developer.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[11px] text-brand-primary font-poppins text-center mt-1 hover:underline break-all"
            >
              {SITE_CONFIG.developer.link}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}