'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SESSION_MIN_MINUTES,
  SESSION_MAX_MINUTES,
} from '@/lib/lectura/readingConfig'
import type { ReadingSessionData } from '@/lib/lectura/types'

interface Props {
  session: ReadingSessionData | null
  onClose: () => void
  onSaved: (updated: ReadingSessionData) => void
}

export default function SessionEditModal({ session, onClose, onSaved }: Props) {
  const [duration, setDuration] = useState('')
  const [pages, setPages] = useState('')
  const [endPage, setEndPage] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) return
    setDuration(String(session.durationMins))
    setPages(session.pagesRead != null ? String(session.pagesRead) : '')
    setEndPage(session.endPage != null ? String(session.endPage) : '')
    setNote(session.note ?? '')
    setError(null)
  }, [session])

  async function handleSave() {
    if (!session || saving) return
    const d = parseInt(duration, 10)
    if (isNaN(d) || d < SESSION_MIN_MINUTES || d > SESSION_MAX_MINUTES) {
      setError(
        `Duración fuera de rango (${SESSION_MIN_MINUTES}-${SESSION_MAX_MINUTES} min)`
      )
      return
    }
    setSaving(true)
    setError(null)
    try {
      const payload: Record<string, unknown> = { durationMins: d }
      payload.pagesRead = pages.trim() ? parseInt(pages, 10) : null
      payload.endPage = endPage.trim() ? parseInt(endPage, 10) : null
      payload.note = note.trim() ? note.trim() : null

      const res = await fetch(`/api/lectura/sessions/${session.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        setError('No se pudo guardar.')
        return
      }
      const updated: ReadingSessionData = await res.json()
      onSaved(updated)
    } catch {
      setError('Error de red.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {session && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-16 md:pt-20"
          style={{
            background: 'rgba(76, 10, 31, 0.45)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="reading-glass-strong rounded-3xl w-full max-w-md p-6 md:p-8"
          >
            <h2
              className="text-2xl font-bold reading-ink-text mb-1"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              Editar sesión
            </h2>
            <p className="text-xs reading-ink-soft-text italic mb-5">
              {session.book?.title ?? 'Sesión libre'}
            </p>

            <div className="space-y-3">
              <label className="block">
                <span className="block text-[10px] font-bold uppercase tracking-widest mb-1 reading-ink-soft-text">
                  Duración (min)
                </span>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min={SESSION_MIN_MINUTES}
                  max={SESSION_MAX_MINUTES}
                  className="w-full reading-glass rounded-xl px-3 py-2 text-sm reading-ink-text focus:outline-none"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="block text-[10px] font-bold uppercase tracking-widest mb-1 reading-ink-soft-text">
                    Páginas leídas
                  </span>
                  <input
                    type="number"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    min={0}
                    className="w-full reading-glass rounded-xl px-3 py-2 text-sm reading-ink-text focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="block text-[10px] font-bold uppercase tracking-widest mb-1 reading-ink-soft-text">
                    Hasta página
                  </span>
                  <input
                    type="number"
                    value={endPage}
                    onChange={(e) => setEndPage(e.target.value)}
                    min={0}
                    className="w-full reading-glass rounded-xl px-3 py-2 text-sm reading-ink-text focus:outline-none"
                  />
                </label>
              </div>

              <label className="block">
                <span className="block text-[10px] font-bold uppercase tracking-widest mb-1 reading-ink-soft-text">
                  Nota
                </span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  maxLength={500}
                  className="w-full reading-glass rounded-xl px-3 py-2 text-sm reading-ink-text placeholder:opacity-40 focus:outline-none resize-none"
                />
              </label>
            </div>

            {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

            <div className="mt-5 flex gap-2">
              <motion.button
                onClick={handleSave}
                disabled={saving}
                whileTap={{ scale: 0.96 }}
                className="flex-1 py-2.5 rounded-2xl text-sm font-bold text-white disabled:opacity-50"
                style={{
                  background:
                    'linear-gradient(135deg, var(--reading-accent), var(--reading-accent-deep))',
                }}
              >
                {saving ? '...' : 'Guardar'}
              </motion.button>
              <button
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2.5 rounded-2xl text-sm font-bold reading-link"
                style={{ border: '1px solid var(--reading-border)' }}
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
