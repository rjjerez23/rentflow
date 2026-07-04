const reservationRepository = require('../repositories/reservation.repository');
const createError = require('../utils/apiError');

const toMariaDbDateTime = (value) => value.slice(0, 19).replace('T', ' ');

const normalizeOptionalText = (value) => {
  if (!value) {
    return null;
  }

  return value.trim();
};

const normalizeReservationPayload = (payload) => ({
  customer_id: Number(payload.customer_id),
  vehicle_id: Number(payload.vehicle_id),
  created_by_user_id: Number(payload.created_by_user_id),
  reservation_status_id: Number(payload.reservation_status_id),
  start_datetime: toMariaDbDateTime(payload.start_datetime),
  end_datetime: toMariaDbDateTime(payload.end_datetime),
  estimated_total: Number(payload.estimated_total || 0),
  notes: normalizeOptionalText(payload.notes),
});

const ensureForeignKeysExist = async (reservationData) => {
  const checks = [
    {
      field: 'customer_id',
      message: 'The selected customer does not exist',
      exists: await reservationRepository.customerExists(reservationData.customer_id),
    },
    {
      field: 'vehicle_id',
      message: 'The selected vehicle does not exist',
      exists: await reservationRepository.vehicleExists(reservationData.vehicle_id),
    },
    {
      field: 'created_by_user_id',
      message: 'The selected user does not exist',
      exists: await reservationRepository.userExists(reservationData.created_by_user_id),
    },
    {
      field: 'reservation_status_id',
      message: 'The selected reservation status does not exist',
      exists: await reservationRepository.statusExists(reservationData.reservation_status_id),
    },
  ];

  const errors = checks
    .filter((check) => !check.exists)
    .map((check) => ({
      field: check.field,
      message: check.message,
    }));

  if (errors.length > 0) {
    throw createError(400, 'Invalid reservation references', errors);
  }
};

const getAllReservations = async () => {
  return reservationRepository.findAll();
};

const getReservationById = async (reservationId) => {
  const reservation = await reservationRepository.findById(reservationId);

  if (!reservation) {
    throw createError(404, 'Reservation not found');
  }

  return reservation;
};

const createReservation = async (payload) => {
  const reservationData = normalizeReservationPayload(payload);

  await ensureForeignKeysExist(reservationData);

  return reservationRepository.create(reservationData);
};

const updateReservation = async (reservationId, payload) => {
  await getReservationById(reservationId);

  const reservationData = normalizeReservationPayload(payload);

  await ensureForeignKeysExist(reservationData);

  return reservationRepository.update(reservationId, reservationData);
};

const cancelReservation = async (reservationId) => {
  await getReservationById(reservationId);

  const cancelledStatus = await reservationRepository.findStatusByName('cancelled');

  if (!cancelledStatus) {
    throw createError(400, 'Reservation cancellation status is not configured', [
      {
        field: 'reservation_status_id',
        message: 'A reservation status named cancelled is required',
      },
    ]);
  }

  return reservationRepository.updateStatus(
    reservationId,
    cancelledStatus.reservation_status_id,
  );
};

module.exports = {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  cancelReservation,
};
