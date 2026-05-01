'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BataCycle } from '@/components/BataEu'
import PhaseCard from '@/components/PhaseCard'
import Calendar from '@/components/Calendar'
import DayModal from '@/components/DayModal'
import CycleForm from '@/components/CycleForm'
import { getPhaseForDate } from '@/lib/cycleLogic'
import type { Phase, PhaseInfo } from '@/lib/cycleLogic'
import { phaseInfo } from '@/lib/phases'

interface CycleEntry {
  id: number
  startDate: string
  cycleLength: number
  periodLength: number
}

// ── Phase pill color map ──────────────────────────────────────────────────────
const phasePillColors: Record<number, { bg: string; border: string; text: string }> = {
  1: { bg: '#fff1f2', border: '#fecdd3', text: '#9f1239' },
  2: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534' },
  3: { bg: '#fdf2f8', border: '#fbcfe8', text: '#9d174d' },
  4: { bg: '#f5f3ff', border: '#ddd6fe', text: '#5b21b6' },
}

// ── Animated mesh gradient blobs ─────────────────────────────────────────────
const phaseBlobs: Record<Phase, { colors: string[] }> = {
  1: { colors: ['#fda4af', '#be123c', '#fecdd3'] },
  2: { colors: ['#bbf7d0', '#4ade80', '#d1fae5'] },
  3: { colors: ['#f9a8d4', '#e879f9', '#fecdd3'] },
  4: { colors: ['#ddd6fe', '#a78bfa', '#ede9fe'] },
}

function MeshBackground({ phase }: { phase: Phase }) {
  const blobs = phaseBlobs[phase]
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: 1 }}
        style={{ background: `radial-gradient(ellipse at 20% 30%, ${blobs.colors[2]}88 0%, transparent 60%)` }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full opacity-30 blur-3xl"
        style={{ width: 480, height: 480, top: '5%', left: '5%' }}
        animate={{ x: [0, 60, -30, 0], y: [0, -80, 40, 0], backgroundColor: blobs.colors[0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror', backgroundColor: { duration: 1.5, ease: 'easeInOut', repeat: 0 } }}
      />
      <motion.div
        className="absolute rounded-full opacity-25 blur-3xl"
        style={{ width: 420, height: 420, top: '40%', right: '5%' }}
        animate={{ x: [0, -70, 40, 0], y: [0, 60, -50, 0], backgroundColor: blobs.colors[1] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror', backgroundColor: { duration: 1.5, ease: 'easeInOut', repeat: 0 } }}
      />
      <motion.div
        className="absolute rounded-full opacity-20 blur-3xl"
        style={{ width: 360, height: 360, bottom: '10%', left: '35%' }}
        animate={{ x: [0, 50, -60, 0], y: [0, -40, 70, 0], backgroundColor: blobs.colors[2] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror', backgroundColor: { duration: 1.5, ease: 'easeInOut', repeat: 0 } }}
      />
      <div className="absolute inset-0 bg-white/40" />
    </div>
  )
}

export default function CicloPage() {
  const [cycleEntry, setCycleEntry] = useState<CycleEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCycleForm, setShowCycleForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedPhase, setSelectedPhase] = useState<PhaseInfo | null>(null)

  async function fetchCycle() {
    try {
      const res = await fetch('/api/cycle', { cache: 'no-store' })
      const data = await res.json()
      setCycleEntry(data ?? null)
    } catch {
      setCycleEntry(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCycle() }, [])

  const today = new Date()
  const currentPhase = cycleEntry
    ? getPhaseForDate(today, new Date(cycleEntry.startDate), cycleEntry.cycleLength, cycleEntry.periodLength)
    : null

  const activePhase = currentPhase?.phase ?? 1

  function handleDayClick(date: Date, phaseData: PhaseInfo) {
    setSelectedDate(date)
    setSelectedPhase(phaseData)
  }

  return (
    <>
      <MeshBackground phase={activePhase} />

      <div className="min-h-screen">
        {/* Phase badge */}
        {currentPhase && (
          <div className="flex justify-center pt-4 px-4">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{
                backgroundColor: phasePillColors[currentPhase.phase].bg,
                border: `1px solid ${phasePillColors[currentPhase.phase].border}`,
                color: phasePillColors[currentPhase.phase].text,
                transition: 'background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease',
              }}
            >
              <span>{phaseInfo[currentPhase.phase].icon}</span>
              <span>{phaseInfo[currentPhase.phase].name}</span>
              <span className="opacity-60">· Día {currentPhase.dayOfCycle}</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 py-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-4xl"
              >
                🩸
              </motion.div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
              {/* LEFT: Mascot + Phase card */}
              <div className="w-full lg:w-72 flex flex-col items-center">
                {currentPhase ? (
                  <>
                    <div className="w-56 md:w-64">
                      <BataCycle phase={currentPhase.phase} />
                    </div>
                    <PhaseCard phase={currentPhase.phase} dayOfCycle={currentPhase.dayOfCycle} />
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-56 md:w-64">
                      <BataCycle phase={1} />
                    </div>
                    <div className="mt-4 text-center px-4">
                      <p className="text-sm text-gray-500 font-medium">
                        Todavía no hay datos del ciclo 🫀
                      </p>
                      <motion.button
                        onClick={() => setShowCycleForm(true)}
                        className="mt-2 text-rose-500 font-bold underline underline-offset-2 hover:text-rose-700 text-sm"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        Registrá el inicio del ciclo
                      </motion.button>
                      <p className="text-xs mt-1 text-gray-400">
                        para activar el calendario de fases
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT: Calendar */}
              <div className="flex-1 w-full">
                <Calendar cycleEntry={cycleEntry} onDayClick={handleDayClick} />

                <motion.button
                  onClick={() => setShowCycleForm(true)}
                  className="mt-4 w-full border-2 border-dashed border-rose-200 hover:border-rose-400 text-rose-400 hover:text-rose-600 font-bold py-3 min-h-[48px] rounded-2xl transition-colors text-sm shimmer-btn"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🩸 Registrar inicio de ciclo
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <DayModal
          date={selectedDate}
          phaseData={selectedPhase}
          onClose={() => { setSelectedDate(null); setSelectedPhase(null) }}
        />
        <AnimatePresence>
          {showCycleForm && (
            <CycleForm onSaved={fetchCycle} onClose={() => setShowCycleForm(false)} />
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
