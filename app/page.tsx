'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { CalendarHeader } from '@/components/calendar-header'
import { CalendarGrid } from '@/components/calendar-grid'
import { ShiftSummary } from '@/components/shift-summary'
import { PatternInput } from '@/components/pattern-input'
import { WeatherBar } from '@/components/weather-bar'
import { FatigueBar } from '@/components/fatigue-bar'
import { GroupPanel } from '@/components/group-panel'
import { DateDetailModal } from '@/components/date-detail-modal'
import { ProfilePage } from '@/components/profile-page'
import { useShiftStore } from '@/hooks/use-shift-store'
import { useGroup } from '@/hooks/use-group'
import { getNextShift } from '@/lib/shift-types'
import type { ShiftType } from '@/lib/shift-types'
import { Layers, Users, PartyPopper } from 'lucide-react'

export default function NurseShiftApp() {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [showPattern, setShowPattern] = useState(false)
  const [showGroup, setShowGroup] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showProfile, setShowProfile] = useState(false)

  const { shifts, memos, getShift, setShift, bulkSetShifts, getMemo, setMemo, hasMemo, getShiftCounts, isLoaded } = useShiftStore()
  const {
    group,
    members,
    myMemberId,
    createGroup,
    joinGroup,
    syncShifts,
    leaveGroup,
    getCommonOffDays,
  } = useGroup()

  // Sync shifts to group when they change
  useEffect(() => {
    if (myMemberId && isLoaded) {
      syncShifts(shifts)
    }
  }, [shifts, myMemberId, isLoaded, syncShifts])

  const handlePrevMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1)
        return 11
      }
      return prev - 1
    })
  }, [])

  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1)
        return 0
      }
      return prev + 1
    })
  }, [])

  const handleToday = useCallback(() => {
    const now = new Date()
    setCurrentYear(now.getFullYear())
    setCurrentMonth(now.getMonth())
  }, [])

  const handleDateClick = useCallback(
    (dateKey: string) => {
      const currentShift = getShift(dateKey)
      const nextShift = getNextShift(currentShift)
      setShift(dateKey, nextShift)
    },
    [getShift, setShift]
  )

  const handleDateLongPress = useCallback((dateKey: string) => {
    setSelectedDate(dateKey)
  }, [])

  const handlePatternApply = useCallback(
    (newShifts: Record<string, ShiftType>) => {
      bulkSetShifts(newShifts)
    },
    [bulkSetShifts]
  )

  const shiftCounts = getShiftCounts(currentYear, currentMonth)
  const commonOffDays = group ? getCommonOffDays(currentYear, currentMonth) : []

  // Build memo flags for current view
  const memoFlags = useMemo(() => {
    const flags: Record<string, boolean> = {}
    Object.keys(memos).forEach((key) => {
      if (hasMemo(key)) flags[key] = true
    })
    return flags
  }, [memos, hasMemo])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-300">読み込み中...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl shadow-gray-200/50">
        <CalendarHeader
          year={currentYear}
          month={currentMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
          onProfile={() => setShowProfile(true)}
        />

        {showProfile ? (
          <ProfilePage onBack={() => setShowProfile(false)} />
        ) : (<>
        {/* Group indicator */}
        {group && (
          <div className="px-4 py-2 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {members.slice(0, 4).map((m) => (
                  <div
                    key={m.id}
                    className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white font-bold"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.name.charAt(0)}
                  </div>
                ))}
              </div>
              <span className="text-xs text-gray-500">{group.name}</span>
            </div>
            {commonOffDays.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-pink-500 font-medium">
                <PartyPopper className="w-3.5 h-3.5" />
                共通休み {commonOffDays.length}日
              </div>
            )}
          </div>
        )}

        <CalendarGrid
          year={currentYear}
          month={currentMonth}
          shifts={shifts}
          memoFlags={memoFlags}
          onDateClick={handleDateClick}
          onDateLongPress={handleDateLongPress}
          commonOffDays={commonOffDays}
        />

        <ShiftSummary counts={shiftCounts} />

        <FatigueBar shifts={shifts} />

        <WeatherBar />

        {/* Actions */}
        <div className="px-5 py-3 flex gap-2">
          <button
            onClick={() => setShowPattern(true)}
            className="flex-1 py-2.5 rounded-2xl text-xs font-medium flex items-center justify-center gap-2 bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors active:scale-[0.98]"
          >
            <Layers className="w-4 h-4" />
            パターン入力
          </button>
          <button
            onClick={() => setShowGroup(true)}
            className="flex-1 py-2.5 rounded-2xl text-xs font-medium flex items-center justify-center gap-2 bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors active:scale-[0.98]"
          >
            <Users className="w-4 h-4" />
            {group ? 'グループ' : 'みんなと共有'}
          </button>
        </div>

        <div className="px-4 pb-6 pt-1 space-y-2">
          <p className="text-xs text-center text-gray-400">
            タップ → シフト切替　／　長押し → メモ編集
            <br />
            <span className="text-gray-300">日 → 準 → 深 → 休 → 有 → クリア</span>
          </p>
          <p className="text-center">
            <Link href="/terms" className="text-[10px] text-gray-300 hover:text-gray-400">
              利用規約・免責事項
            </Link>
          </p>
        </div>
        </>)}
      </div>

      {showPattern && (
        <PatternInput
          year={currentYear}
          month={currentMonth}
          onApply={handlePatternApply}
          onClose={() => setShowPattern(false)}
        />
      )}

      {showGroup && (
        <GroupPanel
          group={group}
          members={members}
          myMemberId={myMemberId}
          onCreateGroup={createGroup}
          onJoinGroup={joinGroup}
          onLeaveGroup={leaveGroup}
          onClose={() => setShowGroup(false)}
        />
      )}

      {selectedDate && (
        <DateDetailModal
          dateKey={selectedDate}
          shift={getShift(selectedDate)}
          memo={getMemo(selectedDate)}
          onShiftChange={(shift) => setShift(selectedDate, shift)}
          onMemoChange={(memo) => setMemo(selectedDate, memo)}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </main>
  )
}
