'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { GoogleBooksResult } from '@/lib/lectura/googleBooks'

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (book: GoogleBooksResult) => void
}

export default function GoogleBooksSearch({ open, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GoogleBooksResult[]>([])
  const [loading, setLoading] = useState(false)
  const [rateLimited, setRateLimited] = useState(false)
  const [source, setSource] = useState<'google' | 'openlibrary' | 'none' | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80)
    } else {
      setQuery('')
      setResults([])
      setRateLimited(false)
      setSource(null)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setSource(null)
      return
    }
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/lectura/google-books/search?q=${encodeURIComponent(q)}`,
          { signal: controller.signal }
        )
        const data = await res.json()
        setRateLimited(Boolean(data.rateLimited))
        setResults(data.results ?? [])
        setSource(data.source ?? null)
      } catch {
        // aborted or network — ignorar
      } finally {
        setLoading(false)
      }
    }, 350)
    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [query, open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-16 md:pt-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ background: 'rgba(76, 10, 31, 0.45)', backdropFilter: 'blur(6px)' }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="reading-glass-strong rounded-3xl w-full max-w-2xl overflow-hidden"
          >
            <div className="p-5 border-b" style={{ borderColor: 'var(--reading-border)' }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔎</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscá por título o autor…"
                  className="flex-1 bg-transparent outline-none text-lg reading-ink-text placeholder:opacity-40"
                  style={{ fontFamily: 'var(--font-playfair), serif' }}
                />
                <button
                  onClick={onClose}
                  className="text-xl reading-ink-soft-text hover:opacity-70"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>
              {source === 'openlibrary' && results.length > 0 && (
                <p className="mt-2 text-[11px] reading-ink-faded italic">
                  Resultados de Open Library
                </p>
              )}
            </div>

            <div
              className="max-h-[60vh] overflow-y-auto p-3"
              style={{ backgroundColor: 'rgba(255, 241, 244, 0.35)' }}
            >
              {loading && query.trim().length >= 2 && (
                <p className="py-8 text-center reading-ink-soft-text italic text-sm">
                  Buscando…
                </p>
              )}
              {!loading && query.trim().length >= 2 && results.length === 0 && (
                <p className="py-8 text-center reading-ink-soft-text italic text-sm">
                  {rateLimited
                    ? 'Los buscadores están con limitación temporal. Podés agregar el libro a mano cerrando esta ventana.'
                    : 'No encontramos nada. Probá otro título.'}
                </p>
              )}
              {!loading && query.trim().length < 2 && (
                <p className="py-8 text-center reading-ink-soft-text italic text-sm">
                  Escribí al menos dos letras.
                </p>
              )}

              <motion.ul
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.04 } },
                }}
                initial="hidden"
                animate="show"
                className="space-y-2"
              >
                {results.map((r) => (
                  <motion.li
                    key={r.googleBooksId}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0 },
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(r)
                        onClose()
                      }}
                      className="w-full flex gap-3 p-3 rounded-2xl text-left hover:bg-white/40 transition-colors"
                      style={{ border: '1px solid rgba(251, 207, 232, 0.3)' }}
                    >
                      <div className="flex-shrink-0 w-14 h-20 rounded overflow-hidden bg-white/40 flex items-center justify-center">
                        {r.coverUrl ? (
                          <Image
                            src={r.coverUrl}
                            alt=""
                            width={56}
                            height={80}
                            unoptimized
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-2xl opacity-40">📖</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-bold reading-ink-text text-sm leading-snug line-clamp-2"
                          style={{ fontFamily: 'var(--font-playfair), serif' }}
                        >
                          {r.title}
                        </p>
                        <p className="text-xs reading-ink-soft-text italic mt-0.5 truncate">
                          {r.authors.join(', ') || 'Autor desconocido'}
                        </p>
                        <div className="flex gap-2 mt-1 text-[10px] reading-ink-soft-text">
                          {r.year && <span>{r.year}</span>}
                          {r.pages && <span>· {r.pages} págs.</span>}
                          {r.genre && <span>· {r.genre}</span>}
                        </div>
                      </div>
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
