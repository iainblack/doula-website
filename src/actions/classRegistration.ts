'use server'

import { z } from 'zod'
import { writeClient } from '@/lib/sanity/client'
import { Resend } from 'resend'

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
  const cancelUrl = `${siteUrl}/cancel-registration?token=${cancelToken}`

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

function buildConfirmationEmail(data: {
  name: string
  className: string
  classDate: string
  classTime: string
  classLocation: string
  cancelUrl: string
}): string {
  const { name, className, classDate, classTime, classLocation, cancelUrl } = data
  const mapsUrl = classLocation
    ? `https://maps.google.com/?q=${encodeURIComponent(classLocation)}`
    : null

  const detailRows = [
    classDate && { icon: '📅', label: 'Date', value: classDate, link: null },
    classTime && { icon: '🕐', label: 'Time', value: classTime, link: null },
    classLocation && { icon: '📍', label: 'Location', value: classLocation, link: mapsUrl },
  ].filter(Boolean) as { icon: string; label: string; value: string; link: string | null }[]

  const detailRowsHtml = detailRows
    .map(
      (row) => `
      <tr>
        <td style="padding:10px 16px;font-size:13px;color:#7f766c;white-space:nowrap;vertical-align:top">
          ${row.icon}&nbsp; ${row.label}
        </td>
        <td style="padding:10px 16px 10px 0;font-size:14px;color:#1b1c19;vertical-align:top">
          ${
            row.link
              ? `<a href="${row.link}" style="color:#6d5b45;text-decoration:underline">${row.value}</a>
                 &nbsp;<a href="${row.link}" style="font-size:12px;color:#7f766c;text-decoration:none" target="_blank">(Open in Maps ↗)</a>`
              : row.value
          }
        </td>
      </tr>`
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0ede8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ede8;padding:40px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#fbf9f4;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08)">

        <!-- Header -->
        <tr>
          <td style="background:#6d5b45;padding:36px 40px;text-align:center">
            <p style="margin:0;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#c8b196;font-weight:500">You&rsquo;re confirmed</p>
            <h1 style="margin:10px 0 0;font-size:28px;font-weight:400;color:#ffffff;font-family:Georgia,'Times New Roman',serif;line-height:1.3">${className}</h1>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:36px 40px 0">
            <p style="margin:0;font-size:16px;color:#1b1c19;line-height:1.6">
              Hi ${name},
            </p>
            <p style="margin:12px 0 0;font-size:16px;color:#4d453d;line-height:1.7">
              Your spot is confirmed — we&rsquo;re so glad you&rsquo;re joining us. Below are the details for your class.
            </p>
          </td>
        </tr>

        <!-- Class details card -->
        ${
          detailRows.length > 0
            ? `<tr>
          <td style="padding:24px 40px">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ee;border-radius:8px;border:1px solid #d0c5b9">
              ${detailRowsHtml}
            </table>
          </td>
        </tr>`
            : ''
        }

        <!-- Divider -->
        <tr>
          <td style="padding:0 40px">
            <hr style="border:none;border-top:1px solid #e4e2dd;margin:0">
          </td>
        </tr>

        <!-- What to expect -->
        <tr>
          <td style="padding:28px 40px">
            <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#7f766c;font-weight:600">What to expect</p>
            <p style="margin:0;font-size:14px;color:#4d453d;line-height:1.7">
              Please arrive a few minutes early. If you have any questions before the class, don&rsquo;t hesitate to reach out — we&rsquo;re here to help.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f5f3ee;padding:24px 40px;border-top:1px solid #e4e2dd">
            <p style="margin:0;font-size:12px;color:#7f766c;line-height:1.6">
              Need to cancel your reservation?
              <a href="${cancelUrl}" style="color:#6d5b45;text-decoration:underline">Click here to cancel</a>.
              Your spot will be released immediately.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildCancellationEmail(data: { name: string; className: string }): string {
  const { name, className } = data
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0ede8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ede8;padding:40px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#fbf9f4;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08)">

        <!-- Header -->
        <tr>
          <td style="background:#645d55;padding:36px 40px;text-align:center">
            <p style="margin:0;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#c8b196;font-weight:500">Reservation cancelled</p>
            <h1 style="margin:10px 0 0;font-size:28px;font-weight:400;color:#ffffff;font-family:Georgia,'Times New Roman',serif;line-height:1.3">${className}</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px">
            <p style="margin:0;font-size:16px;color:#1b1c19;line-height:1.6">Hi ${name},</p>
            <p style="margin:12px 0 0;font-size:16px;color:#4d453d;line-height:1.7">
              Your reservation has been successfully cancelled and your spot has been released.
            </p>
            <p style="margin:16px 0 0;font-size:16px;color:#4d453d;line-height:1.7">
              We hope to see you at a future class — keep an eye on our schedule for upcoming sessions.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f5f3ee;padding:24px 40px;border-top:1px solid #e4e2dd">
            <p style="margin:0;font-size:12px;color:#7f766c;line-height:1.6">
              Changed your mind? Visit our classes page to sign up again anytime.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
