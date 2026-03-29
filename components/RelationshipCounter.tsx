'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { COUPLE_START_DATE, COUPLE_NAMES } from '@/lib/coupleConfig'

function computeDiff(start: Date) {
  const diffMs = Date.now() - start.getTime()
  const days = Math.floor(diffMs / 86400000)
  const hours = Math.floor((diffMs % 86400000) / 3600000)
  const minutes = Math.floor((diffMs % 3600000) / 60000)
  const seconds = Math.floor((diffMs % 60000) / 1000)
  return { days, hours, minutes, seconds }
}

export default function RelationshipCounter() {
  const [diff, setDiff] = useState(() => computeDiff(COUPLE_START_DATE))

  useEffect(() => {
    const id = setInterval(() => setDiff(computeDiff(COUPLE_START_DATE)), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="rounded-3xl px-6 py-8 text-center"
      style={{
        background: 'rgba(255, 255, 255, 0.45)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.07)',
      }}
    >
      {/* Names */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <span className="font-playfair text-2xl font-bold text-rose-700">
          {COUPLE_NAMES.name1}
        </span>
        <motion.span
          className="text-2xl"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          💕
        </motion.span>
        <span className="font-playfair text-2xl font-bold text-rose-700">
          {COUPLE_NAMES.name2}
        </span>
      </div>

      {/* Main counter: days */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
      >
        <span className="font-playfair text-7xl sm:text-8xl font-extrabold text-rose-600 leading-none">
          {diff.days}
        </span>
        <p className="text-sm font-bold text-rose-400 mt-2 uppercase tracking-widest">
          días juntos
        </p>
      </motion.div>

      {/* Sub counter: h / m / s */}
      <div className="flex items-center justify-center gap-4 mt-6">
        {[
          { value: diff.hours, label: 'horas' },
          { value: diff.minutes, label: 'min' },
          { value: diff.seconds, label: 'seg' },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center">
            <span className="font-playfair text-2xl font-bold text-rose-500">
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
