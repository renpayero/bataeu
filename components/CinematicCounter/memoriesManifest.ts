// ═══════════════════════════════════════════════════════
//  Manifest de memorias de la cinemática
//  ------------------------------------------------------
//  - `src` relativo a /public. Ej: "/memories/foo.jpg"
//  - `type`: 'photo' | 'video'
//  - `isFirst`: true para la primera foto juntos (se marca con badge)
//  - `caption`: subtítulo opcional que se muestra sobre la memoria
//  Las memorias se mezclan y distribuyen automáticamente entre actos.
// ═══════════════════════════════════════════════════════

export type MemoryType = 'photo' | 'video'

export interface Memory {
  src: string
  type: MemoryType
  isFirst?: boolean
  caption?: string
  /**
   * Override del encuadre (CSS object-position). Usado para subir o bajar
   * levemente una foto específica cuando el cover center recorta algo
   * importante (ej: un cartel, la cabeza de alguien).
   * Formato: "center 40%" → sube la foto un 10% respecto al centro (default 50%).
   * Valores mayores al 50% → muestra más de la parte inferior.
   * Valores menores al 50% → muestra más de la parte superior.
   */
  objectPosition?: string
}

// Fuente de verdad: el orden acá importa porque algunos actos
// consumen memorias en orden (la primera para acto 2, resto para el resto).
export const MEMORIES: Memory[] = [
  {
    src: '/memories/first.png',
    type: 'photo',
    isFirst: true,
    caption: 'La primera foto juntos',
  },
  // Photos
  { src: '/memories/1e5f8d4c-8721-4234-9fa0-a9416b10677f.jpg', type: 'photo' },
  { src: '/memories/20260321_155752.jpg', type: 'photo' },
  { src: '/memories/2bc605ab-2ecc-4190-98d1-2fd8a0f3143e.jpg', type: 'photo' },
  { src: '/memories/2d188325-390e-485e-b41e-c5ec4ad29530.jpg', type: 'photo' },
  { src: '/memories/4596c093-fa73-475e-965c-e63ee34061f6.jpg', type: 'photo' },
  { src: '/memories/604eeb26-f059-446f-a40c-4cb664a64f9d.jpg', type: 'photo' },
  { src: '/memories/609fc0eb-491a-4593-a24a-9335b651eaca.jpg', type: 'photo' },
  { src: '/memories/63069fef-0406-49a1-8120-65ec6c717f55.jpg', type: 'photo' },
  { src: '/memories/635f6127-d4a4-4b81-92d6-bf2623a5a624.jpg', type: 'photo' },
  { src: '/memories/636c2540-e3d4-4822-9d37-d62a6eeb8a8d.jpg', type: 'photo' },
  { src: '/memories/6b4f5a0d-da0c-48ab-8e10-68b1a49b2049.jpg', type: 'photo' },
  {
    src: '/memories/885baf36-a2be-486c-826e-bfa1c4c86453.jpg',
    type: 'photo',
    // Foto del cartel de graduación ("SOY INGENIERO — ING. RENZO PAYERO").
    // Con cover en aspect 4:3, el cartel superior queda cortado. Movemos la
    // ventana hacia el top para que se vea el frame completo.
    objectPosition: 'center 25%',
  },
  { src: '/memories/b2e46b59-45e7-43b1-bc43-4bbdff421f70.jpg', type: 'photo' },
  { src: '/memories/feb2758f-abe3-41b3-b17c-009393d7380f.jpg', type: 'photo' },
  // Live Photo videos (cortos de ~2s)
  { src: '/memories/IMG_1101.MP4', type: 'video' },
  { src: '/memories/IMG_1921.MP4', type: 'video' },
  { src: '/memories/IMG_2351.MP4', type: 'video' },
  { src: '/memories/IMG_2568.MP4', type: 'video' },
  { src: '/memories/IMG_2994.MP4', type: 'video' },
  { src: '/memories/IMG_3008.MP4', type: 'video' },
  { src: '/memories/IMG_3441.MP4', type: 'video' },
]

// Override opcional para alimentar la cinemática desde la galería DB.
// Cuando es `null`, las funciones devuelven exactamente lo de MEMORIES
// (comportamiento original preservado byte a byte).
let memoriesOverride: Memory[] | null = null

export function setMemoriesOverride(memories: Memory[] | null): void {
  memoriesOverride = memories && memories.length > 0 ? memories : null
}

export function getActiveMemories(): Memory[] {
  return memoriesOverride ?? MEMORIES
}

export function getFirstMemory(): Memory {
  const pool = getActiveMemories()
  return pool.find((m) => m.isFirst) ?? pool[0]
}

export function getPhotos(): Memory[] {
  return getActiveMemories().filter((m) => m.type === 'photo')
}

export function getVideos(): Memory[] {
  return getActiveMemories().filter((m) => m.type === 'video')
}

// Baraja determinística (hash-based) con excepción de la primera.
// Útil para que cada vez no aparezcan en mismo orden, pero el resultado
// sea estable dentro de una misma sesión.
export function shuffled(seed: number, skipFirst = true): Memory[] {
  const source = getActiveMemories()
  const pool = skipFirst ? source.filter((m) => !m.isFirst) : [...source]
  // Fisher–Yates con PRNG basado en seed
  let s = seed
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool
}
