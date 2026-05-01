'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { generateMilestones, getNextMilestone } from '@/lib/milestones'
import type { SpecialDateData } from './SpecialDateForm'

interface TimelineItem {
  id: string
  date: Date
  label: string
  emoji: string
  type: 'auto' | 'manual'
  dbId?: number
}

interface MilestoneTimelineProps {
  startDate: Date
  specialDates: SpecialDateData[]
  onEdit: (sd: SpecialDateData) => void
  onDelete: (id: number) => void
}

export default function MilestoneTimeline({ startDate, specialDates, onEdit, onDelete }: MilestoneTimelineProps) {
  const [confirmingId, setConfirmingId] = useState<number | null>(null)
  const now = new Date()

  const nextMilestone = useMemo(() => getNextMilestone(startDate), [startDate])

  const items: TimelineItem[] = useMemo(() => {
    const autoItems = generateMilestones(startDate).map((m) => ({
      id: `auto-${m.label}`,
      date: m.date,
      label: m.label,
      emoji: m.emoji,
      type: 'auto' as const,
    }))

    const manualItems = specialDates.map((sd) => ({
      id: `manual-${sd.id}`,
      date: new Date(sd.date),
      label: sd.title,
      emoji: sd.emoji,
      type: 'manual' as const,
      dbId: sd.id,
    }))

    return [...autoItems, ...manualItems].sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [startDate, specialDates])

  const daysUntilNext = nextMilestone
    ? Math.ceil((nextMilestone.date.getTime() - now.getTime()) / 86400000)
    : null

  return (
    <div className="space-y-6">
      {/* Next milestone card */}
      {nextMilestone && daysUntilNext !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl px-5 py-4 text-center"
          style={{
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          }}
        >
          <span className="text-3xl">{nextMilestone.emoji}</span>
          <p className="font-bold text-rose-600 text-sm mt-1">
            Faltan <span className="text-lg">{daysUntilNext}</span> días para
          </p>
          <p className="font-playfair text-lg font-bold text-rose-700">{nextMilestone.label}</p>
        </motion.div>
      )}

      {/* Timeline */}
      <div className="relative pl-6 sm:pl-8">
        {/* Vertical line */}
        <div className="absolute left-2 sm:left-3 top-0 bottom-0 w-0.5 bg-rose-200/60" />

        <div className="space-y-4">
          {items.map((item, index) => {
            const isPast = item.date <= now
            const isNext = nextMilestone && item.label === nextMilestone.label && item.type === 'auto'

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                className={`relative ${!isPast && !isNext ? 'opacity-50' : ''}`}
              >
                {/* Dot on the line */}
                <div className={`absolute -left-8 top-3 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  isPast
                    ? 'bg-rose-100 text-rose-500'
                    : isNext
                      ? 'bg-rose-500 text-white ring-4 ring-rose-200'
                      : 'bg-gray-100 text-gray-500'
                }`}>
                  {isPast ? '✓' : item.emoji}
                </div>

                {/* Card */}
                <div
                  className={`rounded-2xl px-4 py-3 ${isNext ? 'ring-2 ring-rose-300' : ''}`}
                  style={{
                    background: 'rgba(255,255,255,0.45)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.5)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm ${isPast ? 'text-gray-600' : 'text-rose-700'}`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {format(item.date, "d 'de' MMMM, yyyy", { locale: es })}
                      </p>
                    </div>
                    {/* Edit/Delete for manual dates */}
                    {item.type === 'manual' && item.dbId && (
                      <div className="flex gap-1 flex-shrink-0">
                        <AnimatePresence>
                          {confirmingId === item.dbId ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="flex items-center gap-1"
                            >
                              <motion.button
                                onClick={() => { onDelete(item.dbId!); setConfirmingId(null) }}
                                className="text-[10px] font-bold text-white bg-rose-500 px-2 py-1 rounded-lg"
                                whileTap={{ scale: 0.9 }}
                              >
                                Sí
                              </motion.button>
                              <motion.button
                                onClick={() => setConfirmingId(null)}
                                className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg"
                                whileTap={{ scale: 0.9 }}
                              >
                                No
                              </motion.button>
                            </motion.div>
                          ) : (
                            <>
                              <motion.button
                                onClick={() => {
                                  const sd = specialDates.find((s) => s.id === item.dbId)
                                  if (sd) onEdit(sd)
                                }}
                                className="text-gray-300 hover:text-rose-400 transition-colors p-1 rounded-lg hover:bg-rose-50 text-sm"
                                whileTap={{ scale: 0.88 }}
                              >
                                ✏️
                              </motion.button>
                              <motion.button
                                onClick={() => setConfirmingId(item.dbId!)}
                                className="text-gray-300 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50 text-sm"
                                whileTap={{ scale: 0.88 }}
                              >
                                🗑️
                              </motion.button>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
