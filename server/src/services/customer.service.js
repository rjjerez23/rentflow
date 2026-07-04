const customerRepository = require('../repositories/customer.repository');

const createError = (statusCode, message, errors = []) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
};

const normalizeEmail = (email) => email.trim().toLowerCase();

const normalizeOptionalText = (value) => {
  if (!value) {
    return null;
  }

  return value.trim();
};

const ensureEmailIsUnique = async (email, customerId = null) => {
  const existingCustomer = customerId
    ? await customerRepository.findByEmailExcludingId(email, customerId)
    : await customerRepository.findByEmail(email);

  if (existingCustomer) {
    throw createError(409, 'Email is already registered', [
      {
        field: 'email',
        message: 'Email must be unique',
      },
    ]);
  }
};

const ensureDocumentNumberIsUnique = async (documentNumber, customerId = null) => {
  const existingCustomer = customerId
    ? await customerRepository.findByDocumentNumberExcludingId(documentNumber, customerId)
    : await customerRepository.findByDocumentNumber(documentNumber);

  if (existingCustomer) {
    throw createError(409, 'Document number is already registered', [
      {
        field: 'document_number',
        message: 'Document number must be unique',
      },
    ]);
  }
};

const ensureDriverLicenseNumberIsUnique = async (driverLicenseNumber, customerId = null) => {
  const existingCustomer = customerId
    ? await customerRepository.findByDriverLicenseNumberExcludingId(
        driverLicenseNumber,
        customerId,
      )
    : await customerRepository.findByDriverLicenseNumber(driverLicenseNumber);

  if (existingCustomer) {
    throw createError(409, 'Driver license number is already registered', [
      {
        field: 'driver_license_number',
        message: 'Driver license number must be unique',
      },
    ]);
  }
};

const normalizeCustomerPayload = (payload) => ({
  first_name: payload.first_name.trim(),
  last_name: payload.last_name.trim(),
  document_number: payload.document_number.trim(),
  driver_license_number: payload.driver_license_number.trim(),
  driver_license_expiration_date: payload.driver_license_expiration_date,
  date_of_birth: payload.date_of_birth,
  email: normalizeEmail(payload.email),
  phone: payload.phone.trim(),
  address: normalizeOptionalText(payload.address),
  emergency_contact_name: normalizeOptionalText(payload.emergency_contact_name),
  emergency_contact_phone: normalizeOptionalText(payload.emergency_contact_phone),
});

const ensureUniqueCustomerFields = async (customerData, customerId = null) => {
  await ensureEmailIsUnique(customerData.email, customerId);
  await ensureDocumentNumberIsUnique(customerData.document_number, customerId);
  await ensureDriverLicenseNumberIsUnique(customerData.driver_license_number, customerId);
};

const getAllCustomers = async () => {
  return customerRepository.findAll();
};

const getCustomerById = async (customerId) => {
  const customer = await customerRepository.findById(customerId);

  if (!customer) {
    throw createError(404, 'Customer not found');
  }

  return customer;
};

const createCustomer = async (payload) => {
  const customerData = normalizeCustomerPayload(payload);

  await ensureUniqueCustomerFields(customerData);

  return customerRepository.create(customerData);
};

const updateCustomer = async (customerId, payload) => {
  await getCustomerById(customerId);

  const customerData = normalizeCustomerPayload(payload);

  await ensureUniqueCustomerFields(customerData, customerId);

  return customerRepository.update(customerId, customerData);
};

const deactivateCustomer = async (customerId) => {
  await getCustomerById(customerId);
  return customerRepository.deactivate(customerId);
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deactivateCustomer,
};
