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

const validateReturnId = positiveIdParam('id', 'Return id');

const returnPayloadValidator = [
  positiveIntegerBody('rental_id', 'Rental id'),
  positiveIntegerBody('processed_by_user_id', 'Processed by user id'),
  isoDateTimeBody('return_datetime', 'Return datetime'),
  nonNegativeIntegerBody('return_mileage', 'Return mileage'),
  body('fuel_level_percent')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Fuel level percent must be between 0 and 100')
    .toFloat(),
  nonNegativeDecimalBody('late_fee', 'Late fee'),
  nonNegativeDecimalBody('damage_fee', 'Damage fee'),
  nonNegativeDecimalBody('fuel_fee', 'Fuel fee'),
  nonNegativeDecimalBody('cleaning_fee', 'Cleaning fee'),
  nonNegativeDecimalBody('total_charged', 'Total charged'),
  body('damage_description')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
  optionalTextBody('notes', 'Notes', 500),
  validateRequest,
];

module.exports = {
  validateReturnId,
  createReturnValidator: returnPayloadValidator,
  updateReturnValidator: returnPayloadValidator,
};
