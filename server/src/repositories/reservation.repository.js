const { pool } = require('../config/database');

const reservationFields = `
  r.reservation_id,
  r.customer_id,
  CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
  c.email AS customer_email,
  r.vehicle_id,
  v.plate_number,
  vm.model_id,
  vm.name AS model_name,
  b.brand_id,
  b.name AS brand_name,
  v.category_id,
  cat.name AS category_name,
  r.created_by_user_id,
  CONCAT(u.first_name, ' ', u.last_name) AS created_by_user_name,
  u.email AS created_by_user_email,
  r.reservation_status_id,
  rs.name AS reservation_status_name,
  r.start_datetime,
  r.end_datetime,
  r.estimated_total,
  r.notes,
  r.created_at,
  r.updated_at
`;

const reservationJoins = `
  FROM reservations r
  INNER JOIN customers c ON r.customer_id = c.customer_id
  INNER JOIN vehicles v ON r.vehicle_id = v.vehicle_id
  INNER JOIN vehicle_models vm ON v.model_id = vm.model_id
  INNER JOIN brands b ON vm.brand_id = b.brand_id
  INNER JOIN categories cat ON v.category_id = cat.category_id
  INNER JOIN users u ON r.created_by_user_id = u.user_id
  INNER JOIN reservation_status rs ON r.reservation_status_id = rs.reservation_status_id
`;

const findAll = async () => {
  return pool.query(`
    SELECT ${reservationFields}
    ${reservationJoins}
    ORDER BY r.reservation_id DESC
  `);
};

const findById = async (reservationId) => {
  const rows = await pool.query(
    `
      SELECT ${reservationFields}
      ${reservationJoins}
      WHERE r.reservation_id = ?
      LIMIT 1
    `,
    [reservationId],
  );

  return rows[0] || null;
};

const customerExists = async (customerId) => {
  const rows = await pool.query(
    'SELECT customer_id FROM customers WHERE customer_id = ? LIMIT 1',
    [customerId],
  );

  return Boolean(rows[0]);
};

const vehicleExists = async (vehicleId) => {
  const rows = await pool.query(
    'SELECT vehicle_id FROM vehicles WHERE vehicle_id = ? LIMIT 1',
    [vehicleId],
  );

  return Boolean(rows[0]);
};

const userExists = async (userId) => {
  const rows = await pool.query(
    'SELECT user_id FROM users WHERE user_id = ? LIMIT 1',
    [userId],
  );

  return Boolean(rows[0]);
};

const statusExists = async (reservationStatusId) => {
  const rows = await pool.query(
    'SELECT reservation_status_id FROM reservation_status WHERE reservation_status_id = ? LIMIT 1',
    [reservationStatusId],
  );

  return Boolean(rows[0]);
};

const findStatusByName = async (name) => {
  const rows = await pool.query(
    `
      SELECT reservation_status_id, name
      FROM reservation_status
      WHERE name = ?
      LIMIT 1
    `,
    [name],
  );

  return rows[0] || null;
};

const create = async (reservationData) => {
  const result = await pool.query(
    `
      INSERT INTO reservations (
        customer_id,
        vehicle_id,
        created_by_user_id,
        reservation_status_id,
        start_datetime,
        end_datetime,
        estimated_total,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      reservationData.customer_id,
      reservationData.vehicle_id,
      reservationData.created_by_user_id,
      reservationData.reservation_status_id,
      reservationData.start_datetime,
      reservationData.end_datetime,
      reservationData.estimated_total,
      reservationData.notes || null,
    ],
  );

  return findById(Number(result.insertId));
};

const update = async (reservationId, reservationData) => {
  await pool.query(
    `
      UPDATE reservations
      SET
        customer_id = ?,
        vehicle_id = ?,
        created_by_user_id = ?,
        reservation_status_id = ?,
        start_datetime = ?,
        end_datetime = ?,
        estimated_total = ?,
        notes = ?
      WHERE reservation_id = ?
    `,
    [
      reservationData.customer_id,
      reservationData.vehicle_id,
      reservationData.created_by_user_id,
      reservationData.reservation_status_id,
      reservationData.start_datetime,
      reservationData.end_datetime,
      reservationData.estimated_total,
      reservationData.notes || null,
      reservationId,
    ],
  );

  return findById(reservationId);
};

const updateStatus = async (reservationId, reservationStatusId) => {
  await pool.query(
    `
      UPDATE reservations
      SET reservation_status_id = ?
      WHERE reservation_id = ?
    `,
    [reservationStatusId, reservationId],
  );

  return findById(reservationId);
};

module.exports = {
  findAll,
  findById,
  customerExists,
  vehicleExists,
  userExists,
  statusExists,
  findStatusByName,
  create,
  update,
  updateStatus,
};
