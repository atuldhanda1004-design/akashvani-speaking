import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'
export const runtime = 'edge'

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
          color: 'white',
          fontSize: 14,
          fontWeight: 700,
          fontFamily: 'sans-serif',
        }}
      >
        AS
      </div>
    ),
    { ...size }
  )
}