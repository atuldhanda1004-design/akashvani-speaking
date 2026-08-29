'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Search, Menu, Pencil } from 'lucide-react'
import Logo from './Logo'
import SideMenu from './SideMenu'
import SearchModal from './SearchModal'
import LiveAudience from './LiveAudience'

function HeaderInner() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [displayDate, setDisplayDate] = useState('')
  const dateInputRef = useRef(null)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeTab = searchParams.get('tab') || 'latest'
  const showTabs = pathname === '/'

  const formatHindiDate = (dateObj) => {
    const days = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार']
    const months = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर']
    const timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    return `${days[dateObj.getDay()]} ${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()} / ${timeStr}`
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    setDisplayDate(formatHindiDate(new Date()))
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleDateChange = (e) => {
    if (e.target.value) setDisplayDate(formatHindiDate(new Date(e.target.value)))
  }

  const triggerDatePicker = () => {
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === 'function') {
        dateInputRef.current.showPicker()
      } else {
        dateInputRef.current.click()
      }
    }
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'shadow-xl' : ''}`}>
        <div className="bg-brand-primary">
          <div className="max-w-7xl mx-auto px-3 h-14 flex items-center justify-between">
            <button onClick={() => setIsSideMenuOpen(true)} className="text-white p-2 hover:bg-white/10 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            {/* Logo & Title — bigger logo + bigger text */}
<Link href="/" className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 justify-center md:justify-start md:ml-2">
  <Logo size="md" className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 shrink-0" />
  <div className="min-w-0 text-left">
    <h1 className="text-white font-poppins font-bold text-lg sm:text-xl md:text-2xl leading-tight truncate">
      Akashvani Speaking
    </h1>
    <p className="text-white/80 text-[11px] sm:text-xs md:text-sm font-yantramanav leading-tight truncate mt-0.5">
      ईमानदार सोच - सच्ची खबरें
    </p>
  </div>
</Link>
            <button onClick={() => setIsSearchOpen(true)} className="text-white p-2 hover:bg-white/10 rounded-lg">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Small Date Bar with Pencil Icon */}
        <div className="bg-brand-secondary h-8 flex items-center border-t border-white/10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-3 w-full flex items-center justify-between gap-2 min-w-0">
            <div
              onClick={triggerDatePicker}
              className="flex items-center gap-1.5 text-white/90 hover:text-white text-[9px] sm:text-[10px] font-yantramanav cursor-pointer bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded transition-all select-none min-w-0 flex-1 max-w-[65%]"
            >
              <Pencil className="w-3 h-3 shrink-0 text-white/80" />
              <span className="truncate">{displayDate || 'तारीख...'}</span>
            </div>
            <input ref={dateInputRef} type="date" onChange={handleDateChange} className="sr-only" tabIndex={-1} />
            <div className="shrink-0">
              <LiveAudience />
            </div>
          </div>
        </div>

        {showTabs && (
          <div className="bg-brand-background border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
    <Link href="/?tab=latest" scroll={false}
      className={`shrink-0 px-3 sm:px-4 py-1.5 rounded-md font-poppins font-semibold text-xs sm:text-sm shadow-sm ${
        activeTab === 'latest' ? 'bg-brand-primary text-white' : 'bg-white text-brand-primary border border-brand-primary/30'
      }`}>
      Haryana Latest News
    </Link>
    <Link href="/?tab=live" scroll={false}
      className={`shrink-0 px-3 sm:px-4 py-1.5 rounded-md font-poppins font-semibold text-xs sm:text-sm shadow-sm ${
        activeTab === 'live' ? 'bg-brand-primary text-white' : 'bg-white text-brand-primary border border-brand-primary/30'
      }`}>
      Live Updates
    </Link>
  </div>
</div>
        )}
      </header>

      <div className={showTabs ? 'h-[126px]' : 'h-[88px]'} />
      <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

export default function Header() {
  return <Suspense fallback={<div className="h-[126px] bg-brand-primary" />}><HeaderInner /></Suspense>
}