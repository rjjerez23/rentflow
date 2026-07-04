const { pool } = require('../config/database');

const userFields = `
  user_id,
  role_id,
  first_name,
  last_name,
  email,
  phone,
  is_active,
  last_login_at,
  created_at,
  updated_at
`;

const findAll = async () => {
  return pool.query(`
    SELECT ${userFields}
    FROM users
    ORDER BY user_id DESC
  `);
};

const findById = async (userId) => {
  const rows = await pool.query(
    `
      SELECT ${userFields}
      FROM users
      WHERE user_id = ?
      LIMIT 1
    `,
    [userId],
  );

  return rows[0] || null;
};

const findByEmail = async (email) => {
  const rows = await pool.query(
    `
      SELECT user_id, email
      FROM users
      WHERE email = ?
      LIMIT 1
    `,
    [email],
  );

  return rows[0] || null;
};

const findByEmailExcludingId = async (email, userId) => {
  const rows = await pool.query(
    `
      SELECT user_id, email
      FROM users
      WHERE email = ?
        AND user_id <> ?
      LIMIT 1
    `,
    [email, userId],
  );

  return rows[0] || null;
};

const roleExists = async (roleId) => {
  const rows = await pool.query(
    `
      SELECT role_id
      FROM roles
      WHERE role_id = ?
      LIMIT 1
    `,
    [roleId],
  );

  return Boolean(rows[0]);
};

const create = async (userData) => {
  const result = await pool.query(
    `
      INSERT INTO users (
        role_id,
        first_name,
        last_name,
        email,
        password_hash,
        phone
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      userData.role_id,
      userData.first_name,
      userData.last_name,
      userData.email,
      userData.password_hash,
      userData.phone || null,
    ],
  );

  return findById(Number(result.insertId));
};

const update = async (userId, userData) => {
  const fields = [
    'role_id = ?',
    'first_name = ?',
    'last_name = ?',
    'email = ?',
    'phone = ?',
  ];

  const values = [
    userData.role_id,
    userData.first_name,
    userData.last_name,
    userData.email,
    userData.phone || null,
  ];

  if (userData.password_hash) {
    fields.push('password_hash = ?');
    values.push(userData.password_hash);
  }

  values.push(userId);

  await pool.query(
    `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE user_id = ?
    `,
    values,
  );

  return findById(userId);
};

const deactivate = async (userId) => {
  await pool.query(
    `
      UPDATE users
      SET is_active = 0
      WHERE user_id = ?
    `,
    [userId],
  );

  return findById(userId);
};

module.exports = {
  findAll,
  findById,
  findByEmail,
  findByEmailExcludingId,
  roleExists,
  create,
  update,
  deactivate,
};
