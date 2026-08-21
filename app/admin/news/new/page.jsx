'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Plus, X, Upload, Image as ImageIcon, 
  Video, Send, Eye, Save, Trash2
} from 'lucide-react'
import { dummyCategories } from '@/lib/dummyData'

export default function AddNewsPage() {
  const [formData, setFormData] = useState({
    headline: '',
    subheadline: '',
    category_id: '',
    points: [''],
    location: '',
    is_trending: false,
    is_breaking: false,
    video_url: '',
    video_type: 'youtube',
  })
  const [featuredImage, setFeaturedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(null)

  const addPoint = () => {
    setFormData((prev) => ({
      ...prev,
      points: [...prev.points, ''],
    }))
  }

  const removePoint = (index) => {
    setFormData((prev) => ({
      ...prev,
      points: prev.points.filter((_, i) => i !== index),
    }))
  }

  const updatePoint = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      points: prev.points.map((p, i) => (i === index ? value : p)),
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFeaturedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Upload image to Supabase Storage
      // Submit news to Supabase
      await new Promise((r) => setTimeout(r, 2000))
      setStatus('success')
    } catch (err) {
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-lightGray">
      {/* Header */}
      <header className="bg-brand-navy text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-poppins"
          >
            <ArrowLeft className="w-4 h-4" />
            डैशबोर्ड
          </Link>
          <h1 className="font-poppins font-bold text-sm">नई खबर जोड़ें</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {status === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-yantramanav text-center animate-slide-down">
            ✅ खबर सफलतापूर्वक सबमिट हो गई! रिव्यू के बाद प्रकाशित होगी।
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Headline */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">
                  हेडलाइन *
                </label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="खबर की हेडलाइन लिखें..."
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl font-yantramanav text-lg outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-all"
                />
              </div>

              {/* Subheadline */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">
                  सब-हेडलाइन
                </label>
                <textarea
                  value={formData.subheadline}
                  onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                  placeholder="खबर का संक्षिप्त विवरण..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl font-yantramanav outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-all resize-none"
                />
              </div>

              {/* Bullet Points */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-3">
                  मुख्य बिंदु (Points) *
                </label>
                <div className="space-y-3">
                  {formData.points.map((point, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-brand-navy/10 text-brand-navy rounded-full flex items-center justify-center text-xs font-poppins font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => updatePoint(idx, e.target.value)}
                        placeholder={`बिंदु ${idx + 1} लिखें...`}
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-yantramanav text-sm outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-all"
                      />
                      {formData.points.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePoint(idx)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addPoint}
                  className="mt-3 flex items-center gap-2 text-brand-navy text-sm font-poppins font-medium hover:underline transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  और बिंदु जोड़ें
                </button>
              </div>

              {/* Image Upload */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-3">
                  फीचर्ड इमेज *
                </label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFeaturedImage(null)
                        setImagePreview(null)
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-brand-navy/30 hover:bg-brand-navy/5 transition-all">
                    <Upload className="w-8 h-8 text-gray-300 mb-2" />
                    <span className="text-sm text-gray-400 font-poppins">
                      क्लिक करें या ड्रैग करें
                    </span>
                    <span className="text-xs text-gray-300 font-poppins mt-1">
                      JPG, PNG, WebP (Max 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Video URL */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">
                  वीडियो (वैकल्पिक)
                </label>
                <div className="flex gap-3 mb-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, video_type: 'youtube' })}
                    className={`px-4 py-2 rounded-lg text-sm font-poppins transition-all ${
                      formData.video_type === 'youtube'
                        ? 'bg-brand-navy text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    YouTube
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, video_type: 'upload' })}
                    className={`px-4 py-2 rounded-lg text-sm font-poppins transition-all ${
                      formData.video_type === 'upload'
                        ? 'bg-brand-navy text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    अपलोड
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder={
                    formData.video_type === 'youtube'
                      ? 'YouTube URL डालें...'
                      : 'Video URL डालें...'
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-poppins text-sm outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-all"
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Category */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">
                  कैटेगरी *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-yantramanav text-sm outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-all bg-white"
                >
                  <option value="">कैटेगरी चुनें</option>
                  {dummyCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <label className="block text-sm font-poppins font-semibold text-gray-700 mb-2">
                  लोकेशन
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="जैसे: भिवानी, रोहतक..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-yantramanav text-sm outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition-all"
                />
              </div>

              {/* Flags */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.is_trending}
                    onChange={(e) => setFormData({ ...formData, is_trending: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-brand-navy focus:ring-brand-navy"
                  />
                  <div>
                    <span className="text-sm font-poppins font-medium text-gray-700 group-hover:text-brand-navy transition-colors">
                      ट्रेंडिंग न्यूज़
                    </span>
                    <p className="text-[11px] text-gray-400 font-poppins">
                      होम पेज पर बड़ा कार्ड दिखेगा
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.is_breaking}
                    onChange={(e) => setFormData({ ...formData, is_breaking: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-brand-red focus:ring-brand-red"
                  />
                  <div>
                    <span className="text-sm font-poppins font-medium text-gray-700 group-hover:text-brand-red transition-colors">
                      ब्रेकिंग / लाइव
                    </span>
                    <p className="text-[11px] text-gray-400 font-poppins">
                      लाल LIVE बैज दिखेगा
                    </p>
                  </div>
                </label>
              </div>

              {/* Submit */}
              <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-brand-navy text-white rounded-xl font-poppins font-semibold text-sm flex items-center justify-center gap-2 hover:bg-brand-navyDark transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>सबमिट हो रहा है...</span>
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>खबर सबमिट करें</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-poppins font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>ड्राफ्ट सेव करें</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}