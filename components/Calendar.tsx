'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  startOfMonth, endOfMonth, eachDayOfInterval, getDay,
  format, addMonths, subMonths, isToday,
} from 'date-fns'
import { es } from 'date-fns/locale'
import { getPhaseForDate } from '@/lib/cycleLogic'
import type { PhaseInfo } from '@/lib/cycleLogic'
import { phaseDayColors, phaseTextColors, phaseInfo } from '@/lib/phases'

interface CycleEntry {
  id: number
  startDate: string
  cycleLength: number
  periodLength: number
}

interface CalendarProps {
  cycleEntry: CycleEntry | null
  onDayClick: (date: Date, phaseData: PhaseInfo) => void
}

const DAY_HEADERS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

// Phase shadow colors for hover
const phaseShadow = {
  1: 'hover:shadow-red-200',
  2: 'hover:shadow-green-200',
  3: 'hover:shadow-pink-200',
  4: 'hover:shadow-purple-200',
} as const

export default function Calendar({ cycleEntry, onDayClick }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [monthKey, setMonthKey] = useState(0)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startOffset = (getDay(monthStart) + 6) % 7

  function changeMonth(dir: 1 | -1) {
    setCurrentMonth(dir === 1 ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1))
    setMonthKey(k => k + 1)
  }

  function getPhase(date: Date): PhaseInfo | null {
    if (!cycleEntry) return null
    return getPhaseForDate(
      date,
      new Date(cycleEntry.startDate),
      cycleEntry.cycleLength,
      cycleEntry.periodLength
    )
  }

  return (
    <div
      className="rounded-2xl p-4 sm:p-5"
      style={{
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.07)',
      }}
    >
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          onClick={() => changeMonth(-1)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-rose-50 transition-colors text-rose-400 hover:text-rose-600 font-bold"
          whileTap={{ scale: 0.9 }}
        >
          ←
        </motion.button>
        <h2 className="text-base font-extrabold text-rose-800 capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h2>
        <motion.button
          onClick={() => changeMonth(1)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-rose-50 transition-colors text-rose-400 hover:text-rose-600 font-bold"
          whileTap={{ scale: 0.9 }}
        >
          →
        </motion.button>
      </div>

      {/* No data banner */}
      {!cycleEntry && (
        <p className="text-center text-xs text-gray-400 mb-3 font-medium">
          Registrá el inicio del ciclo para ver las fases 👆
        </p>
      )}

      {/* Phase legend */}
      {cycleEntry && (
        <div className="flex flex-wrap gap-2 mb-3">
          {([1, 2, 3, 4] as const).map((p) => (
            <div key={p} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded-full ${phaseDayColors[p].split(' ')[0]}`} />
              <span className="text-xs text-gray-500">{phaseInfo[p].name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-center text-xs font-bold text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid — with stagger entrance */}
      <AnimatePresence mode="wait">
        <motion.div
          key={monthKey}
          className="grid grid-cols-7 gap-1"
          initial="hidden"
          animate="visible"
        >
          {/* Empty offset cells */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Day cells */}
          {days.map((day, index) => {
            const phaseData = getPhase(day)
            const today = isToday(day)

            return (
              <motion.div
                key={day.toISOString()}
                className={`
                  relative group flex items-center justify-center
                  aspect-square rounded-2xl cursor-pointer text-[10px] sm:text-xs font-bold p-0.5 sm:p-1
                  transition-shadow duration-200
                  ${phaseData ? phaseDayColors[phaseData.phase] : 'bg-white/60 hover:bg-white/80 text-gray-400'}
                  ${phaseData ? phaseTextColors[phaseData.phase] : ''}
                  ${phaseData ? phaseShadow[phaseData.phase] : ''}
                  ${today ? 'today-glow' : ''}
                `}
                variants={{
                  hidden: { opacity: 0, scale: 0.7 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { delay: (index + startOffset) * 0.018, duration: 0.25, ease: 'backOut' },
                  },
                }}
                whileHover={phaseData ? { scale: 1.13, zIndex: 10 } : { scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => phaseData && onDayClick(day, phaseData)}
              >
                <span>{format(day, 'd')}</span>

                {/* Tooltip */}
                {phaseData && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 hidden group-hover:block pointer-events-none">
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-800/90 text-white text-xs rounded-xl px-2.5 py-1.5 whitespace-nowrap shadow-lg backdrop-blur-sm"
                    >
                      <span className="mr-1">{phaseInfo[phaseData.phase].icon}</span>
                      {phaseData.phaseName}
                      <br />
                      <span className="text-gray-400 text-[10px]">Día {phaseData.dayOfCycle}</span>
                    </motion.div>
                    <div className="flex justify-center mt-0.5">
                      <div
                        className="w-0 h-0"
                        style={{
                          borderLeft: '5px solid transparent',
                          borderRight: '5px solid transparent',
                          borderTop: '5px solid rgba(31,41,55,0.9)',
                        }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
