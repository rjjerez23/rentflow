import Button from './Button'
import Input from './Input'
import Select from './Select'

function FieldControl({ field, value, onChange, error, options }) {
  if (field.type === 'select') {
    return (
      <Select
        label={field.label}
        value={value}
        onChange={(event) => onChange(field.name, event.target.value)}
        options={options}
        error={error}
        required={field.required}
      />
    )
  }

  if (field.type === 'textarea') {
    return (
      <label className="field field-full">
        <span>{field.label}</span>
        <textarea
          className={error ? 'field-control field-error' : 'field-control'}
          value={value}
          onChange={(event) => onChange(field.name, event.target.value)}
          placeholder={field.placeholder}
        />
        {error && <small>{error}</small>}
      </label>
    )
  }

  if (field.type === 'checkbox') {
    return (
      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(field.name, event.target.checked)}
        />
        <span>{field.label}</span>
      </label>
    )
  }

  return (
    <Input
      label={field.label}
      type={field.type}
      value={value}
      onChange={(event) => onChange(field.name, event.target.value)}
      placeholder={field.placeholder}
      required={field.required}
      min={field.min}
      step={field.step}
      error={error}
    />
  )
}

function ResourceForm({
  config,
  values,
  errors,
  optionData,
  saving,
  isEditing,
  onChange,
  onCancel,
  onSubmit,
}) {
  const getOptions = (field) => {
    if (!field.optionsKey) {
      return []
    }

    const options = optionData[field.optionsKey] || []
    const optionIdKey = {
      users: 'user_id',
      customers: 'customer_id',
      vehicles: 'vehicle_id',
      reservations: 'reservation_id',
      rentals: 'rental_id',
    }[field.optionsKey]

    return options.map((option) => ({
      value: option[optionIdKey],
      label: field.optionLabel ? field.optionLabel(option) : String(option[optionIdKey]),
    }))
  }

  return (
    <form className="resource-form" onSubmit={onSubmit}>
      <div className="form-grid">
        {config.fields.map((field) => {
          if (isEditing && field.requiredOnCreate && !values[field.name]) {
            return (
              <FieldControl
                key={field.name}
                field={{ ...field, required: false }}
                value={values[field.name] ?? ''}
                onChange={onChange}
                error={errors[field.name]}
                options={getOptions(field)}
              />
            )
          }

          return (
            <FieldControl
              key={field.name}
              field={field}
              value={values[field.name] ?? ''}
              onChange={onChange}
              error={errors[field.name]}
              options={getOptions(field)}
            />
          )
        })}
      </div>
      {errors.form && <p className="form-error">{errors.form}</p>}
      <footer className="modal-actions">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : `Crear ${config.singular.toLowerCase()}`}
        </Button>
      </footer>
    </form>
  )
}

export default ResourceForm
