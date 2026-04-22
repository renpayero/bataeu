'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  readTimerSnapshot,
  writeTimerSnapshot,
  computeSnapshotElapsedMs,
} from './ReadingTimer'
import { SESSION_COMPLETE_MESSAGES, TIMER_MESSAGES } from '@/lib/lectura/readingConfig'

const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000

export default function TimerRecoveryBanner() {
  const [elapsedMs, setElapsedMs] = useState<number | null>(null)
  const [bookTitle, setBookTitle] = useState<string | null>(null)
  const [bookId, setBookId] = useState<number | null>(null)
  const [startedAtIso, setStartedAtIso] = useState<string | null>(null)
  const [pomodoroType, setPomodoroType] = useState<string>('25-5')
  const [customMins, setCustomMins] = useState<number | null>(null)
  const [startPage, setStartPage] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const snap = readTimerSnapshot()
    if (!snap) return
    const now = Date.now()
    const elapsed = computeSnapshotElapsedMs(snap, now)
    if (elapsed > TWELVE_HOURS_MS) {
      writeTimerSnapshot(null)
      return
    }
    if (elapsed < 60_000) {
      // menos de 1 min — no vale la pena guardarlo
      return
    }
    setElapsedMs(elapsed)
    setBookTitle(snap.book?.title ?? null)
    setBookId(snap.book?.id ?? null)
    setStartPage(snap.book?.currentPage ?? null)
    setStartedAtIso(snap.startedAtIso)
    setPomodoroType(snap.pomodoroType)
    setCustomMins(snap.customMins)
  }, [])

  async function handleSave() {
    if (saving || elapsedMs === null || !startedAtIso) return
    setSaving(true)
    try {
      const endedAt = new Date().toISOString()
      const durationMins = Math.max(1, Math.round(elapsedMs / 60_000))
      const res = await fetch('/api/lectura/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          startedAt: startedAtIso,
          endedAt,
          durationMins,
          startPage,
          endPage: null,
          pagesRead: null,
          pomodoroType,
          customMins,
          note: 'Recuperada (timer abandonado)',
        }),
      })
      writeTimerSnapshot(null)
      setElapsedMs(null)
      if (res.ok) {
        setToast(
          SESSION_COMPLETE_MESSAGES[
            Math.floor(Math.random() * SESSION_COMPLETE_MESSAGES.length)
          ]
        )
      } else {
        setToast('No pudimos guardar la sesión.')
      }
    } catch {
      setToast('Error de red.')
    } finally {
      setSaving(false)
    }
  }

  function handleDiscard() {
    writeTimerSnapshot(null)
    setElapsedMs(null)
  }

  if (elapsedMs === null && !toast) return null

  const mins = elapsedMs !== null ? Math.round(elapsedMs / 60_000) : 0

  return (
    <AnimatePresence>
      {elapsedMs !== null && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="reading-glass-strong rounded-2xl p-4 flex items-start gap-3 mb-4"
          style={{ border: '1px solid rgba(225, 29, 72, 0.25)' }}
        >
          <span className="text-2xl">⏰</span>
          <div className="flex-1 min-w-0">
            <p
              className="font-bold text-sm reading-ink-text"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              {TIMER_MESSAGES.resumePrompt}
            </p>
            <p className="text-xs reading-ink-soft-text italic">
              {mins} min{bookTitle ? ` · ${bookTitle}` : ''}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white disabled:opacity-50"
              style={{
                background:
                  'linear-gradient(135deg, var(--reading-accent), var(--reading-accent-deep))',
              }}
            >
              {saving ? '...' : 'Guardar'}
            </button>
            <button
              onClick={handleDiscard}
              disabled={saving}
              className="px-3 py-1.5 rounded-xl text-xs font-bold reading-link"
              style={{ border: '1px solid var(--reading-border)' }}
            >
              Descartar
            </button>
          </div>
        </motion.div>
      )}
      {toast && (
        <motion.div
          key="toast"
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
    </AnimatePresence>
  )
}
