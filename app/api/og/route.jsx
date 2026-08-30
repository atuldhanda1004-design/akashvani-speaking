import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// Fetch Devanagari fonts for Hindi text rendering
const fontRegular = fetch(
  'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-devanagari@latest/hi-400-normal.ttf'
).then((res) => res.arrayBuffer())

const fontBold = fetch(
  'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-devanagari@latest/hi-700-normal.ttf'
).then((res) => res.arrayBuffer())

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'Akashvani Speaking'
    const img = searchParams.get('img') || ''
    const location = searchParams.get('location') || ''
    const date = searchParams.get('date') || ''
    const reporter = searchParams.get('reporter') || ''
    const role = searchParams.get('role') || 'reporter'

    const fontData = await fontRegular
    const fontBoldData = await fontBold

    const roleLabel = role === 'admin' ? 'संपादक' : 'पत्रकार'
    const fallbackImg = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80'
    const newsImg = img ? img.split(',')[0].trim() : fallbackImg

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#1B3C5F',
            padding: '24px',
            fontFamily: '"Noto Sans Devanagari"',
            position: 'relative',
          }}
        >
          {/* Top Header Branding */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1B3C5F',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                A&S
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: 'bold' }}>
                  Akashvani Speaking
                </span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                  ईमानदार सोच - सच्ची खबरें
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              akashvanispeaking.news
            </div>
          </div>

          {/* News Photo Frame */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '380px',
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            <img
              src={newsImg}
              alt="News"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            {/* Top-Left AS Logo Watermark */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(27, 60, 95, 0.85)',
                border: '2px solid rgba(255,255,255,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              }}
            >
              AS
            </div>

            {/* Bottom-Left Tag: Location / Date / Reporter / Role */}
            {(location || date || reporter) && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: 'bold' }}>
                  {location} {location && date ? '/' : ''} {date}
                </div>
                {reporter && (
                  <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '12px' }}>
                    {roleLabel}: <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{reporter}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom News Headline */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: '16px',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                color: '#ffffff',
                fontSize: '24px',
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
        fonts: [
          {
            name: 'Noto Sans Devanagari',
            data: await fontData,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Noto Sans Devanagari',
            data: await fontBoldData,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    )
  } catch (e) {
    console.error('OG Image Generation Error:', e)
    return new Response('Error generating image', { status: 500 })
  }
}