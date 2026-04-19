'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { ShiftType } from '@/lib/shift-types'
import { SHIFT_CONFIGS } from '@/lib/shift-types'
import { formatDateKey } from '@/hooks/use-shift-store'

interface CalendarGridProps {
  year: number
  month: number
  shifts: Record<string, ShiftType>
  onDateClick: (dateKey: string) => void
  commonOffDays?: string[]
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startDayOfWeek = firstDay.getDay()

  const days: (Date | null)[] = []

  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day))
  }

  while (days.length % 7 !== 0) {
    days.push(null)
  }

  return days
}

function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export function CalendarGrid({ year, month, shifts, onDateClick, commonOffDays = [] }: CalendarGridProps) {
  const days = useMemo(() => getCalendarDays(year, month), [year, month])

  return (
    <div className="px-4 py-3">
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((day, index) => (
          <div
            key={`${day}-${index}`}
            className={cn(
              'text-center text-[11px] font-medium py-2 tracking-wider',
              index === 0 && 'text-rose-300',
              index === 6 && 'text-sky-300',
              index > 0 && index < 6 && 'text-gray-300'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const dateKey = formatDateKey(date)
          const shift = shifts[dateKey] ?? null
          const shiftConfig = shift ? SHIFT_CONFIGS[shift] : null
          const dayOfWeek = date.getDay()
          const today = isToday(date)
          const isCommonOff = commonOffDays.includes(dateKey)

          return (
            <button
              key={dateKey}
              onClick={() => onDateClick(dateKey)}
              className={cn(
                'aspect-square flex flex-col items-center justify-center rounded-2xl transition-all active:scale-90',
                'hover:bg-gray-50 relative',
                today && 'bg-slate-800 hover:bg-slate-700',
                isCommonOff && !today && 'bg-pink-50 ring-2 ring-pink-300 ring-offset-1'
              )}
            >
              <span
                className={cn(
                  'text-[13px] font-medium mb-0.5 font-[var(--font-inter)]',
                  today && 'text-white',
                  !today && dayOfWeek === 0 && 'text-rose-300',
                  !today && dayOfWeek === 6 && 'text-sky-300',
                  !today && dayOfWeek > 0 && dayOfWeek < 6 && 'text-gray-500',
                )}
              >
                {date.getDate()}
              </span>

              {shiftConfig && (
                <div
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center',
                    'text-[10px] font-bold',
                    today ? 'bg-white/20 text-white' : `${shiftConfig.bgColor} ${shiftConfig.textColor}`
                  )}
                >
                  {shiftConfig.shortLabel}
                </div>
              )}

              {!shiftConfig && <div className="w-6 h-6" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
