'use client'
import { useEffect, Fragment } from 'react'
import Link from 'next/link'
import { X, Home, Newspaper, TrendingUp, Zap, Info, Phone, FileText, ChevronRight, Shield } from 'lucide-react'
import Logo from './Logo'
import { dummyCategories } from '@/lib/dummyData'
import { SITE_CONFIG } from '@/lib/constants'

export default function SideMenu({ isOpen, onClose }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const menuItems = [
    { icon: Home, label: 'होम', href: '/' },
    { icon: Newspaper, label: 'सभी खबरें', href: '/all-news' },
    { icon: TrendingUp, label: 'ट्रेंडिंग', href: '/#trending' },
    { icon: Zap, label: 'शॉर्ट न्यूज़', href: '/short-news' },
  ]

  const bottomLinks = [
    { icon: Info, label: 'हमारे बारे में', href: '/about' },
    { icon: Phone, label: 'संपर्क करें', href: '/contact' },
    { icon: Shield, label: 'प्राइवेसी पॉलिसी', href: '/privacy' },
    { icon: FileText, label: 'नियम एवं शर्तें', href: '/terms' },
  ]

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 left-0 h-full w-[300px] max-w-[85vw] bg-white z-[70] transform transition-transform duration-300 ease-out shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="bg-brand-navy p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <h2 className="text-white font-poppins font-bold text-sm">
                {SITE_CONFIG.name}
              </h2>
              <p className="text-white/60 text-[10px] font-yantramanav">
                {SITE_CONFIG.tagline}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-80px)] pb-20">
          <nav className="p-3">
            {menuItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-brand-navy/5 hover:text-brand-navy transition-all group"
              >
                <item.icon className="w-5 h-5 text-gray-400 group-hover:text-brand-navy transition-colors" />
                <span className="font-yantramanav font-medium text-[15px]">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-brand-navy group-hover:translate-x-1 transition-all" />
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
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-brand-navy/5 hover:text-brand-navy transition-all group"
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-yantramanav text-[14px]">{cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 ml-auto group-hover:text-brand-navy group-hover:translate-x-1 transition-all" />
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

          <div className="mx-6 mt-4 p-4 bg-gradient-to-r from-brand-navy/5 to-brand-navyLight/5 rounded-xl">
            <p className="text-[11px] text-gray-400 font-poppins text-center">
              Developed by
            </p>
            <p className="text-[13px] text-brand-navy font-poppins font-semibold text-center mt-0.5">
              {SITE_CONFIG.developer.name}
            </p>
            <a
              href={`tel:${SITE_CONFIG.developer.phone}`}
              className="block text-[11px] text-gray-500 font-poppins text-center mt-1 hover:text-brand-navy transition-colors"
            >
              📞 {SITE_CONFIG.developer.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}