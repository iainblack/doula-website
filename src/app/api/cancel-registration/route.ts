import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { writeClient } from '@/lib/sanity/client'
import { Resend } from 'resend'
import { buildCancellationEmail } from '@/lib/email/template'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    redirect('/cancel-registration?error=This+cancellation+link+is+invalid+or+has+expired.')
  }

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

  if (!registration) {
    redirect('/cancel-registration?error=Cancellation+link+not+found.')
  }

  if (registration.status === 'cancelled') {
    redirect('/cancel-registration?error=This+registration+is+already+cancelled.')
  }

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

  redirect('/cancel-registration?success=1')
}

