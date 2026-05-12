'use client'

import { useState, useEffect } from 'react'
import { X, Briefcase, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SHIFT_CONFIGS, SHIFT_ORDER } from '@/lib/shift-types'
import type { ShiftType } from '@/lib/shift-types'
import type { DayMemo } from '@/hooks/use-shift-store'

interface DateDetailModalProps {
  dateKey: string
  shift: ShiftType
  memo: DayMemo
  onShiftChange: (shift: ShiftType) => void
  onMemoChange: (memo: DayMemo) => void
  onClose: () => void
}

function parseDateKey(dateKey: string) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  return `${m}月${d}日（${weekdays[date.getDay()]}）`
}

export function DateDetailModal({ dateKey, shift, memo, onShiftChange, onMemoChange, onClose }: DateDetailModalProps) {
  const [workMemo, setWorkMemo] = useState(memo.work)
  const [otherMemo, setOtherMemo] = useState(memo.other)

  useEffect(() => {
    setWorkMemo(memo.work)
    setOtherMemo(memo.other)
  }, [memo])

  const handleSave = () => {
    onMemoChange({ work: workMemo.trim(), other: otherMemo.trim() })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={handleSave}>
      <div
        className="w-full max-w-md bg-white rounded-t-3xl p-5 pb-8 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-800">{parseDateKey(dateKey)}</h3>
          <button onClick={handleSave} className="p-1 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shift selector */}
        <div className="mb-5">
          <p className="text-xs text-gray-400 mb-2">シフト</p>
          <div className="flex gap-1.5">
            {SHIFT_ORDER.map((type) => {
              if (type === null) return null
              const config = SHIFT_CONFIGS[type]
              const isActive = shift === type
              return (
                <button
                  key={type}
                  onClick={() => onShiftChange(isActive ? null : type)}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-xs font-bold transition-all',
                    isActive
                      ? `${config.bgColor} ${config.textColor} ring-2 ring-offset-1 ring-current scale-105`
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  )}
                >
                  {config.shortLabel}
                </button>
              )
            })}
          </div>
        </div>

        {/* Work memo */}
        <div className="mb-4">
          <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            仕事メモ
          </label>
          <textarea
            value={workMemo}
            onChange={(e) => setWorkMemo(e.target.value)}
            placeholder="業務内容、申し送りなど..."
            rows={2}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
          />
        </div>

        {/* Other memo */}
        <div className="mb-5">
          <label className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
            <MessageCircle className="w-3.5 h-3.5" />
            プライベートメモ
          </label>
          <textarea
            value={otherMemo}
            onChange={(e) => setOtherMemo(e.target.value)}
            placeholder="予定、買い物、やることなど..."
            rows={2}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 rounded-2xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors active:scale-[0.98]"
        >
          保存
        </button>
      </div>
    </div>
  )
}
