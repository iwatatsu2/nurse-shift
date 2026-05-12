'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { SHIFT_CONFIGS } from '@/lib/shift-types'
import type { ShiftType } from '@/lib/shift-types'
import { calculateFatigue, calculateWeeklyScores } from '@/lib/fatigue'
import { Activity } from 'lucide-react'

interface FatigueBarProps {
  shifts: Record<string, ShiftType>
}

export function FatigueBar({ shifts }: FatigueBarProps) {
  const fatigue = useMemo(() => calculateFatigue(shifts), [shifts])
  const weeklyScores = useMemo(() => calculateWeeklyScores(shifts), [shifts])

  // Don't show if no shifts entered at all in past 7 days
  const hasAnyShift = fatigue.recentShifts.some((s) => s.shift !== null)
  if (!hasAnyShift) return null

  return (
    <div className="mx-4 my-3 p-4 rounded-2xl bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Activity className={cn('w-4 h-4', fatigue.color)} />
          <span className="text-xs font-bold text-gray-600">疲労スコア</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-lg font-black', fatigue.color)}>{fatigue.score}</span>
          <span className={cn('text-xs font-bold', fatigue.color)}>{fatigue.label}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div
          className={cn('h-full rounded-full transition-all duration-500', fatigue.bgColor)}
          style={{ width: `${fatigue.score}%` }}
        />
      </div>

      {/* Recent 7 days */}
      <div className="flex items-center justify-between mb-3">
        {fatigue.recentShifts.map(({ dateKey, shift }) => {
          const day = parseInt(dateKey.split('-')[2])
          const config = shift ? SHIFT_CONFIGS[shift] : null
          return (
            <div key={dateKey} className="flex flex-col items-center gap-0.5">
              <span className="text-[9px] text-gray-400">{day}</span>
              {config ? (
                <div
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold',
                    config.bgColor,
                    config.textColor
                  )}
                >
                  {config.shortLabel}
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-gray-100" />
              )}
            </div>
          )
        })}
      </div>

      {/* Weekly trend (4 weeks) */}
      <div className="flex items-end justify-between gap-1 h-6">
        {weeklyScores.map((score, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <div className="w-full bg-gray-200 rounded-sm overflow-hidden" style={{ height: '16px' }}>
              <div
                className={cn(
                  'w-full rounded-sm transition-all',
                  score <= 20 ? 'bg-emerald-400' :
                  score <= 40 ? 'bg-lime-400' :
                  score <= 60 ? 'bg-amber-400' :
                  score <= 80 ? 'bg-orange-400' : 'bg-red-400'
                )}
                style={{ height: `${Math.max(score, 4)}%` }}
              />
            </div>
            <span className="text-[8px] text-gray-300">{i === 3 ? '今週' : `${3 - i}W前`}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
