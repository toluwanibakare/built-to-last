const base = 'h-5 w-5 fill-none stroke-current'

export function FacebookIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={1.5} aria-hidden="true">
      <path d="M14 8h2.5V5H14a4 4 0 0 0-4 4v2.5H7.5V14H10v6h3v-6h2.5l.5-2.5H13V9a1 1 0 0 1 1-1Z" />
    </svg>
  )
}

export function InstagramIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={1.5} aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="16.8" cy="7.2" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function YouTubeIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} strokeWidth={1.5} aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="M10.5 9.8v4.4l4-2.2-4-2.2Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ArrowRightIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 fill-none stroke-current ${className}`} strokeWidth={1.8} aria-hidden="true">
      <path d="M4 12h16m0 0-6-6m6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function MailIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 fill-none stroke-current ${className}`} strokeWidth={1.5} aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m4.5 7.5 7.5 6 7.5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CheckIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 fill-none stroke-current ${className}`} strokeWidth={2} aria-hidden="true">
      <path d="m4.5 12.5 5 5 10-11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
