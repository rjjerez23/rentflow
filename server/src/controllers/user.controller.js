const userService = require('../services/user.service');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      message: 'Usuarios obtenidos correctamente',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: 'Usuario obtenido correctamente',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: 'Usuario creado correctamente',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(Number(req.params.id), req.body);

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado correctamente',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deactivateUser(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: 'Usuario desactivado correctamente',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
