'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const MUTE_KEY = 'reading_timer_muted_v1'

type AudioContextCtor = typeof AudioContext

interface WindowWithWebkit extends Window {
  webkitAudioContext?: AudioContextCtor
}

// Bell hook: intenta primero /bell.mp3. Si falla, usa Web Audio (tono suave).
// Si tampoco hay audio disponible, dispara navigator.vibrate como fallback.
export function useBell() {
  const [muted, setMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      setMuted(localStorage.getItem(MUTE_KEY) === '1')
    } catch {
      // ignore
    }
    // precargar /bell.mp3 (si existe); el play real vendrá después del user-gesture
    if (typeof Audio !== 'undefined') {
      try {
        const a = new Audio('/bell.mp3')
        a.preload = 'auto'
        a.volume = 0.65
        audioRef.current = a
      } catch {
        audioRef.current = null
      }
    }
  }, [])

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev
      try {
        localStorage.setItem(MUTE_KEY, next ? '1' : '0')
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  const playWebAudioTone = useCallback(() => {
    try {
      const w = window as WindowWithWebkit
      if (!ctxRef.current) {
        const Ctor = window.AudioContext ?? w.webkitAudioContext
        if (!Ctor) return false
        ctxRef.current = new Ctor()
      }
      const ctx = ctxRef.current
      const now = ctx.currentTime
      // Dos tonos suaves en armónico
      ;[660, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0, now + i * 0.15)
        gain.gain.linearRampToValueAtTime(0.18, now + i * 0.15 + 0.04)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.9)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.15)
        osc.stop(now + i * 0.15 + 1)
      })
      return true
    } catch {
      return false
    }
  }, [])

  const ring = useCallback(() => {
    if (muted) return
    const el = audioRef.current
    if (el) {
      try {
        el.currentTime = 0
        const p = el.play()
        if (p && typeof p.catch === 'function') {
          p.catch(() => {
            // archivo no existe o autoplay bloqueado — fallback
            const ok = playWebAudioTone()
            if (!ok) {
              try {
                navigator.vibrate?.(220)
              } catch {
                // ignore
              }
            }
          })
          return
        }
      } catch {
        // try Web Audio
      }
    }
    const ok = playWebAudioTone()
    if (!ok) {
      try {
        navigator.vibrate?.(220)
      } catch {
        // ignore
      }
    }
  }, [muted, playWebAudioTone])

  return { ring, muted, toggleMute }
}
