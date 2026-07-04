import { formatBoolean, formatCurrency, formatDate, formatDateTime, fullName } from '../utils/formatters'

const vehicleLabel = (vehicle) => {
  const name = [vehicle.brand_name, vehicle.model_name].filter(Boolean).join(' ')
  return `${name || 'Vehicle'} · ${vehicle.plate_number || `#${vehicle.vehicle_id}`}`
}

const reservationLabel = (reservation) => (
  `#${reservation.reservation_id} · ${reservation.customer_name || 'Customer'} · ${reservation.plate_number || 'Vehicle'}`
)

const rentalLabel = (rental) => (
  `#${rental.rental_id} · ${rental.customer_name || 'Customer'} · ${rental.plate_number || 'Vehicle'}`
)

const userLabel = (user) => `${fullName(user) || 'User'} · ${user.email || `#${user.user_id}`}`

export const resourceOrder = ['users', 'customers', 'vehicles', 'reservations', 'rentals', 'returns']

export const resourceConfigs = {
  users: {
    endpoint: 'users',
    idKey: 'user_id',
    title: 'Users',
    singular: 'User',
    description: 'Manage internal DriveFlow operators.',
    createLabel: 'New User',
    deleteMessage: 'This user will be deactivated and kept in the system history.',
    searchPlaceholder: 'Search users',
    columns: [
      { key: 'name', label: 'Name', render: fullName },
      { key: 'email', label: 'Email' },
      { key: 'role_id', label: 'Role ID' },
      { key: 'phone', label: 'Phone' },
      { key: 'is_active', label: 'Status', type: 'status', render: (row) => (row.is_active ? 'Active' : 'Inactive') },
    ],
    fields: [
      { name: 'role_id', label: 'Role ID', type: 'number', required: true, defaultValue: 1 },
      { name: 'first_name', label: 'First name', type: 'text', required: true },
      { name: 'last_name', label: 'Last name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'password', label: 'Password', type: 'password', requiredOnCreate: true, placeholder: 'Minimum 8 characters' },
      { name: 'phone', label: 'Phone', type: 'tel' },
    ],
  },
  customers: {
    endpoint: 'customers',
    idKey: 'customer_id',
    title: 'Customers',
    singular: 'Customer',
    description: 'Maintain customer and driver license information.',
    createLabel: 'New Customer',
    deleteMessage: 'This customer will be deactivated and kept in the system history.',
    searchPlaceholder: 'Search customers',
    columns: [
      { key: 'name', label: 'Name', render: fullName },
      { key: 'email', label: 'Email' },
      { key: 'document_number', label: 'Document' },
      { key: 'driver_license_number', label: 'License' },
      { key: 'phone', label: 'Phone' },
      { key: 'is_active', label: 'Status', type: 'status', render: (row) => (row.is_active ? 'Active' : 'Inactive') },
    ],
    fields: [
      { name: 'first_name', label: 'First name', type: 'text', required: true },
      { name: 'last_name', label: 'Last name', type: 'text', required: true },
      { name: 'document_number', label: 'Document number', type: 'text', required: true },
      { name: 'driver_license_number', label: 'Driver license number', type: 'text', required: true },
      { name: 'driver_license_expiration_date', label: 'License expiration date', type: 'date', required: true },
      { name: 'date_of_birth', label: 'Date of birth', type: 'date', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'tel', required: true },
      { name: 'address', label: 'Address', type: 'text' },
      { name: 'emergency_contact_name', label: 'Emergency contact name', type: 'text' },
      { name: 'emergency_contact_phone', label: 'Emergency contact phone', type: 'tel' },
    ],
  },
  vehicles: {
    endpoint: 'vehicles',
    idKey: 'vehicle_id',
    title: 'Vehicles',
    singular: 'Vehicle',
    description: 'Manage fleet inventory, rates, specs and status.',
    createLabel: 'New Vehicle',
    deleteMessage: 'This vehicle will be deactivated and remain available for historical records.',
    searchPlaceholder: 'Search vehicles',
    columns: [
      { key: 'vehicle', label: 'Vehicle', type: 'vehicle' },
      { key: 'category_name', label: 'Category' },
      { key: 'vehicle_status_name', label: 'Status', type: 'status' },
      { key: 'mileage', label: 'Mileage' },
      { key: 'daily_rate', label: 'Daily Rate', render: (row) => formatCurrency(row.daily_rate) },
      { key: 'is_active', label: 'Active', type: 'status', render: (row) => (row.is_active ? 'Active' : 'Inactive') },
    ],
    fields: [
      { name: 'model_id', label: 'Model ID', type: 'number', required: true, defaultValue: 1 },
      { name: 'category_id', label: 'Category ID', type: 'number', required: true, defaultValue: 1 },
      { name: 'fuel_type_id', label: 'Fuel Type ID', type: 'number', required: true, defaultValue: 1 },
      { name: 'transmission_id', label: 'Transmission ID', type: 'number', required: true, defaultValue: 1 },
      { name: 'vehicle_status_id', label: 'Vehicle Status ID', type: 'number', required: true, defaultValue: 1 },
      { name: 'plate_number', label: 'Plate number', type: 'text', required: true },
      { name: 'vin', label: 'VIN', type: 'text', required: true },
      { name: 'color', label: 'Color', type: 'text' },
      { name: 'model_year', label: 'Model year', type: 'number', required: true, defaultValue: new Date().getFullYear() },
      { name: 'engine', label: 'Engine', type: 'text' },
      { name: 'passenger_capacity', label: 'Passenger capacity', type: 'number', required: true, defaultValue: 5 },
      { name: 'door_count', label: 'Door count', type: 'number', required: true, defaultValue: 4 },
      { name: 'air_conditioning', label: 'Air conditioning', type: 'checkbox', defaultValue: true },
      { name: 'mileage', label: 'Mileage', type: 'number', required: true, defaultValue: 0 },
      { name: 'daily_rate', label: 'Daily rate', type: 'number', step: '0.01', required: true, defaultValue: 0 },
    ],
  },
  reservations: {
    endpoint: 'reservations',
    idKey: 'reservation_id',
    title: 'Reservations',
    singular: 'Reservation',
    description: 'Schedule vehicle reservations for customers.',
    createLabel: 'New Reservation',
    deleteMessage: 'This reservation will be marked as cancelled.',
    searchPlaceholder: 'Search reservations',
    columns: [
      { key: 'customer_name', label: 'Customer' },
      { key: 'vehicle', label: 'Vehicle', render: vehicleLabel },
      { key: 'reservation_status_name', label: 'Status', type: 'status' },
      { key: 'start_datetime', label: 'Start', render: (row) => formatDateTime(row.start_datetime) },
      { key: 'end_datetime', label: 'End', render: (row) => formatDateTime(row.end_datetime) },
      { key: 'estimated_total', label: 'Total', render: (row) => formatCurrency(row.estimated_total) },
    ],
    fields: [
      { name: 'customer_id', label: 'Customer', type: 'select', optionsKey: 'customers', optionLabel: fullName, required: true },
      { name: 'vehicle_id', label: 'Vehicle', type: 'select', optionsKey: 'vehicles', optionLabel: vehicleLabel, required: true },
      { name: 'created_by_user_id', label: 'Created by', type: 'select', optionsKey: 'users', optionLabel: userLabel, required: true },
      { name: 'reservation_status_id', label: 'Reservation Status ID', type: 'number', required: true, defaultValue: 1 },
      { name: 'start_datetime', label: 'Start datetime', type: 'datetime-local', required: true },
      { name: 'end_datetime', label: 'End datetime', type: 'datetime-local', required: true },
      { name: 'estimated_total', label: 'Estimated total', type: 'number', step: '0.01', required: true, defaultValue: 0 },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  rentals: {
    endpoint: 'rentals',
    idKey: 'rental_id',
    title: 'Rentals',
    singular: 'Rental',
    description: 'Open and manage rental contracts.',
    createLabel: 'New Rental',
    deleteMessage: 'This rental will be marked as cancelled.',
    searchPlaceholder: 'Search rentals',
    columns: [
      { key: 'customer_name', label: 'Customer' },
      { key: 'reservation_id', label: 'Reservation', render: reservationLabel },
      { key: 'rental_status_name', label: 'Status', type: 'status' },
      { key: 'start_datetime', label: 'Start', render: (row) => formatDateTime(row.start_datetime) },
      { key: 'expected_return_datetime', label: 'Expected Return', render: (row) => formatDateTime(row.expected_return_datetime) },
      { key: 'daily_rate', label: 'Rate', render: (row) => formatCurrency(row.daily_rate) },
    ],
    fields: [
      { name: 'reservation_id', label: 'Reservation', type: 'select', optionsKey: 'reservations', optionLabel: reservationLabel, required: true },
      { name: 'opened_by_user_id', label: 'Opened by', type: 'select', optionsKey: 'users', optionLabel: userLabel, required: true },
      { name: 'rental_status_id', label: 'Rental Status ID', type: 'number', required: true, defaultValue: 1 },
      { name: 'start_datetime', label: 'Start datetime', type: 'datetime-local', required: true },
      { name: 'expected_return_datetime', label: 'Expected return datetime', type: 'datetime-local', required: true },
      { name: 'pickup_mileage', label: 'Pickup mileage', type: 'number', required: true, defaultValue: 0 },
      { name: 'daily_rate', label: 'Daily rate', type: 'number', step: '0.01', required: true, defaultValue: 0 },
      { name: 'deposit_amount', label: 'Deposit amount', type: 'number', step: '0.01', required: true, defaultValue: 0 },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  returns: {
    endpoint: 'returns',
    idKey: 'return_id',
    title: 'Returns',
    singular: 'Return',
    description: 'Record vehicle returns, inspections and final charges.',
    createLabel: 'New Return',
    deleteMessage: 'This return record will be deleted.',
    searchPlaceholder: 'Search returns',
    columns: [
      { key: 'customer_name', label: 'Customer' },
      { key: 'rental_id', label: 'Rental', render: rentalLabel },
      { key: 'return_datetime', label: 'Returned At', render: (row) => formatDateTime(row.return_datetime) },
      { key: 'return_mileage', label: 'Mileage' },
      { key: 'fuel_level_percent', label: 'Fuel', render: (row) => `${row.fuel_level_percent}%` },
      { key: 'total_charged', label: 'Charged', render: (row) => formatCurrency(row.total_charged) },
    ],
    fields: [
      { name: 'rental_id', label: 'Rental', type: 'select', optionsKey: 'rentals', optionLabel: rentalLabel, required: true },
      { name: 'processed_by_user_id', label: 'Processed by', type: 'select', optionsKey: 'users', optionLabel: userLabel, required: true },
      { name: 'return_datetime', label: 'Return datetime', type: 'datetime-local', required: true },
      { name: 'return_mileage', label: 'Return mileage', type: 'number', required: true, defaultValue: 0 },
      { name: 'fuel_level_percent', label: 'Fuel level percent', type: 'number', step: '0.01', required: true, defaultValue: 100 },
      { name: 'late_fee', label: 'Late fee', type: 'number', step: '0.01', required: true, defaultValue: 0 },
      { name: 'damage_fee', label: 'Damage fee', type: 'number', step: '0.01', required: true, defaultValue: 0 },
      { name: 'fuel_fee', label: 'Fuel fee', type: 'number', step: '0.01', required: true, defaultValue: 0 },
      { name: 'cleaning_fee', label: 'Cleaning fee', type: 'number', step: '0.01', required: true, defaultValue: 0 },
      { name: 'total_charged', label: 'Total charged', type: 'number', step: '0.01', required: true, defaultValue: 0 },
      { name: 'damage_description', label: 'Damage description', type: 'textarea' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
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
