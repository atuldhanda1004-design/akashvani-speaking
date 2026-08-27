'use client'

import Link from 'next/link'
import Logo from './Logo'
import SocialIcons from './SocialIcons'
import { SITE_CONFIG } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-brand-secondary mt-auto border-t border-brand-primary/20 pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Logo size="md" />
              <div>
                <h3 className="text-white font-poppins font-bold text-lg">{SITE_CONFIG.name}</h3>
                <p className="text-white/50 text-xs font-yantramanav">{SITE_CONFIG.tagline}</p>
              </div>
            </div>
            <p className="text-white/60 text-sm font-yantramanav leading-relaxed max-w-xs">
              {SITE_CONFIG.description}
            </p>
          </div>

          <div>
            <h4 className="text-white font-poppins font-semibold text-sm mb-4">महत्त्वपूर्ण लिंक</h4>
            <ul className="space-y-2">
              {[
                { label: 'हमारे बारे में', href: '/about' },
                { label: 'संपर्क करें', href: '/contact' },
                { label: 'प्राइवेसी पॉलिसी', href: '/privacy' },
                { label: 'नियम एवं शर्तें', href: '/terms' },
                { label: 'शॉर्ट न्यूज़', href: '/short-news' },
                { label: 'सभी खबरें', href: '/all-news' },
                { label: 'रिपोर्टर लॉगिन', href: '/admin/login' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 text-sm font-yantramanav hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-poppins font-semibold text-sm mb-4">हमसे जुड़ें</h4>
            <SocialIcons variant="footer" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-brand-primary/10 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p className="text-white/50 text-xs font-poppins">
            © {new Date().getFullYear()} Akashvani Speaking. All rights reserved.
          </p>
          <p className="text-xs font-poppins text-white/60">
            Developed by{' '}
            <a
              href={SITE_CONFIG.developer.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-semibold hover:underline"
            >
              {SITE_CONFIG.developer.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}