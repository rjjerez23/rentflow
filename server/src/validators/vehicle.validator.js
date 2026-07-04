const { body, param, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (validationErrors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors: validationErrors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    })),
  });
};

const validateVehicleId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Vehicle id must be a positive integer')
    .toInt(),
  validateRequest,
];

const positiveIntegerField = (field, label) => body(field)
  .isInt({ min: 1 })
  .withMessage(`${label} must be a positive integer`)
  .toInt();

const vehiclePayloadValidator = [
  positiveIntegerField('model_id', 'Model id'),
  positiveIntegerField('category_id', 'Category id'),
  positiveIntegerField('fuel_type_id', 'Fuel type id'),
  positiveIntegerField('transmission_id', 'Transmission id'),
  positiveIntegerField('vehicle_status_id', 'Vehicle status id'),
  body('plate_number')
    .trim()
    .notEmpty()
    .withMessage('Plate number is required')
    .isLength({ max: 20 })
    .withMessage('Plate number must not exceed 20 characters'),
  body('vin')
    .trim()
    .notEmpty()
    .withMessage('VIN is required')
    .isLength({ max: 50 })
    .withMessage('VIN must not exceed 50 characters'),
  body('color')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage('Color must not exceed 50 characters'),
  body('model_year')
    .isInt({ min: 1900 })
    .withMessage('Model year must be 1900 or greater')
    .toInt(),
  body('engine')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Engine must not exceed 100 characters'),
  positiveIntegerField('passenger_capacity', 'Passenger capacity'),
  positiveIntegerField('door_count', 'Door count'),
  body('air_conditioning')
    .isBoolean()
    .withMessage('Air conditioning must be a boolean value')
    .toBoolean(),
  body('mileage')
    .isInt({ min: 0 })
    .withMessage('Mileage must be greater than or equal to 0')
    .toInt(),
  body('daily_rate')
    .isFloat({ gt: 0 })
    .withMessage('Daily rate must be greater than 0')
    .toFloat(),
  validateRequest,
];

module.exports = {
  validateVehicleId,
  createVehicleValidator: vehiclePayloadValidator,
  updateVehicleValidator: vehiclePayloadValidator,
};
