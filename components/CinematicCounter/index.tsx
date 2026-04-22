'use client'

import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ACTS, type ActKey, getTodayEasterEgg } from './cinematicData'
import { useAssetPreloader } from './useAssetPreloader'
import { useCinematicAudio } from './useCinematicAudio'
import { setMemoriesOverride, type Memory } from './memoriesManifest'
import Act1Opening from './Acts/Act1Opening'
import Act2Origin from './Acts/Act2Origin'
import Act3Mosaic from './Acts/Act3Mosaic'
import Act4Crescendo from './Acts/Act4Crescendo'
import Act5Anchor from './Acts/Act5Anchor'
import Act6Sweep from './Acts/Act6Sweep'
import Act7Finale from './Acts/Act7Finale'

interface Props {
  onClose: () => void
}

type Stage = 'loading' | 'ready' | 'playing' | 'holding' | 'done'

// Cuánto tiempo queda en pantalla el último acto con la música sonando
// antes de auto-cerrar (si ella no la cierra manualmente antes).
const HOLD_AFTER_FINALE_MS = 10000

function renderAct(key: ActKey) {
  switch (key) {
    case 'opening':   return <Act1Opening />
    case 'origin':    return <Act2Origin />
    case 'mosaic':    return <Act3Mosaic />
    case 'crescendo': return <Act4Crescendo />
    case 'anchor':    return <Act5Anchor />
    case 'sweep':     return <Act6Sweep />
    case 'finale':    return <Act7Finale />
  }
}

export default function CinematicCounter({ onClose }: Props) {
  const [stage, setStage] = useState<Stage>('loading')
  const [actIndex, setActIndex] = useState(0)
  const [muted, setMutedState] = useState(false)
  const [feedResolved, setFeedResolved] = useState(false)
  const easterEgg = getTodayEasterEgg()
  const { ready, progress, loadedCount, totalCount, failedCount } =
    useAssetPreloader(stage === 'loading' && feedResolved)
  const { prime, start, stop, setMuted: setAudioMuted } = useCinematicAudio(muted)

  // Al montar, consulta el override de galería. Si el flag está OFF, setOverride(null)
  // (comportamiento 100% idéntico al hardcodeado). Siempre resuelve para que el
  // preloader arranque — incluso si el fetch falla.
  useEffect(() => {
    let alive = true
    fetch('/api/galeria/cinematic-feed')
      .then((r) => r.json())
      .then((data: { enabled: boolean; memories: Memory[] }) => {
        if (!alive) return
        setMemoriesOverride(data?.enabled && Array.isArray(data.memories) ? data.memories : null)
      })
      .catch(() => {
        if (!alive) return
        setMemoriesOverride(null)
      })
      .finally(() => {
        if (alive) setFeedResolved(true)
      })
    return () => {
      alive = false
      setMemoriesOverride(null)
    }
  }, [])

  // Cuando preload termina, pasar a 'ready'
  useEffect(() => {
    if (stage === 'loading' && ready) {
      setStage('ready')
    }
  }, [stage, ready])

  // Avanzar entre actos según durationMs
  useEffect(() => {
    if (stage !== 'playing') return
    const act = ACTS[actIndex]
    if (!act) {
      setStage('holding')
      return
    }
    const id = setTimeout(() => {
      if (actIndex + 1 >= ACTS.length) {
        // Último acto terminó → holding (la pantalla queda con el finale)
        setStage('holding')
      } else {
        setActIndex((i) => i + 1)
      }
    }, act.durationMs)
    return () => clearTimeout(id)
  }, [stage, actIndex])

  // Durante 'holding' sigue la música. Auto-cierra tras 10s si no la cerraron.
  useEffect(() => {
    if (stage !== 'holding') return
    const id = setTimeout(() => setStage('done'), HOLD_AFTER_FINALE_MS)
    return () => clearTimeout(id)
  }, [stage])

  // Cuando done, fade out audio + cerrar
  useEffect(() => {
    if (stage !== 'done') return
    stop()
    const t = setTimeout(() => onClose(), 900)
    return () => clearTimeout(t)
  }, [stage, onClose, stop])

  // Sincronizar mute toggle con audio hook
  useEffect(() => {
    setAudioMuted(muted)
  }, [muted, setAudioMuted])

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setStage('done')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleStart = useCallback(() => {
    prime()
    // Pequeño delay para que el seek al offset se aplique antes de play
    setTimeout(() => {
      start()
      setStage('playing')
    }, 80)
  }, [prime, start])

  const handleSkip = useCallback(() => {
    setStage('done')
  }, [])

  // Portal a body para garantizar fullscreen por encima de todo
  if (typeof document === 'undefined') return null

  const content = (
    <motion.div
      className="fixed inset-0 z-[9999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: stage === 'done' ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9 }}
      style={{ background: '#000' }}
    >
      {/* Loading */}
      <AnimatePresence mode="wait">
        {stage === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          >
            <motion.div
              className="w-16 h-16 rounded-full mb-6"
              style={{
                background:
                  'conic-gradient(from 0deg, rgba(244,63,94,0.2), rgba(244,63,94,0.9), rgba(244,63,94,0.2))',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-xs uppercase tracking-[0.35em] text-rose-200/70 mb-3">
              Preparando los recuerdos
            </p>
            <div className="w-56 h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full"
                style={{
                  background:
                    'linear-gradient(90deg, #f43f5e, #ec4899, #f59e0b)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.round(progress * 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="mt-3 text-[11px] text-rose-300/50">
              {loadedCount + failedCount} / {totalCount}
            </p>
          </motion.div>
        )}

        {stage === 'ready' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            {easterEgg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-3 flex flex-col items-center gap-2"
              >
                <span className="text-2xl">✨</span>
                <p className="text-[11px] uppercase tracking-[0.35em] text-rose-300">
                  {easterEgg.kicker}
                </p>
                <p
                  className="font-playfair italic text-base md:text-lg text-rose-50 max-w-md"
                  style={{ textShadow: '0 2px 16px rgba(244,63,94,0.6)' }}
                >
                  {easterEgg.message}
                </p>
              </motion.div>
            )}
            <motion.p
              className="text-xs uppercase tracking-[0.45em] text-rose-200 mb-6"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              Todo listo
            </motion.p>
            <motion.button
              onClick={handleStart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="px-8 py-4 rounded-full text-sm font-bold text-white uppercase tracking-[0.3em]"
              style={{
                background:
                  'linear-gradient(135deg, #f43f5e, #be123c)',
                boxShadow: '0 15px 45px rgba(244, 63, 94, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              Empezar
            </motion.button>
            <label className="mt-8 flex items-center gap-2 text-xs text-rose-200/60 cursor-pointer">
              <input
                type="checkbox"
                checked={muted}
                onChange={(e) => setMutedState(e.target.checked)}
                className="accent-rose-500"
              />
              <span>silenciar audio</span>
            </label>
            <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-rose-300/40">
              esc para salir
            </p>
          </motion.div>
        )}

        {(stage === 'playing' || stage === 'holding') && (
          <motion.div key={`act-${actIndex}`} className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={ACTS[actIndex].key}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {renderAct(ACTS[actIndex].key)}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controles flotantes */}
      {(stage === 'playing' || stage === 'holding') && (
        <div className="absolute top-6 right-6 z-[10000] flex gap-3">
          <button
            onClick={() => setMutedState((m) => !m)}
            className="w-9 h-9 flex items-center justify-center rounded-full text-white/80 hover:text-white text-sm"
            style={{
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
            aria-label={muted ? 'Activar audio' : 'Silenciar audio'}
          >
            {muted ? '🔕' : '🔔'}
          </button>
          <button
            onClick={handleSkip}
            className="px-4 h-9 rounded-full text-xs text-white/80 hover:text-white tracking-widest uppercase"
            style={{
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            Saltar ›
          </button>
        </div>
      )}

      {/* Progress bar: avanza durante 'playing', queda llena en 'holding' */}
      {(stage === 'playing' || stage === 'holding') && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
          <motion.div
            key={`bar-${actIndex}-${stage}`}
            className="h-full"
            style={{
              background:
                'linear-gradient(90deg, #f43f5e 0%, #ec4899 100%)',
            }}
            initial={{
              width:
                stage === 'holding'
                  ? '100%'
                  : `${(actIndex / ACTS.length) * 100}%`,
            }}
            animate={{
              width:
                stage === 'holding'
                  ? '100%'
                  : `${((actIndex + 1) / ACTS.length) * 100}%`,
            }}
            transition={{
              duration:
                stage === 'holding' ? 0 : ACTS[actIndex].durationMs / 1000,
              ease: 'linear',
            }}
          />
        </div>
      )}
    </motion.div>
  )

  return createPortal(content, document.body)
}
