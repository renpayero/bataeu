'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import BookCover from './BookCover'
import { useBell } from '@/lib/lectura/useBell'
import {
  POMODORO_LABELS,
  TIMER_MESSAGES,
  SESSION_MIN_MINUTES,
} from '@/lib/lectura/readingConfig'
import type { BookData, PomodoroType } from '@/lib/lectura/types'

const FINISH_EMOJIS = ['📖', '⭐', '✨', '🌟', '🕯️', '☕', '🔥']

function ConfettiBurst({ emoji, vx, vy }: { emoji: string; vx: number; vy: number }) {
  return (
    <motion.div
      className="fixed pointer-events-none select-none text-3xl z-[110]"
      style={{ left: '50%', top: '50%' }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
      animate={{ x: vx, y: vy, opacity: 0, scale: 0.6, rotate: 480 }}
      transition={{ duration: 1.8, ease: 'easeOut' }}
    >
      {emoji}
    </motion.div>
  )
}

const STORAGE_KEY = 'reading_active_timer_v1'

interface TimerSnapshot {
  v: 1
  startedAtMs: number // Date.now() al iniciar
  startedAtIso: string
  targetMins: number | null
  pomodoroType: PomodoroType
  customMins: number | null
  accumulatedPausedMs: number
  pausedSinceMs: number | null
  book: {
    id: number
    title: string
    author: string
    coverUrl: string | null
    currentPage: number | null
    pages: number | null
  } | null
}

export function readTimerSnapshot(): TimerSnapshot | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const snap = JSON.parse(raw) as TimerSnapshot
    if (snap.v !== 1) return null
    return snap
  } catch {
    return null
  }
}

export function writeTimerSnapshot(snap: TimerSnapshot | null) {
  if (typeof window === 'undefined') return
  try {
    if (snap === null) localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(snap))
  } catch {
    // quota exceeded / private mode — ignorar
  }
}

export function computeSnapshotElapsedMs(snap: TimerSnapshot, nowMs: number): number {
  const extraPausedMs =
    snap.pausedSinceMs !== null ? nowMs - snap.pausedSinceMs : 0
  return Math.max(
    0,
    nowMs - snap.startedAtMs - snap.accumulatedPausedMs - extraPausedMs
  )
}

interface Mode {
  preset: PomodoroType
  customMins?: number
}

export interface TimerFinishPayload {
  durationMins: number
  startedAt: string
  endedAt: string
  endPage: number | null
  note: string | null
  wantsBreak: boolean
}

interface Props {
  open: boolean
  mode: Mode | null
  book?: BookData | null
  onFinish: (payload: TimerFinishPayload) => Promise<void> | void
  onClose: () => void
}

type Phase = 'ready' | 'running' | 'paused' | 'finished' | 'breaking'

const RADIUS = 116
const CIRC = 2 * Math.PI * RADIUS

function formatMMSS(secs: number): string {
  const s = Math.max(0, Math.floor(secs))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
}

function getTargetMins(mode: Mode | null): number | null {
  if (!mode) return null
  if (mode.preset === 'libre') return null
  if (mode.preset === 'custom') return mode.customMins ?? null
  const cfg = POMODORO_LABELS[mode.preset]
  return cfg.work
}

export default function ReadingTimer({
  open,
  mode,
  book,
  onFinish,
  onClose,
}: Props) {
  const targetMins = getTargetMins(mode)
  const targetMs = targetMins !== null ? targetMins * 60 * 1000 : null

  const [phase, setPhase] = useState<Phase>('ready')
  const [displayMs, setDisplayMs] = useState<number>(0) // elapsed effective
  const [breakRemainingMs, setBreakRemainingMs] = useState<number>(0)
  const [endPage, setEndPage] = useState<string>('')
  const [note, setNote] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [flash, setFlash] = useState(false)
  const [confetti, setConfetti] = useState<
    Array<{ id: number; emoji: string; vx: number; vy: number }>
  >([])
  const prevPhaseRef = useRef<Phase>('ready')
  const reducedMotion = useReducedMotion()
  const { ring, muted, toggleMute } = useBell()

  const startedPerfRef = useRef<number | null>(null)
  const pausedAtRef = useRef<number | null>(null)
  const accumPausedMsRef = useRef<number>(0)
  const rafRef = useRef<number | null>(null)
  const startedAtIsoRef = useRef<string | null>(null)

  // Reset al abrir/cerrar
  useEffect(() => {
    if (!open) {
      setPhase('ready')
      setDisplayMs(0)
      setBreakRemainingMs(0)
      setEndPage('')
      setNote('')
      setSaving(false)
      setFlash(false)
      setConfetti([])
      prevPhaseRef.current = 'ready'
      startedPerfRef.current = null
      pausedAtRef.current = null
      accumPausedMsRef.current = 0
      startedAtIsoRef.current = null
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      return
    }
    // Prefill endPage cuando se abre con libro
    if (book?.currentPage) {
      const prefill = Math.min(
        (book.currentPage ?? 0) + 10,
        book.pages ?? book.currentPage + 10
      )
      setEndPage(String(prefill))
    }
  }, [open, book])

  // Running tick via RAF
  const tick = useCallback(() => {
    if (startedPerfRef.current === null) return
    const now = performance.now()
    const elapsed = now - startedPerfRef.current - accumPausedMsRef.current
    if (targetMs !== null) {
      const remaining = targetMs - elapsed
      if (remaining <= 0) {
        setDisplayMs(targetMs)
        // al terminar pasa a 'finished'
        setPhase('finished')
        return
      }
    }
    setDisplayMs(elapsed)
    rafRef.current = requestAnimationFrame(tick)
  }, [targetMs])

  // Arrancar / parar el RAF según phase
  useEffect(() => {
    if (phase === 'running') {
      rafRef.current = requestAnimationFrame(tick)
    } else if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [phase, tick])

  // Celebración al entrar en 'finished' (bell + confetti + flash)
  useEffect(() => {
    if (phase !== 'finished' || prevPhaseRef.current === 'finished') {
      prevPhaseRef.current = phase
      return
    }
    prevPhaseRef.current = 'finished'
    // sonido
    ring()
    // flash dorado
    setFlash(true)
    const flashTimer = setTimeout(() => setFlash(false), 720)
    // confetti (respeta reduced-motion)
    if (!reducedMotion) {
      const parts = Array.from({ length: 16 }, (_, i) => ({
        id: Date.now() + i,
        emoji: FINISH_EMOJIS[Math.floor(Math.random() * FINISH_EMOJIS.length)],
        vx: (Math.random() - 0.5) * 480,
        vy: -(Math.random() * 260 + 120),
      }))
      setConfetti(parts)
      setTimeout(() => setConfetti([]), 1900)
    }
    return () => {
      clearTimeout(flashTimer)
    }
  }, [phase, ring, reducedMotion])

  // Actualizar document.title mientras corre
  useEffect(() => {
    if (!open) return
    if (phase !== 'running' && phase !== 'paused') return
    const original = document.title
    const iv = setInterval(() => {
      const secs =
        targetMs !== null
          ? Math.max(0, Math.floor((targetMs - displayMs) / 1000))
          : Math.floor(displayMs / 1000)
      const prefix = phase === 'paused' ? '⏸' : '⏰'
      const titleBook = book ? ` · ${book.title}` : ''
      document.title = `${prefix} ${formatMMSS(secs)}${titleBook}`
    }, 1000)
    return () => {
      clearInterval(iv)
      document.title = original
    }
  }, [open, phase, displayMs, targetMs, book])

  // Break countdown (5 min)
  useEffect(() => {
    if (phase !== 'breaking') return
    const breakTarget = 5 * 60 * 1000
    const t0 = performance.now()
    setBreakRemainingMs(breakTarget)
    let id = 0
    const tickBreak = () => {
      const el = performance.now() - t0
      const rem = breakTarget - el
      if (rem <= 0) {
        setBreakRemainingMs(0)
        setPhase('ready') // al terminar break, vuelve a ready
        return
      }
      setBreakRemainingMs(rem)
      id = requestAnimationFrame(tickBreak)
    }
    id = requestAnimationFrame(tickBreak)
    return () => cancelAnimationFrame(id)
  }, [phase])

  function persistSnapshot(opts?: { pausedSinceMs?: number | null }) {
    if (!book || !mode) return
    const startedAtMs = Date.now() - displayMs // aprox, reconstrucción
    // Prefer el valor original si ya lo tenemos
    const startedAtIso = startedAtIsoRef.current ?? new Date(startedAtMs).toISOString()
    writeTimerSnapshot({
      v: 1,
      startedAtMs: new Date(startedAtIso).getTime(),
      startedAtIso,
      targetMins: targetMins,
      pomodoroType: mode.preset,
      customMins: mode.customMins ?? null,
      accumulatedPausedMs: accumPausedMsRef.current,
      pausedSinceMs:
        opts?.pausedSinceMs !== undefined
          ? opts.pausedSinceMs
          : pausedAtRef.current !== null
            ? Date.now() - (performance.now() - pausedAtRef.current)
            : null,
      book: {
        id: book.id,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        currentPage: book.currentPage,
        pages: book.pages,
      },
    })
  }

  function handleStart() {
    startedPerfRef.current = performance.now()
    startedAtIsoRef.current = new Date().toISOString()
    accumPausedMsRef.current = 0
    setDisplayMs(0)
    setPhase('running')
    // snapshot inicial
    if (book && mode) {
      writeTimerSnapshot({
        v: 1,
        startedAtMs: Date.now(),
        startedAtIso: startedAtIsoRef.current,
        targetMins,
        pomodoroType: mode.preset,
        customMins: mode.customMins ?? null,
        accumulatedPausedMs: 0,
        pausedSinceMs: null,
        book: {
          id: book.id,
          title: book.title,
          author: book.author,
          coverUrl: book.coverUrl,
          currentPage: book.currentPage,
          pages: book.pages,
        },
      })
    }
  }

  function handlePause() {
    pausedAtRef.current = performance.now()
    setPhase('paused')
    persistSnapshot({ pausedSinceMs: Date.now() })
  }

  function handleResume() {
    if (pausedAtRef.current !== null) {
      accumPausedMsRef.current += performance.now() - pausedAtRef.current
      pausedAtRef.current = null
    }
    setPhase('running')
    persistSnapshot({ pausedSinceMs: null })
  }

  function handleFinishNow() {
    // Finaliza manualmente antes del target
    setPhase('finished')
  }

  async function handleSave(wantsBreak: boolean) {
    if (saving) return
    const endedAt = new Date().toISOString()
    const startedAt =
      startedAtIsoRef.current ?? new Date(Date.now() - displayMs).toISOString()
    const effectiveMins =
      targetMs !== null && displayMs >= targetMs
        ? Math.round(targetMs / 60000)
        : Math.round(displayMs / 60000)

    if (effectiveMins < SESSION_MIN_MINUTES) {
      // descarta silenciosamente
      onClose()
      return
    }

    const ep = endPage.trim() ? parseInt(endPage, 10) : null
    const validEndPage =
      ep !== null && !isNaN(ep) && ep >= 0 ? ep : null

    setSaving(true)
    try {
      await onFinish({
        durationMins: effectiveMins,
        startedAt,
        endedAt,
        endPage: validEndPage,
        note: note.trim() || null,
        wantsBreak,
      })
      writeTimerSnapshot(null)
    } finally {
      setSaving(false)
    }

    if (wantsBreak) {
      setPhase('breaking')
    } else {
      onClose()
    }
  }

  function handleDiscard() {
    writeTimerSnapshot(null)
    onClose()
  }

  // Render helpers
  const progress =
    targetMs !== null ? Math.min(1, displayMs / targetMs) : null

  const displaySecs =
    targetMs !== null
      ? Math.max(0, Math.floor((targetMs - displayMs) / 1000))
      : Math.floor(displayMs / 1000)

  const isFinalMinute = targetMs !== null && displaySecs <= 60 && displaySecs > 0
  const isHalfway =
    targetMs !== null && progress !== null && progress >= 0.5 && progress < 0.52

  const presetLabel = mode ? POMODORO_LABELS[mode.preset].label : ''

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          style={{
            background: 'rgba(76, 10, 31, 0.65)',
            backdropFilter: 'blur(14px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="reading-glass-strong rounded-3xl w-full max-w-md p-6 md:p-8 relative"
          >
            {/* Close X */}
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl text-rose-700 hover:bg-rose-100/60"
            >
              ✕
            </button>

            {/* Mute toggle */}
            <button
              onClick={toggleMute}
              aria-label={muted ? 'Activar sonido' : 'Silenciar'}
              title={muted ? 'Activar sonido' : 'Silenciar'}
              className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center rounded-xl text-rose-700 hover:bg-rose-100/60 text-lg"
            >
              {muted ? '🔕' : '🔔'}
            </button>

            {/* Flash overlay dorado cuando termina */}
            <AnimatePresence>
              {flash && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.9 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                  className="pointer-events-none absolute inset-0 rounded-3xl reading-gold-shimmer"
                  style={{ mixBlendMode: 'overlay' }}
                />
              )}
            </AnimatePresence>

            {/* Confetti */}
            <AnimatePresence>
              {confetti.map((p) => (
                <ConfettiBurst key={p.id} emoji={p.emoji} vx={p.vx} vy={p.vy} />
              ))}
            </AnimatePresence>

            {/* Break mode */}
            {phase === 'breaking' ? (
              <div className="text-center py-8">
                <p className="text-xs uppercase tracking-widest reading-ink-faded mb-2">
                  {TIMER_MESSAGES.breakTitle}
                </p>
                <h2
                  className="text-4xl font-bold reading-ink-text mb-3"
                  style={{ fontFamily: 'var(--font-playfair), serif' }}
                >
                  {formatMMSS(breakRemainingMs / 1000)}
                </h2>
                <p className="reading-ink-soft-text italic text-sm">
                  {TIMER_MESSAGES.breakHint}
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-4 py-2 rounded-xl text-xs font-bold reading-link"
                  style={{ border: '1px solid var(--reading-border)' }}
                >
                  Saltar descanso
                </button>
              </div>
            ) : phase === 'finished' ? (
              // Formulario de cierre
              <div>
                <p className="text-xs uppercase tracking-widest reading-ink-faded mb-1">
                  {TIMER_MESSAGES.completeTitle}
                </p>
                <h2
                  className="text-2xl font-bold reading-ink-text mb-1"
                  style={{ fontFamily: 'var(--font-playfair), serif' }}
                >
                  {TIMER_MESSAGES.completeBody}
                </h2>
                {book && (
                  <p className="text-xs reading-ink-soft-text italic mb-4">
                    {book.title}
                  </p>
                )}
                <label className="block mb-3">
                  <span className="block text-[10px] font-bold uppercase tracking-widest mb-1 reading-ink-soft-text">
                    Página
                  </span>
                  <input
                    type="number"
                    value={endPage}
                    onChange={(e) => setEndPage(e.target.value)}
                    min={0}
                    max={book?.pages ?? undefined}
                    className="w-full reading-glass rounded-xl px-3 py-2 text-lg font-bold reading-ink-text focus:outline-none"
                    autoFocus
                  />
                </label>
                <label className="block mb-4">
                  <span className="block text-[10px] font-bold uppercase tracking-widest mb-1 reading-ink-soft-text">
                    Nota (opcional)
                  </span>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    maxLength={500}
                    placeholder="cap 3, antes de dormir…"
                    className="w-full reading-glass rounded-xl px-3 py-2 text-sm reading-ink-text placeholder:opacity-40 focus:outline-none resize-none"
                  />
                </label>
                <div className="flex flex-col gap-2">
                  {/* El break de 5 min se ofrece en cualquier preset salvo
                      "libre" (stopwatch): si no había meta tampoco hay sentido
                      de descansar "el bloque". */}
                  {mode?.preset !== 'libre' && (
                    <motion.button
                      onClick={() => handleSave(true)}
                      disabled={saving}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="py-3 rounded-2xl text-sm font-bold disabled:opacity-50"
                      style={{
                        background: 'rgba(132, 169, 140, 0.18)',
                        color: 'var(--reading-sage)',
                        border: '1px solid var(--reading-sage)',
                      }}
                    >
                      {TIMER_MESSAGES.saveAndContinue}
                    </motion.button>
                  )}
                  <motion.button
                    onClick={() => handleSave(false)}
                    disabled={saving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="py-3 rounded-2xl text-sm font-bold text-white shimmer-btn disabled:opacity-50"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--reading-accent), var(--reading-accent-deep))',
                      boxShadow: '0 4px 18px rgba(225, 29, 72, 0.35)',
                    }}
                  >
                    {saving ? '...' : TIMER_MESSAGES.saveAndClose}
                  </motion.button>
                  <button
                    onClick={handleDiscard}
                    disabled={saving}
                    className="py-2 text-xs reading-ink-soft-text hover:opacity-70"
                  >
                    descartar sesión
                  </button>
                </div>
              </div>
            ) : (
              // Ready / running / paused
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest reading-ink-faded">
                  {presetLabel}
                </p>
                {book && (
                  <div className="mt-3 flex justify-center">
                    <BookCover
                      title={book.title}
                      author={book.author}
                      coverUrl={book.coverUrl}
                      size="sm"
                    />
                  </div>
                )}
                {book && (
                  <p
                    className="mt-2 text-sm reading-ink-soft-text italic"
                    style={{ fontFamily: 'var(--font-playfair), serif' }}
                  >
                    {book.title}
                  </p>
                )}

                {/* SVG circle */}
                <div className="relative mx-auto mt-4 w-[260px] h-[260px]">
                  <svg
                    viewBox="0 0 260 260"
                    className="absolute inset-0 -rotate-90"
                  >
                    <circle
                      cx="130"
                      cy="130"
                      r={RADIUS}
                      fill="none"
                      stroke="rgba(251, 207, 232, 0.45)"
                      strokeWidth="6"
                    />
                    {progress !== null && (
                      <circle
                        cx="130"
                        cy="130"
                        r={RADIUS}
                        fill="none"
                        stroke={
                          isFinalMinute
                            ? 'var(--reading-accent)'
                            : 'var(--reading-gold)'
                        }
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={CIRC}
                        strokeDashoffset={CIRC * (1 - progress)}
                        style={{ transition: 'stroke-dashoffset 0.25s linear' }}
                      />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-5xl md:text-6xl font-bold reading-ink-text tabular-nums"
                      style={{ fontFamily: 'var(--font-playfair), serif' }}
                    >
                      {formatMMSS(displaySecs)}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-sm reading-ink-soft-text italic min-h-[1.4em]">
                  {phase === 'ready' && TIMER_MESSAGES.startHint}
                  {phase === 'running' && isFinalMinute && TIMER_MESSAGES.finalMinute}
                  {phase === 'running' && isHalfway && TIMER_MESSAGES.halfway}
                </p>

                {/* Controls */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {phase === 'ready' && (
                    <motion.button
                      onClick={handleStart}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="px-8 py-3 rounded-2xl text-sm font-bold text-white shimmer-btn"
                      style={{
                        background:
                          'linear-gradient(135deg, var(--reading-accent), var(--reading-accent-deep))',
                        boxShadow: '0 4px 18px rgba(225, 29, 72, 0.35)',
                      }}
                    >
                      {TIMER_MESSAGES.startedLabel}
                    </motion.button>
                  )}
                  {phase === 'running' && (
                    <>
                      <button
                        onClick={handlePause}
                        className="px-4 py-2 rounded-xl text-sm font-bold reading-link"
                        style={{ border: '1px solid var(--reading-border)' }}
                      >
                        {TIMER_MESSAGES.pauseLabel}
                      </button>
                      <button
                        onClick={handleFinishNow}
                        className="px-4 py-2 rounded-xl text-sm font-bold reading-link"
                        style={{ border: '1px solid var(--reading-border)' }}
                      >
                        {TIMER_MESSAGES.finishNow}
                      </button>
                    </>
                  )}
                  {phase === 'paused' && (
                    <>
                      <motion.button
                        onClick={handleResume}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="px-6 py-2 rounded-xl text-sm font-bold text-white shimmer-btn"
                        style={{
                          background:
                            'linear-gradient(135deg, var(--reading-accent), var(--reading-accent-deep))',
                        }}
                      >
                        {TIMER_MESSAGES.resumeLabel}
                      </motion.button>
                      <button
                        onClick={handleFinishNow}
                        className="px-4 py-2 rounded-xl text-sm font-bold reading-link"
                        style={{ border: '1px solid var(--reading-border)' }}
                      >
                        {TIMER_MESSAGES.finishNow}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
