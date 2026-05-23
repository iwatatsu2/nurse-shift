export type ShiftType = 'day' | 'evening' | 'night' | 'off' | 'paid' | null

export interface ShiftConfig {
  type: ShiftType
  label: string
  shortLabel: string
  bgColor: string
  cellBgColor: string
  textColor: string
}

export const SHIFT_CONFIGS: Record<Exclude<ShiftType, null>, ShiftConfig> = {
  day: {
    type: 'day',
    label: '日勤',
    shortLabel: '日',
    bgColor: 'bg-yellow-50',
    cellBgColor: 'bg-yellow-100',
    textColor: 'text-yellow-500',
  },
  evening: {
    type: 'evening',
    label: '準夜勤',
    shortLabel: '準',
    bgColor: 'bg-orange-50',
    cellBgColor: 'bg-orange-100',
    textColor: 'text-orange-400',
  },
  night: {
    type: 'night',
    label: '深夜勤',
    shortLabel: '深',
    bgColor: 'bg-indigo-50',
    cellBgColor: 'bg-indigo-100',
    textColor: 'text-indigo-400',
  },
  off: {
    type: 'off',
    label: '休み',
    shortLabel: '休',
    bgColor: 'bg-gray-50',
    cellBgColor: 'bg-gray-100',
    textColor: 'text-gray-300',
  },
  paid: {
    type: 'paid',
    label: '有給',
    shortLabel: '有',
    bgColor: 'bg-emerald-50',
    cellBgColor: 'bg-emerald-100',
    textColor: 'text-emerald-400',
  },
}

export const SHIFT_ORDER: ShiftType[] = ['day', 'evening', 'night', 'off', 'paid', null]

export function getNextShift(current: ShiftType): ShiftType {
  const currentIndex = SHIFT_ORDER.indexOf(current)
  const nextIndex = (currentIndex + 1) % SHIFT_ORDER.length
  return SHIFT_ORDER[nextIndex]
}
