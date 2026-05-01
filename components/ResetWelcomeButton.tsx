'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { resetClientState } from '@/lib/devReset'

export default function ResetWelcomeButton() {
  const [confirming, setConfirming] = useState(false)
  const [done, setDone] = useState(false)

  function handleConfirm() {
    const { cleared } = resetClientState()
    setDone(true)
    setConfirming(false)
    setTimeout(() => {
      setDone(false)
      if (cleared.length > 0) window.location.reload()
    }, 900)
  }

  return (
    <div className="pt-6 pb-2 flex flex-col items-center gap-2">
      <AnimatePresence mode="wait">
        {done ? (
          <motion.p
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[11px] text-rose-500"
          >
            Estado limpiado ✓
          </motion.p>
        ) : confirming ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-[11px] text-gray-500 text-center max-w-xs">
              Borra cartas de bienvenida, celebraciones de racha, timer y preferencia de notificaciones.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConfirm}
                className="px-3 py-1 text-[11px] font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg"
              >
                Confirmar
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="px-3 py-1 text-[11px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="trigger"
            type="button"
            onClick={() => setConfirming(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileTap={{ scale: 0.97 }}
            className="text-[10px] text-gray-400 hover:text-rose-500 underline underline-offset-2 transition-colors"
          >
            Resetear pantallas de bienvenida
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
