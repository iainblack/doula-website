'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { writeClient } from '@/lib/sanity/client'
import { Resend } from 'resend'
import { buildConfirmationEmail, buildCancellationEmail } from '@/lib/email/template'

const RegistrationSchema = z.object({
  classKey: z.string().min(1),
  className: z.string().min(1),
  classDate: z.string().optional().default(''),
  classTime: z.string().optional().default(''),
  classLocation: z.string().optional().default(''),
  attendeeLimit: z.coerce.number().int().positive(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
})

type RegistrationResult = { success: true; cancelToken: string } | { error: string }
type ActionResult = { success: true } | { error: string }

function generateToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('')
}

export async function registerForClass(formData: FormData): Promise<RegistrationResult> {
  const parsed = RegistrationSchema.safeParse({
    classKey: formData.get('classKey'),
    className: formData.get('className'),
    classDate: formData.get('classDate'),
    classTime: formData.get('classTime'),
    classLocation: formData.get('classLocation'),
    attendeeLimit: formData.get('attendeeLimit'),
    name: formData.get('name'),
    email: formData.get('email'),
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { classKey, className, classDate, classTime, classLocation, attendeeLimit, name, email } =
    parsed.data

  // Check current registration count
  const existing = await writeClient.fetch<{ classKey: string }[]>(
    `*[_type == "classRegistration" && classKey == $classKey && status == "active"]{ classKey }`,
    { classKey }
  )

  if (existing.length >= attendeeLimit) {
    return { error: 'This class is full. No spots remaining.' }
  }

  // Check if this email is already registered for this class
  const duplicate = await writeClient.fetch<number>(
    `count(*[_type == "classRegistration" && classKey == $classKey && email == $email && status == "active"])`,
    { classKey, email }
  )

  if (duplicate > 0) {
    return { error: 'This email is already registered for this class.' }
  }

  const cancelToken = generateToken()
  const createdAt = new Date().toISOString()

  await writeClient.create({
    _type: 'classRegistration',
    classKey,
    className,
    classDate,
    name,
    email,
    cancelToken,
    status: 'active',
    createdAt,
  })

  // Send confirmation email
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const cancelUrl = `${siteUrl}/api/cancel-registration?token=${cancelToken}`

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: `You're registered for ${className}`,
      html: buildConfirmationEmail({ name, className, classDate, classTime, classLocation, cancelUrl }),
    })
  }

  return { success: true, cancelToken }
}


export async function checkRegistrationActive(classKey: string, token: string): Promise<boolean> {
  const registration = await writeClient.fetch<{ status: string } | null>(
    `*[_type == "classRegistration" && classKey == $classKey && cancelToken == $cancelToken][0]{ status }`,
    { classKey, cancelToken: token }
  )
  return registration?.status === 'active'
}

export async function cancelRegistration(token: string): Promise<ActionResult> {
  if (!token) return { error: 'Invalid cancellation link.' }

  const registration = await writeClient.fetch<{
    _id: string
    name: string
    email: string
    className: string
    status: string
  } | null>(
    `*[_type == "classRegistration" && cancelToken == $cancelToken][0]{ _id, name, email, className, status }`,
    { cancelToken: token }
  )

  if (!registration) return { error: 'Cancellation link not found.' }
  if (registration.status === 'cancelled') return { error: 'This registration is already cancelled.' }

  await writeClient.patch(registration._id).set({ status: 'cancelled' }).commit()

  revalidatePath('/classes')

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: registration.email,
      subject: `Registration cancelled — ${registration.className}`,
      html: buildCancellationEmail({ name: registration.name, className: registration.className }),
    })
  }

  return { success: true }
}


