const returnRepository = require('../repositories/return.repository');
const createError = require('../utils/apiError');

const toMariaDbDateTime = (value) => value.slice(0, 19).replace('T', ' ');

const normalizeOptionalText = (value) => {
  if (!value) {
    return null;
  }

  return value.trim();
};

const normalizeReturnPayload = (payload) => ({
  rental_id: Number(payload.rental_id),
  processed_by_user_id: Number(payload.processed_by_user_id),
  return_datetime: toMariaDbDateTime(payload.return_datetime),
  return_mileage: Number(payload.return_mileage),
  fuel_level_percent: Number(payload.fuel_level_percent),
  late_fee: Number(payload.late_fee || 0),
  damage_fee: Number(payload.damage_fee || 0),
  fuel_fee: Number(payload.fuel_fee || 0),
  cleaning_fee: Number(payload.cleaning_fee || 0),
  total_charged: Number(payload.total_charged || 0),
  damage_description: normalizeOptionalText(payload.damage_description),
  notes: normalizeOptionalText(payload.notes),
});

const ensureForeignKeysExist = async (returnData) => {
  const checks = [
    {
      field: 'rental_id',
      message: 'El alquiler seleccionado no existe',
      exists: await returnRepository.rentalExists(returnData.rental_id),
    },
    {
      field: 'processed_by_user_id',
      message: 'El usuario seleccionado no existe',
      exists: await returnRepository.userExists(returnData.processed_by_user_id),
    },
  ];

  const errors = checks
    .filter((check) => !check.exists)
    .map((check) => ({
      field: check.field,
      message: check.message,
    }));

  if (errors.length > 0) {
    throw createError(400, 'Referencias de devolución inválidas', errors);
  }
};

const ensureRentalIsUnique = async (rentalId, returnId = null) => {
  const existingReturn = returnId
    ? await returnRepository.findByRentalIdExcludingId(rentalId, returnId)
    : await returnRepository.findByRentalId(rentalId);

  if (existingReturn) {
    throw createError(409, 'El alquiler ya tiene una devolución', [
      {
        field: 'rental_id',
        message: 'El alquiler debe ser único para las devoluciones',
      },
    ]);
  }
};

const getAllReturns = async () => {
  return returnRepository.findAll();
};

const getReturnById = async (returnId) => {
  const returnRecord = await returnRepository.findById(returnId);

  if (!returnRecord) {
    throw createError(404, 'Devolución no encontrada');
  }

  return returnRecord;
};

const createReturn = async (payload) => {
  const returnData = normalizeReturnPayload(payload);

  await ensureForeignKeysExist(returnData);
  await ensureRentalIsUnique(returnData.rental_id);

  return returnRepository.create(returnData);
};

const updateReturn = async (returnId, payload) => {
  await getReturnById(returnId);

  const returnData = normalizeReturnPayload(payload);

  await ensureForeignKeysExist(returnData);
  await ensureRentalIsUnique(returnData.rental_id, returnId);

  return returnRepository.update(returnId, returnData);
};

const deleteReturn = async (returnId) => {
  await getReturnById(returnId);
  await returnRepository.remove(returnId);
};

module.exports = {
  getAllReturns,
  getReturnById,
  createReturn,
  updateReturn,
  deleteReturn,
};
