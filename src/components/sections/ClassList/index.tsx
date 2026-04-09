import Link from 'next/link'
import type { ClassList as ClassListType } from '@/types/sanity.generated'

type ClassListProps = Omit<ClassListType, '_type'>

export function ClassList({ classes }: ClassListProps) {
  if (!classes?.length) return null

  return (
    <section data-testid="class-list-section" className="max-w-7xl mx-auto px-8">
      <div className="divide-y divide-outline-variant/30">
        {classes.map((item, i) => (
          <div key={item._key ?? i} className="py-12 first:pt-0 last:pb-0 group">
            <div className="flex flex-col md:grid md:grid-cols-12 gap-8 items-start">
              {/* Schedule Info */}
              <div className="md:col-span-3 space-y-2">
                {item.date && (
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
                    <span className="material-symbols-outlined text-lg">calendar_today</span>
                    <span>{item.date}</span>
                  </div>
                )}
                {item.time && (
                  <div className="text-muted text-sm pl-7">{item.time}</div>
                )}
                {item.location && (
                  <div className="flex items-center gap-2 text-muted italic text-sm pt-1">
                    <span className="material-symbols-outlined text-lg">location_on</span>
                    <span>{item.location}</span>
                  </div>
                )}
              </div>

              {/* Title & Description */}
              <div className="md:col-span-6">
                {item.title && (
                  <h2 className="font-heading text-3xl mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h2>
                )}
                {item.description && (
                  <p className="text-muted leading-relaxed text-base">{item.description}</p>
                )}
              </div>

              {/* CTA & Pricing */}
              <div className="md:col-span-3 flex flex-col items-start md:items-end justify-between h-full gap-4">
                {item.price && (
                  <span className="font-heading text-2xl text-foreground">{item.price}</span>
                )}
                {item.ctaLabel && item.ctaUrl ? (
                  <Link
                    href={item.ctaUrl}
                    className="w-full md:w-auto bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-all active:scale-95 text-center font-body"
                  >
                    {item.ctaLabel}
                  </Link>
                ) : item.ctaLabel ? (
                  <button className="w-full md:w-auto bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-all active:scale-95 font-body">
                    {item.ctaLabel}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
