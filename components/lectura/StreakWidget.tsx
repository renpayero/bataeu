'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { STREAK_HEADING, STREAK_MESSAGES } from '@/lib/lectura/readingConfig'
import type { StreakData } from '@/lib/lectura/types'

type MilestoneTier = 7 | 30 | 100

interface MilestoneStyle {
  tier: MilestoneTier
  badge: string        // emoji que ilustra el hito
  label: string        // copy corto que acompaña el badge
  color: string        // color accent para el halo
  confettiEmojis: string[]
}

const MILESTONES: Record<MilestoneTier, MilestoneStyle> = {
  7: {
    tier: 7,
    badge: '✨',
    label: 'Una semana entera',
    color: '#f59e0b',
    confettiEmojis: ['✨', '🌟', '⭐', '🔥'],
  },
  30: {
    tier: 30,
    badge: '🏅',
    label: 'Un mes seguido',
    color: '#d4a574',
    confettiEmojis: ['🏅', '🌟', '🔥', '✨', '📖', '💫'],
  },
  100: {
    tier: 100,
    badge: '🕯️',
    label: '100 días',
    color: '#be123c',
    confettiEmojis: ['🕯️', '🔥', '🌹', '✨', '💕', '🌟', '📖'],
  },
}

function pickCopy(data: StreakData): string {
  if (data.current >= 100) return STREAK_MESSAGES.milestone100
  if (data.current >= 30) return STREAK_MESSAGES.milestone30
  if (data.current >= 7) return STREAK_MESSAGES.milestone7
  if (data.hasSessionToday && data.current === 1) return STREAK_MESSAGES.firstDay
  if (data.hasSessionToday) return STREAK_MESSAGES.todayDone
  if (data.current > 0) return STREAK_MESSAGES.atRisk
  if (data.longest > 0) return STREAK_MESSAGES.brokenGentle
  return STREAK_MESSAGES.zeroEver
}

// El hito exacto del día es: current === 100, 30, o 7 (día justo).
// Si pasó de largo (ej. 101, 31), no celebramos otra vez.
function exactMilestone(current: number): MilestoneTier | null {
  if (current === 100) return 100
  if (current === 30) return 30
  if (current === 7) return 7
  return null
}

function storageKey(tier: MilestoneTier): string {
  return `reading_streak_milestone_${tier}_celebrated_v1`
}

export default function StreakWidget() {
  const [data, setData] = useState<StreakData | null>(null)
  const [loading, setLoading] = useState(true)
  const [confetti, setConfetti] = useState<
    Array<{ id: number; emoji: string; vx: number; vy: number }>
  >([])
  const celebratedRef = useRef(false)

  useEffect(() => {
    fetch('/api/lectura/sessions/streak')
      .then((r) => r.json())
      .then((d: StreakData) => setData(d))
      .catch(() => {
        // silencioso
      })
      .finally(() => setLoading(false))
  }, [])

  // Dispara la celebración una sola vez por tier cumplido.
  useEffect(() => {
    if (!data || celebratedRef.current) return
    const tier = exactMilestone(data.current)
    if (!tier) return
    try {
      if (localStorage.getItem(storageKey(tier)) === '1') return
    } catch {
      // localStorage no disponible — igual celebramos
    }
    celebratedRef.current = true
    const ms = MILESTONES[tier]
    // Confetti sostenido: 24 partículas con variance
    const parts = Array.from({ length: 24 }, (_, i) => ({
      id: Date.now() + i,
      emoji: ms.confettiEmojis[i % ms.confettiEmojis.length],
      vx: (Math.random() - 0.5) * 540,
      vy: -(Math.random() * 320 + 160),
    }))
    setConfetti(parts)
    const t = setTimeout(() => setConfetti([]), 2400)
    try {
      localStorage.setItem(storageKey(tier), '1')
    } catch {
      // ignore
    }
    return () => clearTimeout(t)
  }, [data])

  if (loading || !data) return null

  const isActive = data.hasSessionToday && data.current > 0
  const copy = pickCopy(data)

  // Cuál es el badge visible "alcanzado" (permanente, no la celebración):
  const reachedTier: MilestoneTier | null =
    data.current >= 100 ? 100 : data.current >= 30 ? 30 : data.current >= 7 ? 7 : null
  const reached = reachedTier ? MILESTONES[reachedTier] : null

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="reading-glass-strong rounded-3xl p-5 md:p-6 flex items-center gap-4 md:gap-6 relative overflow-visible"
      style={
        reached
          ? {
              boxShadow: `0 8px 32px ${reached.color}40, inset 0 1px 0 rgba(255,255,255,0.75)`,
              border: `1px solid ${reached.color}55`,
            }
          : undefined
      }
    >
      <motion.div
        animate={
          isActive
            ? { scale: [1, 1.08, 1] }
            : { scale: 1, opacity: 0.55, filter: 'grayscale(0.6)' }
        }
        transition={
          isActive
            ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
        className="text-5xl md:text-6xl flex-shrink-0 relative"
        aria-hidden
      >
        🔥
        {/* Doble fuego en 100 días */}
        {data.current >= 100 && (
          <motion.span
            className="absolute -right-2 -top-1 text-3xl md:text-4xl"
            animate={{ scale: [1, 1.15, 1], rotate: [0, 6, -6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            🔥
          </motion.span>
        )}
      </motion.div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs uppercase tracking-[0.25em] reading-ink-faded">
            {STREAK_HEADING}
          </p>
          {reached && (
            <motion.span
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 340, damping: 18, delay: 0.4 }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
              style={{
                background: `${reached.color}22`,
                color: reached.color,
                border: `1px solid ${reached.color}66`,
              }}
            >
              <span className="text-sm leading-none">{reached.badge}</span>
              {reached.label}
            </motion.span>
          )}
        </div>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span
            className="text-4xl md:text-5xl font-bold reading-ink-text tabular-nums"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            {data.current}
          </span>
          <span className="text-sm reading-ink-soft-text">
            {data.current === 1 ? 'día' : 'días'}
          </span>
          {data.longest > data.current && (
            <span className="text-[11px] reading-ink-faded ml-auto">
              récord {data.longest}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm reading-ink-soft-text italic">{copy}</p>
      </div>

      {/* Confetti que se dispara una sola vez al alcanzar exactamente el hito */}
      <AnimatePresence>
        {confetti.map((p) => (
          <motion.span
            key={p.id}
            className="absolute text-2xl pointer-events-none select-none"
            style={{ left: '50%', top: '50%' }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.6, rotate: 0 }}
            animate={{
              x: p.vx,
              y: p.vy,
              opacity: [0, 1, 0],
              scale: [0.6, 1.2, 0.8],
              rotate: p.vx > 0 ? 420 : -420,
            }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </motion.section>
  )
}
