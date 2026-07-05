const {
  validateRequest,
  positiveIdParam,
  positiveIntegerBody,
  nonNegativeDecimalBody,
  isoDateTimeBody,
  optionalTextBody,
} = require('./common.validator');

const validateReservationId = positiveIdParam('id', 'ID de reserva');

const reservationPayloadValidator = [
  positiveIntegerBody('customer_id', 'ID de cliente'),
  positiveIntegerBody('vehicle_id', 'ID de vehículo'),
  positiveIntegerBody('created_by_user_id', 'ID de usuario creador'),
  positiveIntegerBody('reservation_status_id', 'ID de estado de reserva'),
  isoDateTimeBody('start_datetime', 'Fecha y hora de inicio'),
  isoDateTimeBody('end_datetime', 'Fecha y hora de fin')
    .bail()
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.start_datetime)) {
        throw new Error('La fecha y hora de fin debe ser posterior a la de inicio');
      }

      return true;
    }),
  nonNegativeDecimalBody('estimated_total', 'Total estimado'),
  optionalTextBody('notes', 'Notas', 500),
  validateRequest,
];

module.exports = {
  validateReservationId,
  createReservationValidator: reservationPayloadValidator,
  updateReservationValidator: reservationPayloadValidator,
};
