'use server'

import { z } from 'zod'

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

  // Per-project: configure newsletter provider via env vars.
  //
  // Option 1 — Buttondown:
  //   await fetch('https://api.buttondown.email/v1/subscribers', {
  //     method: 'POST',
  //     headers: { Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}` },
  //     body: JSON.stringify({ email: parsed.data.email }),
  //   })
  //
  // Option 2 — Mailchimp:
  //   const dc = process.env.MAILCHIMP_DC
  //   await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`, {
  //     method: 'POST',
  //     headers: { Authorization: `apikey ${process.env.MAILCHIMP_API_KEY}` },
  //     body: JSON.stringify({ email_address: parsed.data.email, status: 'subscribed' }),
  //   })

  return { success: true }
}
