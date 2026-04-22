'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BookshelfGrid from './BookshelfGrid'
import BookForm from './BookForm'
import { BataLibrarian, BataSleepy } from '@/components/BataEu'
import { BOOK_STATUS, type BookStatus } from '@/lib/lectura/readingPalette'
import { EMPTY_STATES, BUTTON_LABELS } from '@/lib/lectura/readingConfig'
import type { BookData } from '@/lib/lectura/types'

type ViewMode = 'grid' | 'shelf'
type StatusFilter = 'todos' | BookStatus

export default function BibliotecaClient() {
  const [books, setBooks] = useState<BookData[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<ViewMode>('grid')
  const [filter, setFilter] = useState<StatusFilter>('todos')
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    let alive = true
    fetch('/api/lectura/books')
      .then((r) => r.json())
      .then((data: BookData[]) => {
        if (alive) {
          setBooks(data)
          setLoading(false)
        }
      })
      .catch(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const filteredBooks =
    filter === 'todos' ? books : books.filter((b) => b.status === filter)

  function handleCreated(book: BookData) {
    setBooks((prev) => [book, ...prev])
    setFormOpen(false)
  }

  return (
    <div className="py-6 md:py-10">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex items-end gap-4 md:gap-6 flex-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="w-24 md:w-36 flex-shrink-0 hidden sm:block"
          >
            <BataLibrarian />
          </motion.div>
          <div>
            <h1
              className="text-4xl md:text-5xl font-bold reading-ink-text"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              Tu biblioteca
            </h1>
            <p className="mt-1 text-sm reading-ink-soft-text italic">
              {books.length === 0
                ? 'Empecemos el estante.'
                : `${books.length} libro${books.length === 1 ? '' : 's'} en el estante.`}
            </p>
          </div>
        </div>

        <motion.button
          onClick={() => setFormOpen(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-3 rounded-2xl font-bold text-sm shimmer-btn whitespace-nowrap"
          style={{
            background:
              'linear-gradient(135deg, var(--reading-accent), var(--reading-accent-deep))',
            color: 'white',
            boxShadow: '0 6px 20px rgba(225,29,72,0.35)',
          }}
        >
          + {BUTTON_LABELS.addBook}
        </motion.button>
      </div>

      {/* Filtros + view toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label="Todos"
            active={filter === 'todos'}
            onClick={() => setFilter('todos')}
          />
          {(Object.keys(BOOK_STATUS) as BookStatus[]).map((s) => (
            <FilterChip
              key={s}
              label={BOOK_STATUS[s].label}
              color={BOOK_STATUS[s].color}
              active={filter === s}
              onClick={() => setFilter(s)}
            />
          ))}
        </div>

        <div
          className="flex rounded-full p-1 gap-1"
          style={{
            background: 'rgba(255, 241, 244, 0.7)',
            border: '1px solid var(--reading-border)',
          }}
        >
          {(['grid', 'shelf'] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="relative px-4 py-1.5 text-xs font-bold rounded-full transition-colors"
              style={{ color: mode === m ? 'white' : 'var(--reading-ink-soft)' }}
            >
              {mode === m && (
                <motion.div
                  layoutId="readingViewMode"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--reading-accent), var(--reading-accent-deep))',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {m === 'grid' ? 'Grilla' : 'Estantería'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="py-16 text-center reading-ink-soft-text italic">
          Abriendo cajitas…
        </p>
      ) : filteredBooks.length === 0 ? (
        <EmptyState
          title={
            filter === 'todos'
              ? EMPTY_STATES.libraryEmpty.title
              : `Nada en "${BOOK_STATUS[filter as BookStatus].label}"`
          }
          body={
            filter === 'todos'
              ? EMPTY_STATES.libraryEmpty.body
              : 'Probá otro filtro o agregá un libro nuevo.'
          }
        />
      ) : (
        <BookshelfGrid books={filteredBooks} mode={mode} />
      )}

      {/* Modal de form */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-16 md:pt-20"
            style={{
              background: 'rgba(76, 10, 31, 0.45)',
              backdropFilter: 'blur(6px)',
            }}
            onClick={() => setFormOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="reading-glass-strong rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 md:p-8"
            >
              <h2
                className="text-2xl font-bold reading-ink-text mb-5"
                style={{ fontFamily: 'var(--font-playfair), serif' }}
              >
                Nuevo libro
              </h2>
              <BookForm
                onSuccess={handleCreated}
                onCancel={() => setFormOpen(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FilterChip({
  label,
  active,
  color,
  onClick,
}: {
  label: string
  active: boolean
  color?: string
  onClick: () => void
}) {
  const primary = color ?? 'var(--reading-gold)'
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="px-3 py-1.5 text-xs font-bold rounded-full transition-colors"
      style={
        active
          ? { background: primary, color: 'white', boxShadow: `0 3px 10px ${primary}44` }
          : {
              background: 'rgba(255, 241, 244, 0.5)',
              color: 'var(--reading-ink-soft)',
              border: '1px solid var(--reading-border)',
            }
      }
    >
      {label}
    </motion.button>
  )
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="py-16 flex flex-col items-center text-center">
      <div className="w-40 md:w-52 mb-3">
        <BataSleepy />
      </div>
      <h3
        className="text-xl font-bold reading-ink-text"
        style={{ fontFamily: 'var(--font-playfair), serif' }}
      >
        {title}
      </h3>
      <p className="mt-1 text-sm reading-ink-soft-text italic max-w-sm">{body}</p>
    </div>
  )
}
