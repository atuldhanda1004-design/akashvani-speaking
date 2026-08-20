'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Search, Menu, X, Mic } from 'lucide-react';

const navItems = [
  { name: 'होम', href: '/' },
  { name: 'ट्रेंडिंग', href: '/trending' },
  { name: 'ताज़ा खबरें', href: '/latest' },
  { name: 'हरियाणा', href: '/category/haryana' },
  { name: 'राजनीति', href: '/category/politics' },
  { name: 'देश', href: '/category/india' },
  { name: 'खेल', href: '/category/sports' },
  { name: 'वीडियो', href: '/videos' },
  { name: 'रील्स', href: '/reels' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3 border-b">
          <Link href="/" className="flex items-center gap-2">
            <Mic className="text-red-600" size={28} />
            <div>
              <h1 className="text-xl font-black text-gray-900 leading-tight">
                आकाशवाणी <span className="text-red-600">स्पीकिंग</span>
              </h1>
              <p className="text-[10px] text-gray-500 -mt-1">सच बोलने की आवाज़</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:bg-gray-100 rounded-full">
              <Search size={20} />
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-3 border-b">
            <form action="/search" className="flex gap-2">
              <input
                name="q"
                type="text"
                placeholder="खबर खोजें..."
                className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
                खोजें
              </button>
            </form>
          </div>
        )}

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1 py-2 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-full whitespace-nowrap transition"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 border-b text-sm"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}