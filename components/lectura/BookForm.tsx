'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GoogleBooksSearch from './GoogleBooksSearch'
import BookCover from './BookCover'
import {
  BOOK_STATUS,
  BOOK_FORMATS,
  type BookStatus,
  type BookFormat,
} from '@/lib/lectura/readingPalette'
import type { BookData, BookInput } from '@/lib/lectura/types'
import type { GoogleBooksResult } from '@/lib/lectura/googleBooks'

interface Props {
  bookId?: number
  initial?: Partial<BookData>
  onSuccess: (book: BookData) => void
  onCancel?: () => void
}

export default function BookForm({ bookId, initial, onSuccess, onCancel }: Props) {
  const isEdit = bookId !== undefined
  const [title, setTitle] = useState(initial?.title ?? '')
  const [author, setAuthor] = useState(initial?.author ?? '')
  const [coverUrl, setCoverUrl] = useState<string | null>(initial?.coverUrl ?? null)
  const [isbn, setIsbn] = useState(initial?.isbn ?? '')
  const [pages, setPages] = useState<string>(
    initial?.pages ? String(initial.pages) : ''
  )
  const [year, setYear] = useState<string>(
    initial?.year ? String(initial.year) : ''
  )
  const [genre, setGenre] = useState(initial?.genre ?? '')
  const [format, setFormat] = useState<BookFormat>(
    (initial?.format as BookFormat) ?? 'fisico'
  )
  const [status, setStatus] = useState<BookStatus>(
    (initial?.status as BookStatus) ?? 'quiero'
  )
  const [priority, setPriority] = useState<number>(initial?.priority ?? 3)
  const [location, setLocation] = useState(initial?.location ?? '')
  const [googleBooksId, setGoogleBooksId] = useState<string | null>(
    initial?.googleBooksId ?? null
  )

  const [searchOpen, setSearchOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleGoogleSelect(r: GoogleBooksResult) {
    setTitle(r.title)
    setAuthor(r.authors.join(', ') || author)
    if (r.coverUrl) setCoverUrl(r.coverUrl)
    if (r.isbn) setIsbn(r.isbn)
    if (r.pages) setPages(String(r.pages))
    if (r.year) setYear(String(r.year))
    if (r.genre) setGenre(r.genre)
    setGoogleBooksId(r.googleBooksId)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !author.trim()) return
    setLoading(true)
    setError(null)

    const payload: BookInput = {
      title: title.trim(),
      author: author.trim(),
      coverUrl: coverUrl || null,
      isbn: isbn || null,
      pages: pages ? parseInt(pages, 10) : null,
      year: year ? parseInt(year, 10) : null,
      genre: genre || null,
      format,
      status,
      priority,
      location: location || null,
      googleBooksId,
    }

    try {
      const url = isEdit ? `/api/lectura/books/${bookId}` : '/api/lectura/books'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        setError('No se pudo guardar. Probá de nuevo.')
        return
      }
      const book: BookData = await res.json()
      onSuccess(book)
    } catch {
      setError('No se pudo guardar. Probá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Preview + buscar */}
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            <BookCover
              title={title || 'Título'}
              author={author || 'Autor'}
              coverUrl={coverUrl}
              size="sm"
            />
          </div>
          <div className="flex-1 space-y-2">
            <motion.button
              type="button"
              onClick={() => setSearchOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full px-4 py-2.5 rounded-2xl text-sm font-bold shimmer-btn"
              style={{
                background:
                  'linear-gradient(135deg, var(--reading-accent), var(--reading-accent-deep))',
                color: 'white',
                boxShadow: '0 4px 14px rgba(225, 29, 72, 0.3)',
              }}
            >
              🔎 Buscar online
            </motion.button>
            <input
              type="url"
              value={coverUrl ?? ''}
              onChange={(e) => setCoverUrl(e.target.value || null)}
              placeholder="URL de portada (opcional)"
              className="w-full reading-glass rounded-xl px-3 py-2 text-xs reading-ink-text placeholder:opacity-40 focus:outline-none"
            />
          </div>
        </div>

        <Field label="Título *">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            className="reading-input"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          />
        </Field>
        <Field label="Autor/a *">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            maxLength={200}
            className="reading-input"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Páginas">
            <input
              type="number"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              className="reading-input"
              min={1}
            />
          </Field>
          <Field label="Año">
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="reading-input"
            />
          </Field>
        </div>

        <Field label="Género">
          <input
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="reading-input"
            placeholder="Novela, poesía, ensayo…"
          />
        </Field>

        <Field label="Formato">
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(BOOK_FORMATS) as BookFormat[]).map((f) => (
              <motion.button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                whileTap={{ scale: 0.93 }}
                className="py-2 rounded-xl text-xs font-bold transition-all"
                style={
                  format === f
                    ? {
                        background:
                          'linear-gradient(135deg, rgba(225,29,72,0.9), rgba(159,18,57,0.85))',
                        color: 'white',
                        boxShadow: '0 3px 10px rgba(225,29,72,0.35)',
                      }
                    : {
                        background: 'rgba(255, 241, 244, 0.6)',
                        color: 'var(--reading-ink-soft)',
                        border: '1px solid rgba(251, 207, 232, 0.5)',
                      }
                }
              >
                <div className="text-base">{BOOK_FORMATS[f].icon}</div>
                <div className="text-[10px] mt-0.5">{BOOK_FORMATS[f].label}</div>
              </motion.button>
            ))}
          </div>
        </Field>

        <Field label="Estado">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(BOOK_STATUS) as BookStatus[]).map((s) => (
              <motion.button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                whileTap={{ scale: 0.93 }}
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                style={
                  status === s
                    ? {
                        background: BOOK_STATUS[s].color,
                        color: 'white',
                        boxShadow: `0 3px 10px ${BOOK_STATUS[s].color}55`,
                      }
                    : {
                        background: BOOK_STATUS[s].bg,
                        color: BOOK_STATUS[s].color,
                        border: `1px solid ${BOOK_STATUS[s].color}44`,
                      }
                }
              >
                {BOOK_STATUS[s].label}
              </motion.button>
            ))}
          </div>
        </Field>

        <Field label="Prioridad">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <motion.button
                key={n}
                type="button"
                onClick={() => setPriority(n)}
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.18 }}
                className="text-2xl"
                style={{
                  color:
                    n <= priority
                      ? 'var(--reading-gold)'
                      : 'rgba(251, 207, 232, 0.6)',
                }}
              >
                ★
              </motion.button>
            ))}
          </div>
        </Field>

        <Field label="Ubicación (físico)">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="reading-input"
            placeholder="mesa de luz, estante del living…"
          />
        </Field>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-red-500 font-semibold"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex gap-2 pt-2">
          <motion.button
            type="submit"
            disabled={loading || !title.trim() || !author.trim()}
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
            {loading ? '...' : isEdit ? 'Guardar cambios' : 'Agregar a la biblioteca'}
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

      <GoogleBooksSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={handleGoogleSelect}
      />

      <style jsx>{`
        .reading-input {
          width: 100%;
          background: rgba(255, 241, 244, 0.6);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(251, 207, 232, 0.5);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 14px;
          color: var(--reading-ink);
          outline: none;
          transition: all 0.2s ease;
        }
        .reading-input:focus {
          border-color: var(--reading-gold);
          box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.15);
        }
        .reading-input::placeholder {
          color: var(--reading-ink-faded);
          opacity: 0.6;
        }
      `}</style>
    </>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span
        className="block text-xs font-bold uppercase tracking-wider mb-1.5 reading-ink-soft-text"
        style={{ letterSpacing: '0.12em' }}
      >
        {label}
      </span>
      {children}
    </label>
  )
}
