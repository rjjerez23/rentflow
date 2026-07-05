import { Inbox } from 'lucide-react'

function EmptyState({ title = 'No se encontraron registros', description = 'Crea un nuevo registro para comenzar.' }) {
  return (
    <div className="empty-state">
      <Inbox size={28} aria-hidden="true" />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default EmptyState
