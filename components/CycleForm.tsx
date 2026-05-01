'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

interface CycleFormProps {
  onSaved: () => Promise<void>
  onClose: () => void
}

export default function CycleForm({ onSaved, onClose }: CycleFormProps) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const [startDate, setStartDate] = useState(today)
  const [cycleLength, setCycleLength] = useState(28)
  const [periodLength, setPeriodLength] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, cycleLength, periodLength }),
      })
      if (!res.ok) throw new Error('Error al guardar')
      await onSaved()
      onClose()
    } catch {
      setError('No se pudo guardar. ¿Está corriendo la base de datos?')
    } finally {
      setLoading(false)
    }
  }

  return (
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
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
          <div
            className="w-full max-w-sm glass-strong rounded-3xl shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold text-rose-800">
                🩸 Registrar inicio de ciclo
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={today}
                  required
                  className="w-full border border-rose-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">
                    Duración del ciclo
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={cycleLength}
                      onChange={(e) => setCycleLength(Number(e.target.value))}
                      min={21}
                      max={45}
                      className="w-full border border-rose-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                    <span className="text-xs text-gray-400 whitespace-nowrap">días</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">
                    Duración del sangrado
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={periodLength}
                      onChange={(e) => setPeriodLength(Number(e.target.value))}
                      min={2}
                      max={10}
                      className="w-full border border-rose-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                    <span className="text-xs text-gray-400 whitespace-nowrap">días</span>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-500 font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors text-sm"
              >
                {loading ? 'Guardando...' : '💾 Guardar ciclo'}
              </button>
            </form>
          </div>
      </motion.div>
    </>
  )
}
