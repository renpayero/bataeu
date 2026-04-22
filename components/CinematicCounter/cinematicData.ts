// ═══════════════════════════════════════════════════════
//  CINEMÁTICA "Nuestra historia" — Fase 2 (Hollywood cut)
//  ------------------------------------------------------
//  Editá los mensajes libremente. La arquitectura son 7 actos
//  orquestados por duración. Total objetivo: 30-45 segundos.
//  Cada acto tiene su propio componente visual en /Acts/
// ═══════════════════════════════════════════════════════

export type ActKey =
  | 'opening'
  | 'origin'
  | 'mosaic'
  | 'crescendo'
  | 'anchor'
  | 'sweep'
  | 'finale'

export interface ActConfig {
  key: ActKey
  durationMs: number
}

// Las duraciones fueron calibradas para que el total ronde los 40s.
// Podés subir/bajar un acto específico sin tocar los demás.
export const ACTS: ActConfig[] = [
  { key: 'opening',   durationMs: 4500 },   // negro → nombres desde top-left
  { key: 'origin',    durationMs: 5500 },   // primera foto + día 1
  { key: 'mosaic',    durationMs: 6500 },   // grid 2x2 desde 4 esquinas
  { key: 'crescendo', durationMs: 6000 },   // barrido horizontal + special dates
  { key: 'anchor',    durationMs: 5000 },   // pausa con mensaje
  { key: 'sweep',     durationMs: 5500 },   // rush de memorias rápido
  { key: 'finale',    durationMs: 7500 },   // contador final + confetti
]

export const TOTAL_DURATION_MS = ACTS.reduce((a, b) => a + b.durationMs, 0)

// ─── Copias editables por Renzo ───────────────────────

export const OPENING_LABEL = {
  kicker: 'Nuestra historia',
  headline: '', // se arma dinámicamente con COUPLE_NAMES
}

export const ORIGIN_TEXTS = {
  badge: 'La primera foto juntos',
  line1: 'Todo arrancó acá.',
  line2: '(Sin saber lo que me esperaba...)',
}

export const MOSAIC_TITLE = 'Pedacitos'

export const CRESCENDO_TITLE = 'Sigamos sonriendo como en estas fotos'

export const ANCHOR_QUOTE = {
  body: 'Llevamos este tiempo juntos y cada dia te amo más. Gracias por ser mi luz :)',
  attribution: '',
}

export const SWEEP_TAGLINE = 'Todo lo que somos'

export const FINALE_TEXTS = {
  kicker: 'Hoy',
  daysLabel: (days: number) => `${days} días juntos`,
  closingLine: 'Y recién empezamos.',
  heartSymbol: '💕',
}

// ─── Easter eggs ────────────────────────────────────
// Si la fecha de hoy coincide con alguna clave MM-DD, se muestra un mensaje
// especial al abrir la cinemática (en ready screen + un overlay en Act7).
// Editá libremente: fechas personales, aniversarios, cumples, etc.
export const EASTER_EGGS: Record<string, { kicker: string; message: string }> = {
  // '05-04': { kicker: 'Feliz aniversario', message: 'Un año más de nosotros ✨' },
  // '09-12': { kicker: 'Feliz cumpleaños', message: 'Te amo en cualquier fecha pero hoy más.' },
  // '12-25': { kicker: 'Feliz Navidad', message: 'Con vos cualquier día se siente así.' },
}

/** Devuelve el easter egg activo para la fecha de hoy (TZ Argentina), o null. */
export function getTodayEasterEgg(): { kicker: string; message: string } | null {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    month: '2-digit',
    day: '2-digit',
  })
  // fmt devuelve "MM-DD"
  const key = fmt.format(new Date())
  return EASTER_EGGS[key] ?? null
}

// Palabras que flotan como overlays en varios actos
export const FLOATING_WORDS = [
  ':) :)',
  'abrazos',
  'risa',
  'viaje',
  'casita',
  'ternura',
  'vos',
  'yo',
  'hoy',
  'siempre',
]
