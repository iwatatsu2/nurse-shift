'use client'

import { cn } from '@/lib/utils'
import { SHIFT_CONFIGS } from '@/lib/shift-types'
import type { ShiftType } from '@/lib/shift-types'

interface ShiftSummaryProps {
  counts: Record<Exclude<ShiftType, null>, number>
}

const SHIFT_ORDER: Exclude<ShiftType, null>[] = ['day', 'evening', 'night', 'off', 'paid']

export function ShiftSummary({ counts }: ShiftSummaryProps) {
  return (
    <div className="border-t border-gray-100 px-5 py-4">
      <div className="flex flex-wrap justify-center gap-3">
        {SHIFT_ORDER.map((type) => {
          const config = SHIFT_CONFIGS[type]
          return (
            <div
              key={type}
              className="flex items-center gap-1.5"
            >
              <div
                className={cn(
                  'w-4 h-4 rounded-md flex items-center justify-center',
                  'text-[8px] font-bold',
                  config.bgColor,
                  config.textColor
                )}
              >
                {config.shortLabel}
              </div>
              <span className="text-[11px] text-gray-400">{config.label}</span>
              <span className="text-sm font-bold text-gray-600 font-[var(--font-inter)] tabular-nums">
                {counts[type]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
