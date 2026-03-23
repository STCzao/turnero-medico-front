import { ESTADO_TURNO_LABEL, ESTADO_TURNO_COLOR } from '../../constants/estadosTurno'

export default function Badge({ estado, className = '' }) {
  const label = ESTADO_TURNO_LABEL[estado] ?? estado
  const color = ESTADO_TURNO_COLOR[estado] ?? 'bg-gray-100 text-gray-700'

  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        color,
        className,
      ].join(' ')}
    >
      {label}
    </span>
  )
}
