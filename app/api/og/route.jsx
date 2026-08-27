import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'Akashvani Speaking'
    const imgUrl = searchParams.get('img') || 'https://via.placeholder.com/800x450/30567D/ffffff?text=Akashvani+Speaking'

    return new ImageResponse(
      (
        <div style={{ display: 'flex', width: '100%', height: '100%', position: 'relative', backgroundColor: '#f3f4f6' }}>
          {/* Main Background Image */}
          <img src={imgUrl} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />
          
          {/* Bottom Dark Gradient & Title */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', flexDirection: 'column', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', padding: '40px' }}>
             <h1 style={{ color: 'white', fontSize: '48px', fontWeight: 'bold', margin: 0 }}>{title}</h1>
          </div>

          {/* Top Left Watermark Badge */}
          <div style={{ position: 'absolute', top: 30, left: 30, display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.9)', padding: '10px 20px', borderRadius: '50px' }}>
            <span style={{ color: '#30567D', fontSize: '24px', fontWeight: 'bold' }}>Akashvani Speaking</span>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  } catch (e) {
    return new Response('Failed to generate image', { status: 500 })
  }
}