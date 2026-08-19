import { useEffect, useState } from 'react'

export default function IntroCurtain() {
  const [stage, setStage] = useState('init')

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenIntro')
    
    if (!hasSeen) {
      document.body.style.overflow = 'hidden'
      window.scrollTo(0, 0)
      
      const openTimer = setTimeout(() => {
        setStage('opening')
      }, 1000)

      const doneTimer = setTimeout(() => {
        setStage('done')
        localStorage.setItem('hasSeenIntro', 'true')
        document.body.style.overflow = ''
      }, 2200)
      
      return () => {
        clearTimeout(openTimer)
        clearTimeout(doneTimer)
      }
    } else {
      setStage('done')
    }
  }, [])

  if (stage === 'done') return null

  return (
    <div className="fixed inset-0 z-[100000] pointer-events-none flex" aria-hidden="true">
      <div 
        className={`w-1/2 h-full bg-ink flex flex-col items-end justify-center pr-3 transition-transform duration-[1200ms] ease-[cubic-bezier(0.85,0,0.15,1)] ${stage === 'opening' ? '-translate-x-full' : 'translate-x-0'}`}
      >
        <div className={`transition-opacity duration-700 flex items-center gap-4 ${stage === 'opening' ? 'opacity-0' : 'opacity-100'}`}>
          <img
            src="/femi_logo.png"
            alt=""
            className="h-10 w-auto opacity-80"
          />
          <span className="font-display text-4xl md:text-6xl text-brass">Built</span>
        </div>
      </div>
      <div 
        className={`w-1/2 h-full bg-ink flex flex-col items-start justify-center pl-3 transition-transform duration-[1200ms] ease-[cubic-bezier(0.85,0,0.15,1)] ${stage === 'opening' ? 'translate-x-full' : 'translate-x-0'}`}
      >
        <div className={`transition-opacity duration-700 flex items-center ${stage === 'opening' ? 'opacity-0' : 'opacity-100'}`}>
          <span className="font-display text-4xl md:text-6xl text-paper">to Last</span>
        </div>
      </div>
    </div>
  )
}
