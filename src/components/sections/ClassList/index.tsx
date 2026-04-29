import Link from 'next/link'
import { ClassActions } from './ClassActions'

type ClassEntry = {
  _id: string
  title?: string | null
  date?: string | null
  time?: string | null
  location?: string | null
  description?: string | null
  price?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
  attendeeLimit?: number | null
}

type ClassListItem = {
  _key: string
  class?: ClassEntry | null
}

type ClassListProps = {
  classes?: ClassListItem[] | null
  registrationCounts?: Record<string, number>
}

export function ClassList({ classes, registrationCounts = {} }: ClassListProps) {
  if (!classes?.length) return null

  return (
    <section data-testid="class-list-section" className="max-w-7xl mx-auto px-8">
      <div className="divide-y divide-outline-variant/30">
        {classes.map((item, i) => {
          const c = item.class
          if (!c) return null

          const key = item._key ?? String(i)
          const classKey = c._id
          const limit = c.attendeeLimit ?? null
          const count = registrationCounts[classKey] ?? 0
          const spotsLeft = limit !== null ? limit - count : null
          const isFull = spotsLeft !== null && spotsLeft <= 0
          const hasSignup = limit !== null

          return (
            <div key={key} data-class-key={classKey} className="py-12 first:pt-0 last:pb-0 group">
              <div className="flex flex-col md:grid md:grid-cols-12 gap-8 items-start">
                {/* Schedule Info */}
                <div className="md:col-span-3 space-y-2">
                  {c.date && (
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-wider">
                      <span className="material-symbols-outlined text-lg">calendar_today</span>
                      <span>{c.date}</span>
                    </div>
                  )}
                  {c.time && (
                    <div className="text-muted text-sm pl-7">{c.time}</div>
                  )}
                  {c.location && (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(c.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted italic text-sm pt-1 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">location_on</span>
                      <span>{c.location}</span>
                    </a>
                  )}
                </div>

                {/* Title & Description */}
                <div className="md:col-span-6">
                  {c.title && (
                    <h2 className="font-heading text-3xl mb-3 group-hover:text-primary transition-colors">
                      {c.title}
                    </h2>
                  )}
                  {c.description && (
                    <p className="text-muted leading-relaxed text-base">{c.description}</p>
                  )}
                </div>

                {/* CTA & Pricing */}
                <div className="md:col-span-3 flex flex-col items-start md:items-end justify-between h-full gap-4">
                  {c.price && (
                    <span className="font-heading text-2xl text-foreground">{c.price}</span>
                  )}

                  {hasSignup && (
                    <span
                      className={`text-sm font-body ${isFull ? 'text-red-500' : 'text-muted'}`}
                    >
                      {isFull
                        ? 'No spots remaining'
                        : `${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} remaining`}
                    </span>
                  )}

                  {hasSignup ? (
                    <ClassActions
                      classKey={classKey}
                      className={c.title ?? ''}
                      classDate={c.date ?? ''}
                      classTime={c.time ?? ''}
                      classLocation={c.location ?? ''}
                      attendeeLimit={limit!}
                      isFull={isFull}
                    />
                  ) : c.ctaLabel && c.ctaUrl ? (
                    <Link
                      href={c.ctaUrl}
                      className="w-full md:w-auto bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-all active:scale-95 text-center font-body"
                    >
                      {c.ctaLabel}
                    </Link>
                  ) : c.ctaLabel ? (
                    <button className="w-full md:w-auto bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-all active:scale-95 font-body">
                      {c.ctaLabel}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
