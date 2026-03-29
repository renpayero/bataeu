import { addDays } from 'date-fns'

export interface Milestone {
  date: Date
  label: string
  emoji: string
  type: 'auto'
}

const MILESTONE_DEFS: { days: number; label: string; emoji: string }[] = [
  { days: 100, label: '100 días juntos', emoji: '💯' },
  { days: 182, label: '6 meses', emoji: '🎉' },
  { days: 200, label: '200 días juntos', emoji: '✨' },
  { days: 300, label: '300 días juntos', emoji: '🌟' },
  { days: 365, label: '1 año juntos', emoji: '🥂' },
  { days: 500, label: '500 días juntos', emoji: '💎' },
  { days: 548, label: '18 meses', emoji: '🎊' },
  { days: 730, label: '2 años juntos', emoji: '💕' },
  { days: 1000, label: '1000 días juntos', emoji: '🏆' },
  { days: 1095, label: '3 años juntos', emoji: '💍' },
]

export function generateMilestones(startDate: Date): Milestone[] {
  return MILESTONE_DEFS.map((def) => ({
    date: addDays(startDate, def.days),
    label: def.label,
    emoji: def.emoji,
    type: 'auto' as const,
  }))
}

export function getNextMilestone(startDate: Date): Milestone | null {
  const now = new Date()
  const milestones = generateMilestones(startDate)
  return milestones.find((m) => m.date > now) ?? null
}
