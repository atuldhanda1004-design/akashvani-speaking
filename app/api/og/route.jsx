import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// Helper to fetch image and convert to Base64 safely without Satori timeout
async function fetchImageBase64(url) {
  if (!url) return null
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000)
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (!res.ok) return null
    const buffer = await res.arrayBuffer()
    const contentType = res.headers.get('content-type') || 'image/jpeg'
    
    let binary = ''
    const bytes = new Uint8Array(buffer)
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return `data:${contentType};base64,${btoa(binary)}`
  } catch (e) {
    return null
  }
}

// Fetch Devanagari font with fallback
async function getHindiFont() {
  try {
    const res = await fetch(
      'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-devanagari@latest/hi-700-normal.ttf'
    )
    if (res.ok) return await res.arrayBuffer()
  } catch (e) {}
  return null
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'Akashvani Speaking'
    const imgParam = searchParams.get('img') || ''
    const location = searchParams.get('location') || ''
    const date = searchParams.get('date') || ''
    const reporter = searchParams.get('reporter') || ''
    const role = searchParams.get('role') || 'reporter'

    const roleLabel = role === 'admin' ? 'संपादक' : 'पत्रकार'
    const cleanImgUrl = imgParam ? imgParam.split(',')[0].trim() : ''

    // Pre-fetch image and font concurrently
    const [base64Image, fontBuffer] = await Promise.all([
      fetchImageBase64(cleanImgUrl),
      getHindiFont(),
    ])

    const bgImageSrc =
      base64Image ||
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80'

    const fontsConfig = fontBuffer
      ? [
          {
            name: 'Noto Sans Devanagari',
            data: fontBuffer,
            weight: 700,
            style: 'normal',
          },
        ]
      : []

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#1B3C5F',
            padding: '20px',
            fontFamily: fontBuffer ? '"Noto Sans Devanagari"' : 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Header Branding */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1B3C5F',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                A&S
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    color: '#ffffff',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  Akashvani Speaking
                </span>
                <span
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '11px',
                  }}
                >
                  ईमानदार सोच - सच्ची खबरें
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '13px',
                fontWeight: 'bold',
              }}
            >
              akashvanispeaking.news
            </div>
          </div>

          {/* Photo Container */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '400px',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              backgroundColor: '#0d1347',
            }}
          >
            <img
              src={bgImageSrc}
              alt="News"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            {/* AS Logo Watermark Badge */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(27, 60, 95, 0.9)',
                border: '2px solid rgba(255,255,255,0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              AS
            </div>

            {/* Location / Date / Reporter Tag */}
            {(location || date || reporter) && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <div
                  style={{
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 'bold',
                  }}
                >
                  {location} {location && date ? '/' : ''} {date}
                </div>
                {reporter && (
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: '11px',
                    }}
                  >
                    {roleLabel}:{' '}
                    <span style={{ color: '#ffffff', fontWeight: 'bold' }}>
                      {reporter}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Headline */}
          <div
            style={{
              display: 'flex',
              marginTop: '12px',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                color: '#ffffff',
                fontSize: '22px',
                fontWeight: 'bold',
                lineHeight: '1.3',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: fontsConfig,
        headers: {
          'content-type': 'image/png',
          'cache-control': 'public, max-age=31536000, immutable',
        },
      }
    )
  } catch (e) {
    console.error('OG Route Error:', e)
    return new Response('Error generating OG image', { status: 500 })
  }
}