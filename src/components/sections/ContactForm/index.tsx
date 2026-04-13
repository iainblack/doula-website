'use client'

import { useRef, useState } from 'react'
import { submitContactForm } from '@/actions/contact'
import type { ContactForm as ContactFormType } from '@/types/sanity.generated'

type ContactFormProps = Omit<ContactFormType, '_type'>

export function ContactForm({ heading, buttonLabel, subjectOptions }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [subjectSelected, setSubjectSelected] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!formRef.current) return
    setLoading(true)
    setError(null)
    const formData = new FormData(formRef.current)
    const result = await submitContactForm(formData)
    setLoading(false)
    if ('error' in result) {
      setError(result.error)
    } else {
      setSubmitted(true)
      formRef.current.reset()
    }
  }

  return (
    <section data-testid="contact-form-section" className="bg-surface-container-low py-12 md:py-24">
      <div className="max-w-4xl mx-auto px-8">
        <div className="text-center mb-16">
          {heading && (
            <h2 className="font-heading text-3xl text-foreground mb-4">{heading}</h2>
          )}
          <div className="h-px w-12 bg-outline-variant mx-auto opacity-40" />
        </div>

        {submitted ? (
          <div className="text-center py-16 space-y-4">
            <span
              className="material-symbols-outlined text-5xl text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
            <h3 className="font-heading text-2xl text-foreground">Message received</h3>
            <p className="text-muted font-body">
              Thank you for reaching out. I&apos;ll be in touch with you soon.
            </p>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
          >
            {/* Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="font-body text-xs uppercase tracking-widest text-muted font-medium"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your full name"
                required
                className="w-full bg-transparent border-b border-outline-variant/30 focus:border-primary focus:ring-0 focus:outline-none transition-all py-3 px-0 font-body placeholder:text-muted/60"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="font-body text-xs uppercase tracking-widest text-muted font-medium"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                required
                className="w-full bg-transparent border-b border-outline-variant/30 focus:border-primary focus:ring-0 focus:outline-none transition-all py-3 px-0 font-body placeholder:text-muted/60"
              />
            </div>

            {/* Subject */}
            {subjectOptions && subjectOptions.length > 0 && (
              <div className="md:col-span-2 space-y-2">
                <label
                  htmlFor="subject"
                  className="font-body text-xs uppercase tracking-widest text-muted font-medium"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  onChange={(e) => setSubjectSelected(e.target.value !== '')}
                  className={`w-full bg-transparent border-b border-outline-variant/30 focus:border-primary focus:ring-0 focus:outline-none transition-all py-3 px-0 font-body ${subjectSelected ? 'text-foreground' : 'text-muted/60'}`}
                >
                  <option value="">Select a topic...</option>
                  {subjectOptions.map((opt, i) => (
                    <option key={opt._key ?? i} value={opt.value ?? ''}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Message */}
            <div className="md:col-span-2 space-y-2">
              <label
                htmlFor="message"
                className="font-body text-xs uppercase tracking-widest text-muted font-medium"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell me a bit about your journey..."
                rows={4}
                required
                className="w-full bg-transparent border-b border-outline-variant/30 focus:border-primary focus:ring-0 focus:outline-none transition-all py-3 px-0 font-body placeholder:text-muted/60 resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="md:col-span-2">
                <p className="text-error font-body text-sm text-center">{error}</p>
              </div>
            )}

            {/* Submit */}
            <div className="md:col-span-2 pt-8 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-primary-foreground px-12 py-4 rounded-md font-body font-medium tracking-[0.15em] uppercase text-sm hover:opacity-95 transition-all disabled:opacity-60"
              >
                {loading ? 'Sending…' : (buttonLabel ?? 'Send Message')}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
