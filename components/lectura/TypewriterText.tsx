'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface Props {
  text: string
  speedMs?: number
  delayMs?: number
  maxLengthForAnimation?: number
  className?: string
  style?: React.CSSProperties
  onDone?: () => void
}

/**
 * Typewriter que respeta prefers-reduced-motion y que salta
 * a fade para textos muy largos (evita tartamudeo).
 */
export default function TypewriterText({
  text,
  speedMs = 32,
  delayMs = 120,
  maxLengthForAnimation = 320,
  className = '',
  style,
  onDone,
}: Props) {
  const reduce = useReducedMotion()
  const skip = reduce || text.length > maxLengthForAnimation
  const [displayed, setDisplayed] = useState(skip ? text : '')
  const [done, setDone] = useState(skip)
  const [glowing, setGlowing] = useState(false)

  useEffect(() => {
    if (skip) {
      setDisplayed(text)
      setDone(true)
      setGlowing(true)
      const t = setTimeout(() => setGlowing(false), 1200)
      onDone?.()
      return () => clearTimeout(t)
    }

    setDisplayed('')
    setDone(false)
    setGlowing(false)

    let cancelled = false
    let interval: ReturnType<typeof setInterval> | null = null
    let glowTimer: ReturnType<typeof setTimeout> | null = null

    const start = setTimeout(() => {
      if (cancelled) return
      let idx = 0
      interval = setInterval(() => {
        if (cancelled) {
          if (interval) clearInterval(interval)
          return
        }
        idx += 1
        setDisplayed(text.slice(0, idx))
        if (idx >= text.length) {
          if (interval) clearInterval(interval)
          setDone(true)
          setGlowing(true)
          onDone?.()
          glowTimer = setTimeout(() => setGlowing(false), 1400)
        }
      }, speedMs)
    }, delayMs)

    return () => {
      cancelled = true
      clearTimeout(start)
      if (interval) clearInterval(interval)
      if (glowTimer) clearTimeout(glowTimer)
    }
  }, [text, speedMs, delayMs, skip, onDone])

  return (
    <motion.span
      className={className}
      style={{
        ...style,
        textShadow: glowing
          ? '0 0 18px rgba(225, 29, 72, 0.55), 0 0 42px rgba(225, 29, 72, 0.25)'
          : 'none',
        transition: 'text-shadow 0.8s ease',
      }}
    >
      {displayed}
      {!done && <span className="reading-cursor" aria-hidden />}
    </motion.span>
  )
}
