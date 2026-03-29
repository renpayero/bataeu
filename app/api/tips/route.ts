import { NextRequest, NextResponse } from 'next/server'
import { getRandomTip, getRandomTips } from '@/lib/tips'
import type { Tip } from '@/lib/tips'

const VALID_PHASES: Tip['phase'][] = ['menstruacion', 'folicular', 'ovulacion', 'lutea']

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const phase = searchParams.get('phase') as Tip['phase'] | null
  const countParam = searchParams.get('count')
  const excludeId = searchParams.get('excludeId')

  if (!phase || !VALID_PHASES.includes(phase)) {
    return NextResponse.json(
      { error: 'phase debe ser: menstruacion, folicular, ovulacion o lutea' },
      { status: 400 }
    )
  }

  const dayParam = searchParams.get('day')
  const day = dayParam ? parseInt(dayParam, 10) : undefined

  if (countParam) {
    const count = parseInt(countParam, 10)
    if (isNaN(count) || count < 1 || count > 10) {
      return NextResponse.json({ error: 'count debe estar entre 1 y 10' }, { status: 400 })
    }
    return NextResponse.json(getRandomTips(phase, count, day))
  }

  const tip = getRandomTip(phase, excludeId ? parseInt(excludeId, 10) : undefined, day)
  return NextResponse.json(tip)
}
