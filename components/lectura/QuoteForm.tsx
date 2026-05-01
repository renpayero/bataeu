'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MOOD_TAGS } from '@/lib/lectura/readingPalette'
import type { QuoteData } from '@/lib/lectura/types'

interface Props {
  defaultBookId?: number
  availableBooks: Array<{ id: number; title: string; author: string }>
  onSuccess: (quote: QuoteData) => void
  onCancel?: () => void
}

const SUGGESTED_TAGS = [
  'hermosa',
  'para recordar',
  'sobre el amor',
  'sobre la vida',
  'para tatuarme',
  'para mamá',
  'para mí',
  'dolida',
  ...MOOD_TAGS,
]

export default function QuoteForm({
  defaultBookId,
  availableBooks,
  onSuccess,
  onCancel,
}: Props) {
  const [bookId, setBookId] = useState<number | ''>(defaultBookId ?? '')
  const [text, setText] = useState('')
  const [page, setPage] = useState<string>('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleTag(t: string) {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
  }

  function addCustomTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault()
      const t = newTag.trim().toLowerCase()
      if (!tags.includes(t)) setTags((prev) => [...prev, t])
      setNewTag('')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (typeof bookId !== 'number') {
      setError('Elegí un libro.')
      return
    }
    if (!text.trim()) {
      setError('La frase no puede estar vacía.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/lectura/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          text: text.trim(),
          page: page ? parseInt(page, 10) : null,
          tags,
        }),
      })
      if (!res.ok) {
        setError('No se pudo guardar.')
        return
      }
      const q: QuoteData = await res.json()
      onSuccess(q)
    } catch {
      setError('No se pudo guardar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {availableBooks.length > 1 && (
        <label className="block">
          <span className="block text-xs font-bold uppercase tracking-wider mb-1.5 reading-ink-soft-text">
            Libro
          </span>
          <select
            value={bookId}
            onChange={(e) =>
              setBookId(e.target.value ? parseInt(e.target.value, 10) : '')
            }
            className="w-full reading-glass rounded-xl px-3 py-2.5 text-sm reading-ink-text focus:outline-none"
            style={{ background: 'rgba(255,241,244,0.75)' }}
          >
            <option value="">— Elegí un libro —</option>
            {availableBooks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} — {b.author}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="block">
        <span className="block text-xs font-bold uppercase tracking-wider mb-1.5 reading-ink-soft-text">
          La frase
        </span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          maxLength={1200}
          className="w-full reading-glass rounded-xl px-4 py-3 text-base reading-ink-text placeholder:opacity-40 focus:outline-none resize-none"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            fontStyle: 'italic',
          }}
          placeholder="Escribí la cita tal cual…"
          autoFocus
        />
        <span className="block mt-1 text-[10px] reading-ink-soft-text text-right">
          {text.length} / 1200
        </span>
      </label>

      <label className="block max-w-[140px]">
        <span className="block text-xs font-bold uppercase tracking-wider mb-1.5 reading-ink-soft-text">
          Página
        </span>
        <input
          type="number"
          inputMode="numeric"
          value={page}
          onChange={(e) => setPage(e.target.value)}
          className="w-full reading-glass rounded-xl px-3 py-2 text-sm reading-ink-text focus:outline-none"
          min={1}
        />
      </label>

      <div>
        <span className="block text-xs font-bold uppercase tracking-wider mb-2 reading-ink-soft-text">
          Tags
        </span>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <motion.button
              key={t}
              type="button"
              layout
              onClick={() => toggleTag(t)}
              className="px-3 py-1 text-xs rounded-full font-bold"
              style={{
                background: 'var(--reading-sage)',
                color: 'white',
                boxShadow: '0 3px 8px rgba(132, 169, 140, 0.35)',
              }}
              whileTap={{ scale: 0.93 }}
            >
              #{t} ✕
            </motion.button>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={addCustomTag}
            className="flex-1 reading-glass rounded-xl px-3 py-1.5 text-xs reading-ink-text focus:outline-none"
            placeholder="tag libre (enter)"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {SUGGESTED_TAGS.filter((t) => !tags.includes(t))
            .slice(0, 12)
            .map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTag(t)}
                className="px-2 py-0.5 text-[10px] rounded-full reading-link"
                style={{
                  background: 'rgba(255,241,244,0.5)',
                  border: '1px dashed var(--reading-border)',
                }}
              >
                + {t}
              </button>
            ))}
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500 font-semibold">{error}</p>
      )}

      <div className="flex gap-2 pt-2">
        <motion.button
          type="submit"
          disabled={loading || !text.trim()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 py-3 rounded-2xl font-bold text-sm disabled:opacity-50 shimmer-btn"
          style={{
            background:
              'linear-gradient(135deg, var(--reading-accent), var(--reading-accent-deep))',
            color: 'white',
            boxShadow: '0 4px 18px rgba(225, 29, 72, 0.35)',
          }}
        >
          {loading ? '...' : 'Guardar frase'}
        </motion.button>
        {onCancel && (
          <motion.button
            type="button"
            onClick={onCancel}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-3 rounded-2xl reading-ink-soft-text text-sm font-bold"
            style={{ border: '1px solid var(--reading-border)' }}
          >
            Cancelar
          </motion.button>
        )}
      </div>
    </form>
  )
}
