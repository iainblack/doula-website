'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { client } from '@/lib/sanity/client'
import { contactEmailQuery } from '@/lib/sanity/queries'
import { buildContactNotificationEmail } from '@/lib/email/template'

const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactResult = { success: true } | { error: string }

export async function submitContactForm(formData: FormData): Promise<ContactResult> {
  const parsed = ContactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject') || undefined,
    message: formData.get('message'),
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  // Prefer the email configured in Sanity Settings, fall back to env var
  const to: string =
    (await client.fetch<string | null>(contactEmailQuery)) ??
    process.env.CONTACT_EMAIL_TO ??
    ''

  if (!to) {
    console.error('No contact email configured (Sanity siteSettings.contactEmail or CONTACT_EMAIL_TO)')
    return { error: 'Server configuration error. Please try again later.' }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { name, email, subject, message } = parsed.data

  const subjectLine = subject
    ? `Contact from ${name} — ${subject}`
    : `Contact from ${name}`

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev',
    to,
    replyTo: email,
    subject: subjectLine,
    text: `From: ${name} (${email})\n${subject ? `Subject: ${subject}\n` : ''}\n${message}`,
    html: buildContactNotificationEmail({ name, email, subject, message }),
  })

  if (error) {
    console.error('Resend error:', error)
    return { error: 'Failed to send message. Please try again.' }
  }

  return { success: true }
}
