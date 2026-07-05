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
      message: 'La reserva seleccionada no existe',
      exists: await rentalRepository.reservationExists(rentalData.reservation_id),
    },
    {
      field: 'opened_by_user_id',
      message: 'El usuario seleccionado no existe',
      exists: await rentalRepository.userExists(rentalData.opened_by_user_id),
    },
    {
      field: 'rental_status_id',
      message: 'El estado de alquiler seleccionado no existe',
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
    throw createError(400, 'Referencias de alquiler inválidas', errors);
  }
};

const ensureReservationIsUnique = async (reservationId, rentalId = null) => {
  const existingRental = rentalId
    ? await rentalRepository.findByReservationIdExcludingId(reservationId, rentalId)
    : await rentalRepository.findByReservationId(reservationId);

  if (existingRental) {
    throw createError(409, 'La reserva ya tiene un alquiler', [
      {
        field: 'reservation_id',
        message: 'La reserva debe ser única para los alquileres',
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
    throw createError(404, 'Alquiler no encontrado');
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
    throw createError(400, 'El estado de cancelación de alquiler no está configurado', [
      {
        field: 'rental_status_id',
        message: 'Se requiere un estado de alquiler llamado cancelled',
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
