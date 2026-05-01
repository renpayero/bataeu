import type { CycleEntry, SpecialDate } from '@prisma/client'
import { differenceInCalendarDays } from 'date-fns'
import { getPhaseForDate, type Phase } from '@/lib/cycleLogic'
import { getCycleOwnerName } from '@/lib/coupleConfig'
import type { PushPayload } from './sender'

export type ScheduledNotification = {
  audience: string | null
  payload: PushPayload
}

const todayIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

// ─── Mensajes por fase del ciclo ─────────────────────────

type CycleMsg = (day: number) => { title: string; body: string }

const PHASE_MSG: Record<Phase, CycleMsg> = {
  1: (day) =>
    day === 1
      ? {
          title: '🩸 Día 1 de tu ciclo',
          body: 'Hoy comienza. Hidratáte, descansá y mimáte. Estoy con vos.',
        }
      : {
          title: `🩸 Día ${day} — menstruación`,
          body: 'Que no se te olvide tomar agua y darte mimo extra hoy.',
        },
  2: (day) => ({
    title: `🌱 Día ${day} — folicular`,
    body: 'Energía en alza. Buen día para empezar lo que tenías ganas.',
  }),
  3: (day) => ({
    title: `✨ Día ${day} — ovulación`,
    body: 'Pico hormonal. Estás en tu mejor momento del ciclo.',
  }),
  4: (day) => ({
    title: `🌙 Día ${day} — lútea`,
    body: 'Si te sentís sensible, está bien. Cuidate.',
  }),
}

/**
 * Construye la notificación diaria del ciclo según el último CycleEntry.
 * Devuelve null si no hay entry.
 */
export function buildCycleNotification(
  entry: CycleEntry | null,
  today: Date,
): ScheduledNotification | null {
  if (!entry) return null
  const info = getPhaseForDate(today, entry.startDate, entry.cycleLength, entry.periodLength)
  const msg = PHASE_MSG[info.phase](info.dayOfCycle)
  return {
    audience: getCycleOwnerName(),
    payload: {
      title: msg.title,
      body: msg.body,
      url: '/ciclo',
      tag: `cycle-${todayIso(today)}`,
    },
  }
}

// ─── Mensajes de fechas especiales ───────────────────────

/**
 * Recorre `dates` y genera notifs si:
 *  - hoy es 1 día antes de la fecha → "Mañana es X"
 *  - hoy es la fecha → "Hoy es X"
 */
export function buildSpecialDateNotifications(
  dates: SpecialDate[],
  today: Date,
): ScheduledNotification[] {
  const out: ScheduledNotification[] = []
  for (const sd of dates) {
    // Las fechas se guardan a noon UTC; comparamos por día calendario local.
    const target = new Date(sd.date)
    const diff = differenceInCalendarDays(
      new Date(target.getFullYear(), target.getMonth(), target.getDate()),
      new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    )

    if (diff === 1) {
      out.push({
        audience: null,
        payload: {
          title: `${sd.emoji} Mañana es ${sd.title}`,
          body: 'No te olvides 💕',
          url: '/',
          tag: `special-${sd.id}-d1-${todayIso(today)}`,
        },
      })
    } else if (diff === 0) {
      out.push({
        audience: null,
        payload: {
          title: `${sd.emoji} Hoy: ${sd.title}`,
          body: 'Disfrutá el día ✨',
          url: '/',
          tag: `special-${sd.id}-d0-${todayIso(today)}`,
        },
      })
    }
  }
  return out
}
