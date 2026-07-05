const rentalService = require('../services/rental.service');

const getAllRentals = async (req, res, next) => {
  try {
    const rentals = await rentalService.getAllRentals();

    res.status(200).json({
      success: true,
      message: 'Alquileres obtenidos correctamente',
      data: rentals,
    });
  } catch (error) {
    next(error);
  }
};

const getRentalById = async (req, res, next) => {
  try {
    const rental = await rentalService.getRentalById(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: 'Alquiler obtenido correctamente',
      data: rental,
    });
  } catch (error) {
    next(error);
  }
};

const createRental = async (req, res, next) => {
  try {
    const rental = await rentalService.createRental(req.body);

    res.status(201).json({
      success: true,
      message: 'Alquiler creado correctamente',
      data: rental,
    });
  } catch (error) {
    next(error);
  }
};

const updateRental = async (req, res, next) => {
  try {
    const rental = await rentalService.updateRental(Number(req.params.id), req.body);

    res.status(200).json({
      success: true,
      message: 'Alquiler actualizado correctamente',
      data: rental,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRental = async (req, res, next) => {
  try {
    const rental = await rentalService.cancelRental(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: 'Alquiler cancelado correctamente',
      data: rental,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRentals,
  getRentalById,
  createRental,
  updateRental,
  deleteRental,
};
