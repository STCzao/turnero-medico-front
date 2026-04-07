import { Component } from 'react'
import AppRouter from './router/AppRouter'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Error no capturado:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-navy text-white gap-4">
          <h1 className="text-2xl font-bold">Algo salió mal</h1>
          <p className="text-white/50 text-sm">Recargá la página para continuar.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-5 py-2 rounded-xl bg-mint text-navy font-semibold text-sm hover:opacity-90 transition"
          >
            Recargar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  )
}
