import { READING_TIMEZONE, SESSION_MIN_MINUTES } from './readingConfig'

interface SessionMin {
  startedAt: Date
  durationMins: number
  bookId: number | null
}

// YYYY-MM-DD en TZ del lector (Argentina)
export function toDayKey(d: Date, tz = READING_TIMEZONE): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

function prevDayKey(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() - 1)
  const yy = dt.getUTCFullYear()
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(dt.getUTCDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

// Días activos (hay sesión real válida con libro) en Set YYYY-MM-DD.
export function toActiveDays(sessions: SessionMin[]): Set<string> {
  const days = new Set<string>()
  for (const s of sessions) {
    if (s.durationMins < SESSION_MIN_MINUTES) continue
    if (s.bookId == null) continue // modo libre NO suma al streak
    days.add(toDayKey(s.startedAt))
  }
  return days
}

export function computeStreaks(sessions: SessionMin[]): {
  current: number
  longest: number
  hasSessionToday: boolean
} {
  const days = toActiveDays(sessions)
  const today = toDayKey(new Date())
  const yesterday = prevDayKey(today)
  const hasSessionToday = days.has(today)

  // Current streak: cursor desde hoy (o ayer si hoy aún no leyó)
  let cursor: string | null = hasSessionToday
    ? today
    : days.has(yesterday)
      ? yesterday
      : null
  let current = 0
  while (cursor && days.has(cursor)) {
    current++
    cursor = prevDayKey(cursor)
  }

  // Longest streak: recorrer días ordenados
  const sorted = [...days].sort()
  let longest = 0
  let run = 0
  let prev: string | null = null
  for (const k of sorted) {
    run = prev && prevDayKey(k) === prev ? run + 1 : 1
    if (run > longest) longest = run
    prev = k
  }

  return { current, longest, hasSessionToday }
}
