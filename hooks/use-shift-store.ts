'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ShiftType } from '@/lib/shift-types'

const STORAGE_KEY = 'nurse-shift-data'
const MEMO_STORAGE_KEY = 'nurse-memo-data'

type ShiftData = Record<string, ShiftType>

export interface DayMemo {
  work: string
  other: string
}

type MemoData = Record<string, DayMemo>

export function useShiftStore() {
  const [shifts, setShifts] = useState<ShiftData>({})
  const [memos, setMemos] = useState<MemoData>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setShifts(JSON.parse(stored))
      }
      const storedMemos = localStorage.getItem(MEMO_STORAGE_KEY)
      if (storedMemos) {
        setMemos(JSON.parse(storedMemos))
      }
    } catch {
      console.error('Failed to load data')
    }
    setIsLoaded(true)
  }, [])

  // Save shifts to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(shifts))
      } catch {
        console.error('Failed to save shift data')
      }
    }
  }, [shifts, isLoaded])

  // Save memos to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(MEMO_STORAGE_KEY, JSON.stringify(memos))
      } catch {
        console.error('Failed to save memo data')
      }
    }
  }, [memos, isLoaded])

  const getShift = useCallback(
    (dateKey: string): ShiftType => {
      return shifts[dateKey] ?? null
    },
    [shifts]
  )

  const setShift = useCallback((dateKey: string, shift: ShiftType) => {
    setShifts((prev) => {
      if (shift === null) {
        const { [dateKey]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [dateKey]: shift }
    })
  }, [])

  const bulkSetShifts = useCallback((newShifts: Record<string, ShiftType>) => {
    setShifts((prev) => ({ ...prev, ...newShifts }))
  }, [])

  const getMemo = useCallback(
    (dateKey: string): DayMemo => {
      return memos[dateKey] ?? { work: '', other: '' }
    },
    [memos]
  )

  const setMemo = useCallback((dateKey: string, memo: DayMemo) => {
    setMemos((prev) => {
      if (!memo.work && !memo.other) {
        const { [dateKey]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [dateKey]: memo }
    })
  }, [])

  const hasMemo = useCallback(
    (dateKey: string): boolean => {
      const memo = memos[dateKey]
      return !!memo && (!!memo.work || !!memo.other)
    },
    [memos]
  )

  const getShiftCounts = useCallback(
    (year: number, month: number) => {
      const counts: Record<Exclude<ShiftType, null>, number> = {
        day: 0,
        evening: 0,
        night: 0,
        off: 0,
        paid: 0,
      }

      Object.entries(shifts).forEach(([dateKey, shift]) => {
        if (shift && dateKey.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)) {
          counts[shift]++
        }
      })

      return counts
    },
    [shifts]
  )

  return { shifts, memos, getShift, setShift, bulkSetShifts, getMemo, setMemo, hasMemo, getShiftCounts, isLoaded }
}

export function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
