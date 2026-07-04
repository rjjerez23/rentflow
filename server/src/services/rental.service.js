const rentalRepository = require('../repositories/rental.repository');
const createError = require('../utils/apiError');

const toMariaDbDateTime = (value) => value.slice(0, 19).replace('T', ' ');

const normalizeOptionalText = (value) => {
  if (!value) {
    return null;
  }

  return value.trim();
};

const normalizeRentalPayload = (payload) => ({
  reservation_id: Number(payload.reservation_id),
  opened_by_user_id: Number(payload.opened_by_user_id),
  rental_status_id: Number(payload.rental_status_id),
  start_datetime: toMariaDbDateTime(payload.start_datetime),
  expected_return_datetime: toMariaDbDateTime(payload.expected_return_datetime),
  pickup_mileage: Number(payload.pickup_mileage),
  daily_rate: Number(payload.daily_rate),
  deposit_amount: Number(payload.deposit_amount || 0),
  notes: normalizeOptionalText(payload.notes),
});

const ensureForeignKeysExist = async (rentalData) => {
  const checks = [
    {
      field: 'reservation_id',
      message: 'The selected reservation does not exist',
      exists: await rentalRepository.reservationExists(rentalData.reservation_id),
    },
    {
      field: 'opened_by_user_id',
      message: 'The selected user does not exist',
      exists: await rentalRepository.userExists(rentalData.opened_by_user_id),
    },
    {
      field: 'rental_status_id',
      message: 'The selected rental status does not exist',
      exists: await rentalRepository.statusExists(rentalData.rental_status_id),
    },
  ];

  const errors = checks
    .filter((check) => !check.exists)
    .map((check) => ({
      field: check.field,
      message: check.message,
    }));

  if (errors.length > 0) {
    throw createError(400, 'Invalid rental references', errors);
  }
};

const ensureReservationIsUnique = async (reservationId, rentalId = null) => {
  const existingRental = rentalId
    ? await rentalRepository.findByReservationIdExcludingId(reservationId, rentalId)
    : await rentalRepository.findByReservationId(reservationId);

  if (existingRental) {
    throw createError(409, 'Reservation already has a rental', [
      {
        field: 'reservation_id',
        message: 'Reservation must be unique for rentals',
      },
    ]);
  }
};

const getAllRentals = async () => {
  return rentalRepository.findAll();
};

const getRentalById = async (rentalId) => {
  const rental = await rentalRepository.findById(rentalId);

  if (!rental) {
    throw createError(404, 'Rental not found');
  }

  return rental;
};

const createRental = async (payload) => {
  const rentalData = normalizeRentalPayload(payload);

  await ensureForeignKeysExist(rentalData);
  await ensureReservationIsUnique(rentalData.reservation_id);

  return rentalRepository.create(rentalData);
};

const updateRental = async (rentalId, payload) => {
  await getRentalById(rentalId);

  const rentalData = normalizeRentalPayload(payload);

  await ensureForeignKeysExist(rentalData);
  await ensureReservationIsUnique(rentalData.reservation_id, rentalId);

  return rentalRepository.update(rentalId, rentalData);
};

const cancelRental = async (rentalId) => {
  await getRentalById(rentalId);

  const cancelledStatus = await rentalRepository.findStatusByName('cancelled');

  if (!cancelledStatus) {
    throw createError(400, 'Rental cancellation status is not configured', [
      {
        field: 'rental_status_id',
        message: 'A rental status named cancelled is required',
      },
    ]);
  }

  return rentalRepository.updateStatus(rentalId, cancelledStatus.rental_status_id);
};

module.exports = {
  getAllRentals,
  getRentalById,
  createRental,
  updateRental,
  cancelRental,
};
