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

const validateRentalId = positiveIdParam('id', 'ID de alquiler');

const rentalPayloadValidator = [
  positiveIntegerBody('reservation_id', 'ID de reserva'),
  positiveIntegerBody('opened_by_user_id', 'ID de usuario que abrió'),
  positiveIntegerBody('rental_status_id', 'ID de estado de alquiler'),
  isoDateTimeBody('start_datetime', 'Fecha y hora de inicio'),
  isoDateTimeBody('expected_return_datetime', 'Fecha y hora esperada de devolución')
    .bail()
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.start_datetime)) {
        throw new Error('La fecha y hora esperada de devolución debe ser posterior a la de inicio');
      }

      return true;
    }),
  nonNegativeIntegerBody('pickup_mileage', 'Kilometraje de entrega'),
  positiveDecimalBody('daily_rate', 'Tarifa diaria'),
  nonNegativeDecimalBody('deposit_amount', 'Monto de depósito'),
  optionalTextBody('notes', 'Notas', 500),
  validateRequest,
];

module.exports = {
  validateRentalId,
  createRentalValidator: rentalPayloadValidator,
  updateRentalValidator: rentalPayloadValidator,
};
