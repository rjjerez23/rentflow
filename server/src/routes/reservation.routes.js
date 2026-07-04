const express = require('express');
const reservationController = require('../controllers/reservation.controller');
const {
  validateReservationId,
  createReservationValidator,
  updateReservationValidator,
} = require('../validators/reservation.validator');

const router = express.Router();

router.get('/', reservationController.getAllReservations);
router.get('/:id', validateReservationId, reservationController.getReservationById);
router.post('/', createReservationValidator, reservationController.createReservation);
router.put(
  '/:id',
  validateReservationId,
  updateReservationValidator,
  reservationController.updateReservation,
);
router.delete('/:id', validateReservationId, reservationController.deleteReservation);

module.exports = router;
