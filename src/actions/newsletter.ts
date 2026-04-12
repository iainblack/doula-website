'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { writeClient } from '@/lib/sanity/client'

const NewsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type NewsletterResult = { success: true } | { error: string }

export async function subscribeNewsletter(formData: FormData): Promise<NewsletterResult> {
  const parsed = NewsletterSchema.safeParse({
    email: formData.get('email'),
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { email } = parsed.data
  const audienceId = process.env.RESEND_AUDIENCE_ID

  if (!audienceId) {
    console.error('RESEND_AUDIENCE_ID not set')
    return { error: 'Newsletter signup is not configured.' }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  // Add to Resend Audience
  const { error: resendError } = await resend.contacts.create({
    audienceId,
    email,
    unsubscribed: false,
  })

  if (resendError) {
    console.error('Resend contact error:', resendError)
    return { error: 'Failed to subscribe. Please try again.' }
  }

  // Save to Sanity — don't fail the signup if this errors
  try {
    const existing = await writeClient.fetch<{ _id: string } | null>(
      `*[_type == "subscriber" && email == $email][0]{ _id }`,
      { email }
    )
    if (existing) {
      await writeClient.patch(existing._id).set({ status: 'active' }).commit()
    } else {
      await writeClient.create({
        _type: 'subscriber',
        email,
        subscribedAt: new Date().toISOString(),
        status: 'active',
      })
    }
  } catch (err) {
    console.error('Sanity subscriber create error:', err)
  }

  return { success: true }
}
