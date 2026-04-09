'use client'

import { useState } from 'react'
import type { Faq as FaqType } from '@/types/sanity.generated'

type FaqItem = NonNullable<FaqType['faqs']>[number]

export function Faq({ heading, faqs }: FaqType) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!faqs || faqs.length === 0) return null

  return (
    <section data-testid="faq-section" className="max-w-4xl mx-auto px-8 mt-16 pb-16 md:mt-32 md:pb-32">
      {heading && (
        <h2 className="text-3xl font-heading text-foreground text-center mb-12">{heading}</h2>
      )}
      <div className="space-y-4">
        {faqs.map((item, index) => {
          const isOpen = openIndex === index
          return (
            <div key={item._key ?? index} className="border-b border-outline-variant/20 pb-6">
              <button
                className="w-full flex justify-between items-center text-left py-4 focus:outline-none cursor-pointer"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span className="text-xl font-heading text-primary">{item.question}</span>
                <span className="material-symbols-outlined text-primary transition-transform duration-200" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                  add
                </span>
              </button>
              {isOpen && (
                <div className="bg-surface-container-low p-6 rounded-lg mt-2">
                  <p className="text-muted leading-relaxed font-body">{item.answer}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
