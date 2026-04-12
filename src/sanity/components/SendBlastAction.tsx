'use client'

import { useState } from 'react'
import type { DocumentActionComponent } from 'sanity'

export const SendBlastAction: DocumentActionComponent = ({ id, published }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const isSent = (published as Record<string, unknown>)?.status === 'sent'

  return {
    label: isSent ? 'Already Sent' : isLoading ? 'Sending…' : 'Send Blast',
    disabled: isSent || isLoading,
    tone: 'primary',
    onHandle: async () => {
      if (
        !window.confirm(
          'Send this email blast to all active subscribers? This cannot be undone.'
        )
      ) {
        return
      }

      setIsLoading(true)
      setMessage(null)
      try {
        const res = await fetch('/api/send-blast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        })
        const data = await res.json()
        if (!res.ok) {
          window.alert(`Error: ${data.error}`)
        } else {
          window.alert('Blast sent successfully!')
        }
      } catch {
        window.alert('Network error. Please try again.')
      } finally {
        setIsLoading(false)
        setMessage(null)
      }
    },
  }
}
