'use client'

import { motion } from 'framer-motion'
import type { Phase } from '@/lib/cycleLogic'

interface MascotProps {
  phase: Phase
  variant?: 'default' | 'hungry'
  containerClassName?: string
}

const phaseColors = {
  1: { primary: '#7f1d1d', secondary: '#b91c1c', grad1: '#b91c1c', grad2: '#7f1d1d' },
  2: { primary: '#9f1239', secondary: '#e11d48', grad1: '#e11d48', grad2: '#9f1239' },
  3: { primary: '#831843', secondary: '#db2777', grad1: '#db2777', grad2: '#831843' },
  4: { primary: '#4c1d95', secondary: '#7c3aed', grad1: '#7c3aed', grad2: '#4c1d95' },
}

// Phase 3: floating hearts
function FloatingHeart({ delay, xPercent }: { delay: number; xPercent: string }) {
  return (
    <motion.div
      className="absolute text-lg select-none pointer-events-none"
      style={{ left: xPercent, bottom: '58%' }}
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{ opacity: [0, 1, 1, 0], y: -90, scale: [0.5, 1.2, 1, 0.8] }}
      transition={{ duration: 2.6, delay, repeat: Infinity, repeatDelay: 1.5, ease: 'easeOut' }}
    >
      💗
    </motion.div>
  )
}

// Hungry variant colors (ovulation pink-fuchsia)
const hungryColors = {
  primary: '#831843',
  secondary: '#db2777',
  grad1: '#db2777',
  grad2: '#831843',
}

export default function Mascot({ phase, variant = 'default', containerClassName }: MascotProps) {
  const isHungry = variant === 'hungry'
  const col = isHungry ? hungryColors : phaseColors[phase]
  const gradId = `bodyGrad-${phase}-${isHungry ? 'hungry' : 'default'}`
  const eyeGradId = `eyeGrad-${phase}-${isHungry ? 'hungry' : 'default'}`

  // Per-phase idle animation (matches user spec)
  const defaultBodyAnimation = {
    1: {
      // Menstruación: breathing lento — scale 1 → 0.97
      animate: { scale: [1, 0.97, 1] as number[] },
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
    },
    2: {
      // Folicular: bounce suave -8px cada 1.5s
      animate: { y: [0, -8, 0] },
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const },
    },
    3: {
      // Ovulación: leve sway (hearts handled separately)
      animate: { rotate: [-1.5, 1.5, -1.5] },
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const },
    },
    4: {
      // Lútea: micro-shake cada 4 segundos
      animate: { x: [0, -5, 5, -5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] as number[] },
      transition: {
        duration: 0.7,
        repeat: Infinity,
        repeatDelay: 3.8,
        ease: 'easeInOut' as const,
      },
    },
  }[phase]

  // Hungry variant: anxious bounce
  const hungryBodyAnimation = {
    animate: { y: [0, -12, 0] },
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' as const },
  }

  const bodyAnimation = isHungry ? hungryBodyAnimation : defaultBodyAnimation

  return (
    <motion.div
      initial={{ opacity: 0, y: -24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
    >
    <div className={containerClassName ?? "relative flex items-center justify-center w-[140px] h-[185px] sm:w-[180px] sm:h-[240px]"}>
      {/* Pizza emoji floating above mascot — hungry variant */}
      {isHungry && (
        <motion.div
          className="absolute text-3xl select-none pointer-events-none"
          style={{ top: '-10px', right: '10px', zIndex: 10 }}
          animate={{ rotate: [0, 15, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          🍕
        </motion.div>
      )}

      {/* Hearts for phase 3 (only in default variant) */}
      {phase === 3 && !isHungry && (
        <>
          <FloatingHeart delay={0} xPercent="8%" />
          <FloatingHeart delay={1.0} xPercent="65%" />
          <FloatingHeart delay={1.9} xPercent="38%" />
        </>
      )}

      <motion.div
        animate={bodyAnimation.animate}
        transition={bodyAnimation.transition}
        style={{ originX: '50%', originY: '80%' }}
      >
        <svg
          viewBox="0 0 100 148"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
        >
          <defs>
            <radialGradient id={gradId} cx="38%" cy="30%" r="70%">
              <stop offset="0%" stopColor={col.grad1} />
              <stop offset="100%" stopColor={col.grad2} />
            </radialGradient>
            <radialGradient id={eyeGradId} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="white" />
              <stop offset="100%" stopColor="#f5f5f5" />
            </radialGradient>
          </defs>

          {/* ── BODY ──────────────────────────────────────── */}
          <path
            d="M50,8 C74,22 88,62 88,92 A38,38 0 1 1 12,92 C12,62 26,22 50,8 Z"
            fill={`url(#${gradId})`}
          />

          {/* Body sheen */}
          <ellipse
            cx="36" cy="34" rx="10" ry="16"
            fill="rgba(255,255,255,0.15)"
            transform="rotate(-22, 36, 34)"
          />

          {/* ── ARMS ──────────────────────────────────────── */}
          {phase === 4 ? (
            <>
              <path d="M16,90 Q18,105 33,108" stroke={col.grad2} strokeWidth="5" fill="none" strokeLinecap="round" />
              <circle cx="34" cy="109" r="5" fill={col.grad2} />
              <path d="M84,90 Q82,105 67,108" stroke={col.grad2} strokeWidth="5" fill="none" strokeLinecap="round" />
              <circle cx="66" cy="109" r="5" fill={col.grad2} />
            </>
          ) : (
            <>
              <path d="M16,83 Q6,89 7,99" stroke={col.grad2} strokeWidth="5" fill="none" strokeLinecap="round" />
              <circle cx="7" cy="100" r="5" fill={col.grad2} />
              <path d="M84,83 Q94,89 93,99" stroke={col.grad2} strokeWidth="5" fill="none" strokeLinecap="round" />
              <circle cx="93" cy="100" r="5" fill={col.grad2} />
            </>
          )}

          {/* ── LEGS ──────────────────────────────────────── */}
          <path d="M43,128 L37,142" stroke={col.grad2} strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="35" cy="143" rx="6" ry="2.8" fill={col.grad2} />
          <path d="M57,128 L63,142" stroke={col.grad2} strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="65" cy="143" rx="6" ry="2.8" fill={col.grad2} />

          {/* ── EYES ──────────────────────────────────────── */}
          <circle cx="37" cy="83" r="9" fill={`url(#${eyeGradId})`} />
          {phase === 3 && !isHungry ? (
            <path d="M54,83 Q63,77 72,83" stroke="#1f2937" fill="none" strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            <circle cx="63" cy="83" r="9" fill={`url(#${eyeGradId})`} />
          )}

          {/* Pupils */}
          {phase === 1 && !isHungry ? (
            <>
              <circle cx="37" cy="86" r="5" fill="#1f2937" />
              <circle cx="35" cy="84" r="1.5" fill="rgba(255,255,255,0.7)" />
            </>
          ) : (
            <>
              <circle cx="37" cy="83" r="5" fill="#1f2937" />
              <circle cx="35" cy="81" r="1.8" fill="rgba(255,255,255,0.8)" />
            </>
          )}
          {(phase !== 3 || isHungry) && (
            phase === 1 && !isHungry ? (
              <>
                <circle cx="63" cy="86" r="5" fill="#1f2937" />
                <circle cx="61" cy="84" r="1.5" fill="rgba(255,255,255,0.7)" />
              </>
            ) : (
              <>
                <circle cx="63" cy="83" r="5" fill="#1f2937" />
                <circle cx="61" cy="81" r="1.8" fill="rgba(255,255,255,0.8)" />
              </>
            )
          )}

          {/* Drooping lids — Phase 1 */}
          {phase === 1 && (
            <>
              <path d="M28,84 Q37,74 46,84 Z" fill={col.primary} />
              <path d="M54,84 Q63,74 72,84 Z" fill={col.primary} />
            </>
          )}

          {/* Sparkles — Phase 2 */}
          {phase === 2 && (
            <>
              <circle cx="45" cy="73" r="2" fill="#fbbf24" />
              <circle cx="71" cy="73" r="2" fill="#fbbf24" />
              <circle cx="47" cy="70" r="1" fill="#fde68a" />
              <circle cx="73" cy="70" r="1" fill="#fde68a" />
            </>
          )}

          {/* Blush — Phase 3 (default variant only) */}
          {phase === 3 && !isHungry && (
            <>
              <circle cx="28" cy="92" r="7" fill="rgba(251,113,133,0.32)" />
              <circle cx="72" cy="92" r="7" fill="rgba(251,113,133,0.32)" />
            </>
          )}

          {/* ── EYEBROWS ──────────────────────────────────── */}
          {phase === 1 && (
            <>
              <path d="M30,72 Q37,70 44,72" stroke="#374151" fill="none" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M56,72 Q63,70 70,72" stroke="#374151" fill="none" strokeWidth="2.2" strokeLinecap="round" />
            </>
          )}
          {phase === 2 && (
            <>
              <path d="M30,69 Q37,65 44,69" stroke="#374151" fill="none" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M56,69 Q63,65 70,69" stroke="#374151" fill="none" strokeWidth="2.2" strokeLinecap="round" />
            </>
          )}
          {phase === 3 && (
            <>
              <path d="M30,68 Q37,64 44,69" stroke="#374151" fill="none" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M56,71 Q63,68 70,71" stroke="#374151" fill="none" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}
          {phase === 4 && (
            <>
              <path d="M30,70 Q37,73 44,76" stroke="#374151" fill="none" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M56,76 Q63,73 70,70" stroke="#374151" fill="none" strokeWidth="2.8" strokeLinecap="round" />
            </>
          )}

          {/* ── MOUTH ─────────────────────────────────────── */}
          {isHungry ? (
            <ellipse cx="50" cy="103" rx="10" ry="7" fill="#1f2937" />
          ) : (
            <>
              {phase === 1 && <path d="M40,100 Q50,106 60,100" stroke="#1f2937" fill="none" strokeWidth="2.2" strokeLinecap="round" />}
              {phase === 2 && <path d="M37,99 Q50,113 63,99" stroke="#1f2937" fill="none" strokeWidth="2.2" strokeLinecap="round" />}
              {phase === 3 && <path d="M40,98 Q50,110 60,98" stroke="#1f2937" fill="none" strokeWidth="2.2" strokeLinecap="round" />}
              {phase === 4 && <path d="M40,101 Q50,97 60,101" stroke="#1f2937" fill="none" strokeWidth="2.5" strokeLinecap="round" />}
            </>
          )}

          {/* Sweat drop — Phase 1 */}
          {phase === 1 && (
            <path d="M78,38 C79,44 83,46 81,50 C79,54 75,52 76,48 C77,44 77,41 78,38 Z" fill="#93c5fd" opacity={0.85} />
          )}
        </svg>
      </motion.div>
    </div>
    </motion.div>
  )
}
