'use client';
import { MessageCircle, Share2, Copy, Facebook, Twitter } from 'lucide-react';
import { useState } from 'react';

export default function ShareButtons({ headline, url }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(headline);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-gray-600 mr-1">शेयर करें:</span>

      {/* WhatsApp - BIG & PROMINENT */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`}
        target="_blank"
        rel="noopener"
        className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md transition transform hover:scale-105"
      >
        <MessageCircle size={16} />
        WhatsApp
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener"
        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full text-sm transition"
      >
        <Facebook size={14} /> Facebook
      </a>

      {/* Twitter/X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener"
        className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white px-3 py-2 rounded-full text-sm transition"
      >
        <Twitter size={14} /> X
      </a>

      {/* Telegram */}
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
        target="_blank"
        rel="noopener"
        className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-full text-sm transition"
      >
        ✈️ Telegram
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-full text-sm transition"
      >
        <Copy size={14} />
        {copied ? 'कॉपी हो गया! ✓' : 'लिंक कॉपी'}
      </button>
    </div>
  );
}