import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'ナースシフト - 看護師向けシフト管理アプリ'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e293b, #334155)',
          gap: 24,
        }}
      >
        {/* Cross */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            width: 100,
            height: 100,
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: 80,
              height: 32,
              background: '#f9a8d4',
              borderRadius: 6,
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: 32,
              height: 80,
              background: '#f9a8d4',
              borderRadius: 6,
            }}
          />
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            color: 'white',
            letterSpacing: 8,
          }}
        >
          Nurse Shift
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#94a3b8',
          }}
        >
          看護師のためのシフト管理 & 仲間との共有アプリ
        </div>
      </div>
    ),
    { ...size }
  )
}
