'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Phase } from '@/lib/cycleLogic'
import { phaseMessages, phaseInfo } from '@/lib/phases'

interface PhaseCardProps {
  phase: Phase
  dayOfCycle: number
}

export default function PhaseCard({ phase, dayOfCycle }: PhaseCardProps) {
  const [message, setMessage] = useState('')
  const info = phaseInfo[phase]

  useEffect(() => {
    const msgs = phaseMessages[phase]
    setMessage(msgs[Math.floor(Math.random() * msgs.length)])
  }, [phase])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phase}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3 }}
        className="w-full mt-2 px-2"
      >
        {/* ── Bubble tail pointing UP at mascot ─────────── */}
        <div className="flex justify-center">
          <div
            className="w-0 h-0"
            style={{
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderBottom: '14px solid rgba(255,255,255,0.45)',
              filter: 'drop-shadow(0 -1px 1px rgba(0,0,0,0.04))',
            }}
          />
        </div>

        {/* ── Speech bubble (glassmorphism) ─────────────── */}
        <div
          className="rounded-2xl px-4 py-4"
          style={{
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.07)',
          }}
        >
          {/* Phase badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{info.icon}</span>
            <span
              className={`font-black text-xs tracking-[0.18em] uppercase ${info.textColor}`}
            >
              {info.name}
            </span>
            <span className={`ml-auto text-xs font-bold ${info.textColor} opacity-60`}>
              Día {dayOfCycle}
            </span>
          </div>

          {/* Message */}
          {message && (
            <p className={`text-sm leading-relaxed font-semibold ${info.textColor}`}>
              {message}
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
