function Select({ label, error, options = [], placeholder = 'Selecciona una opción', className = '', ...props }) {
  return (
    <label className={`field ${className}`}>
      <span>{label}</span>
      <select className={error ? 'field-control field-error' : 'field-control'} {...props}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <small>{error}</small>}
    </label>
  )
}

export default Select
