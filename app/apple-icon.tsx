import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
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
          borderRadius: 36,
          gap: 4,
        }}
      >
        {/* Cross */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            width: 60,
            height: 60,
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: 48,
              height: 20,
              background: '#f9a8d4',
              borderRadius: 4,
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: 20,
              height: 48,
              background: '#f9a8d4',
              borderRadius: 4,
            }}
          />
        </div>
        {/* Text */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: 'white',
            letterSpacing: 6,
            marginTop: 8,
          }}
        >
          NS
        </div>
      </div>
    ),
    { ...size }
  )
}
