'use client'

import { useEffect, useMemo, useState } from 'react'
import { getActiveMemories } from './memoriesManifest'
import { AUDIO_SRC } from './useCinematicAudio'

interface PreloadResult {
  ready: boolean
  progress: number // 0..1
  loadedCount: number
  totalCount: number
  failedCount: number
}

// Precarga todas las imágenes (decoded), los primeros frames de los videos
// y la pista de audio de fondo antes de arrancar la cinemática, para que
// reproducir sea instantáneo y sin cortes.
export function useAssetPreloader(enabled = true): PreloadResult {
  const [loadedCount, setLoadedCount] = useState(0)
  const [failedCount, setFailedCount] = useState(0)
  // Snapshot de las memorias activas para este ciclo de preload.
  // Usamos la lista activa (override de galería o manifest hardcodeado).
  const memories = useMemo(() => (enabled ? getActiveMemories() : []), [enabled])
  // +1 por el audio de fondo
  const totalCount = memories.length + 1

  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    const mediaPromises = memories.map((m) => {
      if (m.type === 'photo') {
        return new Promise<'ok' | 'fail'>((resolve) => {
          const img = new Image()
          img.onload = () => resolve('ok')
          img.onerror = () => resolve('fail')
          img.src = m.src
          if ('decode' in img) {
            img
              .decode()
              .then(() => resolve('ok'))
              .catch(() => resolve('fail'))
          }
        })
      }
      return new Promise<'ok' | 'fail'>((resolve) => {
        const video = document.createElement('video')
        video.preload = 'auto'
        video.muted = true
        video.playsInline = true
        video.src = m.src
        const done = (status: 'ok' | 'fail') => resolve(status)
        video.onloadeddata = () => done('ok')
        video.onerror = () => done('fail')
        setTimeout(() => done('fail'), 10000)
      })
    })

    const audioPromise: Promise<'ok' | 'fail'> = new Promise((resolve) => {
      try {
        const a = new Audio(AUDIO_SRC)
        a.preload = 'auto'
        a.muted = true
        const done = (status: 'ok' | 'fail') => resolve(status)
        a.oncanplaythrough = () => done('ok')
        a.onloadeddata = () => done('ok')
        a.onerror = () => done('fail')
        setTimeout(() => done('fail'), 15000)
      } catch {
        resolve('fail')
      }
    })

    const all = [...mediaPromises, audioPromise]
    all.forEach((p) =>
      p.then((status) => {
        if (cancelled) return
        if (status === 'ok') setLoadedCount((c) => c + 1)
        else setFailedCount((c) => c + 1)
      })
    )

    return () => {
      cancelled = true
    }
    // Reset counters si cambia la lista (override aplicado antes de preloaded).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, memories])

  const done = loadedCount + failedCount
  const progress = totalCount === 0 ? 1 : done / totalCount
  const ready = done >= totalCount

  return { ready, progress, loadedCount, totalCount, failedCount }
}
