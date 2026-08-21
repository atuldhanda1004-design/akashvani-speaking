'use client';
import Link from 'next/link';
import { Menu, Search } from 'lucide-react';

export default function Header() {
  return (
    <>
      {/* Top Navy Blue Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button className="p-1 hover:bg-slate-800 rounded">
              <Menu size={28} />
            </button>
            
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-bold text-lg">
                AS
              </div>
              <div className="hidden sm:block leading-tight">
                <h1 className="text-xl font-bold tracking-wide">Akashvani Speaking</h1>
                <p className="text-[11px] text-gray-300 font-medium">ईमानदार सोच - सच्ची खबरें</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-3 text-sm text-gray-300">
              <span>Akashvani Speaking</span>
              <div className="flex gap-2">
                {/* Dummy Social Icons for Top Right */}
                <span className="w-6 h-6 border border-gray-500 rounded-full flex items-center justify-center hover:bg-white hover:text-slate-900 cursor-pointer transition">▶</span>
                <span className="w-6 h-6 border border-gray-500 rounded-full flex items-center justify-center hover:bg-white hover:text-slate-900 cursor-pointer transition">f</span>
                <span className="w-6 h-6 border border-gray-500 rounded-full flex items-center justify-center hover:bg-white hover:text-slate-900 cursor-pointer transition">𝕏</span>
              </div>
            </div>
            <button className="p-1 hover:bg-slate-800 rounded">
              <Search size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Sub Header (Tabs) like screenshot */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center">
          <div className="bg-slate-700 text-white px-6 py-3 font-semibold text-sm">
            Haryana Latest News
          </div>
          <div className="px-6 py-3 font-semibold text-sm text-slate-800 flex items-center gap-2 border-b-2 border-slate-700">
            Live Updates <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></span>
          </div>
        </div>
      </div>
    </>
  );
}