const { pool } = require('../config/database');

const customerFields = `
  customer_id,
  first_name,
  last_name,
  document_number,
  driver_license_number,
  driver_license_expiration_date,
  date_of_birth,
  email,
  phone,
  address,
  emergency_contact_name,
  emergency_contact_phone,
  is_active,
  created_at,
  updated_at
`;

const findAll = async () => {
  return pool.query(`
    SELECT ${customerFields}
    FROM customers
    ORDER BY customer_id DESC
  `);
};

const findById = async (customerId) => {
  const rows = await pool.query(
    `
      SELECT ${customerFields}
      FROM customers
      WHERE customer_id = ?
      LIMIT 1
    `,
    [customerId],
  );

  return rows[0] || null;
};

const findByEmail = async (email) => {
  const rows = await pool.query(
    `
      SELECT customer_id, email
      FROM customers
      WHERE email = ?
      LIMIT 1
    `,
    [email],
  );

  return rows[0] || null;
};

const findByEmailExcludingId = async (email, customerId) => {
  const rows = await pool.query(
    `
      SELECT customer_id, email
      FROM customers
      WHERE email = ?
        AND customer_id <> ?
      LIMIT 1
    `,
    [email, customerId],
  );

  return rows[0] || null;
};

const findByDocumentNumber = async (documentNumber) => {
  const rows = await pool.query(
    `
      SELECT customer_id, document_number
      FROM customers
      WHERE document_number = ?
      LIMIT 1
    `,
    [documentNumber],
  );

  return rows[0] || null;
};

const findByDocumentNumberExcludingId = async (documentNumber, customerId) => {
  const rows = await pool.query(
    `
      SELECT customer_id, document_number
      FROM customers
      WHERE document_number = ?
        AND customer_id <> ?
      LIMIT 1
    `,
    [documentNumber, customerId],
  );

  return rows[0] || null;
};

const findByDriverLicenseNumber = async (driverLicenseNumber) => {
  const rows = await pool.query(
    `
      SELECT customer_id, driver_license_number
      FROM customers
      WHERE driver_license_number = ?
      LIMIT 1
    `,
    [driverLicenseNumber],
  );

  return rows[0] || null;
};

const findByDriverLicenseNumberExcludingId = async (driverLicenseNumber, customerId) => {
  const rows = await pool.query(
    `
      SELECT customer_id, driver_license_number
      FROM customers
      WHERE driver_license_number = ?
        AND customer_id <> ?
      LIMIT 1
    `,
    [driverLicenseNumber, customerId],
  );

  return rows[0] || null;
};

const create = async (customerData) => {
  const result = await pool.query(
    `
      INSERT INTO customers (
        first_name,
        last_name,
        document_number,
        driver_license_number,
        driver_license_expiration_date,
        date_of_birth,
        email,
        phone,
        address,
        emergency_contact_name,
        emergency_contact_phone
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      customerData.first_name,
      customerData.last_name,
      customerData.document_number,
      customerData.driver_license_number,
      customerData.driver_license_expiration_date,
      customerData.date_of_birth,
      customerData.email,
      customerData.phone,
      customerData.address || null,
      customerData.emergency_contact_name || null,
      customerData.emergency_contact_phone || null,
    ],
  );

  return findById(Number(result.insertId));
};

const update = async (customerId, customerData) => {
  await pool.query(
    `
      UPDATE customers
      SET
        first_name = ?,
        last_name = ?,
        document_number = ?,
        driver_license_number = ?,
        driver_license_expiration_date = ?,
        date_of_birth = ?,
        email = ?,
        phone = ?,
        address = ?,
        emergency_contact_name = ?,
        emergency_contact_phone = ?
      WHERE customer_id = ?
    `,
    [
      customerData.first_name,
      customerData.last_name,
      customerData.document_number,
      customerData.driver_license_number,
      customerData.driver_license_expiration_date,
      customerData.date_of_birth,
      customerData.email,
      customerData.phone,
      customerData.address || null,
      customerData.emergency_contact_name || null,
      customerData.emergency_contact_phone || null,
      customerId,
    ],
  );

  return findById(customerId);
};

const deactivate = async (customerId) => {
  await pool.query(
    `
      UPDATE customers
      SET is_active = 0
      WHERE customer_id = ?
    `,
    [customerId],
  );

  return findById(customerId);
};

module.exports = {
  findAll,
  findById,
  findByEmail,
  findByEmailExcludingId,
  findByDocumentNumber,
  findByDocumentNumberExcludingId,
  findByDriverLicenseNumber,
  findByDriverLicenseNumberExcludingId,
  create,
  update,
  deactivate,
};
