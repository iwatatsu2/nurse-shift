import type { ShiftType } from './shift-types'

const SHIFT_FATIGUE: Record<Exclude<ShiftType, null>, number> = {
  night: 25,
  evening: 15,
  day: 8,
  off: -5,
  paid: -5,
}

export interface FatigueResult {
  score: number // 0-100
  level: number // 0-4
  label: string
  color: string // tailwind color
  bgColor: string
  recentShifts: { dateKey: string; shift: ShiftType }[]
}

const LEVELS: { max: number; label: string; color: string; bgColor: string }[] = [
  { max: 20, label: '元気！', color: 'text-emerald-500', bgColor: 'bg-emerald-500' },
  { max: 40, label: 'まあまあ', color: 'text-lime-500', bgColor: 'bg-lime-500' },
  { max: 60, label: 'お疲れ気味', color: 'text-amber-500', bgColor: 'bg-amber-500' },
  { max: 80, label: 'かなりお疲れ', color: 'text-orange-500', bgColor: 'bg-orange-500' },
  { max: 100, label: '限界...休んで！', color: 'text-red-500', bgColor: 'bg-red-500' },
]

function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function calculateFatigue(shifts: Record<string, ShiftType>): FatigueResult {
  const today = new Date()
  const recentShifts: { dateKey: string; shift: ShiftType }[] = []

  // Collect past 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = getDateKey(d)
    recentShifts.push({ dateKey: key, shift: shifts[key] ?? null })
  }

  let raw = 0

  // Base fatigue from each shift
  for (const { shift } of recentShifts) {
    if (shift) raw += SHIFT_FATIGUE[shift]
  }

  // Consecutive work bonus (3+ days)
  let consecutive = 0
  for (const { shift } of recentShifts) {
    if (shift && shift !== 'off' && shift !== 'paid') {
      consecutive++
      if (consecutive >= 3) raw += 10
    } else {
      consecutive = 0
    }
  }

  // Night→Day reversal penalty
  for (let i = 1; i < recentShifts.length; i++) {
    const prev = recentShifts[i - 1].shift
    const curr = recentShifts[i].shift
    if ((prev === 'night' || prev === 'evening') && curr === 'day') {
      raw += 15
    }
  }

  const score = Math.max(0, Math.min(100, raw))
  const levelInfo = LEVELS.find((l) => score <= l.max) ?? LEVELS[4]
  const level = LEVELS.indexOf(levelInfo)

  return { score, level, label: levelInfo.label, color: levelInfo.color, bgColor: levelInfo.bgColor, recentShifts }
}

export function calculateWeeklyScores(shifts: Record<string, ShiftType>): number[] {
  const scores: number[] = []
  const today = new Date()

  for (let week = 3; week >= 0; week--) {
    const weekEnd = new Date(today)
    weekEnd.setDate(weekEnd.getDate() - week * 7)

    const weekShifts: Record<string, ShiftType> = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date(weekEnd)
      d.setDate(d.getDate() - i)
      const key = getDateKey(d)
      if (shifts[key]) weekShifts[key] = shifts[key]
    }

    // Simple calculation for historical weeks
    let raw = 0
    const entries = Object.values(weekShifts)
    for (const shift of entries) {
      if (shift) raw += SHIFT_FATIGUE[shift]
    }
    scores.push(Math.max(0, Math.min(100, raw)))
  }

  return scores
}
