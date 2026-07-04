const {
  validateRequest,
  positiveIdParam,
  positiveIntegerBody,
  nonNegativeIntegerBody,
  nonNegativeDecimalBody,
  positiveDecimalBody,
  isoDateTimeBody,
  optionalTextBody,
} = require('./common.validator');

const validateRentalId = positiveIdParam('id', 'Rental id');

const rentalPayloadValidator = [
  positiveIntegerBody('reservation_id', 'Reservation id'),
  positiveIntegerBody('opened_by_user_id', 'Opened by user id'),
  positiveIntegerBody('rental_status_id', 'Rental status id'),
  isoDateTimeBody('start_datetime', 'Start datetime'),
  isoDateTimeBody('expected_return_datetime', 'Expected return datetime')
    .bail()
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.start_datetime)) {
        throw new Error('Expected return datetime must be after start datetime');
      }

      return true;
    }),
  nonNegativeIntegerBody('pickup_mileage', 'Pickup mileage'),
  positiveDecimalBody('daily_rate', 'Daily rate'),
  nonNegativeDecimalBody('deposit_amount', 'Deposit amount'),
  optionalTextBody('notes', 'Notes', 500),
  validateRequest,
];

module.exports = {
  validateRentalId,
  createRentalValidator: rentalPayloadValidator,
  updateRentalValidator: rentalPayloadValidator,
};
