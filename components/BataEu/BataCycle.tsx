'use client'

import { motion } from 'framer-motion'
import type { Phase } from '@/lib/cycleLogic'

/**
 * Bata Eu por fase del ciclo. Cuatro variantes con paleta y pose distintas.
 *   fase 1 (menstruación) — cozy con bolsa de agua caliente y mantita, cansadito
 *   fase 2 (folicular)   — enérgico, saltando con chispa, sparkles verdes
 *   fase 3 (ovulación)   — glamoroso, brillos rosas, labios y corazones
 *   fase 4 (lútea)       — gruñón con nube de tormenta y rayos, ceño fruncido
 */
interface Props {
  phase: Phase
  className?: string
}

interface PhasePalette {
  body1: string
  body2: string
  body3: string
  deeper: string
  accent: string
  soft: string
}

const palettes: Record<Phase, PhasePalette> = {
  1: {
    body1: '#fb7185', body2: '#e11d48', body3: '#9f1239', deeper: '#7f1d1d',
    accent: '#fca5a5', soft: 'rgba(254,205,211,0.5)',
  },
  2: {
    body1: '#86efac', body2: '#22c55e', body3: '#15803d', deeper: '#14532d',
    accent: '#bbf7d0', soft: 'rgba(187,247,208,0.55)',
  },
  3: {
    body1: '#f472b6', body2: '#db2777', body3: '#9d174d', deeper: '#831843',
    accent: '#fce7f0', soft: 'rgba(249,168,212,0.5)',
  },
  4: {
    body1: '#c4b5fd', body2: '#8b5cf6', body3: '#5b21b6', deeper: '#3b0764',
    accent: '#ddd6fe', soft: 'rgba(196,181,253,0.5)',
  },
}

export default function BataCycle({ phase, className = '' }: Props) {
  const P = palettes[phase]
  return (
    <div className={`relative ${className}`}>
      {/* Halo por fase */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-full"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${hexToRgba(P.body2, 0.28)}, ${hexToRgba(P.accent, 0.16)} 45%, transparent 72%)`,
          filter: 'blur(26px)',
        }}
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.05, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {phase === 1 && <Phase1 P={P} />}
      {phase === 2 && <Phase2 P={P} />}
      {phase === 3 && <Phase3 P={P} />}
      {phase === 4 && <Phase4 P={P} />}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
//  FASE 1 — MENSTRUACIÓN: cozy, bolsa de agua caliente, manta
// ═══════════════════════════════════════════════════════
function Phase1({ P }: { P: PhasePalette }) {
  return (
    <>
      {/* Ondas de calor subiendo desde la bolsa */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute select-none pointer-events-none font-bold"
          style={{
            left: `${34 + i * 10}%`,
            top: '54%',
            fontSize: 16,
            color: 'rgba(251,113,133,0.55)',
          }}
          animate={{ y: [0, -24], opacity: [0, 0.8, 0], scale: [0.7, 1.1, 0.7] }}
          transition={{ duration: 2.4, delay: i * 0.5, repeat: Infinity, ease: 'easeOut' }}
        >
          ∿
        </motion.span>
      ))}

      <svg viewBox="0 0 220 230" width="100%" height="100%" overflow="visible" aria-hidden="true">
        <defs>
          <radialGradient id="p1Body" cx="40%" cy="28%" r="78%">
            <stop offset="0%" stopColor={P.body1} />
            <stop offset="60%" stopColor={P.body2} />
            <stop offset="100%" stopColor={P.body3} />
          </radialGradient>
          <linearGradient id="p1Blanket" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fecdd3" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
          <linearGradient id="p1Bottle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
          <radialGradient id="p1Floor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(79,10,31,0.28)" />
            <stop offset="100%" stopColor="rgba(79,10,31,0)" />
          </radialGradient>
        </defs>
        <ellipse cx="110" cy="218" rx="72" ry="7" fill="url(#p1Floor)" />

        {/* Cuerpo respirando lento */}
        <motion.g
          animate={{ scale: [1, 0.965, 1] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '110px 170px' }}
        >
          <path
            d="M110,28 C140,46 156,86 156,124 C156,164 136,196 110,198 C84,196 64,164 64,124 C64,86 80,46 110,28 Z"
            fill="url(#p1Body)"
          />
          <ellipse cx="88" cy="60" rx="11" ry="20" fill="rgba(255,255,255,0.17)" transform="rotate(-20, 88, 60)" />

          {/* Manta envolviendo la parte inferior */}
          <path
            d="M54,144 Q62,130 80,132 Q110,128 140,132 Q158,130 166,144 L164,200 Q130,208 110,206 Q90,208 56,200 Z"
            fill="url(#p1Blanket)"
            opacity="0.92"
          />
          {/* Textura tejido */}
          <g stroke="rgba(127,29,29,0.4)" strokeWidth="0.6" opacity="0.6">
            <line x1="60" y1="160" x2="160" y2="160" />
            <line x1="60" y1="170" x2="160" y2="170" />
            <line x1="60" y1="180" x2="160" y2="180" />
            <line x1="60" y1="190" x2="160" y2="190" />
          </g>

          {/* Bolsa de agua caliente sobre la panza */}
          <g transform="translate(84, 118)">
            <ellipse cx="26" cy="30" rx="22" ry="3" fill="rgba(79,10,31,0.3)" />
            <path d="M6,10 Q6,0 16,0 L36,0 Q46,0 46,10 L46,28 Q46,34 40,34 L12,34 Q6,34 6,28 Z" fill="url(#p1Bottle)" />
            {/* Cuello/tapón */}
            <rect x="20" y="-6" width="12" height="8" fill="#7f1d1d" />
            <rect x="18" y="-8" width="16" height="3" rx="1" fill="#4c0519" />
            {/* Ondas del líquido */}
            <path d="M12,18 Q20,14 28,18 Q36,22 42,18" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
            <path d="M12,24 Q20,20 28,24 Q36,28 42,24" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" fill="none" />
          </g>

          {/* Ojos entrecerrados (cansados) */}
          <path d="M78,84 Q88,82 98,84" stroke="#1f2937" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M122,84 Q132,82 142,84" stroke="#1f2937" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          {/* Pestañas abajo */}
          <line x1="82" y1="86" x2="81" y2="88" stroke="#1f2937" strokeWidth="1" strokeLinecap="round" />
          <line x1="95" y1="86" x2="95" y2="88" stroke="#1f2937" strokeWidth="1" strokeLinecap="round" />
          <line x1="125" y1="86" x2="125" y2="88" stroke="#1f2937" strokeWidth="1" strokeLinecap="round" />
          <line x1="139" y1="86" x2="140" y2="88" stroke="#1f2937" strokeWidth="1" strokeLinecap="round" />

          {/* Ojeras sutiles */}
          <path d="M80,92 Q88,95 96,92" stroke="#9f1239" strokeWidth="1" fill="none" opacity="0.45" strokeLinecap="round" />
          <path d="M124,92 Q132,95 140,92" stroke="#9f1239" strokeWidth="1" fill="none" opacity="0.45" strokeLinecap="round" />

          {/* Cejas tristonas (caídas) */}
          <path d="M76,74 Q88,78 100,74" stroke="#3f1d1d" strokeWidth="2.3" fill="none" strokeLinecap="round" />
          <path d="M120,74 Q132,78 144,74" stroke="#3f1d1d" strokeWidth="2.3" fill="none" strokeLinecap="round" />

          {/* Rubor febril */}
          <circle cx="66" cy="102" r="10" fill="rgba(251,113,133,0.45)" />
          <circle cx="154" cy="102" r="10" fill="rgba(251,113,133,0.45)" />

          {/* Boca — pequeña línea ligeramente caída */}
          <path d="M100,110 Q110,108 120,110" stroke="#1f2937" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </motion.g>
      </svg>
    </>
  )
}

// ═══════════════════════════════════════════════════════
//  FASE 2 — FOLICULAR: enérgico, saltando, sparkles verdes
// ═══════════════════════════════════════════════════════
function Phase2({ P }: { P: PhasePalette }) {
  return (
    <>
      {/* Sparkles verdes orbitando */}
      {[
        { x: '12%', y: '14%', delay: 0 },
        { x: '84%', y: '20%', delay: 0.6 },
        { x: '8%', y: '64%', delay: 1.2 },
        { x: '82%', y: '68%', delay: 1.8 },
      ].map((s, i) => (
        <motion.span
          key={i}
          className="absolute select-none pointer-events-none"
          style={{ left: s.x, top: s.y, fontSize: 18, color: '#22c55e' }}
          animate={{
            rotate: [0, 180, 360],
            scale: [0.6, 1.2, 0.6],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{ duration: 2.4, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          ✦
        </motion.span>
      ))}

      <svg viewBox="0 0 220 230" width="100%" height="100%" overflow="visible" aria-hidden="true">
        <defs>
          <radialGradient id="p2Body" cx="40%" cy="28%" r="78%">
            <stop offset="0%" stopColor={P.body1} />
            <stop offset="60%" stopColor={P.body2} />
            <stop offset="100%" stopColor={P.body3} />
          </radialGradient>
          <radialGradient id="p2Floor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(21,128,61,0.3)" />
            <stop offset="100%" stopColor="rgba(21,128,61,0)" />
          </radialGradient>
        </defs>

        {/* Sombra se achica al saltar */}
        <motion.ellipse
          cx="110" rx="56" ry="5" fill="url(#p2Floor)"
          animate={{ cy: [218, 218, 218], rx: [60, 40, 60], opacity: [0.7, 0.3, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Bata saltando */}
        <motion.g
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: [0.5, 0, 0.5, 1] }}
        >
          <motion.g
            animate={{ scaleY: [1, 1.06, 0.96, 1], scaleX: [1, 0.96, 1.04, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '110px 190px' }}
          >
            <path
              d="M110,28 C140,46 156,86 156,124 C156,160 136,188 110,190 C84,188 64,160 64,124 C64,86 80,46 110,28 Z"
              fill="url(#p2Body)"
            />
            <ellipse cx="88" cy="60" rx="11" ry="20" fill="rgba(255,255,255,0.2)" transform="rotate(-20, 88, 60)" />

            {/* Brazos arriba celebrando */}
            <motion.g
              animate={{ rotate: [-8, 8, -8] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '70px 110px' }}
            >
              <path d="M70,110 Q56,80 66,60" stroke={P.body3} strokeWidth="5.5" fill="none" strokeLinecap="round" />
              <circle cx="66" cy="60" r="5.5" fill={P.body3} />
            </motion.g>
            <motion.g
              animate={{ rotate: [8, -8, 8] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '150px 110px' }}
            >
              <path d="M150,110 Q164,80 154,60" stroke={P.body3} strokeWidth="5.5" fill="none" strokeLinecap="round" />
              <circle cx="154" cy="60" r="5.5" fill={P.body3} />
            </motion.g>

            {/* Piernas dobladas (saltando) */}
            <path d="M92,188 L86,200" stroke={P.deeper} strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="84" cy="202" rx="7" ry="3" fill={P.deeper} />
            <path d="M128,188 L134,200" stroke={P.deeper} strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="136" cy="202" rx="7" ry="3" fill={P.deeper} />

            {/* Ojos brillantes (estrellas) */}
            <motion.g
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '110px 86px' }}
            >
              <circle cx="86" cy="86" r="10" fill="white" />
              <path
                d="M86,80 L88,84 L92,84 L89,87 L90,92 L86,89 L82,92 L83,87 L80,84 L84,84 Z"
                fill="#fbbf24"
              />
              <circle cx="134" cy="86" r="10" fill="white" />
              <path
                d="M134,80 L136,84 L140,84 L137,87 L138,92 L134,89 L130,92 L131,87 L128,84 L132,84 Z"
                fill="#fbbf24"
              />
            </motion.g>

            {/* Cejas levantadas */}
            <path d="M76,72 Q86,68 96,72" stroke="#14532d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M124,72 Q134,68 144,72" stroke="#14532d" strokeWidth="2.4" fill="none" strokeLinecap="round" />

            {/* Boca abierta sonriendo ampliamente */}
            <path d="M90,112 Q110,134 130,112 Q110,122 90,112 Z" fill="#1f2937" />
            <path d="M94,114 L94,120 M102,116 L102,122 M110,116 L110,122 M118,116 L118,122 M126,114 L126,120" stroke="white" strokeWidth="1" opacity="0.55" />
            {/* Lengua */}
            <ellipse cx="110" cy="120" rx="7" ry="3" fill="#fb7185" />

            {/* Rubor de energía */}
            <circle cx="66" cy="104" r="8" fill="rgba(134,239,172,0.5)" />
            <circle cx="154" cy="104" r="8" fill="rgba(134,239,172,0.5)" />
          </motion.g>
        </motion.g>
      </svg>
    </>
  )
}

// ═══════════════════════════════════════════════════════
//  FASE 3 — OVULACIÓN: glamoroso, brillos, corazones
// ═══════════════════════════════════════════════════════
function Phase3({ P }: { P: PhasePalette }) {
  return (
    <>
      {/* Corazones alrededor */}
      {[
        { x: '10%', y: '12%', delay: 0, size: 20 },
        { x: '82%', y: '18%', delay: 0.9, size: 16 },
        { x: '14%', y: '72%', delay: 2.2, size: 14 },
        { x: '82%', y: '68%', delay: 1.5, size: 18 },
      ].map((h, i) => (
        <motion.span
          key={i}
          className="absolute select-none pointer-events-none"
          style={{ left: h.x, top: h.y, fontSize: h.size, lineHeight: 1 }}
          animate={{ y: [0, -12, 0], opacity: [0, 1, 0], scale: [0.7, 1.15, 0.7] }}
          transition={{ duration: 3.2, delay: h.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          💗
        </motion.span>
      ))}

      <svg viewBox="0 0 220 230" width="100%" height="100%" overflow="visible" aria-hidden="true">
        <defs>
          <radialGradient id="p3Body" cx="40%" cy="28%" r="78%">
            <stop offset="0%" stopColor={P.body1} />
            <stop offset="60%" stopColor={P.body2} />
            <stop offset="100%" stopColor={P.body3} />
          </radialGradient>
          <linearGradient id="p3Glint" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <radialGradient id="p3Floor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(157,23,77,0.32)" />
            <stop offset="100%" stopColor="rgba(157,23,77,0)" />
          </radialGradient>
        </defs>
        <ellipse cx="110" cy="218" rx="68" ry="7" fill="url(#p3Floor)" />

        {/* Cuerpo con leve sway */}
        <motion.g
          animate={{ rotate: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '110px 200px' }}
        >
          <path
            d="M110,28 C140,46 156,86 156,124 C156,160 136,196 110,198 C84,196 64,160 64,124 C64,86 80,46 110,28 Z"
            fill="url(#p3Body)"
          />
          <ellipse cx="88" cy="60" rx="11" ry="20" fill="rgba(255,255,255,0.22)" transform="rotate(-20, 88, 60)" />

          {/* Brillo que barre el cuerpo (shine pasando) */}
          <motion.rect
            x="-40" y="20" width="36" height="200"
            fill="url(#p3Glint)"
            transform="rotate(18, 110, 120)"
            animate={{ x: [-40, 220] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
          />

          {/* Pies */}
          <ellipse cx="94" cy="204" rx="8" ry="3" fill={P.deeper} />
          <ellipse cx="126" cy="204" rx="8" ry="3" fill={P.deeper} />

          {/* Brazos, uno en la cadera (pose coqueta) */}
          <path d="M64,122 Q56,136 62,152 Q64,160 74,164" stroke={P.body3} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M156,122 Q168,138 158,156" stroke={P.body3} strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="158" cy="157" r="5" fill={P.body3} />

          {/* Ojos cerrados con pestañas glam (pestañeo) */}
          <motion.g
            animate={{ scaleY: [1, 0.2, 1] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
            style={{ transformOrigin: '86px 88px' }}
          >
            <path d="M76,88 Q86,84 96,88" stroke="#1f2937" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            {/* Pestañas largas arriba */}
            <line x1="79" y1="86" x2="76" y2="80" stroke="#1f2937" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="85" y1="85" x2="84" y2="79" stroke="#1f2937" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="91" y1="85" x2="92" y2="79" stroke="#1f2937" strokeWidth="1.4" strokeLinecap="round" />
          </motion.g>
          <motion.g
            animate={{ scaleY: [1, 0.2, 1] }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
            style={{ transformOrigin: '134px 88px' }}
          >
            <path d="M124,88 Q134,84 144,88" stroke="#1f2937" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <line x1="127" y1="86" x2="124" y2="80" stroke="#1f2937" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="133" y1="85" x2="132" y2="79" stroke="#1f2937" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="139" y1="85" x2="140" y2="79" stroke="#1f2937" strokeWidth="1.4" strokeLinecap="round" />
          </motion.g>

          {/* Cejas suaves */}
          <path d="M76,74 Q86,70 96,74" stroke="#3f1d1d" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M124,74 Q134,70 144,74" stroke="#3f1d1d" strokeWidth="2.2" fill="none" strokeLinecap="round" />

          {/* Rubor rosa intenso */}
          <motion.g
            animate={{ opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx="66" cy="102" r="11" fill="rgba(251,113,133,0.55)" />
            <circle cx="154" cy="102" r="11" fill="rgba(251,113,133,0.55)" />
          </motion.g>

          {/* Labios pintados (rojo glam) */}
          <path d="M94,112 Q100,118 110,120 Q120,118 126,112 Q118,126 110,126 Q102,126 94,112 Z" fill="#dc2626" />
          <path d="M98,114 Q110,116 122,114" stroke="#7f1d1d" strokeWidth="0.6" fill="none" />
          {/* Highlight en labio */}
          <ellipse cx="110" cy="115" rx="4" ry="1" fill="rgba(255,255,255,0.5)" />
        </motion.g>

        {/* Brillo en corona arriba de la cabeza */}
        <motion.path
          d="M102,24 L110,8 L118,24 L114,20 L110,26 L106,20 Z"
          fill="#fde68a"
          animate={{ opacity: [0.6, 1, 0.6], y: [-2, 0, -2] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </>
  )
}

// ═══════════════════════════════════════════════════════
//  FASE 4 — LÚTEA: gruñón con nube de tormenta
// ═══════════════════════════════════════════════════════
function Phase4({ P }: { P: PhasePalette }) {
  return (
    <>
      {/* Rayito flotando al costado ocasional */}
      <motion.span
        className="absolute select-none pointer-events-none"
        style={{ left: '78%', top: '22%', fontSize: 22 }}
        animate={{ opacity: [0, 1, 0], scale: [0.7, 1.2, 0.7] }}
        transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
      >
        ⚡
      </motion.span>

      <svg viewBox="0 0 220 230" width="100%" height="100%" overflow="visible" aria-hidden="true">
        <defs>
          <radialGradient id="p4Body" cx="40%" cy="28%" r="78%">
            <stop offset="0%" stopColor={P.body1} />
            <stop offset="60%" stopColor={P.body2} />
            <stop offset="100%" stopColor={P.body3} />
          </radialGradient>
          <radialGradient id="p4Cloud" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#374151" />
          </radialGradient>
          <radialGradient id="p4Floor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(91,33,182,0.3)" />
            <stop offset="100%" stopColor="rgba(91,33,182,0)" />
          </radialGradient>
        </defs>
        <ellipse cx="110" cy="218" rx="70" ry="7" fill="url(#p4Floor)" />

        {/* NUBE DE TORMENTA flotando arriba */}
        <motion.g
          animate={{ y: [0, -3, 0], x: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="82" cy="38" r="14" fill="url(#p4Cloud)" />
          <circle cx="100" cy="32" r="16" fill="url(#p4Cloud)" />
          <circle cx="120" cy="34" r="14" fill="url(#p4Cloud)" />
          <circle cx="138" cy="40" r="12" fill="url(#p4Cloud)" />
          <ellipse cx="110" cy="46" rx="34" ry="8" fill="url(#p4Cloud)" />
          {/* Relámpago dentro */}
          <motion.path
            d="M102,44 L110,32 L106,42 L116,40 L104,56 L108,46 Z"
            fill="#fbbf24"
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
          />
        </motion.g>

        {/* Gotita de lluvia cayendo de la nube */}
        <motion.path
          d="M108,54 C109,60 112,62 110,66 C108,68 106,66 106,63 C106,61 107,58 108,54 Z"
          fill="#93c5fd"
          opacity="0.85"
          animate={{ y: [0, 24], opacity: [0.9, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.8, ease: 'easeIn' }}
        />

        {/* Cuerpo con micro-shake periódico */}
        <motion.g
          animate={{ x: [0, -2, 2, -2, 2, 0, 0, 0, 0, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
        >
          <path
            d="M110,68 C140,84 156,122 156,158 C156,186 136,204 110,206 C84,204 64,186 64,158 C64,122 80,84 110,68 Z"
            fill="url(#p4Body)"
          />
          <ellipse cx="88" cy="98" rx="11" ry="18" fill="rgba(255,255,255,0.17)" transform="rotate(-20, 88, 98)" />

          {/* Pies cruzados (de brazos cruzados abajo) */}
          <ellipse cx="94" cy="212" rx="8" ry="3" fill={P.deeper} />
          <ellipse cx="126" cy="212" rx="8" ry="3" fill={P.deeper} />

          {/* Brazos cruzados frente al cuerpo */}
          <path d="M68,150 Q100,156 130,148" stroke={P.deeper} strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M152,150 Q118,166 88,156" stroke={P.deeper} strokeWidth="6" fill="none" strokeLinecap="round" />

          {/* Ojos entrecerrados con ceño (V enojado) */}
          <circle cx="86" cy="122" r="9" fill="white" />
          <circle cx="134" cy="122" r="9" fill="white" />
          <circle cx="86" cy="125" r="4" fill="#1f2937" />
          <circle cx="134" cy="125" r="4" fill="#1f2937" />
          {/* Párpados caídos */}
          <path d="M76,118 L96,122 L96,118 Z" fill={P.body3} />
          <path d="M124,122 L144,118 L144,118 Z" fill={P.body3} />

          {/* Cejas muy fruncidas en V */}
          <path d="M72,110 L96,118" stroke="#3f1d1d" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M148,110 L124,118" stroke="#3f1d1d" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Boca torcida/puchero */}
          <path d="M96,148 Q110,140 124,148" stroke="#1f2937" strokeWidth="2.4" fill="none" strokeLinecap="round" />

          {/* Vena saliente (enojado) */}
          <motion.g
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
          >
            <path d="M144,96 Q148,94 146,90 M144,96 Q150,96 150,92 M144,96 Q150,100 152,98" stroke="#dc2626" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </motion.g>
        </motion.g>
      </svg>
    </>
  )
}

// Helper: convierte hex a rgba con alpha.
function hexToRgba(hex: string, alpha: number): string {
  const m = hex.match(/^#([0-9a-f]{6})$/i)
  if (!m) return hex
  const n = parseInt(m[1], 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r},${g},${b},${alpha})`
}
