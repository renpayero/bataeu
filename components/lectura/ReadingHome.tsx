'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import CurrentlyReading from './CurrentlyReading'
import QuoteOfTheDay from './QuoteOfTheDay'
import WelcomeLetter from './WelcomeLetter'
import StreakWidget from './StreakWidget'
import { BataReading, BataSleepy } from '@/components/BataEu'
import { WELCOME_MESSAGE, EMPTY_STATES } from '@/lib/lectura/readingConfig'
import type { BookData } from '@/lib/lectura/types'

export default function ReadingHome() {
  const [books, setBooks] = useState<BookData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/lectura/books?status=leyendo')
      .then((r) => r.json())
      .then((data: BookData[]) => {
        setBooks(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="py-8 md:py-12 space-y-12">
      <WelcomeLetter />

      {/* Saludo + Bata Eu leyendo */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative flex flex-col-reverse md:flex-row items-center gap-6 md:gap-10"
      >
        <div className="flex-1 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.3em] reading-ink-faded mb-3">
            Tu rincón
          </p>
          <h1
            className="text-5xl md:text-7xl font-bold reading-ink-text leading-[1.05]"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            {WELCOME_MESSAGE.title}
          </h1>
          <p className="mt-4 text-lg reading-ink-soft-text italic max-w-xl">
            {WELCOME_MESSAGE.subtitle}
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
          className="w-48 md:w-60 flex-shrink-0 self-center"
        >
          <BataReading />
        </motion.div>
      </motion.header>

      {/* Racha */}
      <StreakWidget />

      {/* Leyendo ahora */}
      {!loading && books.length > 0 && <CurrentlyReading books={books} />}

      {!loading && books.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="reading-glass rounded-3xl p-8 flex flex-col items-center text-center"
          style={{ borderStyle: 'dashed', borderColor: 'var(--reading-border)' }}
        >
          <div className="w-40 md:w-52 mb-3">
            <BataSleepy />
          </div>
          <h3
            className="text-xl font-bold reading-ink-text"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            {EMPTY_STATES.noCurrentlyReading.title}
          </h3>
          <p className="mt-1 text-sm reading-ink-soft-text italic max-w-sm">
            {EMPTY_STATES.noCurrentlyReading.body}
          </p>
          <Link
            href="/lectura/biblioteca"
            className="mt-5 inline-block px-5 py-2.5 rounded-2xl text-sm font-bold shimmer-btn"
            style={{
              background:
                'linear-gradient(135deg, var(--reading-accent), var(--reading-accent-deep))',
              color: 'white',
              boxShadow: '0 4px 14px rgba(225, 29, 72, 0.3)',
            }}
          >
            Ir a la biblioteca
          </Link>
        </motion.div>
      )}

      {/* Frase del día */}
      <QuoteOfTheDay />

      {/* Accesos rápidos */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickLink
          href="/lectura/biblioteca"
          icon="📚"
          title="Biblioteca"
          subtitle="Tus libros"
        />
        <QuickLink
          href="/lectura/frases"
          icon="✒️"
          title="Mural de frases"
          subtitle="Lo que subrayaste"
        />
      </section>
    </div>
  )
}

function QuickLink({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string
  icon: string
  title: string
  subtitle: string
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 340, damping: 24 }}
        className="reading-glass-strong rounded-2xl p-5 flex items-center gap-4"
      >
        <span
          className="flex items-center justify-center w-14 h-14 rounded-2xl text-2xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(225,29,72,0.18), rgba(159,18,57,0.12))',
            border: '1px solid rgba(225, 29, 72, 0.25)',
          }}
        >
          {icon}
        </span>
        <div className="flex-1">
          <h3
            className="text-lg font-bold reading-ink-text"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            {title}
          </h3>
          <p className="text-xs reading-ink-soft-text italic">{subtitle}</p>
        </div>
        <span className="text-xl reading-ink-faded">→</span>
      </motion.div>
    </Link>
  )
}
