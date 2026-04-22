'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow, format, differenceInHours } from 'date-fns'
import { es } from 'date-fns/locale'
import AntojoForm, { type AntojoData } from '@/components/AntojoForm'
import { BataCraving } from '@/components/BataEu'

interface Antojo {
  id: number
  content: string
  emoji: string
  createdAt: string
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  if (differenceInHours(new Date(), date) >= 24) {
    return format(date, "d 'de' MMMM 'a las' HH:mm", { locale: es })
  }
  return formatDistanceToNow(date, { addSuffix: true, locale: es })
}

function FoodBackground() {
  const emojis = '🍕🍫🧁🌮🍟🍰🥐🍩🍜🫔🥗🍦🧇🥞🍣🍓🍇🥑 '
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      <div
        className="absolute inset-0 text-3xl leading-[3.5rem] tracking-[1.5rem] opacity-[0.045] break-all"
        style={{ wordBreak: 'break-all' }}
      >
        {emojis.repeat(120)}
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 via-white/70 to-pink-50/80" />
    </div>
  )
}

function DeleteConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 rounded-2xl flex items-center justify-center gap-3 px-4 z-10"
      style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)' }}
    >
      <span className="text-sm font-semibold text-gray-600 flex-1">¿Eliminar este antojo?</span>
      <motion.button
        onClick={onConfirm}
        className="text-xs font-bold text-white bg-rose-500 px-3 py-1.5 rounded-xl"
        whileTap={{ scale: 0.9 }}
      >
        Sí, borrar
      </motion.button>
      <motion.button
        onClick={onCancel}
        className="text-xs font-bold text-gray-500 px-3 py-1.5 rounded-xl bg-gray-100"
        whileTap={{ scale: 0.9 }}
      >
        Cancelar
      </motion.button>
    </motion.div>
  )
}

function AntojoCard({
  antojo,
  index,
  onDeleted,
  onEdited,
}: {
  antojo: Antojo
  index: number
  onDeleted: (id: number) => void
  onEdited: (updated: Antojo) => void
}) {
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/antojos/${antojo.id}`, { method: 'DELETE' })
      if (res.ok) onDeleted(antojo.id)
    } finally {
      setDeleting(false)
      setConfirming(false)
    }
  }

  function handleEditSuccess(updated: AntojoData) {
    onEdited(updated)
    setEditing(false)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, scale: 0.95 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: 'backOut' }}
      className="relative rounded-2xl px-5 py-4"
      style={{
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}
    >
      <AnimatePresence>
        {confirming && <DeleteConfirm onConfirm={handleDelete} onCancel={() => setConfirming(false)} />}
      </AnimatePresence>

      {editing ? (
        <AntojoForm
          antojoId={antojo.id}
          initialContent={antojo.content}
          initialEmoji={antojo.emoji}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5 flex-shrink-0">{antojo.emoji}</span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-700 text-sm leading-relaxed">{antojo.content}</p>
            <p className="text-xs text-gray-400 mt-1 font-medium">{formatTime(antojo.createdAt)}</p>
          </div>
          <div className="flex gap-1 flex-shrink-0 ml-1">
            <motion.button
              onClick={() => setEditing(true)}
              className="text-gray-300 hover:text-rose-400 transition-colors p-1 rounded-lg hover:bg-rose-50 text-base"
              whileTap={{ scale: 0.88 }}
              title="Editar"
            >
              ✏️
            </motion.button>
            <motion.button
              onClick={() => setConfirming(true)}
              disabled={deleting}
              className="text-gray-300 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50 text-base disabled:opacity-40"
              whileTap={{ scale: 0.88 }}
              title="Eliminar"
            >
              🗑️
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

const MAX_ANTOJOS = 4

function getExpiresIn(createdAt: string): string {
  const expiry = new Date(new Date(createdAt).getTime() + 24 * 60 * 60 * 1000)
  const diffMs = expiry.getTime() - Date.now()
  if (diffMs <= 0) return 'en breve'
  const h = Math.floor(diffMs / (1000 * 60 * 60))
  const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  return h > 0 ? `en ${h}h ${m}m` : `en ${m}m`
}

export default function AntojosPage() {
  const [antojos, setAntojos] = useState<Antojo[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAntojos = useCallback(async () => {
    try {
      const res = await fetch('/api/antojos')
      const data = await res.json()
      setAntojos(data ?? [])
    } catch {
      setAntojos([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAntojos() }, [fetchAntojos])

  function handleAdd(antojo: AntojoData) {
    setAntojos((prev) => [antojo, ...prev])
  }

  return (
    <>
      <FoodBackground />
      <div className="min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-end gap-3 mb-6">
              <div className="flex-1 min-w-0">
                <h2 className="text-3xl font-extrabold text-rose-700 mb-1">🍫 ¿Qué se te antojó hoy?</h2>
                <p className="text-sm text-gray-400 font-medium">
                  Escribí tus antojos acá. Él los va a ver. (No promete nada, igual.)
                </p>
              </div>
              <div className="flex-shrink-0 w-[100px] md:w-[130px]">
                <BataCraving />
              </div>
            </div>
          </motion.div>

          {/* Slot counter */}
          {!loading && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400 font-semibold">
                {antojos.length}/{MAX_ANTOJOS} antojos · se borran a las 24hs
              </span>
              <div className="flex gap-1">
                {Array.from({ length: MAX_ANTOJOS }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${i < antojos.length ? 'bg-rose-400' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Form or full-state message */}
          <AnimatePresence mode="wait">
            {!loading && antojos.length >= MAX_ANTOJOS ? (
              <motion.div
                key="full"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl px-5 py-5 text-center"
                style={{
                  background: 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.6)',
                }}
              >
                <div className="text-4xl mb-2">😅</div>
                <p className="font-bold text-rose-600 text-sm">Ya pusiste 4 antojos, ¿no es suficiente?</p>
                <p className="text-xs text-gray-400 mt-1">
                  El más viejo se libera {getExpiresIn(antojos[antojos.length - 1].createdAt)}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <AntojoForm onSuccess={handleAdd} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 space-y-3">
            {loading && (
              <div className="text-center pt-12">
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="text-4xl">
                  🍫
                </motion.div>
              </div>
            )}

            {!loading && antojos.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 text-gray-400"
              >
                <div className="text-6xl mb-3">🍽️</div>
                <p className="font-medium text-lg">Todavía no hay antojos...</p>
                <p className="text-sm mt-1">¡Escribí el primero! Él lo va a ver 👀</p>
              </motion.div>
            )}

            <AnimatePresence mode="popLayout">
              {antojos.map((a, index) => (
                <AntojoCard
                  key={a.id}
                  antojo={a}
                  index={index}
                  onDeleted={(id) => setAntojos(prev => prev.filter(x => x.id !== id))}
                  onEdited={(updated) => setAntojos(prev => prev.map(x => x.id === updated.id ? updated : x))}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}
