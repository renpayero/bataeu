import { COUPLE_START_DATE } from '@/lib/coupleConfig'
import { generateMilestones } from '@/lib/milestones'

export interface SpecialDateLite {
  id: number
  title: string
  emoji: string
  date?: string
}

export interface MilestoneOption {
  value: string
  label: string
  emoji: string
}

const AUTO_PREFIX = 'auto:'

function isoDay(d: Date): string {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12, 0, 0, 0)
  ).toISOString()
}

export function buildMilestoneOptions(specialDates: SpecialDateLite[]): MilestoneOption[] {
  const existing = new Map<string, SpecialDateLite>()
  for (const sd of specialDates) existing.set(sd.title, sd)

  const auto = generateMilestones(COUPLE_START_DATE)

  const autoOptions: MilestoneOption[] = auto
    .filter((m) => !existing.has(m.label))
    .map((m) => ({
      value: `${AUTO_PREFIX}${m.label}|${isoDay(m.date)}|${m.emoji}`,
      label: m.label,
      emoji: m.emoji,
    }))

  const existingOptions: MilestoneOption[] = specialDates.map((sd) => ({
    value: String(sd.id),
    label: sd.title,
    emoji: sd.emoji,
  }))

  return [...existingOptions, ...autoOptions]
}

/**
 * Convierte el `value` elegido en el dropdown en un `specialDateId` listo para persistir.
 * - Si es numérico → ya existe, devuelve el id.
 * - Si empieza con `auto:` → materializa el milestone creando un SpecialDate en DB.
 * - Si está vacío → null.
 */
export async function resolveMilestoneValue(value: string): Promise<number | null> {
  if (!value) return null

  if (value.startsWith(AUTO_PREFIX)) {
    const payload = value.slice(AUTO_PREFIX.length)
    const [title, dateIso, emoji] = payload.split('|')
    if (!title || !dateIso) return null
    const res = await fetch('/api/dates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, date: dateIso, emoji }),
    })
    if (!res.ok) return null
    const created = await res.json()
    return typeof created?.id === 'number' ? created.id : null
  }

  const n = parseInt(value, 10)
  return isNaN(n) ? null : n
}
