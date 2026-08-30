import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'
export const runtime = 'edge'

// This becomes /icon automatically and overrides defaults
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1B3C5F',
          borderRadius: '50%',
          color: '#fff',
          fontSize: 11,
          fontWeight: 800,
          fontFamily: 'Arial, sans-serif',
          letterSpacing: '-0.5px',
        }}
      >
        AS
      </div>
    ),
    { ...size }
  )
}