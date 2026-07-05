const statusClassNames = {
  available: 'success',
  disponible: 'success',
  active: 'primary',
  activo: 'primary',
  confirmed: 'primary',
  confirmado: 'primary',
  rentado: 'primary',
  pending: 'warning',
  pendiente: 'warning',
  reservado: 'warning',
  cancelled: 'danger',
  cancelado: 'danger',
  inactive: 'muted',
  inactivo: 'muted',
  maintenance: 'danger',
  mantenimiento: 'danger',
  completed: 'success',
  completado: 'success',
  desconocido: 'muted',
}

const statusLabels = {
  available: 'Disponible',
  active: 'Activo',
  confirmed: 'Confirmado',
  pending: 'Pendiente',
  cancelled: 'Cancelado',
  inactive: 'Inactivo',
  maintenance: 'Mantenimiento',
  completed: 'Completado',
  unknown: 'Desconocido',
}

function Badge({ children }) {
  const normalized = String(children || '').toLowerCase()
  const variant = statusClassNames[normalized] || 'muted'
  const label = statusLabels[normalized] || children

  return <span className={`badge badge-${variant}`}>{label || '—'}</span>
}

export default Badge
