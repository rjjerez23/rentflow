const express = require('express');
const rentalController = require('../controllers/rental.controller');
const {
  validateRentalId,
  createRentalValidator,
  updateRentalValidator,
} = require('../validators/rental.validator');

const router = express.Router();

router.get('/', rentalController.getAllRentals);
router.get('/:id', validateRentalId, rentalController.getRentalById);
router.post('/', createRentalValidator, rentalController.createRental);
router.put('/:id', validateRentalId, updateRentalValidator, rentalController.updateRental);
router.delete('/:id', validateRentalId, rentalController.deleteRental);

module.exports = router;
