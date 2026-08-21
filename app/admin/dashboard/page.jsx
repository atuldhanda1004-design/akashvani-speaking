'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard, FileText, Users, Settings, Plus,
  TrendingUp, Eye, Clock, LogOut, BarChart3, Newspaper
} from 'lucide-react'
import Logo from '@/components/Logo'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { label: 'कुल खबरें', value: '156', icon: Newspaper, color: 'bg-blue-500' },
    { label: 'आज की खबरें', value: '12', icon: FileText, color: 'bg-green-500' },
    { label: 'ट्रेंडिंग', value: '5', icon: TrendingUp, color: 'bg-orange-500' },
    { label: 'पेंडिंग', value: '3', icon: Clock, color: 'bg-red-500' },
  ]

  return (
    <div className="min-h-screen bg-brand-lightGray">
      {/* Admin Header */}
      <header className="bg-brand-navy text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-[80%] h-[80%] rounded-full border border-white flex items-center justify-center">
                <span className="font-poppins font-bold text-[10px] tracking-wider">A&S</span>
              </div>
            </div>
            <div>
              <h1 className="font-poppins font-bold text-sm">Admin Dashboard</h1>
              <p className="text-white/50 text-[10px] font-poppins">Akashvani Speaking</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white/60 hover:text-white text-xs font-poppins transition-colors">
              साइट देखें ↗
            </Link>
            <button className="flex items-center gap-1 text-white/60 hover:text-white text-xs font-poppins transition-colors">
              <LogOut className="w-3.5 h-3.5" />
              लॉगआउट
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Quick Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-yantramanav text-gray-900">
            डैशबोर्ड
          </h2>
          <Link
            href="/admin/news/new"
            className="btn-navy flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            नई खबर जोड़ें
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-3xl font-bold font-poppins text-gray-900">
                  {stat.value}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-yantramanav">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent News */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold font-yantramanav text-gray-900 mb-4">
            हाल की खबरें
          </h3>
          <div className="space-y-3">
            {[
              { title: 'हरियाणा में डीजीपी ने पुलिस प्रशासन को दिए सख्त आदेश', status: 'approved', time: '2 घंटे पहले' },
              { title: 'किसानों ने टोल प्लाज़ा पर लगाया धरना', status: 'approved', time: '4 घंटे पहले' },
              { title: 'मनीषा मामले में सीबीआई की रिपोर्ट', status: 'pending', time: '5 घंटे पहले' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex-1">
                  <p className="font-yantramanav font-medium text-gray-900 text-sm">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 font-poppins mt-1">{item.time}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-poppins font-medium ${
                    item.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {item.status === 'approved' ? 'प्रकाशित' : 'पेंडिंग'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}