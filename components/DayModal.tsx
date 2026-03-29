'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { PhaseInfo } from '@/lib/cycleLogic'
import type { Phase } from '@/lib/cycleLogic'
import { phaseInfo } from '@/lib/phases'
import type { Tip } from '@/lib/tips'

interface DayModalProps {
  date: Date | null
  phaseData: PhaseInfo | null
  onClose: () => void
}

const PHASE_MAP: Record<Phase, Tip['phase']> = {
  1: 'menstruacion',
  2: 'folicular',
  3: 'ovulacion',
  4: 'lutea',
}

export default function DayModal({ date, phaseData, onClose }: DayModalProps) {
  const isOpen = date !== null && phaseData !== null
  const [tip, setTip] = useState<Tip | null>(null)
  const [tipLoading, setTipLoading] = useState(false)
  const [tipKey, setTipKey] = useState(0)
  const lastTipId = useRef<number | undefined>(undefined)

  const fetchTip = useCallback(async (phase: Phase, dayOfCycle: number) => {
    setTipLoading(true)
    try {
      const phaseStr = PHASE_MAP[phase]
      const excludeParam = lastTipId.current !== undefined ? `&excludeId=${lastTipId.current}` : ''
      const res = await fetch(`/api/tips?phase=${phaseStr}&day=${dayOfCycle}${excludeParam}`)
      if (res.ok) {
        const data: Tip = await res.json()
        lastTipId.current = data.id
        setTip(data)
        setTipKey(k => k + 1)
      }
    } finally {
      setTipLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen && phaseData) {
      lastTipId.current = undefined
      fetchTip(phaseData.phase, phaseData.dayOfCycle)
    } else {
      setTip(null)
    }
  }, [isOpen, phaseData, fetchTip])

  return (
    <AnimatePresence>
      {isOpen && date && phaseData && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={onClose}
          >
            <motion.div
              className={`w-full max-w-sm rounded-3xl shadow-xl overflow-hidden ${phaseInfo[phaseData.phase].bgColor} border ${phaseInfo[phaseData.phase].borderColor}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-3xl">{phaseInfo[phaseData.phase].icon}</span>
                      <h2 className={`text-xl font-extrabold ${phaseInfo[phaseData.phase].textColor}`}>
                        {phaseData.phaseName}
                      </h2>
                    </div>
                    <p className={`text-sm font-semibold capitalize ${phaseInfo[phaseData.phase].textColor} opacity-70`}>
                      {format(date, "EEEE d 'de' MMMM", { locale: es })}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none ml-2"
                  >
                    ×
                  </button>
                </div>

                {/* Day of cycle badge */}
                <div className="mt-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/60 ${phaseInfo[phaseData.phase].textColor}`}>
                    Día {phaseData.dayOfCycle} de tu ciclo
                  </span>
                </div>
              </div>

              {/* Tip card */}
              <div className="px-6 pb-6">
                <div className="bg-white/70 rounded-2xl px-4 py-4 shadow-sm min-h-[120px] flex flex-col gap-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Consejo del novio 💌
                  </p>

                  <AnimatePresence mode="wait">
                    {tip && !tipLoading ? (
                      <motion.div
                        key={tipKey}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className={`text-base font-bold ${phaseInfo[phaseData.phase].textColor} mb-1`}>
                          {tip.emoji} {tip.title}
                        </p>
                        <p className={`text-sm leading-relaxed font-medium ${phaseInfo[phaseData.phase].textColor} opacity-80`}>
                          {tip.message}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center h-14"
                      >
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="text-2xl inline-block"
                        >
                          🔀
                        </motion.span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    onClick={() => fetchTip(phaseData.phase, phaseData.dayOfCycle)}
                    disabled={tipLoading}
                    className={`mt-1 self-end text-xs font-bold px-3 py-1.5 rounded-full bg-white/80 hover:bg-white transition-colors disabled:opacity-40 ${phaseInfo[phaseData.phase].textColor}`}
                    whileTap={{ scale: 0.93 }}
                    whileHover={{ scale: 1.04 }}
                  >
                    Otro consejo 🔀
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
