'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase, getDeviceId } from '@/lib/supabase'
import type { ShiftType } from '@/lib/shift-types'

interface Group {
  id: string
  name: string
  invite_code: string
}

interface Member {
  id: string
  name: string
  color: string
  device_id: string
}

interface MemberShift {
  member_id: string
  date: string
  shift_type: ShiftType
}

const MEMBER_COLORS = ['#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#f43f5e']

export function useGroup() {
  const [group, setGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [memberShifts, setMemberShifts] = useState<MemberShift[]>([])
  const [myMemberId, setMyMemberId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const deviceId = typeof window !== 'undefined' ? getDeviceId() : ''

  // Load saved group on mount
  useEffect(() => {
    const savedGroupId = localStorage.getItem('nurse-group-id')
    if (savedGroupId) {
      loadGroup(savedGroupId)
    } else {
      setIsLoading(false)
    }
  }, [])

  const loadGroup = async (groupId: string) => {
    setIsLoading(true)

    const { data: groupData } = await supabase
      .from('nurse_groups')
      .select('*')
      .eq('id', groupId)
      .single()

    if (!groupData) {
      localStorage.removeItem('nurse-group-id')
      setIsLoading(false)
      return
    }

    setGroup(groupData)

    const { data: membersData } = await supabase
      .from('nurse_members')
      .select('*')
      .eq('group_id', groupId)

    if (membersData) {
      setMembers(membersData)
      const me = membersData.find((m: Member) => m.device_id === deviceId)
      if (me) setMyMemberId(me.id)
    }

    await loadMemberShifts(groupId)
    setIsLoading(false)
  }

  const loadMemberShifts = async (groupId: string) => {
    const { data: membersData } = await supabase
      .from('nurse_members')
      .select('id')
      .eq('group_id', groupId)

    if (!membersData) return

    const memberIds = membersData.map((m: { id: string }) => m.id)
    const { data: shiftsData } = await supabase
      .from('nurse_shifts')
      .select('member_id, date, shift_type')
      .in('member_id', memberIds)

    if (shiftsData) setMemberShifts(shiftsData)
  }

  // Subscribe to realtime changes
  useEffect(() => {
    if (!group) return

    const channel = supabase
      .channel('nurse-shifts-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'nurse_shifts' },
        () => {
          loadMemberShifts(group.id)
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'nurse_members' },
        () => {
          loadGroup(group.id)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [group?.id])

  const createGroup = useCallback(async (groupName: string, myName: string) => {
    const { data: newGroup } = await supabase
      .from('nurse_groups')
      .insert({ name: groupName })
      .select()
      .single()

    if (!newGroup) return null

    const colorIndex = 0
    const { data: member } = await supabase
      .from('nurse_members')
      .insert({
        group_id: newGroup.id,
        name: myName,
        color: MEMBER_COLORS[colorIndex],
        device_id: deviceId,
      })
      .select()
      .single()

    if (member) {
      setMyMemberId(member.id)
      setMembers([member])
    }

    setGroup(newGroup)
    localStorage.setItem('nurse-group-id', newGroup.id)
    return newGroup
  }, [deviceId])

  const joinGroup = useCallback(async (inviteCode: string, myName: string) => {
    const { data: foundGroup } = await supabase
      .from('nurse_groups')
      .select('*')
      .eq('invite_code', inviteCode)
      .single()

    if (!foundGroup) return null

    const { data: existingMembers } = await supabase
      .from('nurse_members')
      .select('*')
      .eq('group_id', foundGroup.id)

    const colorIndex = (existingMembers?.length ?? 0) % MEMBER_COLORS.length

    const { data: member } = await supabase
      .from('nurse_members')
      .upsert({
        group_id: foundGroup.id,
        name: myName,
        color: MEMBER_COLORS[colorIndex],
        device_id: deviceId,
      }, { onConflict: 'group_id,device_id' })
      .select()
      .single()

    if (member) {
      setMyMemberId(member.id)
    }

    setGroup(foundGroup)
    localStorage.setItem('nurse-group-id', foundGroup.id)
    await loadGroup(foundGroup.id)
    return foundGroup
  }, [deviceId])

  const syncShifts = useCallback(async (shifts: Record<string, ShiftType>) => {
    if (!myMemberId) return

    const entries = Object.entries(shifts)
      .filter(([, v]) => v !== null)
      .map(([date, shift_type]) => ({
        member_id: myMemberId,
        date,
        shift_type,
      }))

    if (entries.length === 0) return

    await supabase
      .from('nurse_shifts')
      .upsert(entries, { onConflict: 'member_id,date' })
  }, [myMemberId])

  const leaveGroup = useCallback(() => {
    setGroup(null)
    setMembers([])
    setMemberShifts([])
    setMyMemberId(null)
    localStorage.removeItem('nurse-group-id')
  }, [])

  // Get common off days for a given month
  const getCommonOffDays = useCallback((year: number, month: number) => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`
    const otherMembers = members.filter((m) => m.id !== myMemberId)

    if (otherMembers.length === 0) return []

    const offDaysByMember: Record<string, Set<string>> = {}
    otherMembers.forEach((m) => {
      offDaysByMember[m.id] = new Set()
    })

    // Include my off days too
    if (myMemberId) {
      offDaysByMember[myMemberId] = new Set()
    }

    memberShifts.forEach((s) => {
      if (s.date.startsWith(prefix) && (s.shift_type === 'off' || s.shift_type === 'paid')) {
        if (offDaysByMember[s.member_id]) {
          offDaysByMember[s.member_id].add(s.date)
        }
      }
    })

    // Find dates where ALL members are off
    const allMemberIds = [...otherMembers.map((m) => m.id), myMemberId].filter(Boolean) as string[]
    if (allMemberIds.length < 2) return []

    const allDates = new Set<string>()
    Object.values(offDaysByMember).forEach((dates) => {
      dates.forEach((d) => allDates.add(d))
    })

    return Array.from(allDates).filter((date) =>
      allMemberIds.every((id) => offDaysByMember[id]?.has(date))
    )
  }, [members, memberShifts, myMemberId])

  return {
    group,
    members,
    memberShifts,
    myMemberId,
    isLoading,
    createGroup,
    joinGroup,
    syncShifts,
    leaveGroup,
    getCommonOffDays,
  }
}
