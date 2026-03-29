'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NosotrosBackground from '@/components/NosotrosBackground'
import RelationshipCounter from '@/components/RelationshipCounter'
import MilestoneTimeline from '@/components/MilestoneTimeline'
import SpecialDateForm, { type SpecialDateData } from '@/components/SpecialDateForm'
import { COUPLE_START_DATE } from '@/lib/coupleConfig'

export default function NosotrosPage() {
  const [specialDates, setSpecialDates] = useState<SpecialDateData[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDate, setEditingDate] = useState<SpecialDateData | null>(null)

  const fetchDates = useCallback(async () => {
    try {
      const res = await fetch('/api/dates')
      const data = await res.json()
      setSpecialDates(data ?? [])
    } catch {
      setSpecialDates([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDates() }, [fetchDates])

  function handleAdd(sd: SpecialDateData) {
    setSpecialDates((prev) => [...prev, sd].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
    setShowForm(false)
  }

  function handleEdit(sd: SpecialDateData) {
    setEditingDate(sd)
    setShowForm(true)
  }

  function handleEditSuccess(sd: SpecialDateData) {
    setSpecialDates((prev) =>
      prev.map((x) => (x.id === sd.id ? sd : x)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    )
    setEditingDate(null)
    setShowForm(false)
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/dates/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSpecialDates((prev) => prev.filter((x) => x.id !== id))
      }
    } catch { /* silently fail */ }
  }

  function handleCancel() {
    setShowForm(false)
    setEditingDate(null)
  }

  return (
    <>
      <NosotrosBackground />

      <div className="min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          {/* Counter */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <RelationshipCounter />
          </motion.div>

          {/* Add button / Form */}
          <AnimatePresence mode="wait">
            {showForm ? (
              <SpecialDateForm
                key={editingDate ? `edit-${editingDate.id}` : 'create'}
                dateId={editingDate?.id}
                initialTitle={editingDate?.title}
                initialDate={editingDate ? new Date(editingDate.date).toISOString().split('T')[0] : ''}
                initialEmoji={editingDate?.emoji}
                onSuccess={editingDate ? handleEditSuccess : handleAdd}
                onCancel={handleCancel}
              />
            ) : (
              <motion.button
                key="add-btn"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                onClick={() => setShowForm(true)}
                className="w-full border-2 border-dashed border-rose-200 hover:border-rose-400 text-rose-400 hover:text-rose-600 font-bold py-3 min-h-[48px] rounded-2xl transition-colors text-sm shimmer-btn"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                + Agregar fecha especial
              </motion.button>
            )}
          </AnimatePresence>

          {/* Timeline */}
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="text-4xl">
                💕
              </motion.div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
              <MilestoneTimeline
                startDate={COUPLE_START_DATE}
                specialDates={specialDates}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}
