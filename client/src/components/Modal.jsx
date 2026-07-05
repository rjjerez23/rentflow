import { X } from 'lucide-react'
import Button from './Button'

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal-header">
          <h2>{title}</h2>
          <Button variant="ghost" size="icon" icon={X} onClick={onClose}>
            Cerrar
          </Button>
        </header>
        {children}
      </section>
    </div>
  )
}

export default Modal
