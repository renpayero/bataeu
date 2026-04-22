'use client'

import { useEffect, useRef } from 'react'
import type { Memory } from './memoriesManifest'

interface Props {
  memory: Memory
  className?: string
  style?: React.CSSProperties
  objectFit?: 'cover' | 'contain'
  playOnMount?: boolean // solo para videos, default true
  loop?: boolean
  muted?: boolean
  autoPlay?: boolean
}

/**
 * Renderiza una foto o un video (Live Photo MP4) con manejo uniforme.
 * - Para fotos: <img> con lazy? no, pre-cargado por el preloader.
 * - Para videos: <video muted loop playsInline autoPlay /> para que autoreproduzca
 *   en cualquier browser sin gesture (gracias al muted).
 */
export default function MemoryFrame({
  memory,
  className = '',
  style,
  objectFit = 'cover',
  loop = true,
  muted = true,
  autoPlay = true,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (memory.type !== 'video') return
    const v = videoRef.current
    if (!v || !autoPlay) return
    const p = v.play()
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        // autoplay bloqueado (muy raro con muted). No crashear.
      })
    }
  }, [memory, autoPlay])

  const fit = objectFit === 'cover' ? 'cover' : 'contain'

  // Prioridad: style.objectPosition override > manifest.objectPosition > default 'center'
  const resolvedPosition =
    (style as React.CSSProperties | undefined)?.objectPosition ??
    memory.objectPosition ??
    'center'

  const mergedStyle: React.CSSProperties = {
    objectFit: fit,
    objectPosition: resolvedPosition,
    width: '100%',
    height: '100%',
    ...style,
    // Forzar que el resolved gane siempre (si no venía override en style)
    ...(style?.objectPosition ? {} : { objectPosition: resolvedPosition }),
  }

  if (memory.type === 'video') {
    return (
      <video
        ref={videoRef}
        src={memory.src}
        className={className}
        style={mergedStyle}
        muted={muted}
        loop={loop}
        autoPlay={autoPlay}
        playsInline
        preload="auto"
      />
    )
  }

  // img con eslint disable porque next/image en un modal full-screen
  // con aspecto variable es contraproducente; el preloader ya asegura decode.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={memory.src}
      alt=""
      className={className}
      style={mergedStyle}
      draggable={false}
    />
  )
}
