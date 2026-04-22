'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QuoteCard from './QuoteCard'
import QuoteForm from './QuoteForm'
import { BataScribe, BataSleepy } from '@/components/BataEu'
import { EMPTY_STATES, BUTTON_LABELS } from '@/lib/lectura/readingConfig'
import type { QuoteData, BookData } from '@/lib/lectura/types'

export default function FrasesClient() {
  const [quotes, setQuotes] = useState<QuoteData[]>([])
  const [books, setBooks] = useState<Array<{ id: number; title: string; author: string }>>([])
  const [loading, setLoading] = useState(true)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  async function reload() {
    const [q, b] = await Promise.all([
      fetch('/api/lectura/quotes').then((r) => r.json()),
      fetch('/api/lectura/books').then((r) => r.json()),
    ])
    setQuotes(q)
    setBooks(
      (b as BookData[]).map((x) => ({ id: x.id, title: x.title, author: x.author }))
    )
  }

  useEffect(() => {
    reload().finally(() => setLoading(false))
  }, [])

  const allTags = useMemo(() => {
    const set = new Set<string>()
    quotes.forEach((q) => q.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [quotes])

  const filtered = activeTag
    ? quotes.filter((q) => q.tags.includes(activeTag))
    : quotes

  async function handleDelete(id: number) {
    await fetch(`/api/lectura/quotes/${id}`, { method: 'DELETE' })
    setQuotes((prev) => prev.filter((q) => q.id !== id))
  }

  function handleCreated(q: QuoteData) {
    setQuotes((prev) => [q, ...prev])
    setFormOpen(false)
  }

  return (
    <div className="py-6 md:py-10">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-end gap-4 md:gap-6 flex-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="w-24 md:w-36 flex-shrink-0 hidden sm:block"
          >
            <BataScribe />
          </motion.div>
          <div>
            <h1
              className="text-4xl md:text-5xl font-bold reading-ink-text"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              Mural de frases
            </h1>
            <p className="mt-1 text-sm reading-ink-soft-text italic">
              {quotes.length === 0
                ? 'Todavía vacío.'
                : `${quotes.length} frase${quotes.length === 1 ? '' : 's'} subrayada${quotes.length === 1 ? '' : 's'}.`}
            </p>
          </div>
        </div>

        <motion.button
          onClick={() => setFormOpen(true)}
          disabled={books.length === 0}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-3 rounded-2xl font-bold text-sm disabled:opacity-40 shimmer-btn whitespace-nowrap"
          style={{
            background:
              'linear-gradient(135deg, var(--reading-accent), var(--reading-accent-deep))',
            color: 'white',
            boxShadow: '0 6px 20px rgba(225,29,72,0.35)',
          }}
        >
          + {BUTTON_LABELS.addQuote}
        </motion.button>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Chip
            label="Todas"
            active={activeTag === null}
            onClick={() => setActiveTag(null)}
          />
          {allTags.map((t) => (
            <Chip
              key={t}
              label={`#${t}`}
              active={activeTag === t}
              onClick={() => setActiveTag(t)}
            />
          ))}
        </div>
      )}

      {loading ? (
        <p className="py-16 text-center reading-ink-soft-text italic">Buscando frases…</p>
      ) : filtered.length === 0 ? (
        <div className="py-12 flex flex-col items-center text-center">
          <div className="w-40 md:w-52 mb-3">
            <BataSleepy />
          </div>
          <h3
            className="text-xl font-bold reading-ink-text"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            {activeTag
              ? `No hay frases con #${activeTag}`
              : EMPTY_STATES.quotesEmpty.title}
          </h3>
          <p className="mt-1 text-sm reading-ink-soft-text italic max-w-sm">
            {activeTag ? 'Probá otro tag.' : EMPTY_STATES.quotesEmpty.body}
          </p>
        </div>
      ) : (
        <div
          className="columns-1 sm:columns-2 lg:columns-3 gap-5"
          style={{ columnFill: 'balance' }}
        >
          {filtered.map((q) => (
            <QuoteCard
              key={q.id}
              quote={q}
              onDelete={() => handleDelete(q.id)}
              animateInitial
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFormOpen(false)}
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
                Nueva frase
              </h2>
              <QuoteForm
                availableBooks={books}
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

function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className="px-3 py-1 text-xs font-bold rounded-full transition-colors"
      style={
        active
          ? {
              background: 'var(--reading-sage)',
              color: 'white',
              boxShadow: '0 3px 10px rgba(132, 169, 140, 0.35)',
            }
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
