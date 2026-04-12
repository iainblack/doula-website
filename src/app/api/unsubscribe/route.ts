import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity/client'

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')

  if (!email) {
    return NextResponse.redirect(new URL('/unsubscribed?error=1', request.url))
  }

  // Update Sanity subscriber status
  try {
    const doc = await writeClient.fetch<{ _id: string } | null>(
      `*[_type == "subscriber" && email == $email][0]{ _id }`,
      { email }
    )
    if (doc) {
      await writeClient.patch(doc._id).set({ status: 'unsubscribed' }).commit()
    }
  } catch (err) {
    console.error('Sanity unsubscribe error:', err)
  }

  // Remove from Resend Audience
  const audienceId = process.env.RESEND_AUDIENCE_ID
  const apiKey = process.env.RESEND_API_KEY
  if (audienceId && apiKey) {
    try {
      await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(email)}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${apiKey}` },
        }
      )
    } catch (err) {
      console.error('Resend unsubscribe error:', err)
    }
  }

  return NextResponse.redirect(new URL('/unsubscribed', request.url))
}
