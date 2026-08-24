'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, Menu, Calendar } from 'lucide-react'
import Logo from './Logo'
import SideMenu from './SideMenu'
import SearchModal from './SearchModal'
import LiveAudience from './LiveAudience'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [displayDate, setDisplayDate] = useState('')
  const [activeTab, setActiveTab] = useState('latest')
  
  const dateInputRef = useRef(null)

  // हिन्दी में तारीख फॉर्मेट करने का फंक्शन
  const formatHindiDate = (dateObj) => {
    const days = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार']
    const months = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर']
    const dayStr = days[dateObj.getDay()]
    const dateStr = dateObj.getDate()
    const monthStr = months[dateObj.getMonth()]
    const yearStr = dateObj.getFullYear()
    const timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    return `${dayStr} ${dateStr} ${monthStr} ${yearStr} / ${timeStr}`
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    
    // वर्तमान तारीख सेट करें
    setDisplayDate(formatHindiDate(new Date()))

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // तारीख बदलने का फंक्शन
  const handleDateChange = (e) => {
    if (e.target.value) {
      const selected = new Date(e.target.value)
      setDisplayDate(formatHindiDate(selected))
    }
  }

  // क्लिक करने पर Date Picker खोलें
  const triggerDatePicker = () => {
    if (dateInputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        dateInputRef.current.showPicker()
      } else {
        dateInputRef.current.click()
      }
    }
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'shadow-xl' : ''}`}>
        {/* Main Header */}
        <div className="bg-brand-primary">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <button onClick={() => setIsSideMenuOpen(true)} className="text-white p-2 hover:bg-white/10 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-3">
              <Logo size="sm" />
              <div>
                <h1 className="text-white font-poppins font-bold text-lg leading-tight">Akashvani Speaking</h1>
                <p className="text-white/70 text-[10px] font-yantramanav leading-tight">ईमानदार सोच - सच्ची खबरें</p>
              </div>
            </Link>
            <button onClick={() => setIsSearchOpen(true)} className="text-white p-2 hover:bg-white/10 rounded-lg">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Small Date Bar with Date Selector */}
        <div className="bg-brand-secondary h-7 flex items-center border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
            {/* Interactive Clickable Date */}
            <div 
              onClick={triggerDatePicker}
              className="flex items-center gap-1.5 text-white/90 hover:text-white text-[10px] font-yantramanav cursor-pointer bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded transition-all select-none"
              title="तारीख बदलने के लिए क्लिक करें"
            >
              <Calendar className="w-3 h-3 text-white/80" />
              <span>{displayDate || 'तारीख चुनिए...'}</span>
              <span className="text-[8px] bg-white/20 px-1 rounded ml-1 text-white">बदलें 📅</span>
            </div>

            {/* Hidden Native Date Input */}
            <input 
              ref={dateInputRef}
              type="date" 
              onChange={handleDateChange} 
              className="hidden" 
            />

            <LiveAudience />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-brand-background border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('latest')} 
              className={`flex-shrink-0 px-4 py-1.5 rounded-md font-poppins font-semibold text-sm transition-all shadow-sm ${activeTab === 'latest' ? 'bg-brand-primary text-white' : 'bg-white text-brand-primary border border-brand-primary/30'}`}
            >
              Haryana Latest News
            </button>
            <button 
              onClick={() => setActiveTab('live')} 
              className={`flex-shrink-0 px-4 py-1.5 rounded-md font-poppins font-semibold text-sm transition-all flex items-center gap-2 shadow-sm ${activeTab === 'live' ? 'bg-brand-primary text-white' : 'bg-white text-brand-primary border border-brand-primary/30'}`}
            >
              Live Updates
              <span className={`w-2 h-2 rounded-full animate-pulse-red ${activeTab === 'live' ? 'bg-white' : 'bg-brand-red'}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Height Spacer */}
      <div className="h-[118px]" />

      <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}