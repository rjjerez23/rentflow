const { body } = require('express-validator');
const {
  validateRequest,
  positiveIdParam,
  positiveIntegerBody,
  nonNegativeIntegerBody,
  nonNegativeDecimalBody,
  isoDateTimeBody,
  optionalTextBody,
} = require('./common.validator');

const validateReturnId = positiveIdParam('id', 'ID de devolución');

const returnPayloadValidator = [
  positiveIntegerBody('rental_id', 'ID de alquiler'),
  positiveIntegerBody('processed_by_user_id', 'ID de usuario procesador'),
  isoDateTimeBody('return_datetime', 'Fecha y hora de devolución'),
  nonNegativeIntegerBody('return_mileage', 'Kilometraje de devolución'),
  body('fuel_level_percent')
    .isFloat({ min: 0, max: 100 })
    .withMessage('El porcentaje de combustible debe estar entre 0 y 100')
    .toFloat(),
  nonNegativeDecimalBody('late_fee', 'Cargo por retraso'),
  nonNegativeDecimalBody('damage_fee', 'Cargo por daños'),
  nonNegativeDecimalBody('fuel_fee', 'Cargo por combustible'),
  nonNegativeDecimalBody('cleaning_fee', 'Cargo por limpieza'),
  nonNegativeDecimalBody('total_charged', 'Total cobrado'),
  body('damage_description')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
  optionalTextBody('notes', 'Notas', 500),
  validateRequest,
];

module.exports = {
  validateReturnId,
  createReturnValidator: returnPayloadValidator,
  updateReturnValidator: returnPayloadValidator,
};
