'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { SHIFT_CONFIGS, SHIFT_ORDER } from '@/lib/shift-types'
import type { ShiftType } from '@/lib/shift-types'
import { formatDateKey } from '@/hooks/use-shift-store'
import { X, Repeat, Play } from 'lucide-react'

interface PatternInputProps {
  year: number
  month: number
  onApply: (shifts: Record<string, ShiftType>) => void
  onClose: () => void
}

const SELECTABLE_SHIFTS: Exclude<ShiftType, null>[] = ['day', 'evening', 'night', 'off', 'paid']

const PRESET_PATTERNS: { name: string; pattern: Exclude<ShiftType, null>[] }[] = [
  { name: '二交代', pattern: ['day', 'night', 'off', 'off'] },
  { name: '三交代', pattern: ['day', 'evening', 'night', 'off', 'off'] },
  { name: '日勤のみ', pattern: ['day', 'day', 'day', 'day', 'day', 'off', 'off'] },
]

export function PatternInput({ year, month, onApply, onClose }: PatternInputProps) {
  const [pattern, setPattern] = useState<Exclude<ShiftType, null>[]>([])
  const [startDay, setStartDay] = useState(1)

  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const addToPattern = (shift: Exclude<ShiftType, null>) => {
    setPattern((prev) => [...prev, shift])
  }

  const removeFromPattern = (index: number) => {
    setPattern((prev) => prev.filter((_, i) => i !== index))
  }

  const applyPreset = (preset: Exclude<ShiftType, null>[]) => {
    setPattern(preset)
  }

  const handleApply = () => {
    if (pattern.length === 0) return

    const newShifts: Record<string, ShiftType> = {}
    let patternIndex = 0

    for (let day = startDay; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const key = formatDateKey(date)
      newShifts[key] = pattern[patternIndex % pattern.length]
      patternIndex++
    }

    onApply(newShifts)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">パターン一括入力</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Presets */}
          <div>
            <p className="text-[11px] text-gray-400 mb-2 tracking-wider">プリセット</p>
            <div className="flex gap-2">
              {PRESET_PATTERNS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset.pattern)}
                  className="px-3 py-1.5 rounded-full text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Pattern builder */}
          <div>
            <p className="text-[11px] text-gray-400 mb-2 tracking-wider">シフトを追加</p>
            <div className="flex gap-2">
              {SELECTABLE_SHIFTS.map((type) => {
                const config = SHIFT_CONFIGS[type]
                return (
                  <button
                    key={type}
                    onClick={() => addToPattern(type)}
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all active:scale-90',
                      config.bgColor,
                      config.textColor,
                      'hover:shadow-md'
                    )}
                  >
                    {config.shortLabel}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Current pattern */}
          <div>
            <p className="text-[11px] text-gray-400 mb-2 tracking-wider">
              パターン
              {pattern.length > 0 && (
                <button
                  onClick={() => setPattern([])}
                  className="ml-2 text-rose-400 hover:text-rose-500"
                >
                  クリア
                </button>
              )}
            </p>
            <div className="min-h-[44px] flex items-center gap-1.5 flex-wrap">
              {pattern.length === 0 ? (
                <span className="text-xs text-gray-300">上のボタンでパターンを作成</span>
              ) : (
                <>
                  {pattern.map((type, i) => {
                    const config = SHIFT_CONFIGS[type]
                    return (
                      <button
                        key={i}
                        onClick={() => removeFromPattern(i)}
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all hover:opacity-70',
                          config.bgColor,
                          config.textColor
                        )}
                      >
                        {config.shortLabel}
                      </button>
                    )
                  })}
                  <Repeat className="w-4 h-4 text-gray-300 ml-1" />
                </>
              )}
            </div>
          </div>

          {/* Start day */}
          <div>
            <p className="text-[11px] text-gray-400 mb-2 tracking-wider">開始日</p>
            <select
              value={startDay}
              onChange={(e) => setStartDay(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {month + 1}月{d}日から
                </option>
              ))}
            </select>
          </div>

          {/* Apply button */}
          <button
            onClick={handleApply}
            disabled={pattern.length === 0}
            className={cn(
              'w-full py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all',
              pattern.length > 0
                ? 'bg-slate-800 text-white hover:bg-slate-700 active:scale-[0.98]'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            )}
          >
            <Play className="w-4 h-4" />
            適用する
          </button>
        </div>

        {/* Safe area */}
        <div className="h-8" />
      </div>
    </div>
  )
}
