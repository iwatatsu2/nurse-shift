'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ShiftType } from '@/lib/shift-types'

const STORAGE_KEY = 'nurse-shift-data'

type ShiftData = Record<string, ShiftType>

export function useShiftStore() {
  const [shifts, setShifts] = useState<ShiftData>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setShifts(JSON.parse(stored))
      }
    } catch {
      console.error('Failed to load shift data')
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever shifts change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(shifts))
      } catch {
        console.error('Failed to save shift data')
      }
    }
  }, [shifts, isLoaded])

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

  return { shifts, getShift, setShift, bulkSetShifts, getShiftCounts, isLoaded }
}

export function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
