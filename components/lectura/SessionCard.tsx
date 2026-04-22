'use client'

import { motion } from 'framer-motion'
import BookCover from './BookCover'
import { POMODORO_LABELS } from '@/lib/lectura/readingConfig'
import type { ReadingSessionData } from '@/lib/lectura/types'

interface Props {
  session: ReadingSessionData
  onEdit?: () => void
  onDelete?: () => void
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Argentina/Buenos_Aires',
    })
  } catch {
    return ''
  }
}

export default function SessionCard({ session, onEdit, onDelete }: Props) {
  const preset = POMODORO_LABELS[session.pomodoroType]
  const startTime = formatTime(session.startedAt)
  const pagesDelta =
    session.startPage !== null && session.endPage !== null
      ? `pág ${session.startPage} → ${session.endPage}`
      : session.pagesRead
        ? `${session.pagesRead} págs`
        : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="reading-glass rounded-2xl p-4 flex gap-3 items-start group relative"
    >
      <div className="flex-shrink-0">
        {session.book ? (
          <BookCover
            title={session.book.title}
            author={session.book.author}
            coverUrl={session.book.coverUrl}
            size="sm"
          />
        ) : (
          <div
            className="w-[72px] h-[108px] rounded flex items-center justify-center text-2xl"
            style={{
              background: 'rgba(251, 207, 232, 0.4)',
              border: '1px dashed var(--reading-border)',
            }}
            aria-hidden
          >
            ✨
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="font-bold reading-ink-text text-sm truncate"
          style={{ fontFamily: 'var(--font-playfair), serif' }}
        >
          {session.book?.title ?? 'Sesión libre'}
        </p>
        {session.book && (
          <p className="text-xs reading-ink-soft-text italic truncate">
            {session.book.author}
          </p>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] reading-ink-soft-text">
          <span className="font-bold reading-ink-text">
            {session.durationMins} min
          </span>
          <span className="opacity-40">·</span>
          <span>{preset.label}</span>
          {startTime && (
            <>
              <span className="opacity-40">·</span>
              <span>{startTime}</span>
            </>
          )}
          {pagesDelta && (
            <>
              <span className="opacity-40">·</span>
              <span>{pagesDelta}</span>
            </>
          )}
        </div>
        {session.note && (
          <p className="mt-1.5 text-xs reading-ink-soft-text italic line-clamp-2">
            “{session.note}”
          </p>
        )}
      </div>

      {(onEdit || onDelete) && (
        <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={onEdit}
              aria-label="Editar"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-xs reading-ink-soft-text hover:text-rose-700"
            >
              ✎
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              aria-label="Eliminar"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-xs reading-ink-soft-text hover:text-red-500"
            >
              🗑
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
