'use client'

import { useState } from 'react'
import { Share2, Check, Copy } from 'lucide-react'
import type { ShiftType } from '@/lib/shift-types'
import { cn } from '@/lib/utils'

interface ShareButtonProps {
  shifts: Record<string, ShiftType>
  year: number
  month: number
}

export function ShareButton({ shifts, year, month }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    // Filter shifts for current month only
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`
    const monthShifts: Record<string, ShiftType> = {}
    Object.entries(shifts).forEach(([key, value]) => {
      if (key.startsWith(prefix)) {
        monthShifts[key] = value
      }
    })

    const encoded = btoa(encodeURIComponent(JSON.stringify(monthShifts)))
    const url = `${window.location.origin}?shared=${encoded}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `ナースシフト ${year}年${month + 1}月`,
          text: `${year}年${month + 1}月のシフトを共有します`,
          url,
        })
        return
      } catch {
        // Fall through to clipboard
      }
    }

    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleShare}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all',
        copied
          ? 'bg-emerald-50 text-emerald-500'
          : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
      )}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          コピー済み
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" />
          共有
        </>
      )}
    </button>
  )
}
