import { differenceInDays } from 'date-fns'

export type Phase = 1 | 2 | 3 | 4

export interface PhaseInfo {
  phase: Phase
  dayOfCycle: number
  phaseName: string
}

const PHASE_NAMES: Record<Phase, string> = {
  1: 'Menstruación',
  2: 'Folicular',
  3: 'Ovulación',
  4: 'Lútea',
}

export function getPhaseForDate(
  date: Date,
  lastStartDate: Date,
  cycleLength: number = 28,
  periodLength: number = 5
): PhaseInfo {
  const start = new Date(lastStartDate)
  start.setHours(0, 0, 0, 0)
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)

  const diffDays = differenceInDays(d, start)
  // dayOfCycle is 1-indexed; wraps with modulo for future cycles
  const dayOfCycle = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1

  // Ovulation is estimated at cycleLength - 14 (standard: luteal phase is always ~14 days).
  // For a 28-day cycle: ovulation = day 14. For 32-day: day 18. For 24-day: day 10.
  const ovulationDay = cycleLength - 14

  let phase: Phase
  if (dayOfCycle <= periodLength) {
    phase = 1
  } else if (dayOfCycle < ovulationDay) {
    phase = 2
  } else if (dayOfCycle === ovulationDay) {
    phase = 3
  } else {
    phase = 4
  }

  return { phase, dayOfCycle, phaseName: PHASE_NAMES[phase] }
}
