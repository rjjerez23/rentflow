import { Inbox } from 'lucide-react'

function EmptyState({ title = 'No records found', description = 'Create a new record to get started.' }) {
  return (
    <div className="empty-state">
      <Inbox size={28} aria-hidden="true" />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default EmptyState
