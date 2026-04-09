import type { Philosophy as PhilosophyType } from '@/types/sanity.generated'

export function Philosophy({ heading, body, pullQuote }: PhilosophyType) {
  const paragraphs = body.split(/\n\n+/).filter(Boolean)

  return (
    <section data-testid="philosophy-section" className="bg-surface-container-low py-12 md:py-24">
      <div className="max-w-4xl mx-auto px-8">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-heading text-primary mb-12">{heading}</h2>
          <div className="space-y-8 text-muted leading-relaxed text-base md:text-xl font-body">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {pullQuote && (
              <div className="pt-12 flex flex-col items-center md:items-start gap-4 border-l-2 border-primary-container pl-8 italic text-foreground font-heading text-2xl">
                &ldquo;{pullQuote}&rdquo;
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
