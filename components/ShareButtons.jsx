'use client'
import { useState } from 'react'
import { Share2, Copy, Check } from 'lucide-react'
import { WhatsAppIcon, FacebookIcon, TwitterIcon } from './SocialIcons'

export default function ShareButtons({ url, title, compact = false }) {
  const [copied, setCopied] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareTitle = title || 'Akashvani Speaking'

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `📰 ${shareTitle}\n\n${shareUrl}\n\n- Akashvani Speaking\nईमानदार सोच - सच्ची खबरें`
  )}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) { console.error(err) }
  }

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareTitle, url: shareUrl })
      } catch (err) {
        if (err.name !== 'AbortError') setShowMore(true)
      }
    } else {
      setShowMore(true)
    }
  }

  if (compact) {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-10 h-10 bg-[#25D366] text-white rounded-full hover:bg-[#1da851] transition-all hover:shadow-lg hover:shadow-[#25D366]/30 active:scale-90"
        aria-label="Share on WhatsApp"
      >
        <WhatsAppIcon />
      </a>
    )
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-full text-sm font-poppins font-medium hover:bg-[#1da851] transition-all hover:shadow-lg hover:shadow-[#25D366]/30 active:scale-95"
        >
          <WhatsAppIcon />
          <span>शेयर करें</span>
        </a>

        <button
          onClick={handleNativeShare}
          className="p-2.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all active:scale-95"
          aria-label="More share options"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <button
          onClick={handleCopy}
          className={`p-2.5 rounded-full transition-all active:scale-95 ${
            copied ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          aria-label="Copy link"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {showMore && (
        <div className="absolute bottom-full mb-2 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 min-w-[200px] animate-scale-in z-50">
          <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-[#1877F2] rounded-full flex items-center justify-center text-white">
              <FacebookIcon className="w-4 h-4" />
            </div>
            <span className="text-sm font-yantramanav text-gray-700">Facebook</span>
          </a>
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
              <TwitterIcon />
            </div>
            <span className="text-sm font-yantramanav text-gray-700">X (Twitter)</span>
          </a>
          <button onClick={() => setShowMore(false)} className="w-full text-center text-xs text-gray-400 mt-2 py-1 hover:text-gray-600 transition-colors">
            बंद करें
          </button>
        </div>
      )}
    </div>
  )
}