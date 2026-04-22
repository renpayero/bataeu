'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import BookCover from './BookCover'
import BookForm from './BookForm'
import QuoteForm from './QuoteForm'
import QuoteCard from './QuoteCard'
import TimerLauncher from './TimerLauncher'
import { BOOK_STATUS, BOOK_FORMATS } from '@/lib/lectura/readingPalette'
import { MILESTONE_MESSAGES, BUTTON_LABELS } from '@/lib/lectura/readingConfig'
import type { BookData, QuoteData } from '@/lib/lectura/types'

interface Props {
  bookId: number
}

const FINISH_CONFETTI = ['📖', '⭐', '✨', '🌟', '🕯️', '📜']

function ConfettiBurst({ emoji, vx, vy }: { emoji: string; vx: number; vy: number }) {
  return (
    <motion.div
      className="fixed pointer-events-none select-none text-3xl z-[100]"
      style={{ left: '50%', top: '50%' }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
      animate={{ x: vx, y: vy, opacity: 0, scale: 0.6, rotate: 540 }}
      transition={{ duration: 1.8, ease: 'easeOut' }}
    >
      {emoji}
    </motion.div>
  )
}

export default function BookDetail({ bookId }: Props) {
  const router = useRouter()
  const [book, setBook] = useState<BookData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [editing, setEditing] = useState(false)
  const [addingQuote, setAddingQuote] = useState(false)
  const [finishAnim, setFinishAnim] = useState(false)
  const [confetti, setConfetti] = useState<
    Array<{ id: number; emoji: string; vx: number; vy: number }>
  >([])
  const [milestone, setMilestone] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    fetch(`/api/lectura/books/${bookId}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true)
          return null
        }
        return r.json()
      })
      .then((data: BookData | null) => {
        if (!alive || !data) return
        setBook(data)
        setLoading(false)
      })
      .catch(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [bookId])

  function launchConfetti() {
    const parts = Array.from({ length: 18 }, (_, i) => ({
      id: Date.now() + i,
      emoji: FINISH_CONFETTI[Math.floor(Math.random() * FINISH_CONFETTI.length)],
      vx: (Math.random() - 0.5) * 480,
      vy: -(Math.random() * 280 + 120),
    }))
    setConfetti(parts)
    setTimeout(() => setConfetti([]), 2000)
  }

  async function updateStatus(newStatus: string) {
    if (!book) return
    const wasNotFinished = book.status !== 'terminado'
    const goingToFinished = newStatus === 'terminado'

    if (goingToFinished && wasNotFinished) {
      setFinishAnim(true)
      launchConfetti()
      setMilestone(MILESTONE_MESSAGES.bookFinished)
      setTimeout(() => setFinishAnim(false), 1000)
      setTimeout(() => setMilestone(null), 3500)
    }

    const payload: Record<string, unknown> = { status: newStatus }
    if (goingToFinished) payload.endDate = new Date().toISOString()
    if (newStatus === 'leyendo' && !book.startDate)
      payload.startDate = new Date().toISOString()

    const res = await fetch(`/api/lectura/books/${book.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const updated: BookData = await res.json()
      setBook(updated)
    }
  }

  async function handleDelete() {
    if (!book) return
    const ok = window.confirm(
      `¿Eliminar "${book.title}"? Se borran también sus frases.`
    )
    if (!ok) return
    await fetch(`/api/lectura/books/${book.id}`, { method: 'DELETE' })
    router.push('/lectura/biblioteca')
  }

  function handleEdited(updated: BookData) {
    setBook(updated)
    setEditing(false)
  }

  async function reloadBook() {
    const res = await fetch(`/api/lectura/books/${bookId}`)
    if (res.ok) {
      const data: BookData = await res.json()
      setBook(data)
    }
  }

  function handleQuoteCreated() {
    setAddingQuote(false)
    reloadBook()
  }

  async function handleQuoteDeleted(quoteId: number) {
    await fetch(`/api/lectura/quotes/${quoteId}`, { method: 'DELETE' })
    reloadBook()
  }

  if (loading) {
    return <p className="py-16 text-center reading-ink-soft-text italic">Abriendo el libro…</p>
  }

  if (notFound || !book) {
    return (
      <div className="py-16 text-center">
        <p className="text-xl reading-ink-text mb-3" style={{ fontFamily: 'var(--font-playfair), serif' }}>
          No encontramos este libro.
        </p>
        <Link href="/lectura/biblioteca" className="text-sm reading-ink-soft-text underline">
          Volver a la biblioteca
        </Link>
      </div>
    )
  }

  const status = BOOK_STATUS[book.status as keyof typeof BOOK_STATUS]
  const fmt = BOOK_FORMATS[book.format as keyof typeof BOOK_FORMATS]
  const quotes = (book.quotes as QuoteData[]) ?? []
  const progressPct =
    book.pages && book.currentPage
      ? Math.min(100, Math.round((book.currentPage / book.pages) * 100))
      : null

  return (
    <div className="py-6">
      <AnimatePresence>
        {confetti.map((p) => (
          <ConfettiBurst key={p.id} emoji={p.emoji} vx={p.vx} vy={p.vy} />
        ))}
      </AnimatePresence>

      <Link
        href="/lectura/biblioteca"
        className="inline-flex items-center gap-1 text-xs reading-link mb-6"
      >
        ← Biblioteca
      </Link>

      <div className="grid md:grid-cols-[280px_1fr] gap-8 md:gap-12 items-start">
        {/* Hero cover */}
        <div className="flex md:block justify-center">
          <motion.div
            animate={
              finishAnim
                ? { rotateY: [0, 360], scale: [1, 1.08, 1] }
                : { rotateY: 0, scale: 1 }
            }
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
          >
            <BookCover
              title={book.title}
              author={book.author}
              coverUrl={book.coverUrl}
              layoutId={`book-cover-${book.id}`}
              size="xl"
            />
          </motion.div>
        </div>

        <div>
          {fmt && (
            <p className="text-xs uppercase tracking-widest reading-ink-faded mb-2">
              {fmt.icon} {fmt.label}
              {book.year ? ` · ${book.year}` : ''}
              {book.pages ? ` · ${book.pages} págs.` : ''}
            </p>
          )}
          <h1
            className="text-3xl md:text-5xl font-bold reading-ink-text leading-tight"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            {book.title}
          </h1>
          <p className="mt-2 text-lg reading-ink-soft-text italic">
            por {book.author}
          </p>

          {book.series && (
            <p className="mt-1 text-xs reading-ink-faded">
              Saga: {book.series.name}
              {book.seriesOrder ? ` · #${book.seriesOrder}` : ''}
            </p>
          )}

          {/* Status badge */}
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: status?.bg,
                color: status?.color,
                border: `1px solid ${status?.color ?? '#999'}44`,
              }}
            >
              {status?.label ?? book.status}
            </span>
            {book.priority > 3 && (
              <div className="flex gap-0.5">
                {Array.from({ length: book.priority }).map((_, i) => (
                  <span key={i} style={{ color: 'var(--reading-gold)' }}>★</span>
                ))}
              </div>
            )}
            {book.genre && (
              <span className="text-xs reading-ink-soft-text italic">
                {book.genre}
              </span>
            )}
          </div>

          {/* Progreso */}
          {book.status === 'leyendo' && book.pages && (
            <div className="mt-5">
              <div className="flex justify-between text-xs reading-ink-soft-text mb-1.5">
                <span>Progreso</span>
                <span className="font-bold">
                  {book.currentPage ?? 0} / {book.pages} {progressPct !== null && `· ${progressPct}%`}
                </span>
              </div>
              <div
                className="h-3 rounded-full overflow-hidden"
                style={{ background: 'rgba(251, 207, 232, 0.35)' }}
              >
                {progressPct !== null && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="reading-gold-shimmer h-full"
                  />
                )}
              </div>
              <PageSlider book={book} onUpdate={setBook} />
            </div>
          )}

          {book.location && (
            <p className="mt-4 text-xs reading-ink-soft-text">
              <span className="opacity-60">📍</span> {book.location}
            </p>
          )}

          {/* Acciones */}
          <div className="mt-6 flex flex-wrap gap-2">
            {(book.status === 'leyendo' || book.status === 'pausado') && (
              <TimerLauncher book={book} onSessionSaved={reloadBook} />
            )}
            {book.status !== 'leyendo' && (
              <ActionButton
                onClick={() => updateStatus('leyendo')}
                primary
                label={BUTTON_LABELS.markReading}
              />
            )}
            {book.status !== 'terminado' && (
              <ActionButton
                onClick={() => updateStatus('terminado')}
                label={BUTTON_LABELS.markFinished}
                icon="✓"
              />
            )}
            {book.status === 'leyendo' && (
              <ActionButton
                onClick={() => updateStatus('pausado')}
                label={BUTTON_LABELS.pause}
              />
            )}
            <ActionButton onClick={() => setEditing(true)} label={BUTTON_LABELS.editBook} />
            <ActionButton onClick={handleDelete} label="Eliminar" danger />
          </div>

          <AnimatePresence>
            {milestone && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-sm italic reading-ink-text"
                style={{ fontFamily: 'var(--font-playfair), serif' }}
              >
                {milestone}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Frases del libro */}
      <div className="mt-14">
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-2xl font-bold reading-ink-text"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            ✒️ Frases de este libro
          </h2>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setAddingQuote(true)}
            className="text-xs font-bold px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(225, 29, 72, 0.15)',
              color: 'var(--reading-bronze)',
              border: '1px solid rgba(225, 29, 72, 0.35)',
            }}
          >
            + {BUTTON_LABELS.addQuote}
          </motion.button>
        </div>

        {quotes.length === 0 ? (
          <p className="py-8 text-center reading-ink-soft-text italic text-sm">
            Todavía no subrayaste nada. Cuando lo hagas, aparece acá.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {quotes.map((q) => (
              <QuoteCard
                key={q.id}
                quote={q}
                onDelete={() => handleQuoteDeleted(q.id)}
                hideBookInfo
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editing && (
          <ModalShell onClose={() => setEditing(false)} title="Editar libro">
            <BookForm
              bookId={book.id}
              initial={book}
              onSuccess={handleEdited}
              onCancel={() => setEditing(false)}
            />
          </ModalShell>
        )}
        {addingQuote && (
          <ModalShell onClose={() => setAddingQuote(false)} title="Nueva frase">
            <QuoteForm
              defaultBookId={book.id}
              availableBooks={[
                { id: book.id, title: book.title, author: book.author },
              ]}
              onSuccess={handleQuoteCreated}
              onCancel={() => setAddingQuote(false)}
            />
          </ModalShell>
        )}
      </AnimatePresence>
    </div>
  )
}

function ActionButton({
  label,
  onClick,
  primary = false,
  danger = false,
  icon,
}: {
  label: string
  onClick: () => void
  primary?: boolean
  danger?: boolean
  icon?: string
}) {
  const style = danger
    ? {
        background: 'transparent',
        color: '#b91c1c',
        border: '1px solid rgba(185, 28, 28, 0.3)',
      }
    : primary
      ? {
          background:
            'linear-gradient(135deg, var(--reading-accent), var(--reading-accent-deep))',
          color: 'white',
          boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)',
        }
      : {
          background: 'rgba(255, 241, 244, 0.8)',
          color: 'var(--reading-ink)',
          border: '1px solid var(--reading-border)',
        }
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className="px-4 py-2 rounded-2xl text-sm font-bold shimmer-btn"
      style={style}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </motion.button>
  )
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-16 md:pt-20"
      style={{ background: 'rgba(76, 10, 31, 0.45)', backdropFilter: 'blur(6px)' }}
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
          {title}
        </h2>
        {children}
      </motion.div>
    </motion.div>
  )
}

function PageSlider({
  book,
  onUpdate,
}: {
  book: BookData
  onUpdate: (b: BookData) => void
}) {
  const [value, setValue] = useState(book.currentPage ?? 0)
  const [saving, setSaving] = useState(false)

  async function save(v: number) {
    setSaving(true)
    const res = await fetch(`/api/lectura/books/${book.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPage: v }),
    })
    if (res.ok) {
      const updated: BookData = await res.json()
      onUpdate(updated)
    }
    setSaving(false)
  }

  if (!book.pages) return null

  return (
    <div className="mt-3 flex items-center gap-3">
      <input
        type="range"
        min={0}
        max={book.pages}
        value={value}
        onChange={(e) => setValue(parseInt(e.target.value, 10))}
        onPointerUp={() => save(value)}
        className="flex-1 accent-[var(--reading-gold)]"
      />
      <span
        className="text-xs font-bold reading-ink-text tabular-nums w-14 text-right"
        style={{ opacity: saving ? 0.5 : 1 }}
      >
        pág {value}
      </span>
    </div>
  )
}
