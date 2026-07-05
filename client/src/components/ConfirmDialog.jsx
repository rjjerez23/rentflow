import { AlertTriangle } from 'lucide-react'
import Button from './Button'
import Modal from './Modal'

function ConfirmDialog({ title, message, confirmLabel = 'Confirmar', onCancel, onConfirm, loading }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <div className="confirm-body">
        <div className="confirm-icon">
          <AlertTriangle size={22} aria-hidden="true" />
        </div>
        <p>{message}</p>
      </div>
      <footer className="modal-actions">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Procesando...' : confirmLabel}
        </Button>
      </footer>
    </Modal>
  )
}

export default ConfirmDialog
