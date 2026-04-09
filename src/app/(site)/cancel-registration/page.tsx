import Link from 'next/link'
import { cancelRegistration } from '@/actions/classRegistration'

type Props = {
  searchParams: Promise<{ token?: string }>
}

export default async function CancelRegistrationPage({ searchParams }: Props) {
  const { token } = await searchParams

  if (!token) {
    return <CancelPage success={false} message="This cancellation link is invalid or has expired." />
  }

  const result = await cancelRegistration(token)

  if ('error' in result) {
    return <CancelPage success={false} message={result.error} />
  }

  return (
    <CancelPage
      success
      message="Your reservation has been cancelled. We hope to see you at a future class."
    />
  )
}

function CancelPage({ success, message }: { success: boolean; message: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md mx-auto px-6 py-16">
        <span
          className={`material-symbols-outlined text-5xl mb-4 block ${success ? 'text-primary' : 'text-muted'}`}
        >
          {success ? 'check_circle' : 'error'}
        </span>
        <h1 className="font-heading text-3xl text-foreground mb-4">
          {success ? 'Reservation Cancelled' : 'Something went wrong'}
        </h1>
        <p className="text-muted font-body mb-8">{message}</p>
        <Link
          href="/classes"
          className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-all font-body"
        >
          View Classes
        </Link>
      </div>
    </div>
  )
}
