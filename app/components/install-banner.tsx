'use client'

import { useState, useEffect, useCallback } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'install-banner-dismissed'
const DISMISS_DAYS = 7

export default function InstallBanner() {
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    // Skip if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      return
    }

    // Check dismissal
    const dismissed = localStorage.getItem(DISMISS_KEY)
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10)
      if (Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000) {
        return
      }
    }

    const ua = navigator.userAgent
    const ios = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream
    setIsIOS(ios)

    if (ios) {
      setShow(true)
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString())
    setShow(false)
  }, [])

  const install = useCallback(async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShow(false)
    }
    setDeferredPrompt(null)
  }, [deferredPrompt])

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-[#1e1e2e] text-white rounded-2xl shadow-2xl p-4 flex items-start gap-3">
        <div className="text-2xl mt-0.5">📲</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">ホーム画面に追加</p>
          {isIOS ? (
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              下の共有ボタン
              <span className="inline-block mx-1 text-pink-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 inline-block align-text-bottom">
                  <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h3v2H6v11h12V10h-3V8h3a2 2 0 012 2z" />
                </svg>
              </span>
              から「ホーム画面に追加」でアプリとして使えます
            </p>
          ) : (
            <p className="text-xs text-gray-300 mt-1">
              アプリとしてインストールできます
            </p>
          )}
          <div className="flex gap-2 mt-3">
            {!isIOS && deferredPrompt && (
              <button
                onClick={install}
                className="px-4 py-1.5 bg-pink-500 text-white text-xs font-bold rounded-full hover:bg-pink-600 transition-colors"
              >
                インストール
              </button>
            )}
            <button
              onClick={dismiss}
              className="px-4 py-1.5 text-gray-400 text-xs rounded-full hover:text-gray-200 transition-colors"
            >
              あとで
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
