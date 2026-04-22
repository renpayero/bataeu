'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import BookCover from './BookCover'
import type { BookData } from '@/lib/lectura/types'

interface Props {
  books: BookData[]
}

export default function CurrentlyReading({ books }: Props) {
  if (books.length === 0) return null

  return (
    <section>
      <p className="text-xs uppercase tracking-widest reading-ink-faded mb-3">
        🕯️ Leyendo ahora
      </p>

      <div className="flex gap-5 overflow-x-auto pb-3 -mx-2 px-2 snap-x snap-mandatory">
        {books.map((book) => {
          const pct =
            book.pages && book.currentPage
              ? Math.min(100, Math.round((book.currentPage / book.pages) * 100))
              : null
          return (
            <Link
              key={book.id}
              href={`/lectura/biblioteca/${book.id}`}
              className="flex-shrink-0 snap-start w-[200px]"
            >
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 340, damping: 22 }}
                className="reading-glass rounded-2xl p-4 relative"
                style={{ boxShadow: '0 10px 28px -10px rgba(76,10,31,0.3)' }}
              >
                <div className="flex justify-center">
                  <BookCover
                    title={book.title}
                    author={book.author}
                    coverUrl={book.coverUrl}
                    layoutId={`book-cover-${book.id}`}
                    size="md"
                  />
                </div>
                <h3
                  className="mt-3 text-sm font-bold reading-ink-text text-center line-clamp-2"
                  style={{ fontFamily: 'var(--font-playfair), serif' }}
                >
                  {book.title}
                </h3>
                <p className="text-xs reading-ink-soft-text italic text-center line-clamp-1">
                  {book.author}
                </p>

                {pct !== null && (
                  <div className="mt-3">
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: 'rgba(251, 207, 232, 0.4)' }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                        className="reading-gold-shimmer h-full"
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-center reading-ink-soft-text tabular-nums">
                      {book.currentPage} / {book.pages} · {pct}%
                    </p>
                  </div>
                )}
              </motion.div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
