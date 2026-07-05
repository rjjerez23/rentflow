import { formatBoolean, formatCurrency, formatDate, formatDateTime, fullName } from '../utils/formatters'

const vehicleLabel = (vehicle) => {
  const name = [vehicle.brand_name, vehicle.model_name].filter(Boolean).join(' ')
  return `${name || 'Vehículo'} · ${vehicle.plate_number || `#${vehicle.vehicle_id}`}`
}

const reservationLabel = (reservation) => (
  `#${reservation.reservation_id} · ${reservation.customer_name || 'Cliente'} · ${reservation.plate_number || 'Vehículo'}`
)

const rentalLabel = (rental) => (
  `#${rental.rental_id} · ${rental.customer_name || 'Cliente'} · ${rental.plate_number || 'Vehículo'}`
)

const userLabel = (user) => `${fullName(user) || 'Usuario'} · ${user.email || `#${user.user_id}`}`

export const resourceOrder = ['users', 'customers', 'vehicles', 'reservations', 'rentals', 'returns']

export const resourceConfigs = {
  users: {
    endpoint: 'users',
    idKey: 'user_id',
    title: 'Usuarios',
    singular: 'Usuario',
    description: 'Administra los operadores internos de DriveFlow.',
    createLabel: 'Nuevo usuario',
    deleteMessage: 'Este usuario será desactivado y se mantendrá en el historial del sistema.',
    searchPlaceholder: 'Buscar usuarios',
    columns: [
      { key: 'name', label: 'Nombre', render: fullName },
      { key: 'email', label: 'Correo' },
      { key: 'role_id', label: 'ID de rol' },
      { key: 'phone', label: 'Teléfono' },
      { key: 'is_active', label: 'Estado', type: 'status', render: (row) => (row.is_active ? 'Activo' : 'Inactivo') },
    ],
    fields: [
      { name: 'role_id', label: 'ID de rol', type: 'number', required: true, defaultValue: 1 },
      { name: 'first_name', label: 'Nombre', type: 'text', required: true },
      { name: 'last_name', label: 'Apellido', type: 'text', required: true },
      { name: 'email', label: 'Correo', type: 'email', required: true },
      { name: 'password', label: 'Contraseña', type: 'password', requiredOnCreate: true, placeholder: 'Mínimo 8 caracteres' },
      { name: 'phone', label: 'Teléfono', type: 'tel' },
    ],
  },
  customers: {
    endpoint: 'customers',
    idKey: 'customer_id',
    title: 'Clientes',
    singular: 'Cliente',
    description: 'Mantén la información de clientes y licencias de conducir.',
    createLabel: 'Nuevo cliente',
    deleteMessage: 'Este cliente será desactivado y se mantendrá en el historial del sistema.',
    searchPlaceholder: 'Buscar clientes',
    columns: [
      { key: 'name', label: 'Nombre', render: fullName },
      { key: 'email', label: 'Correo' },
      { key: 'document_number', label: 'Documento' },
      { key: 'driver_license_number', label: 'Licencia' },
      { key: 'phone', label: 'Teléfono' },
      { key: 'is_active', label: 'Estado', type: 'status', render: (row) => (row.is_active ? 'Activo' : 'Inactivo') },
    ],
    fields: [
      { name: 'first_name', label: 'Nombre', type: 'text', required: true },
      { name: 'last_name', label: 'Apellido', type: 'text', required: true },
      { name: 'document_number', label: 'Número de documento', type: 'text', required: true },
      { name: 'driver_license_number', label: 'Número de licencia', type: 'text', required: true },
      { name: 'driver_license_expiration_date', label: 'Vencimiento de licencia', type: 'date', required: true },
      { name: 'date_of_birth', label: 'Fecha de nacimiento', type: 'date', required: true },
      { name: 'email', label: 'Correo', type: 'email', required: true },
      { name: 'phone', label: 'Teléfono', type: 'tel', required: true },
      { name: 'address', label: 'Dirección', type: 'text' },
      { name: 'emergency_contact_name', label: 'Nombre de contacto de emergencia', type: 'text' },
      { name: 'emergency_contact_phone', label: 'Teléfono de contacto de emergencia', type: 'tel' },
    ],
  },
  vehicles: {
    endpoint: 'vehicles',
    idKey: 'vehicle_id',
    title: 'Vehículos',
    singular: 'Vehículo',
    description: 'Administra inventario, tarifas, especificaciones y estado de la flota.',
    createLabel: 'Nuevo vehículo',
    deleteMessage: 'Este vehículo será desactivado y permanecerá disponible para registros históricos.',
    searchPlaceholder: 'Buscar vehículos',
    columns: [
      { key: 'vehicle', label: 'Vehículo', type: 'vehicle' },
      { key: 'category_name', label: 'Categoría' },
      { key: 'vehicle_status_name', label: 'Estado', type: 'status' },
      { key: 'mileage', label: 'Kilometraje' },
      { key: 'daily_rate', label: 'Tarifa diaria', render: (row) => formatCurrency(row.daily_rate) },
      { key: 'is_active', label: 'Activo', type: 'status', render: (row) => (row.is_active ? 'Activo' : 'Inactivo') },
    ],
    fields: [
      { name: 'model_id', label: 'ID de modelo', type: 'number', required: true, defaultValue: 1 },
      { name: 'category_id', label: 'ID de categoría', type: 'number', required: true, defaultValue: 1 },
      { name: 'fuel_type_id', label: 'ID de combustible', type: 'number', required: true, defaultValue: 1 },
      { name: 'transmission_id', label: 'ID de transmisión', type: 'number', required: true, defaultValue: 1 },
      { name: 'vehicle_status_id', label: 'ID de estado del vehículo', type: 'number', required: true, defaultValue: 1 },
      { name: 'plate_number', label: 'Placa', type: 'text', required: true },
      { name: 'vin', label: 'VIN', type: 'text', required: true },
      { name: 'color', label: 'Color', type: 'text' },
      { name: 'model_year', label: 'Año del modelo', type: 'number', required: true, defaultValue: new Date().getFullYear() },
      { name: 'engine', label: 'Motor', type: 'text' },
      { name: 'passenger_capacity', label: 'Capacidad de pasajeros', type: 'number', required: true, defaultValue: 5 },
      { name: 'door_count', label: 'Cantidad de puertas', type: 'number', required: true, defaultValue: 4 },
      { name: 'air_conditioning', label: 'Aire acondicionado', type: 'checkbox', defaultValue: true },
      { name: 'mileage', label: 'Kilometraje', type: 'number', required: true, defaultValue: 0 },
      { name: 'daily_rate', label: 'Tarifa diaria', type: 'number', step: '0.01', required: true, defaultValue: 0 },
    ],
  },
  reservations: {
    endpoint: 'reservations',
    idKey: 'reservation_id',
    title: 'Reservas',
    singular: 'Reserva',
    description: 'Programa reservas de vehículos para clientes.',
    createLabel: 'Nueva reserva',
    deleteMessage: 'Esta reserva será marcada como cancelada.',
    searchPlaceholder: 'Buscar reservas',
    columns: [
      { key: 'customer_name', label: 'Cliente' },
      { key: 'vehicle', label: 'Vehículo', render: vehicleLabel },
      { key: 'reservation_status_name', label: 'Estado', type: 'status' },
      { key: 'start_datetime', label: 'Inicio', render: (row) => formatDateTime(row.start_datetime) },
      { key: 'end_datetime', label: 'Fin', render: (row) => formatDateTime(row.end_datetime) },
      { key: 'estimated_total', label: 'Total', render: (row) => formatCurrency(row.estimated_total) },
    ],
    fields: [
      { name: 'customer_id', label: 'Cliente', type: 'select', optionsKey: 'customers', optionLabel: fullName, required: true },
      { name: 'vehicle_id', label: 'Vehículo', type: 'select', optionsKey: 'vehicles', optionLabel: vehicleLabel, required: true },
      { name: 'created_by_user_id', label: 'Creado por', type: 'select', optionsKey: 'users', optionLabel: userLabel, required: true },
      { name: 'reservation_status_id', label: 'ID de estado de reserva', type: 'number', required: true, defaultValue: 1 },
      { name: 'start_datetime', label: 'Fecha y hora de inicio', type: 'datetime-local', required: true },
      { name: 'end_datetime', label: 'Fecha y hora de fin', type: 'datetime-local', required: true },
      { name: 'estimated_total', label: 'Total estimado', type: 'number', step: '0.01', required: true, defaultValue: 0 },
      { name: 'notes', label: 'Notas', type: 'textarea' },
    ],
  },
  rentals: {
    endpoint: 'rentals',
    idKey: 'rental_id',
    title: 'Alquileres',
    singular: 'Alquiler',
    description: 'Abre y administra contratos de alquiler.',
    createLabel: 'Nuevo alquiler',
    deleteMessage: 'Este alquiler será marcado como cancelado.',
    searchPlaceholder: 'Buscar alquileres',
    columns: [
      { key: 'customer_name', label: 'Cliente' },
      { key: 'reservation_id', label: 'Reserva', render: reservationLabel },
      { key: 'rental_status_name', label: 'Estado', type: 'status' },
      { key: 'start_datetime', label: 'Inicio', render: (row) => formatDateTime(row.start_datetime) },
      { key: 'expected_return_datetime', label: 'Devolución esperada', render: (row) => formatDateTime(row.expected_return_datetime) },
      { key: 'daily_rate', label: 'Tarifa', render: (row) => formatCurrency(row.daily_rate) },
    ],
    fields: [
      { name: 'reservation_id', label: 'Reserva', type: 'select', optionsKey: 'reservations', optionLabel: reservationLabel, required: true },
      { name: 'opened_by_user_id', label: 'Abierto por', type: 'select', optionsKey: 'users', optionLabel: userLabel, required: true },
      { name: 'rental_status_id', label: 'ID de estado de alquiler', type: 'number', required: true, defaultValue: 1 },
      { name: 'start_datetime', label: 'Fecha y hora de inicio', type: 'datetime-local', required: true },
      { name: 'expected_return_datetime', label: 'Fecha y hora esperada de devolución', type: 'datetime-local', required: true },
      { name: 'pickup_mileage', label: 'Kilometraje de entrega', type: 'number', required: true, defaultValue: 0 },
      { name: 'daily_rate', label: 'Tarifa diaria', type: 'number', step: '0.01', required: true, defaultValue: 0 },
      { name: 'deposit_amount', label: 'Monto de depósito', type: 'number', step: '0.01', required: true, defaultValue: 0 },
      { name: 'notes', label: 'Notas', type: 'textarea' },
    ],
  },
  returns: {
    endpoint: 'returns',
    idKey: 'return_id',
    title: 'Devoluciones',
    singular: 'Devolución',
    description: 'Registra devoluciones, inspecciones y cargos finales.',
    createLabel: 'Nueva devolución',
    deleteMessage: 'Este registro de devolución será eliminado.',
    searchPlaceholder: 'Buscar devoluciones',
    columns: [
      { key: 'customer_name', label: 'Cliente' },
      { key: 'rental_id', label: 'Alquiler', render: rentalLabel },
      { key: 'return_datetime', label: 'Devuelto el', render: (row) => formatDateTime(row.return_datetime) },
      { key: 'return_mileage', label: 'Kilometraje' },
      { key: 'fuel_level_percent', label: 'Combustible', render: (row) => `${row.fuel_level_percent}%` },
      { key: 'total_charged', label: 'Cobrado', render: (row) => formatCurrency(row.total_charged) },
    ],
    fields: [
      { name: 'rental_id', label: 'Alquiler', type: 'select', optionsKey: 'rentals', optionLabel: rentalLabel, required: true },
      { name: 'processed_by_user_id', label: 'Procesado por', type: 'select', optionsKey: 'users', optionLabel: userLabel, required: true },
      { name: 'return_datetime', label: 'Fecha y hora de devolución', type: 'datetime-local', required: true },
      { name: 'return_mileage', label: 'Kilometraje de devolución', type: 'number', required: true, defaultValue: 0 },
      { name: 'fuel_level_percent', label: 'Porcentaje de combustible', type: 'number', step: '0.01', required: true, defaultValue: 100 },
      { name: 'late_fee', label: 'Cargo por retraso', type: 'number', step: '0.01', required: true, defaultValue: 0 },
      { name: 'damage_fee', label: 'Cargo por daños', type: 'number', step: '0.01', required: true, defaultValue: 0 },
      { name: 'fuel_fee', label: 'Cargo por combustible', type: 'number', step: '0.01', required: true, defaultValue: 0 },
      { name: 'cleaning_fee', label: 'Cargo por limpieza', type: 'number', step: '0.01', required: true, defaultValue: 0 },
      { name: 'total_charged', label: 'Total cobrado', type: 'number', step: '0.01', required: true, defaultValue: 0 },
      { name: 'damage_description', label: 'Descripción de daños', type: 'textarea' },
      { name: 'notes', label: 'Notas', type: 'textarea' },
    ],
  },
}

export const getFieldValue = (field, record) => {
  if (!record) {
    return field.defaultValue ?? (field.type === 'checkbox' ? false : '')
  }

  if (field.type === 'date') {
    return String(record[field.name] || '').slice(0, 10)
  }

  if (field.type === 'datetime-local') {
    const value = record[field.name]
    if (!value) {
      return ''
    }
    const date = new Date(value)
    const offset = date.getTimezoneOffset()
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16)
  }

  if (field.type === 'checkbox') {
    return Boolean(record[field.name])
  }

  return record[field.name] ?? ''
}

export const getDisplayValue = (column, row) => {
  if (column.render) {
    return column.render(row)
  }

  if (column.key === 'created_at' || column.key === 'updated_at') {
    return formatDate(row[column.key])
  }

  if (column.key === 'air_conditioning') {
    return formatBoolean(row[column.key])
  }

  return row[column.key] ?? '—'
}
