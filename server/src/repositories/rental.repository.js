const { pool } = require('../config/database');

const rentalFields = `
  rt.rental_id,
  rt.reservation_id,
  rv.customer_id,
  CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
  rv.vehicle_id,
  v.plate_number,
  vm.model_id,
  vm.name AS model_name,
  b.brand_id,
  b.name AS brand_name,
  v.category_id,
  cat.name AS category_name,
  rt.opened_by_user_id,
  CONCAT(u.first_name, ' ', u.last_name) AS opened_by_user_name,
  u.email AS opened_by_user_email,
  rt.rental_status_id,
  rs.name AS rental_status_name,
  rt.start_datetime,
  rt.expected_return_datetime,
  rt.pickup_mileage,
  rt.daily_rate,
  rt.deposit_amount,
  rt.notes,
  rt.created_at,
  rt.updated_at
`;

const rentalJoins = `
  FROM rentals rt
  INNER JOIN reservations rv ON rt.reservation_id = rv.reservation_id
  INNER JOIN customers c ON rv.customer_id = c.customer_id
  INNER JOIN vehicles v ON rv.vehicle_id = v.vehicle_id
  INNER JOIN vehicle_models vm ON v.model_id = vm.model_id
  INNER JOIN brands b ON vm.brand_id = b.brand_id
  INNER JOIN categories cat ON v.category_id = cat.category_id
  INNER JOIN users u ON rt.opened_by_user_id = u.user_id
  INNER JOIN rental_status rs ON rt.rental_status_id = rs.rental_status_id
`;

const findAll = async () => {
  return pool.query(`
    SELECT ${rentalFields}
    ${rentalJoins}
    ORDER BY rt.rental_id DESC
  `);
};

const findById = async (rentalId) => {
  const rows = await pool.query(
    `
      SELECT ${rentalFields}
      ${rentalJoins}
      WHERE rt.rental_id = ?
      LIMIT 1
    `,
    [rentalId],
  );

  return rows[0] || null;
};

const reservationExists = async (reservationId) => {
  const rows = await pool.query(
    'SELECT reservation_id FROM reservations WHERE reservation_id = ? LIMIT 1',
    [reservationId],
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

const statusExists = async (rentalStatusId) => {
  const rows = await pool.query(
    'SELECT rental_status_id FROM rental_status WHERE rental_status_id = ? LIMIT 1',
    [rentalStatusId],
  );

  return Boolean(rows[0]);
};

const findStatusByName = async (name) => {
  const rows = await pool.query(
    `
      SELECT rental_status_id, name
      FROM rental_status
      WHERE name = ?
      LIMIT 1
    `,
    [name],
  );

  return rows[0] || null;
};

const findByReservationId = async (reservationId) => {
  const rows = await pool.query(
    `
      SELECT rental_id, reservation_id
      FROM rentals
      WHERE reservation_id = ?
      LIMIT 1
    `,
    [reservationId],
  );

  return rows[0] || null;
};

const findByReservationIdExcludingId = async (reservationId, rentalId) => {
  const rows = await pool.query(
    `
      SELECT rental_id, reservation_id
      FROM rentals
      WHERE reservation_id = ?
        AND rental_id <> ?
      LIMIT 1
    `,
    [reservationId, rentalId],
  );

  return rows[0] || null;
};

const create = async (rentalData) => {
  const result = await pool.query(
    `
      INSERT INTO rentals (
        reservation_id,
        opened_by_user_id,
        rental_status_id,
        start_datetime,
        expected_return_datetime,
        pickup_mileage,
        daily_rate,
        deposit_amount,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      rentalData.reservation_id,
      rentalData.opened_by_user_id,
      rentalData.rental_status_id,
      rentalData.start_datetime,
      rentalData.expected_return_datetime,
      rentalData.pickup_mileage,
      rentalData.daily_rate,
      rentalData.deposit_amount,
      rentalData.notes || null,
    ],
  );

  return findById(Number(result.insertId));
};

const update = async (rentalId, rentalData) => {
  await pool.query(
    `
      UPDATE rentals
      SET
        reservation_id = ?,
        opened_by_user_id = ?,
        rental_status_id = ?,
        start_datetime = ?,
        expected_return_datetime = ?,
        pickup_mileage = ?,
        daily_rate = ?,
        deposit_amount = ?,
        notes = ?
      WHERE rental_id = ?
    `,
    [
      rentalData.reservation_id,
      rentalData.opened_by_user_id,
      rentalData.rental_status_id,
      rentalData.start_datetime,
      rentalData.expected_return_datetime,
      rentalData.pickup_mileage,
      rentalData.daily_rate,
      rentalData.deposit_amount,
      rentalData.notes || null,
      rentalId,
    ],
  );

  return findById(rentalId);
};

const updateStatus = async (rentalId, rentalStatusId) => {
  await pool.query(
    `
      UPDATE rentals
      SET rental_status_id = ?
      WHERE rental_id = ?
    `,
    [rentalStatusId, rentalId],
  );

  return findById(rentalId);
};

module.exports = {
  findAll,
  findById,
  reservationExists,
  userExists,
  statusExists,
  findStatusByName,
  findByReservationId,
  findByReservationIdExcludingId,
  create,
  update,
  updateStatus,
};
