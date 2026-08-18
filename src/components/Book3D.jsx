import { Suspense, lazy, useRef, useState, useCallback, Component } from 'react'
import frontCoverUrl from '../assets/book/front_cover.jpeg'

const BookScene = lazy(() =>
  import('./BookScene.jsx').then((m) => ({ default: m.BookScene })),
)

function LoadingState() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4" role="status" aria-label="Loading 3D book">
      <div className="skeleton h-[58%] w-[42%] max-w-[220px] rounded-sm" />
      <p className="text-sm text-mist">Preparing the book</p>
    </div>
  )
}

function StaticFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center" role="img" aria-label="Built to Last book cover">
      <img
        src={frontCoverUrl}
        alt="Front cover of Built to Last by Femi Bakare"
        className="max-h-[70%] max-w-[46%] rounded-sm shadow-book"
      />
    </div>
  )
}

class SceneBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.error('3D scene failed', error)
    this.props.onError?.()
  }

  render() {
    if (this.state.failed) return <StaticFallback />
    return this.props.children
  }
}

export default function Book3D() {
  const bookRef = useRef(null)
  const [view, setView] = useState('front')
  const [failed, setFailed] = useState(false)
  const [hintVisible, setHintVisible] = useState(true)

  const selectView = useCallback((name) => {
    setView(name)
    bookRef.current?.setView(name)
  }, [])

  const hideHint = useCallback(() => setHintVisible(false), [])
  const fail = useCallback(() => setFailed(true), [])

  if (failed) {
    return (
      <div className="h-full w-full">
        <StaticFallback />
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <Suspense fallback={<LoadingState />}>
        <SceneBoundary onError={fail}>
          <BookScene ref={bookRef} onError={fail} onFirstInteract={hideHint} />
        </SceneBoundary>
      </Suspense>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center transition-opacity duration-700"
        style={{ opacity: hintVisible ? 1 : 0 }}
        aria-hidden="true"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-4 py-1.5 text-xs font-medium tracking-wide text-slate backdrop-blur">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth={1.6} aria-hidden="true">
            <path d="M8 11 5 14l3 3m8-6 3 3-3 3m-3 2 1-9-2-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Drag to explore
        </span>
      </div>

      <div className="absolute bottom-6 right-5 hidden gap-1 md:flex" role="group" aria-label="Book view presets">
        {[
          { name: 'front', label: 'Front' },
          { name: 'spine', label: 'Spine' },
          { name: 'back', label: 'Back' },
        ].map((v) => (
          <button
            key={v.name}
            type="button"
            onClick={() => selectView(v.name)}
            aria-pressed={view === v.name}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300 ${
              view === v.name
                ? 'bg-ink text-paper'
                : 'border border-line bg-white/80 text-slate backdrop-blur hover:border-ink/40 hover:text-ink'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  )
}