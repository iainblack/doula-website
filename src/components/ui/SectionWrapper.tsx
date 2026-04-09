interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  as?: 'section' | 'div' | 'article'
  testId?: string
}

export function SectionWrapper({
  children,
  className = '',
  as: Tag = 'section',
  testId,
}: SectionWrapperProps) {
  return (
    <Tag className={`py-[--spacing-section-y] ${className}`} data-testid={testId}>
      <div className="max-w-[--max-width-content] mx-auto px-[--spacing-section-x]">
        {children}
      </div>
    </Tag>
  )
}
