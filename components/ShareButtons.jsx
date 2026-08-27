'use client'
import { useState } from 'react'
import { Share2, Copy, Check } from 'lucide-react'
import { WhatsAppIcon, FacebookIcon } from './SocialIcons'

export default function ShareButtons({ url, title, compact = false }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareTitle = title || 'Akashvani Speaking'
  
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`📰 ${shareTitle}\n\n${shareUrl}`)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch {}
  }

  // अगर कार्ड में लगा है (Compact = true) तो सिर्फ WhatsApp और Facebook के गोल आइकॉन दिखेंगे
  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-[#25D366] text-white rounded hover:bg-[#1da851] transition-all" title="WhatsApp पर शेयर करें">
          <WhatsAppIcon className="w-4 h-4" />
        </a>
        <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center bg-[#1877F2] text-white rounded hover:bg-[#155df0] transition-all" title="Facebook पर शेयर करें">
          <FacebookIcon className="w-4 h-4" />
        </a>
      </div>
    )
  }

  // फुल न्यूज़ पेज के लिए
  return (
    <div className="flex items-center gap-2">
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-full text-sm font-poppins font-medium hover:bg-[#1da851] transition-all">
        <WhatsAppIcon className="w-5 h-5" /> <span>शेयर करें</span>
      </a>
      <button onClick={handleCopy} className={`p-2.5 rounded-full transition-all ${copied ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
      <button onClick={async () => { if (navigator.share) await navigator.share({ title: shareTitle, url: shareUrl }) }} className="p-2.5 bg-gray-100 text-gray-600 rounded-full">
        <Share2 className="w-4 h-4" />
      </button>
    </div>
  )
}