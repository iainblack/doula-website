import Link from 'next/link'

type ButtonStyle = 'primary' | 'secondary' | 'outline' | 'ghost'

interface ButtonProps {
  href?: string
  style?: ButtonStyle
  newTab?: boolean
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
}

const styleClasses: Record<ButtonStyle, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  secondary: 'bg-secondary text-secondary-foreground hover:opacity-90',
  outline: 'border border-border text-foreground hover:bg-surface',
  ghost: 'text-foreground hover:bg-surface',
}

export function Button({
  href,
  style = 'primary',
  newTab = false,
  children,
  className = '',
  type = 'button',
  onClick,
  disabled = false,
}: ButtonProps) {
  const baseClasses = `inline-flex items-center justify-center px-6 py-3 rounded-md font-medium text-sm transition-colors disabled:opacity-50 disabled:pointer-events-none ${styleClasses[style]} ${className}`

  if (href) {
    return (
      <Link
        href={href}
        className={baseClasses}
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={baseClasses}>
      {children}
    </button>
  )
}
