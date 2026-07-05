const { body, param, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (validationErrors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    success: false,
    message: 'La validación falló',
    errors: validationErrors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    })),
  });
};

const validateCustomerId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID de cliente debe ser un entero positivo')
    .toInt(),
  validateRequest,
];

const customerPayloadValidator = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio'),
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('El apellido es obligatorio'),
  body('document_number')
    .trim()
    .notEmpty()
    .withMessage('El número de documento es obligatorio')
    .isLength({ max: 50 })
    .withMessage('El número de documento no debe exceder 50 caracteres'),
  body('driver_license_number')
    .trim()
    .notEmpty()
    .withMessage('El número de licencia es obligatorio')
    .isLength({ max: 50 })
    .withMessage('El número de licencia no debe exceder 50 caracteres'),
  body('driver_license_expiration_date')
    .notEmpty()
    .withMessage('La fecha de vencimiento de la licencia es obligatoria')
    .bail()
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage('La fecha de vencimiento de la licencia debe ser válida'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El correo es obligatorio')
    .bail()
    .isEmail()
    .withMessage('El correo debe ser válido')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('El teléfono es obligatorio')
    .isLength({ max: 25 })
    .withMessage('El teléfono no debe exceder 25 caracteres'),
  body('date_of_birth')
    .notEmpty()
    .withMessage('La fecha de nacimiento es obligatoria')
    .bail()
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage('La fecha de nacimiento debe ser válida')
    .bail()
    .custom((value) => {
      const dateOfBirth = new Date(`${value}T00:00:00.000Z`);
      const today = new Date();

      if (dateOfBirth > today) {
        throw new Error('La fecha de nacimiento no puede estar en el futuro');
      }

      return true;
    }),
  body('address')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 255 })
    .withMessage('La dirección no debe exceder 255 caracteres'),
  body('emergency_contact_name')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 160 })
    .withMessage('El nombre del contacto de emergencia no debe exceder 160 caracteres'),
  body('emergency_contact_phone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 25 })
    .withMessage('El teléfono del contacto de emergencia no debe exceder 25 caracteres'),
  validateRequest,
];

module.exports = {
  validateCustomerId,
  createCustomerValidator: customerPayloadValidator,
  updateCustomerValidator: customerPayloadValidator,
};
