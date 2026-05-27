'use client'

import { ArrowLeft, Globe, Hospital, Instagram, FileText, BarChart3 } from 'lucide-react'

const links = [
  { icon: <Globe className="w-4 h-4" />, label: '公式サイト', url: 'https://driwatatsu.readdy.co' },
  { icon: <Hospital className="w-4 h-4" />, label: '医療アプリまとめ', url: 'https://medapp-market.vercel.app' },
  { icon: <Instagram className="w-4 h-4" />, label: 'Instagram', url: 'https://www.instagram.com/dr.iwatatsu/' },
  { icon: <span className="text-sm font-bold">𝕏</span>, label: 'X (Twitter)', url: 'https://x.com/KenKyu1019799' },
  { icon: <FileText className="w-4 h-4" />, label: 'note', url: 'https://note.com/dr_iwatatsu' },
  { icon: <BarChart3 className="w-4 h-4" />, label: 'antaaスライド', url: 'https://slide.antaa.jp/profile/mtzDnleJ6DYJ' },
]

interface ProfilePageProps {
  onBack: () => void
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  return (
    <div className="px-4 py-6 space-y-4">
      {/* 戻るボタン */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        戻る
      </button>

      {/* プロフィールカード */}
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
        <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 shadow-lg shadow-slate-200">
          <img
            src="/dr-iwatatsu.png"
            alt="Dr. いわたつ"
            className="w-full object-cover object-top"
            style={{ height: '200%' }}
          />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Dr. いわたつ</h2>
        <p className="text-sm text-gray-500 mt-1">岩本 達也｜糖尿病・内分泌 専門医・指導医</p>
      </div>

      {/* 自己紹介文 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <p className="text-sm text-gray-600 leading-relaxed">
          糖尿病・内分泌の専門医として日々診療に取り組みながら、「現場で本当に使えるツールを自分の手で作る」をモットーにWebアプリを開発しています。
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mt-3">
          点滴の滴下速度調整やシフト管理など、忙しい病棟業務をサポートするツールを無料で公開中。看護師さんの「これ便利！」が何よりの励みです。
        </p>
      </div>

      {/* リンク一覧 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-5 py-3.5 text-gray-700 hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
          >
            <span className="text-gray-400">{link.icon}</span>
            <span className="flex-1 text-sm font-medium">{link.label}</span>
            <span className="text-gray-300 text-sm">→</span>
          </a>
        ))}
      </div>
    </div>
  )
}
