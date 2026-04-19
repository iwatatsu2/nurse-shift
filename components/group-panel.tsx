'use client'

import { useState } from 'react'
import { X, Users, Copy, Check, LogOut, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Member {
  id: string
  name: string
  color: string
  device_id: string
}

interface Group {
  id: string
  name: string
  invite_code: string
}

interface GroupPanelProps {
  group: Group | null
  members: Member[]
  myMemberId: string | null
  onCreateGroup: (groupName: string, myName: string) => Promise<unknown>
  onJoinGroup: (inviteCode: string, myName: string) => Promise<unknown>
  onLeaveGroup: () => void
  onClose: () => void
}

export function GroupPanel({
  group,
  members,
  myMemberId,
  onCreateGroup,
  onJoinGroup,
  onLeaveGroup,
  onClose,
}: GroupPanelProps) {
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>(group ? 'menu' : 'menu')
  const [groupName, setGroupName] = useState('')
  const [myName, setMyName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!groupName.trim() || !myName.trim()) return
    setError('')
    const result = await onCreateGroup(groupName.trim(), myName.trim())
    if (!result) {
      setError('グループの作成に失敗しました')
      return
    }
    setMode('menu')
  }

  const handleJoin = async () => {
    if (!inviteCode.trim() || !myName.trim()) return
    setError('')
    const result = await onJoinGroup(inviteCode.trim(), myName.trim())
    if (!result) {
      setError('招待コードが見つかりません')
      return
    }
    setMode('menu')
  }

  const handleCopyCode = async () => {
    if (!group) return
    await navigator.clipboard.writeText(group.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="bg-white w-full max-w-md rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5" />
            グループ
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Group exists - show info */}
          {group && mode === 'menu' && (
            <>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-1">グループ名</p>
                <p className="font-bold text-gray-800">{group.name}</p>

                <p className="text-xs text-gray-400 mt-3 mb-1">招待コード</p>
                <div className="flex items-center gap-2">
                  <code className="text-lg font-bold font-[var(--font-inter)] text-slate-800 tracking-widest">
                    {group.invite_code}
                  </code>
                  <button
                    onClick={handleCopyCode}
                    className={cn(
                      'p-1.5 rounded-lg transition-colors',
                      copied ? 'text-emerald-500 bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'
                    )}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Members list */}
              <div>
                <p className="text-xs text-gray-400 mb-2">メンバー ({members.length}人)</p>
                <div className="space-y-2">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 py-2"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: member.color }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-700 font-medium">
                        {member.name}
                        {member.id === myMemberId && (
                          <span className="text-xs text-gray-400 ml-1">（自分）</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onLeaveGroup}
                className="w-full py-2 text-xs text-rose-400 hover:text-rose-500 flex items-center justify-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                グループを退出
              </button>
            </>
          )}

          {/* No group - show options */}
          {!group && mode === 'menu' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 text-center">
                仲間とシフトを共有して<br />みんなが休みの日を見つけよう
              </p>
              <button
                onClick={() => setMode('create')}
                className="w-full py-3 rounded-2xl text-sm font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              >
                グループを作成
              </button>
              <button
                onClick={() => setMode('join')}
                className="w-full py-3 rounded-2xl text-sm font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                招待コードで参加
              </button>
            </div>
          )}

          {/* Create form */}
          {mode === 'create' && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="グループ名（例：5F仲良し組）"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
              <input
                type="text"
                placeholder="あなたの名前"
                value={myName}
                onChange={(e) => setMyName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
              {error && <p className="text-xs text-rose-500">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={() => { setMode('menu'); setError('') }}
                  className="flex-1 py-3 rounded-2xl text-sm bg-gray-50 text-gray-500"
                >
                  戻る
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!groupName.trim() || !myName.trim()}
                  className={cn(
                    'flex-1 py-3 rounded-2xl text-sm font-bold transition-colors',
                    groupName.trim() && myName.trim()
                      ? 'bg-slate-800 text-white hover:bg-slate-700'
                      : 'bg-gray-100 text-gray-300'
                  )}
                >
                  作成
                </button>
              </div>
            </div>
          )}

          {/* Join form */}
          {mode === 'join' && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="招待コード"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-[var(--font-inter)] tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
              <input
                type="text"
                placeholder="あなたの名前"
                value={myName}
                onChange={(e) => setMyName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
              {error && <p className="text-xs text-rose-500">{error}</p>}
              <div className="flex gap-2">
                <button
                  onClick={() => { setMode('menu'); setError('') }}
                  className="flex-1 py-3 rounded-2xl text-sm bg-gray-50 text-gray-500"
                >
                  戻る
                </button>
                <button
                  onClick={handleJoin}
                  disabled={!inviteCode.trim() || !myName.trim()}
                  className={cn(
                    'flex-1 py-3 rounded-2xl text-sm font-bold transition-colors',
                    inviteCode.trim() && myName.trim()
                      ? 'bg-slate-800 text-white hover:bg-slate-700'
                      : 'bg-gray-100 text-gray-300'
                  )}
                >
                  参加
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-8" />
      </div>
    </div>
  )
}
