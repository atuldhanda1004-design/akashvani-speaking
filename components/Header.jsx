'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Menu } from 'lucide-react'
import Logo from './Logo'
import SideMenu from './SideMenu'
import SearchModal from './SearchModal'
import SocialIcons from './SocialIcons'
import LiveAudience from './LiveAudience'
import { SITE_CONFIG } from '@/lib/constants'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('latest')

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'shadow-xl' : ''
        }`}
      >
        {/* Main Header */}
        <div className="bg-brand-navy">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Menu Button */}
              <button
                onClick={() => setIsSideMenuOpen(true)}
                className="text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-90"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Logo & Title */}
              <Link href="/" className="flex items-center gap-3 group flex-1 justify-center md:justify-start md:ml-4">
                <Logo size="md" />
                <div className="hidden sm:block">
                  <h1 className="text-white font-poppins font-bold text-lg leading-tight group-hover:text-white/90 transition-colors">
                    {SITE_CONFIG.name}
                  </h1>
                  <p className="text-white/70 text-[10px] font-yantramanav leading-tight">
                    {SITE_CONFIG.tagline}
                  </p>
                </div>
              </Link>

              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-90"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Social Bar */}
          <div className="bg-brand-navyDark/50 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-end h-8 gap-3">
                <span className="text-white/60 text-[11px] font-poppins hidden sm:inline">
                  Follow Us
                </span>
                <SocialIcons variant="header" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-12 gap-2">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab('latest')}
                  className={`flex-shrink-0 px-5 py-2 rounded-lg font-yantramanav font-bold text-sm transition-all duration-300 ${
                    activeTab === 'latest'
                      ? 'bg-brand-navy text-white shadow-lg shadow-brand-navy/30'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Haryana Latest News
                </button>
                <button
                  onClick={() => setActiveTab('live')}
                  className={`flex-shrink-0 px-5 py-2 rounded-lg font-yantramanav font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                    activeTab === 'live'
                      ? 'bg-white text-brand-navy border-2 border-brand-navy shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  Live Updates
                  <span className="live-dot" />
                </button>
              </div>

              {/* Live Audience Counter */}
              <div className="hidden md:block">
                <LiveAudience />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[136px]" />

      <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}