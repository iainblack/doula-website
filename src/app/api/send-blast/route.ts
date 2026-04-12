import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity/client'

export async function POST(request: NextRequest) {
  const { id } = await request.json()

  if (!id) {
    return NextResponse.json({ error: 'Missing blast document ID' }, { status: 400 })
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

  if (!audienceId || !apiKey || !fromEmail) {
    return NextResponse.json({ error: 'Missing Resend environment variables' }, { status: 500 })
  }

  if (fromEmail === 'onboarding@resend.dev') {
    return NextResponse.json(
      {
        error:
          'A verified sending domain is required to send broadcasts. Update RESEND_FROM_EMAIL in your environment variables and verify the domain at resend.com/domains.',
      },
      { status: 400 }
    )
  }

  // Fetch the blast document from Sanity
  const blast = await writeClient.fetch<{
    _id: string
    subject: string
    previewText?: string
    body: string
    status: string
  } | null>(
    `*[_type == "emailBlast" && _id == $id][0]{ _id, subject, previewText, body, status }`,
    { id }
  )

  if (!blast) {
    return NextResponse.json({ error: 'Blast not found' }, { status: 404 })
  }

  if (blast.status === 'sent') {
    return NextResponse.json({ error: 'This blast has already been sent' }, { status: 409 })
  }

  // Build HTML — paragraphs separated by blank lines, {{email}} replaced by Resend at send time
  const bodyHtml = blast.body
    .split('\n\n')
    .map(p => `<p style="margin:0 0 16px;line-height:1.6">${p.replace(/\n/g, '<br>')}</p>`)
    .join('')

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
${blast.previewText ? `<div style="display:none;max-height:0;overflow:hidden">${blast.previewText}</div>` : ''}
</head>
<body style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 24px;color:#3a3027;background:#fefcf9">
  <div style="border-bottom:1px solid #e8dfd4;margin-bottom:32px;padding-bottom:16px">
    <p style="font-size:13px;color:#8a7a6a;margin:0">Gentle Roots Doula Services</p>
  </div>
  ${bodyHtml}
  <div style="border-top:1px solid #e8dfd4;margin-top:40px;padding-top:16px;font-size:12px;color:#8a7a6a">
    <p style="margin:0">You received this because you subscribed at <a href="${siteUrl}" style="color:#8a7a6a">${siteUrl}</a>.</p>
    <p style="margin:8px 0 0"><a href="${siteUrl}/api/unsubscribe?email={{email}}" style="color:#8a7a6a">Unsubscribe</a></p>
  </div>
</body>
</html>`

  // Create Resend broadcast
  const createRes = await fetch('https://api.resend.com/broadcasts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audience_id: audienceId,
      from: fromEmail,
      name: blast.subject,
      subject: blast.subject,
      html,
      text: blast.body,
    }),
  })

  const createData = await createRes.json()
  if (!createRes.ok) {
    console.error('Resend broadcast create error:', createData)
    return NextResponse.json(
      { error: createData.message || 'Failed to create broadcast' },
      { status: 500 }
    )
  }

  // Send the broadcast
  const sendRes = await fetch(`https://api.resend.com/broadcasts/${createData.id}/send`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
  })

  if (!sendRes.ok) {
    const sendData = await sendRes.json()
    console.error('Resend broadcast send error:', sendData)
    return NextResponse.json(
      { error: sendData.message || 'Failed to send broadcast' },
      { status: 500 }
    )
  }

  // Mark the Sanity document as sent
  await writeClient
    .patch(id)
    .set({ status: 'sent', sentAt: new Date().toISOString() })
    .commit()

  return NextResponse.json({ success: true })
}
