const { body, param, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (validationErrors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    success: false,
    message: 'La validación falló',
    errors: validationErrors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    })),
  });
};

const validateVehicleId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID de vehículo debe ser un entero positivo')
    .toInt(),
  validateRequest,
];

const positiveIntegerField = (field, label) => body(field)
  .isInt({ min: 1 })
  .withMessage(`${label} debe ser un entero positivo`)
  .toInt();

const vehiclePayloadValidator = [
  positiveIntegerField('model_id', 'ID de modelo'),
  positiveIntegerField('category_id', 'ID de categoría'),
  positiveIntegerField('fuel_type_id', 'ID de combustible'),
  positiveIntegerField('transmission_id', 'ID de transmisión'),
  positiveIntegerField('vehicle_status_id', 'ID de estado del vehículo'),
  body('plate_number')
    .trim()
    .notEmpty()
    .withMessage('La placa es obligatoria')
    .isLength({ max: 20 })
    .withMessage('La placa no debe exceder 20 caracteres'),
  body('vin')
    .trim()
    .notEmpty()
    .withMessage('El VIN es obligatorio')
    .isLength({ max: 50 })
    .withMessage('El VIN no debe exceder 50 caracteres'),
  body('color')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage('El color no debe exceder 50 caracteres'),
  body('model_year')
    .isInt({ min: 1900 })
    .withMessage('El año del modelo debe ser 1900 o mayor')
    .toInt(),
  body('engine')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('El motor no debe exceder 100 caracteres'),
  positiveIntegerField('passenger_capacity', 'Capacidad de pasajeros'),
  positiveIntegerField('door_count', 'Cantidad de puertas'),
  body('air_conditioning')
    .isBoolean()
    .withMessage('El aire acondicionado debe ser un valor booleano')
    .toBoolean(),
  body('mileage')
    .isInt({ min: 0 })
    .withMessage('El kilometraje debe ser mayor o igual a 0')
    .toInt(),
  body('daily_rate')
    .isFloat({ gt: 0 })
    .withMessage('La tarifa diaria debe ser mayor que 0')
    .toFloat(),
  validateRequest,
];

module.exports = {
  validateVehicleId,
  createVehicleValidator: vehiclePayloadValidator,
  updateVehicleValidator: vehiclePayloadValidator,
};
