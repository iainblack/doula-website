import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity/client'
import { buildBlastEmail } from '@/lib/email/template'

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
  const html = buildBlastEmail({ body: blast.body, previewText: blast.previewText, siteUrl })

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
