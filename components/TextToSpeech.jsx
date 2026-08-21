'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, Pause, Play } from 'lucide-react'

export default function TextToSpeech({ text, headline }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const utteranceRef = useRef(null)

  useEffect(() => {
    setIsSupported('speechSynthesis' in window)
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const fullText = headline + '। ' + text

  const speak = () => {
    if (!isSupported) return

    if (isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
      setIsPlaying(true)
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(fullText)
    utterance.lang = 'hi-IN'
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    // Try to find Hindi voice
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(
      (v) => v.lang.includes('hi') || v.lang.includes('Hindi')
    )
    if (hindiVoice) {
      utterance.voice = hindiVoice
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
  }

  const pause = () => {
    window.speechSynthesis.pause()
    setIsPaused(true)
    setIsPlaying(false)
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
  }

  if (!isSupported) return null

  return (
    <div className="flex items-center gap-2">
      {!isPlaying && !isPaused && (
        <button
          onClick={speak}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-navy to-brand-navyLight text-white rounded-full text-sm font-poppins font-medium hover:shadow-lg hover:shadow-brand-navy/30 transition-all duration-300 active:scale-95"
          title="सुनें"
        >
          <Volume2 className="w-4 h-4" />
          <span className="hidden sm:inline">सुनें</span>
        </button>
      )}

      {isPlaying && (
        <div className="flex items-center gap-2">
          <button
            onClick={pause}
            className="flex items-center gap-2 px-4 py-2 bg-brand-navy text-white rounded-full text-sm font-poppins font-medium hover:bg-brand-navyDark transition-all active:scale-95"
          >
            <Pause className="w-4 h-4" />
            <span className="hidden sm:inline">रोकें</span>
          </button>
          <button
            onClick={stop}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all active:scale-95"
          >
            <VolumeX className="w-4 h-4" />
          </button>
          {/* Audio wave animation */}
          <div className="flex items-center gap-0.5 ml-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-1 bg-brand-navy rounded-full animate-bounce"
                style={{
                  height: `${Math.random() * 16 + 8}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.6s',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {isPaused && (
        <div className="flex items-center gap-2">
          <button
            onClick={speak}
            className="flex items-center gap-2 px-4 py-2 bg-brand-navy text-white rounded-full text-sm font-poppins font-medium hover:bg-brand-navyDark transition-all active:scale-95"
          >
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">जारी रखें</span>
          </button>
          <button
            onClick={stop}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all active:scale-95"
          >
            <VolumeX className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}