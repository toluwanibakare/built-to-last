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
    <svg viewBox="0 0 24 24" className={`h-5 w-5 fill-current ${className}`} aria-hidden="true">
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.002 3.002 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 8.568l5.966 3.43-5.966 3.432V8.568z" />
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

export function WhatsAppIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 fill-current ${className}`} aria-hidden="true">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.497 0 9.923-4.424 9.927-9.922.001-2.663-1.033-5.166-2.915-7.05C16.362 1.748 13.861.714 11.2.713 5.702.713 1.282 5.138 1.278 10.638c-.001 1.558.423 3.084 1.227 4.437l-.997 3.637 3.73-.978l.419.248zM17.15 13.9c-.3-.15-1.785-.88-2.062-.98-.28-.1-.48-.15-.68.15-.2.3-.77.98-.95 1.18-.18.2-.35.23-.65.08-3.04-1.5-3.8-2.5-4.4-3.5-.15-.3-.02-.45.13-.6l.45-.45c.15-.15.2-.25.3-.45.1-.2.05-.38-.03-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.48-.5-.68-.5-.2 0-.42-.03-.65-.03-.23 0-.6.08-.9.43-.3.35-1.15 1.13-1.15 2.75 0 1.63 1.18 3.2 1.35 3.43.18.23 2.33 3.56 5.65 5 .79.34 1.4.55 1.88.7.8.25 1.53.22 2.1.13.64-.1 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.07-.15-.28-.23-.58-.38z"/>
    </svg>
  )
}
