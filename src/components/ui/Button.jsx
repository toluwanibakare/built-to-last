export function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  href,
  className = '',
  ...rest
}) {
  const base =
    'group inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-3 disabled:cursor-not-allowed disabled:opacity-60'

  const variants = {
    primary:
      'bg-ink text-paper hover:bg-brass-deep hover:shadow-lg active:scale-[0.98]',
    outline:
      'border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper active:scale-[0.98]',
    light:
      'bg-paper text-ink hover:bg-white active:scale-[0.98]',
  }

  const classes = `${base} ${variants[variant]} ${className}`

  const content = loading ? (
    <span className="inline-flex items-center gap-2.5">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
      {children}
    </span>
  ) : (
    children
  )

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }

  return (
    <button type={type} disabled={disabled || loading} onClick={onClick} className={classes} {...rest}>
      {content}
    </button>
  )
}
