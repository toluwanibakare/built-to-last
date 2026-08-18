import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
      setVisible(scrolled > 80)
    }
    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-[9999] flex h-11 w-11 items-center justify-center rounded-full border border-line bg-brass text-paper shadow-soft backdrop-blur transition-all duration-500 hover:bg-brass-deep active:scale-95 focus:outline-none translate-y-0 opacity-100 pointer-events-auto"
      aria-label="Scroll to top"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth={2.5}>
        <path d="m4.5 15.75 7.5-7.5 7.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
