'use client'

import { useState } from 'react'
import type { NewsletterSignup as NewsletterSignupType } from '@/types/sanity.generated'

type NewsletterSignupProps = Omit<NewsletterSignupType, '_type'>

export function NewsletterSignup({ heading, body, buttonLabel }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email) setSubmitted(true)
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
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-grow bg-white border-none rounded-lg px-6 py-4 focus:ring-1 focus:ring-primary transition-shadow font-body"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-10 py-4 rounded-lg font-semibold hover:opacity-90 transition-all font-body"
            >
              {buttonLabel ?? 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
