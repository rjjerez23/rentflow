const express = require('express');
const vehicleController = require('../controllers/vehicle.controller');
const {
  validateVehicleId,
  createVehicleValidator,
  updateVehicleValidator,
} = require('../validators/vehicle.validator');

const router = express.Router();

router.get('/', vehicleController.getAllVehicles);
router.get('/:id', validateVehicleId, vehicleController.getVehicleById);
router.post('/', createVehicleValidator, vehicleController.createVehicle);
router.put('/:id', validateVehicleId, updateVehicleValidator, vehicleController.updateVehicle);
router.delete('/:id', validateVehicleId, vehicleController.deleteVehicle);

module.exports = router;
