'use client'

import Link from 'next/link'
import type { FeatureGrid as FeatureGridType } from '@/types/sanity.generated'

export function FeatureGrid({ overline, heading, features }: FeatureGridType) {
  return (
    <section data-testid="feature-grid-section" className="py-12 md:py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          {overline && (
            <span className="font-body text-xs tracking-[--tracking-extra-wide] uppercase text-primary font-medium mb-4 block">
              {overline}
            </span>
          )}
          <h2 className="font-heading text-3xl md:text-4xl text-foreground">
            {heading}
          </h2>
        </div>

        {features && features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group bg-surface-container-lowest p-6 md:p-10 rounded-xl transition-all duration-500 hover:shadow-md"
              >
                {feature.icon && (
                  <span
                    className="material-symbols-outlined text-primary text-4xl mb-6 block"
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </span>
                )}
                <h3 className="font-heading text-2xl text-foreground mb-4">
                  {feature.title}
                </h3>
                {feature.description && (
                  <p className="font-body text-muted mb-8 leading-relaxed">
                    {feature.description}
                  </p>
                )}
                {feature.linkLabel && feature.linkUrl && (
                  <Link
                    href={feature.linkUrl}
                    className="font-body text-sm font-semibold text-primary flex items-center gap-2 group-hover:gap-4 transition-all"
                  >
                    {feature.linkLabel}
                    <span className="material-symbols-outlined text-sm" aria-hidden="true">
                      arrow_forward
                    </span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
