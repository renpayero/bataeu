'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SessionCard from './SessionCard'
import SessionEditModal from './SessionEditModal'
import TimerLauncher from './TimerLauncher'
import { BataZen } from '@/components/BataEu'
import { SESSIONS_PAGE, READING_TIMEZONE } from '@/lib/lectura/readingConfig'
import type {
  ReadingSessionData,
  SessionStats,
  BookData,
} from '@/lib/lectura/types'

type RangeFilter = '7' | '30' | 'all'
type BookFilter = 'all' | number

function dayHeader(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  const raw = dt.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: READING_TIMEZONE,
  })
  // solo capitalizar primera letra
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}

function dayWord(n: number) {
  return n === 1 ? 'día' : 'días'
}

function sessionsWord(n: number) {
  return n === 1 ? 'sesión' : 'sesiones'
}

function toDayKey(iso: string): string {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: READING_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

export default function SessionsClient() {
  const [stats, setStats] = useState<SessionStats | null>(null)
  const [sessions, setSessions] = useState<ReadingSessionData[]>([])
  const [books, setBooks] = useState<BookData[]>([])
  const [range, setRange] = useState<RangeFilter>('7')
  const [bookFilter, setBookFilter] = useState<BookFilter>('all')
  const [editing, setEditing] = useState<ReadingSessionData | null>(null)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    const now = new Date()
    const from = new Date(now)
    if (range === '7') from.setDate(from.getDate() - 7)
    else if (range === '30') from.setDate(from.getDate() - 30)

    const qs = new URLSearchParams()
    if (range !== 'all') qs.set('from', from.toISOString())
    if (bookFilter !== 'all') qs.set('bookId', String(bookFilter))
    qs.set('limit', '500')

    try {
      const [sessRes, statsRes, booksRes] = await Promise.all([
        fetch(`/api/lectura/sessions?${qs.toString()}`).then((r) => r.json()),
        fetch('/api/lectura/sessions/stats').then((r) => r.json()),
        fetch('/api/lectura/books').then((r) => r.json()),
      ])
      setSessions(sessRes as ReadingSessionData[])
      setStats(statsRes as SessionStats)
      setBooks(booksRes as BookData[])
    } finally {
      setLoading(false)
    }
  }, [range, bookFilter])

  useEffect(() => {
    reload()
  }, [reload])

  const grouped = useMemo(() => {
    const map = new Map<string, ReadingSessionData[]>()
    for (const s of sessions) {
      const key = toDayKey(s.startedAt)
      const arr = map.get(key) ?? []
      arr.push(s)
      map.set(key, arr)
    }
    return [...map.entries()].sort(([a], [b]) => (a < b ? 1 : -1))
  }, [sessions])

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar esta sesión?')) return
    await fetch(`/api/lectura/sessions/${id}`, { method: 'DELETE' })
    setSessions((prev) => prev.filter((s) => s.id !== id))
    // stats se refresca cuando vuelve a cargar
    fetch('/api/lectura/sessions/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
  }

  return (
    <div className="py-6 md:py-10">
      <header className="mb-6 flex items-end gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          className="w-24 md:w-36 flex-shrink-0 hidden sm:block"
        >
          <BataZen />
        </motion.div>
        <div>
          <h1
            className="text-4xl md:text-5xl font-bold reading-ink-text"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            {SESSIONS_PAGE.title}
          </h1>
          <p className="mt-1 text-sm reading-ink-soft-text italic">
            {SESSIONS_PAGE.subtitle}
          </p>
        </div>
      </header>

      {/* Stats tiles */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatTile
            label="Hoy"
            value={`${stats.today.mins}′`}
            sub={`${stats.today.sessions} ${sessionsWord(stats.today.sessions)}`}
          />
          <StatTile
            label="Esta semana"
            value={`${stats.thisWeek.mins}′`}
            sub={`${stats.thisWeek.days} ${dayWord(stats.thisWeek.days)}`}
          />
          <StatTile
            label="Este mes"
            value={`${stats.thisMonth.mins}′`}
            sub={`${stats.thisMonth.days} ${dayWord(stats.thisMonth.days)}`}
          />
          <StatTile
            label="Racha"
            value={`${stats.currentStreak}`}
            sub={`récord ${stats.longestStreak}`}
            emoji="🔥"
          />
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex gap-2">
          {(['7', '30', 'all'] as RangeFilter[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-3 py-1.5 text-xs font-bold rounded-full transition-colors"
              style={
                range === r
                  ? {
                      background:
                        'linear-gradient(135deg, var(--reading-accent), var(--reading-accent-deep))',
                      color: 'white',
                      boxShadow: '0 3px 10px rgba(225, 29, 72, 0.3)',
                    }
                  : {
                      background: 'rgba(255, 241, 244, 0.6)',
                      color: 'var(--reading-ink-soft)',
                      border: '1px solid var(--reading-border)',
                    }
              }
            >
              {r === '7' ? '7 días' : r === '30' ? '30 días' : 'todo'}
            </button>
          ))}
        </div>

        <select
          value={String(bookFilter)}
          onChange={(e) =>
            setBookFilter(
              e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10)
            )
          }
          className="text-xs reading-glass rounded-full px-3 py-1.5 reading-ink-text"
        >
          <option value="all">Todos los libros</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}
            </option>
          ))}
        </select>

        <div className="ml-auto">
          <TimerLauncher
            label={SESSIONS_PAGE.startFreeLabel}
            onSessionSaved={reload}
          />
        </div>
      </div>

      {loading ? (
        <p className="py-16 text-center reading-ink-soft-text italic">
          Buscando sesiones…
        </p>
      ) : sessions.length === 0 ? (
        <div className="py-16 text-center">
          <div className="text-5xl mb-3 opacity-60">⏱️</div>
          <h3
            className="text-xl font-bold reading-ink-text"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            {SESSIONS_PAGE.emptyTitle}
          </h3>
          <p className="mt-1 text-sm reading-ink-soft-text italic">
            {SESSIONS_PAGE.emptyBody}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([dayKey, list]) => {
            const totalMins = list.reduce((acc, s) => acc + s.durationMins, 0)
            return (
              <section key={dayKey}>
                <header className="flex items-baseline justify-between mb-2 px-1">
                  <h3
                    className="font-bold reading-ink-text text-base"
                    style={{ fontFamily: 'var(--font-playfair), serif' }}
                  >
                    {dayHeader(dayKey)}
                  </h3>
                  <span className="text-xs reading-ink-faded">
                    {list.length} {list.length === 1 ? 'sesión' : 'sesiones'} ·{' '}
                    {totalMins} min
                  </span>
                </header>
                <div className="space-y-2">
                  <AnimatePresence>
                    {list.map((s) => (
                      <SessionCard
                        key={s.id}
                        session={s}
                        onEdit={() => setEditing(s)}
                        onDelete={() => handleDelete(s.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )
          })}
        </div>
      )}

      <SessionEditModal
        session={editing}
        onClose={() => setEditing(null)}
        onSaved={(updated) => {
          setSessions((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s))
          )
          setEditing(null)
        }}
      />
    </div>
  )
}

function StatTile({
  label,
  value,
  sub,
  emoji,
}: {
  label: string
  value: string
  sub: string
  emoji?: string
}) {
  return (
    <div className="reading-glass rounded-2xl p-4">
      <p className="text-[10px] uppercase tracking-widest reading-ink-faded mb-1">
        {label}
      </p>
      <div className="flex items-baseline gap-1.5">
        <span
          className="text-3xl font-bold reading-ink-text"
          style={{ fontFamily: 'var(--font-playfair), serif' }}
        >
          {value}
        </span>
        {emoji && <span className="text-xl">{emoji}</span>}
      </div>
      <p className="text-[11px] reading-ink-soft-text">{sub}</p>
    </div>
  )
}
