'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import TypewriterText from './TypewriterText'
import {
  QUOTE_OF_THE_DAY_HEADING,
  BUTTON_LABELS,
  EMPTY_STATES,
} from '@/lib/lectura/readingConfig'
import type { QuoteData } from '@/lib/lectura/types'

export default function QuoteOfTheDay() {
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [key, setKey] = useState(0)

  async function load(excludeId?: number) {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/lectura/quote-of-the-day${excludeId ? `?excludeId=${excludeId}` : ''}`
      )
      const data = await res.json()
      setQuote(data.quote)
      setKey((k) => k + 1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading && !quote) {
    return (
      <div className="reading-glass rounded-3xl p-8 text-center">
        <p className="reading-ink-soft-text italic text-sm">Abriendo una página…</p>
      </div>
    )
  }

  if (!quote) {
    return (
      <div
        className="reading-glass rounded-3xl p-8 text-center"
        style={{ borderStyle: 'dashed' }}
      >
        <p
          className="text-xl reading-ink-text font-bold"
          style={{ fontFamily: 'var(--font-playfair), serif' }}
        >
          {EMPTY_STATES.quotesEmpty.title}
        </p>
        <p className="mt-1 text-sm reading-ink-soft-text italic">
          {EMPTY_STATES.quotesEmpty.body}
        </p>
        <Link
          href="/lectura/frases"
          className="mt-4 inline-block text-xs font-bold px-4 py-2 rounded-full"
          style={{
            background: 'rgba(225, 29, 72, 0.15)',
            color: 'var(--reading-bronze)',
            border: '1px solid rgba(225, 29, 72, 0.35)',
          }}
        >
          + agregar frases
        </Link>
      </div>
    )
  }

  return (
    <section className="relative">
      <p className="text-xs uppercase tracking-widest reading-ink-faded mb-2">
        ✒️ {QUOTE_OF_THE_DAY_HEADING}
      </p>

      <motion.div
        className="reading-glass-strong rounded-3xl p-6 md:p-10 relative overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <span
          aria-hidden
          className="absolute top-2 left-6 select-none"
          style={{
            fontSize: 88,
            lineHeight: 1,
            fontFamily: 'var(--font-playfair), serif',
            color: 'rgba(225, 29, 72, 0.22)',
          }}
        >
          “
        </span>

        <AnimatePresence mode="wait">
          <motion.blockquote
            key={key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative pt-4"
          >
            <p
              className="text-xl md:text-3xl reading-ink-text leading-relaxed"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              <TypewriterText text={quote.text} />
            </p>

            {quote.book && (
              <footer className="mt-5 text-sm reading-ink-soft-text italic">
                — {quote.book.title}
                <span className="opacity-80">, {quote.book.author}</span>
                {quote.page && <span className="opacity-60"> · pág. {quote.page}</span>}
              </footer>
            )}
          </motion.blockquote>
        </AnimatePresence>

        <motion.button
          onClick={() => load(quote.id)}
          disabled={loading}
          whileHover={{ scale: 1.06, rotate: -2 }}
          whileTap={{ scale: 0.93 }}
          className="absolute bottom-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full"
          style={{
            background: 'rgba(225, 29, 72, 0.12)',
            color: 'var(--reading-bronze)',
            border: '1px solid rgba(225, 29, 72, 0.3)',
          }}
        >
          {loading ? '…' : `↻ ${BUTTON_LABELS.anotherQuote}`}
        </motion.button>
      </motion.div>
    </section>
  )
}
