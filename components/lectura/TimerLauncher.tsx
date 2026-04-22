'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import PomodoroConfig from './PomodoroConfig'
import ReadingTimer, { TimerFinishPayload } from './ReadingTimer'
import { BUTTON_LABELS, SESSION_COMPLETE_MESSAGES } from '@/lib/lectura/readingConfig'
import type { BookData, PomodoroType } from '@/lib/lectura/types'

interface Props {
  book?: BookData | null
  onSessionSaved?: () => void
  label?: string
  variant?: 'primary' | 'ghost'
}

interface Mode {
  preset: PomodoroType
  customMins?: number
}

export default function TimerLauncher({
  book,
  onSessionSaved,
  label,
  variant = 'primary',
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [mode, setMode] = useState<Mode | null>(null)
  const [timerOpen, setTimerOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function handlePick(preset: PomodoroType, customMins?: number) {
    setMode({ preset, customMins })
    setPickerOpen(false)
    setTimerOpen(true)
  }

  async function handleFinish(payload: TimerFinishPayload) {
    // Snapshot de páginas al arrancar: no lo tenemos en esta versión simple,
    // así que lo tomamos de book.currentPage si hay. endPage es lo que marcó.
    const startPage = book?.currentPage ?? null
    const pagesRead =
      payload.endPage !== null && startPage !== null && payload.endPage >= startPage
        ? payload.endPage - startPage
        : null

    try {
      const res = await fetch('/api/lectura/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book?.id ?? null,
          startedAt: payload.startedAt,
          endedAt: payload.endedAt,
          durationMins: payload.durationMins,
          startPage,
          endPage: payload.endPage,
          pagesRead,
          pomodoroType: mode?.preset ?? '25-5',
          customMins: mode?.customMins ?? null,
          note: payload.note,
        }),
      })
      if (!res.ok) {
        setToast('No se pudo guardar la sesión. Probá de nuevo.')
        return
      }
      const data = await res.json()
      const msg =
        SESSION_COMPLETE_MESSAGES[
          Math.floor(Math.random() * SESSION_COMPLETE_MESSAGES.length)
        ]
      const streakMsg = data.newStreak ? ' · 🔥 Empezó tu racha!' : ''
      setToast(msg + streakMsg)
      onSessionSaved?.()
    } catch {
      setToast('Error de red al guardar.')
    }
  }

  function handleClose() {
    setTimerOpen(false)
    setMode(null)
  }

  const isPrimary = variant === 'primary'

  return (
    <>
      <motion.button
        onClick={() => setPickerOpen(true)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        className={`px-4 py-2 rounded-2xl text-sm font-bold transition-colors ${
          isPrimary ? 'text-white shimmer-btn' : 'reading-link'
        }`}
        style={
          isPrimary
            ? {
                background:
                  'linear-gradient(135deg, var(--reading-accent), var(--reading-accent-deep))',
                boxShadow: '0 4px 14px rgba(225, 29, 72, 0.3)',
              }
            : {
                border: '1px solid var(--reading-border)',
              }
        }
      >
        🕯️ {label ?? BUTTON_LABELS.startSession}
      </motion.button>

      <PomodoroConfig
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={handlePick}
      />

      <ReadingTimer
        open={timerOpen}
        mode={mode}
        book={book}
        onFinish={handleFinish}
        onClose={handleClose}
      />

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={() => setTimeout(() => setToast(null), 3500)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[95] reading-glass-strong rounded-2xl px-5 py-3 max-w-sm text-sm reading-ink-text"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            fontStyle: 'italic',
          }}
        >
          {toast}
        </motion.div>
      )}
    </>
  )
}
