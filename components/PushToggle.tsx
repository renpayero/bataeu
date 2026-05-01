'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COUPLE_NICKNAMES } from '@/lib/coupleConfig'
import {
  checkPushSupport,
  getCurrentSubscription,
  requestNotificationPermission,
  subscribePush,
  unsubscribePush,
} from '@/lib/push/client'

const LABEL_OPTIONS = [COUPLE_NICKNAMES.name2, COUPLE_NICKNAMES.name1] as const
type LabelOption = (typeof LABEL_OPTIONS)[number]

type Status =
  | { kind: 'loading' }
  | { kind: 'unsupported'; reason: string }
  | { kind: 'ios-install-needed' }
  | { kind: 'denied' }
  | { kind: 'idle' } // permission default + no sub
  | { kind: 'subscribed'; label: LabelOption | null }

const SUPPORT_REASON_TEXT: Record<string, string> = {
  'no-window': 'No disponible en este entorno',
  'no-sw': 'Service Workers no soportados',
  'no-push': 'Push no soportado por el navegador',
  'no-notification': 'Notificaciones no soportadas',
}

export default function PushToggle() {
  const [status, setStatus] = useState<Status>({ kind: 'loading' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [labelChoice, setLabelChoice] = useState<LabelOption>(LABEL_OPTIONS[0])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const support = checkPushSupport()
      if (!support.ok) {
        if (cancelled) return
        if (support.reason === 'ios-not-installed') {
          setStatus({ kind: 'ios-install-needed' })
        } else {
          setStatus({
            kind: 'unsupported',
            reason: SUPPORT_REASON_TEXT[support.reason] ?? support.reason,
          })
        }
        return
      }

      // SW se registra solo en producción (ver components/RegisterSW.tsx).
      // En dev, no esperamos sub. Detectamos con Notification.permission.
      if (Notification.permission === 'denied') {
        if (!cancelled) setStatus({ kind: 'denied' })
        return
      }

      const sub = await getCurrentSubscription()
      if (cancelled) return
      if (sub && Notification.permission === 'granted') {
        // Hay sub local. No sabemos el label sin guardarlo en localStorage; lo dejamos como null.
        const stored = localStorage.getItem('hormonitas-push-label')
        const validStored = LABEL_OPTIONS.find((opt) => opt === stored) ?? null
        setStatus({ kind: 'subscribed', label: validStored })
        if (validStored) setLabelChoice(validStored)
      } else {
        setStatus({ kind: 'idle' })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleEnable() {
    setError(null)
    setBusy(true)
    try {
      const perm = await requestNotificationPermission()
      if (perm !== 'granted') {
        setStatus({ kind: 'denied' })
        return
      }
      const sub = await subscribePush(labelChoice)
      localStorage.setItem('hormonitas-push-label', labelChoice)
      setStatus({ kind: 'subscribed', label: labelChoice })
      // Notif de prueba para confirmar que efectivamente funcionan.
      fetch('/api/push/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      }).catch(() => {
        // silencioso: no romper el flujo si falla
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al activar')
    } finally {
      setBusy(false)
    }
  }

  async function handleDisable() {
    setError(null)
    setBusy(true)
    try {
      await unsubscribePush()
      localStorage.removeItem('hormonitas-push-label')
      setStatus({ kind: 'idle' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al desactivar')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-2xl px-4 py-3 bg-white/55 border border-rose-200/60">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">🔔</span>
        <p className="text-sm font-bold text-rose-700">Notificaciones</p>
      </div>

      <AnimatePresence mode="wait">
        {status.kind === 'loading' && (
          <motion.p
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-gray-500"
          >
            Cargando…
          </motion.p>
        )}

        {status.kind === 'unsupported' && (
          <motion.p
            key="unsup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-gray-500"
          >
            {status.reason}
          </motion.p>
        )}

        {status.kind === 'ios-install-needed' && (
          <motion.div
            key="ios"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-gray-600 leading-relaxed"
          >
            Para recibir notificaciones en iPhone, primero hay que instalar la app:
            tocá <span className="font-bold">Compartir</span> → <span className="font-bold">Añadir a pantalla de inicio</span>.
            Después abrí desde el ícono y volvé acá.
          </motion.div>
        )}

        {status.kind === 'denied' && (
          <motion.div
            key="denied"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-gray-600 leading-relaxed"
          >
            Las notificaciones están bloqueadas. Tenés que habilitarlas manualmente en
            la configuración del navegador para esta app.
          </motion.div>
        )}

        {status.kind === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <p className="text-xs text-gray-600 leading-relaxed">
              Recordatorios del ciclo y de fechas especiales.
            </p>
            <div className="flex gap-1.5 text-xs">
              {LABEL_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setLabelChoice(opt)}
                  className={`flex-1 px-2 py-1 rounded-lg font-bold transition-colors ${
                    labelChoice === opt
                      ? 'bg-rose-500 text-white'
                      : 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <motion.button
              type="button"
              onClick={handleEnable}
              disabled={busy}
              whileTap={{ scale: 0.97 }}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 disabled:opacity-60"
            >
              {busy ? 'Activando…' : 'Activar notificaciones'}
            </motion.button>
          </motion.div>
        )}

        {status.kind === 'subscribed' && (
          <motion.div
            key="sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <p className="text-xs text-rose-600 font-medium">
              Activadas
              {status.label ? ` para ${status.label}` : ''} ✓
            </p>
            <motion.button
              type="button"
              onClick={handleDisable}
              disabled={busy}
              whileTap={{ scale: 0.97 }}
              className="w-full py-1.5 px-3 rounded-xl text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 disabled:opacity-60"
            >
              {busy ? 'Desactivando…' : 'Desactivar'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-2 text-xs text-rose-700 bg-rose-50 rounded-lg px-2 py-1">{error}</p>}
    </div>
  )
}
