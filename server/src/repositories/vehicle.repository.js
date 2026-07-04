const { pool } = require('../config/database');

const vehicleFields = `
  v.vehicle_id,
  v.model_id,
  vm.name AS model_name,
  b.brand_id,
  b.name AS brand_name,
  v.category_id,
  c.name AS category_name,
  v.fuel_type_id,
  ft.name AS fuel_type_name,
  v.transmission_id,
  t.name AS transmission_name,
  v.vehicle_status_id,
  vs.name AS vehicle_status_name,
  v.plate_number,
  v.vin,
  v.color,
  v.model_year,
  v.engine,
  v.passenger_capacity,
  v.door_count,
  v.air_conditioning,
  v.mileage,
  v.daily_rate,
  v.is_active,
  v.created_at,
  v.updated_at
`;

const vehicleJoins = `
  FROM vehicles v
  INNER JOIN vehicle_models vm ON v.model_id = vm.model_id
  INNER JOIN brands b ON vm.brand_id = b.brand_id
  INNER JOIN categories c ON v.category_id = c.category_id
  INNER JOIN fuel_types ft ON v.fuel_type_id = ft.fuel_type_id
  INNER JOIN transmissions t ON v.transmission_id = t.transmission_id
  INNER JOIN vehicle_status vs ON v.vehicle_status_id = vs.vehicle_status_id
`;

const findAll = async () => {
  return pool.query(`
    SELECT ${vehicleFields}
    ${vehicleJoins}
    ORDER BY v.vehicle_id DESC
  `);
};

const findById = async (vehicleId) => {
  const rows = await pool.query(
    `
      SELECT ${vehicleFields}
      ${vehicleJoins}
      WHERE v.vehicle_id = ?
      LIMIT 1
    `,
    [vehicleId],
  );

  return rows[0] || null;
};

const findByPlateNumber = async (plateNumber) => {
  const rows = await pool.query(
    `
      SELECT vehicle_id, plate_number
      FROM vehicles
      WHERE plate_number = ?
      LIMIT 1
    `,
    [plateNumber],
  );

  return rows[0] || null;
};

const findByPlateNumberExcludingId = async (plateNumber, vehicleId) => {
  const rows = await pool.query(
    `
      SELECT vehicle_id, plate_number
      FROM vehicles
      WHERE plate_number = ?
        AND vehicle_id <> ?
      LIMIT 1
    `,
    [plateNumber, vehicleId],
  );

  return rows[0] || null;
};

const findByVin = async (vin) => {
  const rows = await pool.query(
    `
      SELECT vehicle_id, vin
      FROM vehicles
      WHERE vin = ?
      LIMIT 1
    `,
    [vin],
  );

  return rows[0] || null;
};

const findByVinExcludingId = async (vin, vehicleId) => {
  const rows = await pool.query(
    `
      SELECT vehicle_id, vin
      FROM vehicles
      WHERE vin = ?
        AND vehicle_id <> ?
      LIMIT 1
    `,
    [vin, vehicleId],
  );

  return rows[0] || null;
};

const modelExists = async (modelId) => {
  const rows = await pool.query(
    `
      SELECT model_id
      FROM vehicle_models
      WHERE model_id = ?
      LIMIT 1
    `,
    [modelId],
  );

  return Boolean(rows[0]);
};

const categoryExists = async (categoryId) => {
  const rows = await pool.query(
    `
      SELECT category_id
      FROM categories
      WHERE category_id = ?
      LIMIT 1
    `,
    [categoryId],
  );

  return Boolean(rows[0]);
};

const fuelTypeExists = async (fuelTypeId) => {
  const rows = await pool.query(
    `
      SELECT fuel_type_id
      FROM fuel_types
      WHERE fuel_type_id = ?
      LIMIT 1
    `,
    [fuelTypeId],
  );

  return Boolean(rows[0]);
};

const transmissionExists = async (transmissionId) => {
  const rows = await pool.query(
    `
      SELECT transmission_id
      FROM transmissions
      WHERE transmission_id = ?
      LIMIT 1
    `,
    [transmissionId],
  );

  return Boolean(rows[0]);
};

const vehicleStatusExists = async (vehicleStatusId) => {
  const rows = await pool.query(
    `
      SELECT vehicle_status_id
      FROM vehicle_status
      WHERE vehicle_status_id = ?
      LIMIT 1
    `,
    [vehicleStatusId],
  );

  return Boolean(rows[0]);
};

const create = async (vehicleData) => {
  const result = await pool.query(
    `
      INSERT INTO vehicles (
        model_id,
        category_id,
        fuel_type_id,
        transmission_id,
        vehicle_status_id,
        plate_number,
        vin,
        color,
        model_year,
        engine,
        passenger_capacity,
        door_count,
        air_conditioning,
        mileage,
        daily_rate
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      vehicleData.model_id,
      vehicleData.category_id,
      vehicleData.fuel_type_id,
      vehicleData.transmission_id,
      vehicleData.vehicle_status_id,
      vehicleData.plate_number,
      vehicleData.vin,
      vehicleData.color || null,
      vehicleData.model_year,
      vehicleData.engine || null,
      vehicleData.passenger_capacity,
      vehicleData.door_count,
      vehicleData.air_conditioning,
      vehicleData.mileage,
      vehicleData.daily_rate,
    ],
  );

  return findById(Number(result.insertId));
};

const update = async (vehicleId, vehicleData) => {
  await pool.query(
    `
      UPDATE vehicles
      SET
        model_id = ?,
        category_id = ?,
        fuel_type_id = ?,
        transmission_id = ?,
        vehicle_status_id = ?,
        plate_number = ?,
        vin = ?,
        color = ?,
        model_year = ?,
        engine = ?,
        passenger_capacity = ?,
        door_count = ?,
        air_conditioning = ?,
        mileage = ?,
        daily_rate = ?
      WHERE vehicle_id = ?
    `,
    [
      vehicleData.model_id,
      vehicleData.category_id,
      vehicleData.fuel_type_id,
      vehicleData.transmission_id,
      vehicleData.vehicle_status_id,
      vehicleData.plate_number,
      vehicleData.vin,
      vehicleData.color || null,
      vehicleData.model_year,
      vehicleData.engine || null,
      vehicleData.passenger_capacity,
      vehicleData.door_count,
      vehicleData.air_conditioning,
      vehicleData.mileage,
      vehicleData.daily_rate,
      vehicleId,
    ],
  );

  return findById(vehicleId);
};

const deactivate = async (vehicleId) => {
  await pool.query(
    `
      UPDATE vehicles
      SET is_active = 0
      WHERE vehicle_id = ?
    `,
    [vehicleId],
  );

  return findById(vehicleId);
};

module.exports = {
  findAll,
  findById,
  findByPlateNumber,
  findByPlateNumberExcludingId,
  findByVin,
  findByVinExcludingId,
  modelExists,
  categoryExists,
  fuelTypeExists,
  transmissionExists,
  vehicleStatusExists,
  create,
  update,
  deactivate,
};
