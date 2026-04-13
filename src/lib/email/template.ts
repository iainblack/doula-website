/**
 * Branded email template
 *
 * CSS variables cannot be used in email clients, so theme values are
 * hardcoded here as constants that mirror globals.css @theme exactly.
 * Update both places together when the theme changes.
 */

const t = {
  // Colours
  primary: '#6d5b45',
  primaryHover: '#54442e',
  primaryForeground: '#ffffff',
  primaryContainer: '#c8b196',
  surface: '#fbf9f4',
  surfaceContainerLow: '#f5f3ee',
  surfaceContainerHighest: '#e4e2dd',
  emailBg: '#f0ede8',
  foreground: '#1b1c19',
  muted: '#4d453d',
  outline: '#7f766c',
  border: '#d0c5b9',
  // Typography
  fontHeading: "Georgia, 'Times New Roman', serif",
  fontBody: "'Helvetica Neue', Helvetica, Arial, sans-serif",
}

/**
 * Wraps arbitrary HTML content in the branded email shell.
 *
 * @param title    Large heading shown in the coloured header bar
 * @param subtitle Small all-caps label shown above the title (optional)
 * @param bodyHtml HTML for the main content area (no outer wrapper needed)
 * @param footerHtml HTML for the footer area (replaces default footer when provided)
 * @param siteUrl  Used in the default footer link
 * @param siteName Used in the default footer text
 */
export function wrapEmail({
  title,
  subtitle,
  bodyHtml,
  footerHtml,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  siteName = 'Gentle Roots Doula Services',
}: {
  title: string
  subtitle?: string
  bodyHtml: string
  footerHtml?: string
  siteUrl?: string
  siteName?: string
}): string {
  const resolvedFooter =
    footerHtml ??
    `<p style="margin:0;font-size:12px;color:${t.outline};line-height:1.6">
       You received this email from <a href="${siteUrl}" style="color:${t.outline}">${siteName}</a>.
     </p>`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:${t.emailBg};font-family:${t.fontBody}">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${t.emailBg};padding:40px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:${t.surface};border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08)">

        <!-- Header -->
        <tr>
          <td style="background:${t.primary};padding:36px 40px;text-align:center">
            ${subtitle ? `<p style="margin:0;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:${t.primaryContainer};font-weight:500">${subtitle}</p>` : ''}
            <h1 style="margin:${subtitle ? '10px' : '0'} 0 0;font-size:28px;font-weight:400;color:${t.primaryForeground};font-family:${t.fontHeading};line-height:1.3">${title}</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px 32px">
            ${bodyHtml}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:${t.surfaceContainerLow};padding:24px 40px;border-top:1px solid ${t.surfaceContainerHighest}">
            ${resolvedFooter}
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

/** Renders a labelled detail row for use inside a detail card table. */
function detailRow(icon: string, label: string, value: string, link?: string | null, mapLink?: boolean): string {
  const valueHtml = link
    ? `<a href="${link}" style="color:${t.primary};text-decoration:underline">${value}</a>${
        mapLink
          ? `&nbsp;<a href="${link}" style="font-size:12px;color:${t.outline};text-decoration:none" target="_blank">(Open in Maps ↗)</a>`
          : ''
      }`
    : value

  return `<tr>
    <td style="padding:10px 16px;font-size:13px;color:${t.outline};white-space:nowrap;vertical-align:top">
      ${icon}&nbsp; ${label}
    </td>
    <td style="padding:10px 16px 10px 0;font-size:14px;color:${t.foreground};vertical-align:top">
      ${valueHtml}
    </td>
  </tr>`
}

/** Renders a bordered detail card containing the provided rows HTML. */
function detailCard(rowsHtml: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:${t.surfaceContainerLow};border-radius:8px;border:1px solid ${t.border}">
    ${rowsHtml}
  </table>`
}

// ─── Contact notification ──────────────────────────────────────────────────

export function buildContactNotificationEmail(data: {
  name: string
  email: string
  subject?: string
  message: string
}): string {
  const { name, email, subject, message } = data

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:16px;color:${t.foreground};line-height:1.6">
      You have a new contact form submission${subject ? ` regarding <strong>${subject}</strong>` : ''}.
    </p>
    ${detailCard(
      detailRow('👤', 'Name', name) +
      detailRow('✉️', 'Email', email, `mailto:${email}`)
    )}
    <p style="margin:24px 0 8px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:${t.outline};font-weight:600">Message</p>
    <p style="margin:0;font-size:15px;color:${t.muted};line-height:1.7;white-space:pre-wrap">${message}</p>
  `

  return wrapEmail({
    title: subject ?? 'New Contact Message',
    subtitle: 'Contact Form',
    bodyHtml,
    footerHtml: `<p style="margin:0;font-size:12px;color:${t.outline};line-height:1.6">
      Reply directly to this email to respond to ${name}.
    </p>`,
  })
}

// ─── Class registration confirmation ──────────────────────────────────────

export function buildConfirmationEmail(data: {
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

  const rows = [
    classDate && detailRow('📅', 'Date', classDate),
    classTime && detailRow('🕐', 'Time', classTime),
    classLocation && detailRow('📍', 'Location', classLocation, mapsUrl, true),
  ]
    .filter(Boolean)
    .join('')

  const bodyHtml = `
    <p style="margin:0 0 12px;font-size:16px;color:${t.foreground};line-height:1.6">Hi ${name},</p>
    <p style="margin:0 0 24px;font-size:16px;color:${t.muted};line-height:1.7">
      Your spot is confirmed &mdash; we&rsquo;re so glad you&rsquo;re joining us. Below are the details for your class.
    </p>
    ${rows ? detailCard(rows) : ''}
    <hr style="border:none;border-top:1px solid ${t.surfaceContainerHighest};margin:28px 0">
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:${t.outline};font-weight:600">What to expect</p>
    <p style="margin:0;font-size:14px;color:${t.muted};line-height:1.7">
      Please arrive a few minutes early. If you have any questions before the class, don&rsquo;t hesitate to reach out &mdash; we&rsquo;re here to help.
    </p>
  `

  return wrapEmail({
    title: className,
    subtitle: "You're confirmed",
    bodyHtml,
    footerHtml: `<p style="margin:0;font-size:12px;color:${t.outline};line-height:1.6">
      Need to cancel your reservation?
      <a href="${cancelUrl}" style="color:${t.primary};text-decoration:underline">Click here to cancel</a>.
      Your spot will be released immediately.
    </p>`,
  })
}

// ─── Class registration cancellation ──────────────────────────────────────

export function buildCancellationEmail(data: { name: string; className: string }): string {
  const { name, className } = data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const classesUrl = `${siteUrl}/classes`

  return wrapEmail({
    title: className,
    subtitle: 'Reservation cancelled',
    bodyHtml: `
      <p style="margin:0 0 12px;font-size:16px;color:${t.foreground};line-height:1.6">Hi ${name},</p>
      <p style="margin:0 0 16px;font-size:16px;color:${t.muted};line-height:1.7">
        Your reservation has been successfully cancelled and your spot has been released.
      </p>
      <p style="margin:0;font-size:16px;color:${t.muted};line-height:1.7">
        We hope to see you at a future class &mdash; keep an eye on our schedule for upcoming sessions.
      </p>
    `,
    footerHtml: `<p style="margin:0;font-size:12px;color:${t.outline};line-height:1.6">
      Changed your mind?
      <a href="${classesUrl}" style="color:${t.primary};text-decoration:underline">View our classes page</a>
      to sign up again anytime.
    </p>`,
  })
}

// ─── Email blast ───────────────────────────────────────────────────────────

export function buildBlastEmail(data: {
  body: string
  previewText?: string
  siteUrl: string
  siteName?: string
}): string {
  const { body, previewText, siteUrl, siteName = 'Gentle Roots Doula Services' } = data

  const bodyParagraphs = body
    .split('\n\n')
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-size:16px;color:${t.muted};line-height:1.7">${p.replace(/\n/g, '<br>')}</p>`
    )
    .join('')

  // Resend preview text hack — hidden preheader
  const preheader = previewText
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${previewText}</div>`
    : ''

  return wrapEmail({
    title: siteName,
    bodyHtml: preheader + bodyParagraphs,
    siteUrl,
    siteName,
    footerHtml: `<p style="margin:0;font-size:12px;color:${t.outline};line-height:1.6">
      You received this because you subscribed at <a href="${siteUrl}" style="color:${t.outline}">${siteUrl}</a>.
    </p>
    <p style="margin:8px 0 0;font-size:12px">
      <a href="${siteUrl}/api/unsubscribe?email={{email}}" style="color:${t.outline}">Unsubscribe</a>
    </p>`,
  })
}
