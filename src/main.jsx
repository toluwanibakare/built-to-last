import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    console.error('Application error', error)
  }

  render() {
    if (this.state.error) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-paper px-5">
          <div className="max-w-md text-center">
            <h1 className="font-display text-3xl text-ink">Something went wrong</h1>
            <p className="mt-4 leading-relaxed text-slate">
              An unexpected error occurred while loading the page. Please refresh to try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-8 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-paper transition-all duration-300 hover:bg-brass-deep"
            >
              Refresh the page
            </button>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)