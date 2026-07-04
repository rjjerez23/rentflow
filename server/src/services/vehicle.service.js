const vehicleRepository = require('../repositories/vehicle.repository');

const createError = (statusCode, message, errors = []) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.errors = errors;
  return error;
};

const normalizeOptionalText = (value) => {
  if (!value) {
    return null;
  }

  return value.trim();
};

const normalizeIdentifier = (value) => value.trim().toUpperCase();

const normalizeVehiclePayload = (payload) => ({
  model_id: Number(payload.model_id),
  category_id: Number(payload.category_id),
  fuel_type_id: Number(payload.fuel_type_id),
  transmission_id: Number(payload.transmission_id),
  vehicle_status_id: Number(payload.vehicle_status_id),
  plate_number: normalizeIdentifier(payload.plate_number),
  vin: normalizeIdentifier(payload.vin),
  color: normalizeOptionalText(payload.color),
  model_year: Number(payload.model_year),
  engine: normalizeOptionalText(payload.engine),
  passenger_capacity: Number(payload.passenger_capacity),
  door_count: Number(payload.door_count),
  air_conditioning: payload.air_conditioning ? 1 : 0,
  mileage: Number(payload.mileage),
  daily_rate: Number(payload.daily_rate),
});

const ensurePlateNumberIsUnique = async (plateNumber, vehicleId = null) => {
  const existingVehicle = vehicleId
    ? await vehicleRepository.findByPlateNumberExcludingId(plateNumber, vehicleId)
    : await vehicleRepository.findByPlateNumber(plateNumber);

  if (existingVehicle) {
    throw createError(409, 'Plate number is already registered', [
      {
        field: 'plate_number',
        message: 'Plate number must be unique',
      },
    ]);
  }
};

const ensureVinIsUnique = async (vin, vehicleId = null) => {
  const existingVehicle = vehicleId
    ? await vehicleRepository.findByVinExcludingId(vin, vehicleId)
    : await vehicleRepository.findByVin(vin);

  if (existingVehicle) {
    throw createError(409, 'VIN is already registered', [
      {
        field: 'vin',
        message: 'VIN must be unique',
      },
    ]);
  }
};

const ensureForeignKeysExist = async (vehicleData) => {
  const checks = [
    {
      field: 'model_id',
      message: 'The selected vehicle model does not exist',
      exists: await vehicleRepository.modelExists(vehicleData.model_id),
    },
    {
      field: 'category_id',
      message: 'The selected category does not exist',
      exists: await vehicleRepository.categoryExists(vehicleData.category_id),
    },
    {
      field: 'fuel_type_id',
      message: 'The selected fuel type does not exist',
      exists: await vehicleRepository.fuelTypeExists(vehicleData.fuel_type_id),
    },
    {
      field: 'transmission_id',
      message: 'The selected transmission does not exist',
      exists: await vehicleRepository.transmissionExists(vehicleData.transmission_id),
    },
    {
      field: 'vehicle_status_id',
      message: 'The selected vehicle status does not exist',
      exists: await vehicleRepository.vehicleStatusExists(vehicleData.vehicle_status_id),
    },
  ];

  const errors = checks
    .filter((check) => !check.exists)
    .map((check) => ({
      field: check.field,
      message: check.message,
    }));

  if (errors.length > 0) {
    throw createError(400, 'Invalid vehicle references', errors);
  }
};

const ensureUniqueVehicleFields = async (vehicleData, vehicleId = null) => {
  await ensurePlateNumberIsUnique(vehicleData.plate_number, vehicleId);
  await ensureVinIsUnique(vehicleData.vin, vehicleId);
};

const getAllVehicles = async () => {
  return vehicleRepository.findAll();
};

const getVehicleById = async (vehicleId) => {
  const vehicle = await vehicleRepository.findById(vehicleId);

  if (!vehicle) {
    throw createError(404, 'Vehicle not found');
  }

  return vehicle;
};

const createVehicle = async (payload) => {
  const vehicleData = normalizeVehiclePayload(payload);

  await ensureForeignKeysExist(vehicleData);
  await ensureUniqueVehicleFields(vehicleData);

  return vehicleRepository.create(vehicleData);
};

const updateVehicle = async (vehicleId, payload) => {
  await getVehicleById(vehicleId);

  const vehicleData = normalizeVehiclePayload(payload);

  await ensureForeignKeysExist(vehicleData);
  await ensureUniqueVehicleFields(vehicleData, vehicleId);

  return vehicleRepository.update(vehicleId, vehicleData);
};

const deactivateVehicle = async (vehicleId) => {
  await getVehicleById(vehicleId);
  return vehicleRepository.deactivate(vehicleId);
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deactivateVehicle,
};
