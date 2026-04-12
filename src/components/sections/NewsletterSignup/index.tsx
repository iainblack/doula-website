'use client'

import { useState, useTransition } from 'react'
import { subscribeNewsletter } from '@/actions/newsletter'
import type { NewsletterSignup as NewsletterSignupType } from '@/types/sanity.generated'

type NewsletterSignupProps = Omit<NewsletterSignupType, '_type'>

export function NewsletterSignup({ heading, body, buttonLabel }: NewsletterSignupProps) {
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        const result = await subscribeNewsletter(formData)
        if ('error' in result) {
          setError(result.error)
        } else {
          setSubmitted(true)
        }
      } catch {
        setError('Something went wrong. Please try again.')
      }
    })
  }

  return (
    <section data-testid="newsletter-signup-section" className="mt-16 md:mt-32 bg-surface-container-low py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-8 text-center">
        {heading && (
          <h2 className="font-heading text-3xl md:text-4xl mb-6">{heading}</h2>
        )}
        {body && (
          <p className="text-muted mb-10">{body}</p>
        )}
        {submitted ? (
          <p className="text-primary font-body font-semibold">Thank you for subscribing!</p>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                name="email"
                required
                placeholder="Your email address"
                className="flex-grow bg-white border-none rounded-lg px-6 py-4 focus:ring-1 focus:ring-primary transition-shadow font-body"
              />
              <button
                type="submit"
                disabled={isPending}
                className="bg-primary text-primary-foreground px-10 py-4 rounded-lg font-semibold hover:opacity-90 transition-all font-body disabled:opacity-60"
              >
                {isPending ? 'Subscribing…' : (buttonLabel ?? 'Subscribe')}
              </button>
            </form>
            {error && (
              <p className="text-sm text-red-600 mt-3">{error}</p>
            )}
          </>
        )}
      </div>
    </section>
  )
}
