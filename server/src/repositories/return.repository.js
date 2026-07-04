const { pool } = require('../config/database');

const returnFields = `
  ret.return_id,
  ret.rental_id,
  rt.reservation_id,
  rv.customer_id,
  CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
  rv.vehicle_id,
  v.plate_number,
  vm.model_id,
  vm.name AS model_name,
  b.brand_id,
  b.name AS brand_name,
  ret.processed_by_user_id,
  CONCAT(u.first_name, ' ', u.last_name) AS processed_by_user_name,
  u.email AS processed_by_user_email,
  ret.return_datetime,
  ret.return_mileage,
  ret.fuel_level_percent,
  ret.late_fee,
  ret.damage_fee,
  ret.fuel_fee,
  ret.cleaning_fee,
  ret.total_charged,
  ret.damage_description,
  ret.notes,
  ret.created_at,
  ret.updated_at
`;

const returnJoins = `
  FROM \`returns\` ret
  INNER JOIN rentals rt ON ret.rental_id = rt.rental_id
  INNER JOIN reservations rv ON rt.reservation_id = rv.reservation_id
  INNER JOIN customers c ON rv.customer_id = c.customer_id
  INNER JOIN vehicles v ON rv.vehicle_id = v.vehicle_id
  INNER JOIN vehicle_models vm ON v.model_id = vm.model_id
  INNER JOIN brands b ON vm.brand_id = b.brand_id
  INNER JOIN users u ON ret.processed_by_user_id = u.user_id
`;

const findAll = async () => {
  return pool.query(`
    SELECT ${returnFields}
    ${returnJoins}
    ORDER BY ret.return_id DESC
  `);
};

const findById = async (returnId) => {
  const rows = await pool.query(
    `
      SELECT ${returnFields}
      ${returnJoins}
      WHERE ret.return_id = ?
      LIMIT 1
    `,
    [returnId],
  );

  return rows[0] || null;
};

const rentalExists = async (rentalId) => {
  const rows = await pool.query(
    'SELECT rental_id FROM rentals WHERE rental_id = ? LIMIT 1',
    [rentalId],
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

const findByRentalId = async (rentalId) => {
  const rows = await pool.query(
    `
      SELECT return_id, rental_id
      FROM \`returns\`
      WHERE rental_id = ?
      LIMIT 1
    `,
    [rentalId],
  );

  return rows[0] || null;
};

const findByRentalIdExcludingId = async (rentalId, returnId) => {
  const rows = await pool.query(
    `
      SELECT return_id, rental_id
      FROM \`returns\`
      WHERE rental_id = ?
        AND return_id <> ?
      LIMIT 1
    `,
    [rentalId, returnId],
  );

  return rows[0] || null;
};

const create = async (returnData) => {
  const result = await pool.query(
    `
      INSERT INTO \`returns\` (
        rental_id,
        processed_by_user_id,
        return_datetime,
        return_mileage,
        fuel_level_percent,
        late_fee,
        damage_fee,
        fuel_fee,
        cleaning_fee,
        total_charged,
        damage_description,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      returnData.rental_id,
      returnData.processed_by_user_id,
      returnData.return_datetime,
      returnData.return_mileage,
      returnData.fuel_level_percent,
      returnData.late_fee,
      returnData.damage_fee,
      returnData.fuel_fee,
      returnData.cleaning_fee,
      returnData.total_charged,
      returnData.damage_description || null,
      returnData.notes || null,
    ],
  );

  return findById(Number(result.insertId));
};

const update = async (returnId, returnData) => {
  await pool.query(
    `
      UPDATE \`returns\`
      SET
        rental_id = ?,
        processed_by_user_id = ?,
        return_datetime = ?,
        return_mileage = ?,
        fuel_level_percent = ?,
        late_fee = ?,
        damage_fee = ?,
        fuel_fee = ?,
        cleaning_fee = ?,
        total_charged = ?,
        damage_description = ?,
        notes = ?
      WHERE return_id = ?
    `,
    [
      returnData.rental_id,
      returnData.processed_by_user_id,
      returnData.return_datetime,
      returnData.return_mileage,
      returnData.fuel_level_percent,
      returnData.late_fee,
      returnData.damage_fee,
      returnData.fuel_fee,
      returnData.cleaning_fee,
      returnData.total_charged,
      returnData.damage_description || null,
      returnData.notes || null,
      returnId,
    ],
  );

  return findById(returnId);
};

const remove = async (returnId) => {
  await pool.query(
    'DELETE FROM `returns` WHERE return_id = ?',
    [returnId],
  );
};

module.exports = {
  findAll,
  findById,
  rentalExists,
  userExists,
  findByRentalId,
  findByRentalIdExcludingId,
  create,
  update,
  remove,
};
