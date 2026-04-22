// Hex tokens de la paleta del módulo Lectura.
// Paleta: blush rosa + dorado warm + borgoña. Coherente con fase 1 (rosa).
// La fuente de verdad son las CSS vars `--reading-*` en globals.css.

export const readingPalette = {
  cream: '#fff5f7',
  creamDeep: '#ffe8ec',
  paper: '#fde4ea',
  ink: '#7f1d1d',
  inkSoft: '#9f1239',
  inkFaded: '#b45867',
  terracotta: '#be185d',
  roseOld: '#9f1239',
  sage: '#84a98c',
  gold: '#c68b5a',
  goldSoft: '#edc494',
  bronze: '#a16207',
  border: '#fbcfe8',
  borderSoft: '#fce7f0',
} as const

export const BOOK_STATUS = {
  quiero:     { label: 'Quiero leer', color: readingPalette.sage,        bg: '#e8f0ea' },
  leyendo:    { label: 'Leyendo',     color: readingPalette.gold,        bg: '#fdecd9' },
  pausado:    { label: 'Pausado',     color: readingPalette.inkFaded,    bg: '#fbe4ea' },
  terminado:  { label: 'Terminado',   color: readingPalette.terracotta,  bg: '#fce7f0' },
  abandonado: { label: 'Soltado',     color: readingPalette.inkFaded,    bg: '#f5e0e6' },
  releer:     { label: 'Para releer', color: readingPalette.roseOld,     bg: '#fce7f0' },
} as const

export type BookStatus = keyof typeof BOOK_STATUS

export const BOOK_FORMATS = {
  fisico: { label: 'Físico',     icon: '📕' },
  kindle: { label: 'Kindle',     icon: '📲' },
  audio:  { label: 'Audiolibro', icon: '🎧' },
  pdf:    { label: 'PDF',        icon: '📄' },
} as const

export type BookFormat = keyof typeof BOOK_FORMATS

export const MOOD_TAGS = [
  'tierno',
  'oscuro',
  'intenso',
  'liviano',
  'reflexivo',
  'divertido',
  'triste',
  'inspirador',
  'romántico',
  'misterioso',
] as const

export type MoodTag = (typeof MOOD_TAGS)[number]
