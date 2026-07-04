const statusClassNames = {
  available: 'success',
  disponible: 'success',
  active: 'primary',
  confirmed: 'primary',
  rentado: 'primary',
  pending: 'warning',
  reservado: 'warning',
  cancelled: 'danger',
  inactive: 'muted',
  maintenance: 'danger',
  mantenimiento: 'danger',
  completed: 'success',
}

function Badge({ children }) {
  const normalized = String(children || '').toLowerCase()
  const variant = statusClassNames[normalized] || 'muted'

  return <span className={`badge badge-${variant}`}>{children || '—'}</span>
}

export default Badge
