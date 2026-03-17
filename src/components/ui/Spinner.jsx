const SIZES = {
  sm: 'w-4 h-4 border-2',
  md: 'w-7 h-7 border-2',
  lg: 'w-11 h-11 border-4',
}

const COLORS = {
  primary: 'border-deep border-t-transparent',
  white:   'border-white border-t-transparent',
  teal:    'border-teal border-t-transparent',
}

export default function Spinner({ size = 'md', color = 'primary', className = '' }) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={[
        'inline-block rounded-full animate-spin',
        SIZES[size],
        COLORS[color],
        className,
      ].join(' ')}
    />
  )
}

// Pantalla completa centrada
export function FullPageSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-mint">
      <Spinner size="lg" />
    </div>
  )
}
