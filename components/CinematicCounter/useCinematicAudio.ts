'use client'

import { useCallback, useEffect, useRef } from 'react'

// Configuración del track de fondo.
// Cambiá AUDIO_SRC si querés otro archivo; START_AT_SEC para el offset de inicio.
export const AUDIO_SRC = '/audio/peaches.mp3'
export const START_AT_SEC = 140.5 // 2:20.5
export const FADE_IN_MS = 1500
export const FADE_OUT_MS = 800
export const TARGET_VOLUME = 1.0

// Hook de música de fondo para la cinemática.
// - `prime()` debe llamarse desde un user-gesture (click Empezar) para
//   desbloquear autoplay en iOS/Safari y cargar el archivo.
// - `start()` arranca playback con fade-in desde 2:20.5 con 1.5s de fade.
// - `stop()` hace fade-out y pausa.
// - `setMuted(true)` silencia en vivo.
export function useCinematicAudio(initiallyMuted: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeRafRef = useRef<number | null>(null)
  const mutedRef = useRef<boolean>(initiallyMuted)
  const readyRef = useRef<boolean>(false)

  useEffect(() => {
    mutedRef.current = initiallyMuted
    const a = audioRef.current
    if (!a) return
    // Si ya está sonando, ajusta volumen al vuelo
    if (initiallyMuted) {
      a.volume = 0
    } else if (readyRef.current) {
      a.volume = TARGET_VOLUME
    }
  }, [initiallyMuted])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const a = document.createElement('audio')
    a.src = AUDIO_SRC
    a.preload = 'auto'
    a.loop = false
    a.volume = 0
    a.setAttribute('data-cinematic', 'bg')
    a.style.display = 'none'
    document.body.appendChild(a)
    audioRef.current = a
    return () => {
      try {
        a.pause()
        a.remove()
      } catch {
        // ignore
      }
      audioRef.current = null
      if (fadeRafRef.current) {
        cancelAnimationFrame(fadeRafRef.current)
        fadeRafRef.current = null
      }
    }
  }, [])

  const cancelFade = useCallback(() => {
    if (fadeRafRef.current) {
      cancelAnimationFrame(fadeRafRef.current)
      fadeRafRef.current = null
    }
  }, [])

  const fadeTo = useCallback(
    (target: number, durationMs: number, onDone?: () => void) => {
      cancelFade()
      const a = audioRef.current
      if (!a) {
        onDone?.()
        return
      }
      const start = performance.now()
      const from = a.volume
      const diff = target - from
      const tick = () => {
        if (!audioRef.current) return
        const t = Math.min(1, (performance.now() - start) / durationMs)
        // ease-in-out cuadrática suave
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
        audioRef.current.volume = Math.max(0, Math.min(1, from + diff * eased))
        if (t < 1) {
          fadeRafRef.current = requestAnimationFrame(tick)
        } else {
          fadeRafRef.current = null
          onDone?.()
        }
      }
      fadeRafRef.current = requestAnimationFrame(tick)
    },
    [cancelFade]
  )

  // Prime: setea offset y precarga, tiene que llamarse desde user gesture.
  const prime = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    try {
      // Algunos browsers necesitan que el audio esté lo suficientemente cargado
      // para hacer seek. Si currentTime aún no está disponible, se setea al
      // primer 'loadedmetadata'.
      const setOffset = () => {
        try {
          a.currentTime = START_AT_SEC
        } catch {
          // si el archivo es más corto, cae a 0
          a.currentTime = 0
        }
        readyRef.current = true
      }
      if (a.readyState >= 1) {
        setOffset()
      } else {
        a.addEventListener('loadedmetadata', setOffset, { once: true })
      }
      a.load()
    } catch {
      // ignore
    }
  }, [])

  const start = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    try {
      a.volume = 0
      const p = a.play()
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // autoplay bloqueado — dejamos silencioso, no crashea
        })
      }
      const target = mutedRef.current ? 0 : TARGET_VOLUME
      fadeTo(target, FADE_IN_MS)
    } catch {
      // ignore
    }
  }, [fadeTo])

  const stop = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    fadeTo(0, FADE_OUT_MS, () => {
      try {
        a.pause()
      } catch {
        // ignore
      }
    })
  }, [fadeTo])

  const setMuted = useCallback(
    (m: boolean) => {
      mutedRef.current = m
      const a = audioRef.current
      if (!a) return
      if (m) {
        fadeTo(0, 300)
      } else {
        fadeTo(TARGET_VOLUME, 300)
      }
    },
    [fadeTo]
  )

  return { prime, start, stop, setMuted }
}
