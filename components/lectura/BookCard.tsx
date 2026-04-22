'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import BookCover from './BookCover'
import { BOOK_STATUS, BOOK_FORMATS } from '@/lib/lectura/readingPalette'
import type { BookData } from '@/lib/lectura/types'

interface BookCardProps {
  book: BookData
  variant?: 'grid' | 'shelf'
}

export default function BookCard({ book, variant = 'grid' }: BookCardProps) {
  const status = BOOK_STATUS[book.status as keyof typeof BOOK_STATUS]
  const fmt = BOOK_FORMATS[book.format as keyof typeof BOOK_FORMATS]

  if (variant === 'shelf') {
    return (
      <Link
        href={`/lectura/biblioteca/${book.id}`}
        className="relative block"
        style={{ perspective: 1000 }}
      >
        <motion.div
          whileHover={{ rotateY: -8, y: -6, z: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <BookCover
            title={book.title}
            author={book.author}
            coverUrl={book.coverUrl}
            layoutId={`book-cover-${book.id}`}
            size="md"
          />
        </motion.div>
      </Link>
    )
  }

  return (
    <Link href={`/lectura/biblioteca/${book.id}`} className="group block">
      <motion.div
        style={{ perspective: 1200 }}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="flex justify-center"
      >
        <motion.div
          whileHover={{ rotateY: 6, rotateX: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative inline-block"
        >
          <BookCover
            title={book.title}
            author={book.author}
            coverUrl={book.coverUrl}
            layoutId={`book-cover-${book.id}`}
            size="md"
          />

          {/* Status pin — anclado al cover, no a la grid cell */}
          <div
            className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-bold rounded-full shadow-md whitespace-nowrap"
            style={{
              background: status?.bg ?? '#eee',
              color: status?.color ?? '#333',
              border: `1px solid ${status?.color ?? '#ccc'}44`,
            }}
          >
            {status?.label ?? book.status}
          </div>

          {/* Format icon — anclado al cover */}
          {fmt && (
            <div
              className="absolute bottom-1.5 left-1.5 w-7 h-7 flex items-center justify-center rounded-full text-sm shadow-md"
              style={{
                background: 'rgba(255, 241, 244, 0.92)',
                border: '1px solid rgba(251, 207, 232, 0.6)',
              }}
              title={fmt.label}
            >
              {fmt.icon}
            </div>
          )}
        </motion.div>
      </motion.div>

      <div className="mt-3 text-center px-1">
        <h3
          className="text-sm font-bold reading-ink-text truncate"
          style={{ fontFamily: 'var(--font-playfair), serif' }}
          title={book.title}
        >
          {book.title}
        </h3>
        <p
          className="text-xs reading-ink-soft-text truncate italic"
          title={book.author}
        >
          {book.author}
        </p>
        {book.priority > 3 && (
          <div className="mt-1 flex items-center justify-center gap-0.5">
            {Array.from({ length: book.priority }).map((_, i) => (
              <span key={i} className="text-[10px]" style={{ color: '#d97706' }}>
                ★
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
