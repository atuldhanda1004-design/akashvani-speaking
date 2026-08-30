export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const body = await req.json()
    const { title, url, image, message } = body

    const APP_ID =
      process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID ||
      '0f47a4cc-753c-49bc-869c-da583a236cfc'
    const REST_KEY = process.env.ONESIGNAL_REST_KEY

    if (!REST_KEY) {
      return Response.json(
        { ok: false, error: 'ONESIGNAL_REST_KEY missing in env' },
        { status: 500 }
      )
    }

    if (!title) {
      return Response.json({ ok: false, error: 'title required' }, { status: 400 })
    }

    const payload = {
      app_id: APP_ID,
      included_segments: ['Subscribed Users'],
      headings: { en: 'Akashvani Speaking', hi: 'आकाशवाणी स्पीकिंग' },
      contents: {
        en: message || title,
        hi: message || title,
      },
      url: url || 'https://akashvanispeaking.news',
      web_url: url || 'https://akashvanispeaking.news',
      chrome_web_icon: 'https://akashvanispeaking.news/logo.png',
    }

    if (image) {
      payload.chrome_web_image = image
      payload.big_picture = image
    }

    const res = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Basic ${REST_KEY}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (!res.ok) {
      return Response.json({ ok: false, error: data }, { status: res.status })
    }

    return Response.json({
      ok: true,
      recipients: data.recipients || 0,
      id: data.id,
    })
  } catch (err) {
    return Response.json(
      { ok: false, error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}