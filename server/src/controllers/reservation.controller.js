const reservationService = require('../services/reservation.service');

const getAllReservations = async (req, res, next) => {
  try {
    const reservations = await reservationService.getAllReservations();

    res.status(200).json({
      success: true,
      message: 'Reservations retrieved successfully',
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

const getReservationById = async (req, res, next) => {
  try {
    const reservation = await reservationService.getReservationById(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: 'Reservation retrieved successfully',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

const createReservation = async (req, res, next) => {
  try {
    const reservation = await reservationService.createReservation(req.body);

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

const updateReservation = async (req, res, next) => {
  try {
    const reservation = await reservationService.updateReservation(
      Number(req.params.id),
      req.body,
    );

    res.status(200).json({
      success: true,
      message: 'Reservation updated successfully',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReservation = async (req, res, next) => {
  try {
    const reservation = await reservationService.cancelReservation(Number(req.params.id));

    res.status(200).json({
      success: true,
      message: 'Reservation cancelled successfully',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
};
