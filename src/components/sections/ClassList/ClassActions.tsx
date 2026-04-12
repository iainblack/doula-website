'use client'

import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { registerForClass, cancelRegistration } from '@/actions/classRegistration'

// localStorage schema: { [classKey]: cancelToken }
// Key present with a string value → user is registered
// Key absent → user is not registered
const STORAGE_KEY = 'doula_class_registrations'

function readToken(classKey: string): string | null {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    return stored[classKey] ?? null
  } catch {
    return null
  }
}

function saveToken(classKey: string, token: string) {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    stored[classKey] = token
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch {}
}

function clearToken(classKey: string) {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    delete stored[classKey]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch {}
}

type Props = {
  classKey: string
  className: string
  classDate: string
  classTime: string
  classLocation: string
  attendeeLimit: number
  isFull: boolean
}

type View = 'signup-form' | 'signup-success' | 'cancel-confirm' | 'cancelled' | 'already-registered'

export function ClassActions({
  classKey,
  className,
  classDate,
  classTime,
  classLocation,
  attendeeLimit,
  isFull,
}: Props) {
  // null = loading (reading localStorage), true/false = resolved
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null)
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<View>('signup-form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const router = useRouter()

  // Read localStorage once on mount (client-only)
  useEffect(() => {
    setIsRegistered(readToken(classKey) !== null)
  }, [classKey])

  useEffect(() => {
    if (open) {
      dialogRef.current?.setAttribute('open', '')
    } else {
      dialogRef.current?.removeAttribute('open')
    }
  }, [open])

  function openSignup() {
    setView('signup-form')
    setError(null)
    setOpen(true)
  }

  function openCancel() {
    setView('cancel-confirm')
    setError(null)
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    setError(null)
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set('classKey', classKey)
    formData.set('className', className)
    formData.set('classDate', classDate)
    formData.set('classTime', classTime)
    formData.set('classLocation', classLocation)
    formData.set('attendeeLimit', String(attendeeLimit))

    const result = await registerForClass(formData)
    setLoading(false)

    if ('error' in result) {
      // If this email is already registered (e.g. localStorage was cleared),
      // surface a helpful state rather than a confusing dead-end error.
      if (result.error === 'This email is already registered for this class.') {
        setView('already-registered')
      } else {
        setError(result.error)
      }
    } else {
      saveToken(classKey, result.cancelToken)
      setIsRegistered(true)
      setView('signup-success')
      router.refresh()
    }
  }

  async function handleCancel() {
    const token = readToken(classKey)
    if (!token) return

    setLoading(true)
    setError(null)

    const result = await cancelRegistration(token)
    setLoading(false)

    if ('error' in result) {
      // If the registration was already cancelled (e.g. via the email link),
      // treat it as success and clean up stale localStorage state.
      if (result.error === 'This registration is already cancelled.') {
        clearToken(classKey)
        setIsRegistered(false)
        setView('cancelled')
        router.refresh()
      } else {
        setError(result.error)
      }
    } else {
      clearToken(classKey)
      setIsRegistered(false)
      setView('cancelled')
      router.refresh()
    }
  }

  // Still reading localStorage — render nothing to avoid flicker
  if (isRegistered === null) return null

  return (
    <>
      {isRegistered ? (
        <button
          onClick={openCancel}
          className="text-sm text-muted hover:text-foreground underline font-body transition-colors"
        >
          Cancel reservation
        </button>
      ) : (
        <button
          onClick={openSignup}
          disabled={isFull}
          className="w-full md:w-auto bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-all active:scale-95 font-body disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFull ? 'Class Full' : 'Sign Up'}
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      <dialog
        ref={dialogRef}
        onClose={handleClose}
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md pointer-events-none backdrop:bg-transparent"
      >
        <div className="pointer-events-auto rounded-xl bg-background p-8 shadow-xl border border-outline-variant/20">
        {view === 'signup-form' && (
          <>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-heading text-2xl">{className}</h2>
                {(classDate || classTime) && (
                  <p className="text-muted text-sm mt-1">
                    {[classDate, classTime].filter(Boolean).join(' · ')}
                  </p>
                )}
                {classLocation && (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(classLocation)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted text-sm mt-0.5 inline-flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">location_on</span>
                    {classLocation}
                  </a>
                )}
              </div>
              <button
                onClick={handleClose}
                className="text-muted hover:text-foreground transition-colors ml-4 mt-0.5"
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="signup-name" className="block text-sm font-body font-medium mb-1.5">
                  Name
                </label>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="w-full border border-outline-variant rounded-lg px-4 py-2.5 bg-background text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label htmlFor="signup-email" className="block text-sm font-body font-medium mb-1.5">
                  Email
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full border border-outline-variant rounded-lg px-4 py-2.5 bg-background text-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              {error && <p className="text-red-600 text-sm font-body">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-all active:scale-95 font-body disabled:opacity-60"
              >
                {loading ? 'Reserving…' : 'Reserve My Spot'}
              </button>
            </form>
          </>
        )}

        {view === 'signup-success' && (
          <div className="text-center py-4">
            <span className="material-symbols-outlined text-5xl text-primary mb-4 block">
              check_circle
            </span>
            <h2 className="font-heading text-2xl mb-2">You&apos;re registered!</h2>
            <p className="text-muted font-body mb-6">
              A confirmation email is on its way with class details and a cancellation link.
            </p>
            <button
              onClick={handleClose}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:opacity-90 transition-all font-body"
            >
              Done
            </button>
          </div>
        )}

        {view === 'cancel-confirm' && (
          <div className="text-center py-4">
            <span className="material-symbols-outlined text-4xl text-muted mb-4 block">help</span>
            <h2 className="font-heading text-2xl mb-2">Cancel your spot?</h2>
            <p className="text-muted font-body mb-6">
              This will release your spot in <strong>{className}</strong>. This cannot be undone.
            </p>
            {error && <p className="text-red-600 text-sm font-body mb-4">{error}</p>}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-lg border border-outline-variant font-body hover:bg-surface-container transition-colors"
              >
                Keep my spot
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-2.5 rounded-lg bg-red-600 text-white font-body hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {loading ? 'Cancelling…' : 'Yes, cancel'}
              </button>
            </div>
          </div>
        )}

        {view === 'cancelled' && (
          <div className="text-center py-4">
            <span className="material-symbols-outlined text-5xl text-muted mb-4 block">cancel</span>
            <h2 className="font-heading text-2xl mb-2">Reservation cancelled</h2>
            <p className="text-muted font-body mb-6">
              Your spot has been released. We hope to see you at a future class.
            </p>
            <button
              onClick={handleClose}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:opacity-90 transition-all font-body"
            >
              Close
            </button>
          </div>
        )}

        {view === 'already-registered' && (
          <div className="text-center py-4">
            <span className="material-symbols-outlined text-5xl text-primary mb-4 block">
              info
            </span>
            <h2 className="font-heading text-2xl mb-2">You&apos;re already registered</h2>
            <p className="text-muted font-body mb-6">
              This email already has a spot in this class. Check your confirmation email for a
              cancellation link if you need to cancel.
            </p>
            <button
              onClick={handleClose}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:opacity-90 transition-all font-body"
            >
              Got it
            </button>
          </div>
        )}
        </div>
      </dialog>
    </>
  )
}
