const vehicleService = require('../services/vehicle.service');

const getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();

    res.status(200).json({
      success: true,
      message: 'Vehículos obtenidos correctamente',
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
};

const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getVehicleById(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: 'Vehículo obtenido correctamente',
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

const createVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);

    res.status(201).json({
      success: true,
      message: 'Vehículo creado correctamente',
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.updateVehicle(Number(req.params.id), req.body);

    res.status(200).json({
      success: true,
      message: 'Vehículo actualizado correctamente',
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.deactivateVehicle(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: 'Vehículo desactivado correctamente',
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
