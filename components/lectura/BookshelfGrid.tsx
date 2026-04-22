'use client'

import { motion } from 'framer-motion'
import BookCard from './BookCard'
import type { BookData } from '@/lib/lectura/types'

interface Props {
  books: BookData[]
  mode: 'grid' | 'shelf'
}

export default function BookshelfGrid({ books, mode }: Props) {
  if (mode === 'shelf') {
    // Agrupar en estantes de ~6 libros para desktop
    const perShelf = 6
    const shelves: BookData[][] = []
    for (let i = 0; i < books.length; i += perShelf) {
      shelves.push(books.slice(i, i + perShelf))
    }
    return (
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06 } },
        }}
        className="space-y-10"
      >
        {shelves.map((shelf, si) => (
          <div key={si} className="relative">
            <div className="flex items-end justify-start gap-3 overflow-x-auto pb-2 pl-2 pr-2 min-h-[220px]">
              {shelf.map((book) => (
                <motion.div
                  key={book.id}
                  variants={{
                    hidden: { opacity: 0, y: 20, rotateZ: -2 },
                    show: { opacity: 1, y: 0, rotateZ: 0 },
                  }}
                  className="flex-shrink-0"
                  style={{ transformOrigin: 'bottom center' }}
                >
                  <BookCard book={book} variant="shelf" />
                </motion.div>
              ))}
            </div>
            <div
              className="reading-shelf-plank h-4 rounded-sm"
              style={{
                marginTop: -4,
                boxShadow:
                  '0 -2px 0 rgba(0,0,0,0.1) inset, 0 10px 18px -6px rgba(76,10,31,0.3)',
              }}
            />
          </div>
        ))}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.05 } },
      }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-8"
    >
      {books.map((book) => (
        <motion.div
          key={book.id}
          variants={{
            hidden: { opacity: 0, y: 24, scale: 0.95 },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: 'spring', stiffness: 340, damping: 26 },
            },
          }}
        >
          <BookCard book={book} variant="grid" />
        </motion.div>
      ))}
    </motion.div>
  )
}
