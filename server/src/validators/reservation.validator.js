const {
  validateRequest,
  positiveIdParam,
  positiveIntegerBody,
  nonNegativeDecimalBody,
  isoDateTimeBody,
  optionalTextBody,
} = require('./common.validator');

const validateReservationId = positiveIdParam('id', 'Reservation id');

const reservationPayloadValidator = [
  positiveIntegerBody('customer_id', 'Customer id'),
  positiveIntegerBody('vehicle_id', 'Vehicle id'),
  positiveIntegerBody('created_by_user_id', 'Created by user id'),
  positiveIntegerBody('reservation_status_id', 'Reservation status id'),
  isoDateTimeBody('start_datetime', 'Start datetime'),
  isoDateTimeBody('end_datetime', 'End datetime')
    .bail()
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.start_datetime)) {
        throw new Error('End datetime must be after start datetime');
      }

      return true;
    }),
  nonNegativeDecimalBody('estimated_total', 'Estimated total'),
  optionalTextBody('notes', 'Notes', 500),
  validateRequest,
];

module.exports = {
  validateReservationId,
  createReservationValidator: reservationPayloadValidator,
  updateReservationValidator: reservationPayloadValidator,
};
