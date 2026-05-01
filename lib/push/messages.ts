import type { CycleEntry, SpecialDate } from '@prisma/client'
import { differenceInCalendarDays } from 'date-fns'
import { getPhaseForDate, type Phase } from '@/lib/cycleLogic'
import { COUPLE_NICKNAMES, COUPLE_START_DATE } from '@/lib/coupleConfig'
import { generateMilestones } from '@/lib/milestones'
import type { PushPayload } from './sender'

export type ScheduledNotification = {
  audience: string | null
  payload: PushPayload
}

const todayIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

// ─── Mensajes para REN cuando CAMI cambia de fase ─────────

const PHASE_ENTRY_MSG: Record<Phase, { title: string; body: string }> = {
  1: {
    title: `🩸 ${COUPLE_NICKNAMES.name2} arrancó el período`,
    body: 'Se viene la fase de menstruación. Mimá, abrazos y mucha agua.',
  },
  2: {
    title: `🌱 ${COUPLE_NICKNAMES.name2} entró en folicular`,
    body: 'Energía en alza estos días. Buen momento para planear cosas juntos.',
  },
  3: {
    title: `✨ ${COUPLE_NICKNAMES.name2} está en ovulación`,
    body: 'Pico hormonal. Está en su mejor momento del ciclo.',
  },
  4: {
    title: `🌙 ${COUPLE_NICKNAMES.name2} entró en lútea`,
    body: 'Puede estar más sensible en estos días. Banca y paciencia.',
  },
}

/**
 * Notif al PARTNER (Ren) solo en el día que CAMBIA la fase del ciclo.
 * Devuelve null si hoy no es transición.
 */
export function buildCycleNotification(
  entry: CycleEntry | null,
  today: Date,
): ScheduledNotification | null {
  if (!entry) return null
  const info = getPhaseForDate(today, entry.startDate, entry.cycleLength, entry.periodLength)
  const periodLength = entry.periodLength
  const ovulationDay = entry.cycleLength - 14

  const isTransition =
    info.dayOfCycle === 1 ||
    info.dayOfCycle === periodLength + 1 ||
    info.dayOfCycle === ovulationDay ||
    info.dayOfCycle === ovulationDay + 1

  if (!isTransition) return null

  const msg = PHASE_ENTRY_MSG[info.phase]
  return {
    audience: COUPLE_NICKNAMES.name1,
    payload: {
      title: msg.title,
      body: msg.body,
      url: '/ciclo',
      tag: `cycle-phase-${info.phase}-${todayIso(today)}`,
    },
  }
}

// ─── Mensajes de fechas especiales (manuales) ─────────────

/**
 * Recorre `dates` y genera notifs si:
 *  - hoy es 1 día antes de la fecha → "Mañana es X"
 *  - hoy es la fecha → "Hoy es X"
 * Audience = null (les llega a los dos).
 */
export function buildSpecialDateNotifications(
  dates: SpecialDate[],
  today: Date,
): ScheduledNotification[] {
  const out: ScheduledNotification[] = []
  for (const sd of dates) {
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

// ─── Milestones automáticos (100d, 6m, 1y, 500d, 18m, 2y, etc) ───

/**
 * Genera notifs si hoy coincide con un milestone automático del aniversario.
 * Audience = null (les llega a los dos).
 */
export function buildAutoMilestoneNotifications(
  startDate: Date,
  today: Date,
): ScheduledNotification[] {
  const milestones = generateMilestones(startDate)
  const out: ScheduledNotification[] = []
  const todayKey = todayIso(today)
  for (const ms of milestones) {
    const diff = differenceInCalendarDays(
      new Date(ms.date.getFullYear(), ms.date.getMonth(), ms.date.getDate()),
      new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    )
    if (diff === 0) {
      out.push({
        audience: null,
        payload: {
          title: `${ms.emoji} ${ms.label}`,
          body: 'Hoy se cumple. Festejen 💕',
          url: '/',
          tag: `milestone-${ms.label}-${todayKey}`,
        },
      })
    } else if (diff === 1) {
      out.push({
        audience: null,
        payload: {
          title: `${ms.emoji} Mañana: ${ms.label}`,
          body: 'No te lo pierdas ✨',
          url: '/',
          tag: `milestone-${ms.label}-d1-${todayKey}`,
        },
      })
    }
  }
  return out
}

export const COUPLE_START = COUPLE_START_DATE
