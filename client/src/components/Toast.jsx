function Toast({ toast, onClose }) {
  if (!toast) {
    return null
  }

  return (
    <button className={`toast toast-${toast.type}`} type="button" onClick={onClose}>
      <strong>{toast.title}</strong>
      <span>{toast.message}</span>
    </button>
  )
}

export default Toast
