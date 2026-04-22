'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import TypewriterText from './TypewriterText'
import type { QuoteData } from '@/lib/lectura/types'

interface Props {
  quote: QuoteData
  onDelete?: () => void
  hideBookInfo?: boolean
  animateInitial?: boolean
}

export default function QuoteCard({
  quote,
  onDelete,
  hideBookInfo = false,
  animateInitial = false,
}: Props) {
  const length = quote.text.length
  const bigSerif = length < 120
  const mediumSerif = length >= 120 && length < 260

  return (
    <motion.article
      initial={animateInitial ? { opacity: 0, y: 14 } : false}
      whileInView={animateInitial ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="reading-glass rounded-2xl p-5 md:p-6 relative break-inside-avoid mb-4"
      style={{
        background:
          'linear-gradient(180deg, rgba(255, 241, 244, 0.9), rgba(253, 228, 234, 0.85))',
      }}
    >
      <div
        aria-hidden
        className="absolute -top-3 left-4 text-5xl select-none"
        style={{
          fontFamily: 'var(--font-playfair), serif',
          color: 'rgba(225, 29, 72, 0.35)',
          lineHeight: 1,
        }}
      >
        “
      </div>

      <p
        className={`reading-ink-text leading-relaxed ${
          bigSerif
            ? 'text-2xl md:text-3xl'
            : mediumSerif
              ? 'text-lg md:text-xl'
              : 'text-base'
        }`}
        style={{
          fontFamily: 'var(--font-playfair), serif',
          fontStyle: bigSerif ? 'normal' : 'italic',
        }}
      >
        {animateInitial ? <TypewriterText text={quote.text} /> : quote.text}
      </p>

      {!hideBookInfo && quote.book && (
        <Link
          href={`/lectura/biblioteca/${quote.book.id}`}
          className="block mt-4 pt-3 border-t text-xs reading-link"
          style={{ borderColor: 'rgba(251, 207, 232, 0.5)' }}
        >
          <span className="font-bold">{quote.book.title}</span>
          <span className="opacity-70"> · {quote.book.author}</span>
          {quote.page && (
            <span className="opacity-60"> · pág. {quote.page}</span>
          )}
        </Link>
      )}

      {hideBookInfo && quote.page && (
        <p className="mt-3 text-xs reading-ink-soft-text italic">
          pág. {quote.page}
        </p>
      )}

      {quote.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {quote.tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-[10px] rounded-full"
              style={{
                background: 'rgba(132, 169, 140, 0.18)',
                color: 'var(--reading-sage)',
                border: '1px solid rgba(132, 169, 140, 0.35)',
              }}
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          aria-label="Eliminar frase"
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center text-xs rounded-full reading-ink-soft-text hover:text-red-500 transition-colors opacity-0 hover:opacity-100 focus:opacity-100"
          style={{ background: 'rgba(255, 241, 244, 0.7)' }}
        >
          ✕
        </button>
      )}
    </motion.article>
  )
}
