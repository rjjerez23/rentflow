const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');

const createError = (statusCode, message, errors = []) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
};

const normalizeEmail = (email) => email.trim().toLowerCase();

const ensureRoleExists = async (roleId) => {
  const exists = await userRepository.roleExists(roleId);

  if (!exists) {
    throw createError(400, 'Role does not exist', [
      {
        field: 'role_id',
        message: 'The selected role does not exist',
      },
    ]);
  }
};

const ensureEmailIsUnique = async (email, userId = null) => {
  const existingUser = userId
    ? await userRepository.findByEmailExcludingId(email, userId)
    : await userRepository.findByEmail(email);

  if (existingUser) {
    throw createError(409, 'Email is already registered', [
      {
        field: 'email',
        message: 'Email must be unique',
      },
    ]);
  }
};

const getAllUsers = async () => {
  return userRepository.findAll();
};

const getUserById = async (userId) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw createError(404, 'User not found');
  }

  return user;
};

const createUser = async (payload) => {
  const email = normalizeEmail(payload.email);
  const roleId = Number(payload.role_id);

  await ensureRoleExists(roleId);
  await ensureEmailIsUnique(email);

  const passwordHash = await bcrypt.hash(payload.password, 10);

  return userRepository.create({
    role_id: roleId,
    first_name: payload.first_name.trim(),
    last_name: payload.last_name.trim(),
    email,
    password_hash: passwordHash,
    phone: payload.phone ? payload.phone.trim() : null,
  });
};

const updateUser = async (userId, payload) => {
  await getUserById(userId);

  const email = normalizeEmail(payload.email);
  const roleId = Number(payload.role_id);

  await ensureRoleExists(roleId);
  await ensureEmailIsUnique(email, userId);

  const userData = {
    role_id: roleId,
    first_name: payload.first_name.trim(),
    last_name: payload.last_name.trim(),
    email,
    phone: payload.phone ? payload.phone.trim() : null,
  };

  if (payload.password) {
    userData.password_hash = await bcrypt.hash(payload.password, 10);
  }

  return userRepository.update(userId, userData);
};

const deactivateUser = async (userId) => {
  await getUserById(userId);
  return userRepository.deactivate(userId);
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deactivateUser,
};
