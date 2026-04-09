'use server'

import { z } from 'zod'

const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactResult = { success: true } | { error: string }

export async function submitContactForm(formData: FormData): Promise<ContactResult> {
  const parsed = ContactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  // Per-project: configure delivery method via env vars.
  //
  // Option 1 — Resend email:
  //   import { Resend } from 'resend'
  //   const resend = new Resend(process.env.RESEND_API_KEY)
  //   await resend.emails.send({
  //     from: 'noreply@yourdomain.com',
  //     to: process.env.CONTACT_EMAIL_TO!,
  //     subject: `Contact from ${parsed.data.name}`,
  //     text: `From: ${parsed.data.name} (${parsed.data.email})\n\n${parsed.data.message}`,
  //   })
  //
  // Option 2 — Store in Sanity:
  //   import { client } from '@/lib/sanity/client'
  //   await client.create({ _type: 'contactSubmission', ...parsed.data })

  return { success: true }
}
