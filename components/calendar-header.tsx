'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CalendarHeaderProps {
  year: number
  month: number
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  onProfile?: () => void
}

export function CalendarHeader({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onToday,
  onProfile,
}: CalendarHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 px-5 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="text-lg">🩺</span>
          </div>
          <h1 className="text-lg font-medium text-white/90 tracking-widest uppercase">
            Nurse Shift
          </h1>
        </div>
        {onProfile && (
          <button
            onClick={onProfile}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <div className="w-5 h-5 rounded-full overflow-hidden">
              <img
                src="/dr-iwatatsu.png"
                alt=""
                className="w-full object-cover object-top"
                style={{ height: '200%' }}
              />
            </div>
            <span className="text-xs text-gray-300">Dr. いわたつ</span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onPrevMonth}
          className="text-white/60 hover:text-white hover:bg-white/10 rounded-full h-9 w-9 flex items-center justify-center transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={onToday}
          className="text-white font-bold text-xl hover:bg-white/10 px-5 py-1.5 rounded-full transition-all tracking-wider"
        >
          {year}.<span className="text-pink-300">{String(month + 1).padStart(2, '0')}</span>
        </button>

        <button
          onClick={onNextMonth}
          className="text-white/60 hover:text-white hover:bg-white/10 rounded-full h-9 w-9 flex items-center justify-center transition-all"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
