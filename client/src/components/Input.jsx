function Input({ label, error, className = '', ...props }) {
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>
      <input className={error ? 'field-control field-error' : 'field-control'} {...props} />
      {error && <small>{error}</small>}
    </label>
  )
}

export default Input
